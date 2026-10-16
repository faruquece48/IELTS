import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

type GoldApiResponse = { price?: number; symbol?: string; currency?: string; updatedAt?: string };
type BangladeshGoldResponse = {
  bhoriInGrams?: number;
  lastUpdate?: string;
  latest?: { k22?: number };
};
type YahooChartResponse = {
  chart?: { result?: Array<{ timestamp?: number[]; indicators?: { quote?: Array<{ close?: Array<number | null> }> } }> };
};
type StoredPoint = { observed_at: string; price_usd: string | number; instrument: string; source: string };

const connectionString = process.env.DATABASE_URL;

async function prepareDatabase(sql: NeonQueryFunction<false, false>) {
  await sql.query(`
    CREATE TABLE IF NOT EXISTS gold_price_samples (
      id BIGSERIAL PRIMARY KEY,
      observed_at TIMESTAMPTZ NOT NULL,
      price_usd NUMERIC(14, 4) NOT NULL CHECK (price_usd > 0),
      instrument TEXT NOT NULL,
      source TEXT NOT NULL,
      interval_name TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (observed_at, instrument, source)
    )
  `);
  await sql.query(`CREATE INDEX IF NOT EXISTS gold_price_samples_observed_at_idx ON gold_price_samples (observed_at DESC)`);
  await sql.query(`
    CREATE TABLE IF NOT EXISTS bangladesh_gold_prices (
      id BIGSERIAL PRIMARY KEY,
      observed_at TIMESTAMPTZ NOT NULL,
      karat SMALLINT NOT NULL,
      price_bdt_per_gram NUMERIC(14, 2) NOT NULL CHECK (price_bdt_per_gram > 0),
      bhori_grams NUMERIC(8, 3) NOT NULL,
      source TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (observed_at, karat, source)
    )
  `);
}

async function backfillHourlyHistory(sql: NeonQueryFunction<false, false>) {
  const [{ count }] = await sql.query(`SELECT COUNT(*)::int AS count FROM gold_price_samples WHERE instrument = 'GC=F'`) as Array<{ count: number }>;
  if (count >= 24) return { imported: 0, status: "ready" };

  const response = await fetch("https://query1.finance.yahoo.com/v8/finance/chart/GC%3DF?range=2y&interval=1h", {
    headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0 Gold Intelligence Dashboard" },
  });
  if (!response.ok) throw new Error("Free historical feed is temporarily unavailable.");

  const payload = (await response.json()) as YahooChartResponse;
  const result = payload.chart?.result?.[0];
  const timestamps = result?.timestamp ?? [];
  const closes = result?.indicators?.quote?.[0]?.close ?? [];
  const rows = timestamps
    .map((timestamp, index) => ({ time: new Date(timestamp * 1000).toISOString(), value: closes[index] }))
    .filter((row): row is { time: string; value: number } => typeof row.value === "number" && Number.isFinite(row.value));

  for (let start = 0; start < rows.length; start += 1_000) {
    const chunk = rows.slice(start, start + 1_000);
    await sql.query(
      `INSERT INTO gold_price_samples (observed_at, price_usd, instrument, source, interval_name)
       SELECT value_time, value_price, 'GC=F', 'Yahoo Finance', '1h'
       FROM UNNEST($1::timestamptz[], $2::numeric[]) AS values_to_add(value_time, value_price)
       ON CONFLICT (observed_at, instrument, source) DO NOTHING`,
      [chunk.map((row) => row.time), chunk.map((row) => row.value)],
    );
  }

  return { imported: rows.length, status: "imported" };
}

export async function GET() {
  if (!connectionString) return Response.json({ error: "DATABASE_URL is not configured." }, { status: 503 });

  try {
    const sql = neon(connectionString);
    await prepareDatabase(sql);

    let backfill = { imported: 0, status: "ready" };
    try {
      backfill = await backfillHourlyHistory(sql);
    } catch (error) {
      backfill = { imported: 0, status: error instanceof Error ? error.message : "Historical import failed." };
    }

    const response = await fetch("https://api.gold-api.com/price/XAU/USD", {
      next: { revalidate: 30 },
      headers: { Accept: "application/json" },
    });
    const current = (await response.json()) as GoldApiResponse;
    if (!response.ok || !current.price || !Number.isFinite(current.price)) throw new Error("The free live gold provider returned an invalid price.");

    const updatedAt = current.updatedAt ?? new Date().toISOString();
    await sql.query(
      `INSERT INTO gold_price_samples (observed_at, price_usd, instrument, source, interval_name)
       VALUES ($1, $2, 'XAU/USD', 'Gold-API.com', 'live')
       ON CONFLICT (observed_at, instrument, source) DO UPDATE SET price_usd = EXCLUDED.price_usd`,
      [updatedAt, current.price],
    );

    let bhoriBdt: number | null = null;
    let bangladeshUpdatedAt: string | null = null;
    try {
      const localResponse = await fetch("https://gold-price.bd/api/gold/latest.json", { next: { revalidate: 3_600 } });
      const local = (await localResponse.json()) as BangladeshGoldResponse;
      const grams = local.bhoriInGrams ?? 11.664;
      const pricePerGram = local.latest?.k22;
      if (localResponse.ok && pricePerGram && Number.isFinite(pricePerGram)) {
        bangladeshUpdatedAt = local.lastUpdate ?? new Date().toISOString();
        bhoriBdt = pricePerGram * grams;
        await sql.query(
          `INSERT INTO bangladesh_gold_prices (observed_at, karat, price_bdt_per_gram, bhori_grams, source)
           VALUES ($1, 22, $2, $3, 'Gold Price Bangladesh / BAJUS')
           ON CONFLICT (observed_at, karat, source) DO UPDATE SET price_bdt_per_gram = EXCLUDED.price_bdt_per_gram`,
          [bangladeshUpdatedAt, pricePerGram, grams],
        );
      }
    } catch {
      // The international dashboard remains available if the Bangladesh feed is temporarily offline.
    }

    const stored = await sql.query(
      `SELECT observed_at, price_usd, instrument, source
       FROM gold_price_samples
       ORDER BY observed_at ASC`,
    ) as StoredPoint[];
    const [{ total_count: storedCount }] = await sql.query(
      `SELECT COUNT(*)::int AS total_count FROM gold_price_samples`,
    ) as Array<{ total_count: number }>;

    const futures = stored.filter((row) => row.instrument === "GC=F");
    const spot = stored.filter((row) => row.instrument === "XAU/USD");
    const basis = futures.length ? current.price - Number(futures.at(-1)!.price_usd) : 0;
    const history = futures.map((row) => ({ time: row.observed_at, value: Number(row.price_usd) + basis }));
    const liveHistory = spot.map((row) => ({ time: row.observed_at, value: Number(row.price_usd) }));

    return Response.json({
      currentUsd: current.price,
      updatedAt,
      source: "Gold-API.com",
      history,
      liveHistory,
      storedCount,
      returnedPoints: stored.length,
      historicalSource: "Yahoo Finance GC=F (spot-aligned proxy)",
      bhoriBdt,
      bhoriGrams: 11.664,
      bangladeshUpdatedAt,
      backfill,
    });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to load gold data." }, { status: 502 });
  }
}
