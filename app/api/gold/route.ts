import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { buildRollingGoldForecast, type GoldForecastPoint, type GoldPoint } from "@/lib/goldForecast";

type GoldApiResponse = { price?: number; symbol?: string; currency?: string; updatedAt?: string };
type BangladeshGoldResponse = {
  bhoriInGrams?: number;
  lastUpdate?: string;
  latest?: { k22?: number };
};
type ExchangeRateResponse = { result?: string; rates?: { BDT?: number } };
type YahooChartResponse = {
  chart?: { result?: Array<{ timestamp?: number[]; indicators?: { quote?: Array<{ close?: Array<number | null> }> } }> };
};
type StoredPoint = { observed_at: string; price_usd: string | number; instrument: string; source: string };
type StoredForecast = {
  generated_at: string;
  expires_at: string;
  anchor_price: string | number;
  predictions: Record<string, GoldForecastPoint[]> | string;
};
type RollingStateRow = { generated_at: string; predictions: GoldForecastPoint[] | string };
type LockedForecastRow = { target_at: string; forecast_price: string | number; low_price: string | number; high_price: string | number };
type ErrorStatRow = { sample_count: string | number; mean_error: string | number };
type AccuracyRow = { sample_count: string | number; mae: string | number; mape: string | number; bias: string | number };

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
    CREATE TABLE IF NOT EXISTS gold_forecast_snapshots (
      id BIGSERIAL PRIMARY KEY,
      generated_at TIMESTAMPTZ NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      anchor_time TIMESTAMPTZ NOT NULL,
      anchor_price NUMERIC(14, 4) NOT NULL CHECK (anchor_price > 0),
      predictions JSONB NOT NULL,
      model_version TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await sql.query(`CREATE INDEX IF NOT EXISTS gold_forecast_snapshots_generated_at_idx ON gold_forecast_snapshots (generated_at DESC)`);
  await sql.query(`CREATE TABLE IF NOT EXISTS gold_locked_forecasts (target_at TIMESTAMPTZ PRIMARY KEY, forecast_price NUMERIC(14, 4) NOT NULL, low_price NUMERIC(14, 4) NOT NULL, high_price NUMERIC(14, 4) NOT NULL, generated_at TIMESTAMPTZ NOT NULL, locked_at TIMESTAMPTZ NOT NULL, model_version TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
  await sql.query(`CREATE TABLE IF NOT EXISTS gold_forecast_state (id SMALLINT PRIMARY KEY CHECK (id = 1), generated_at TIMESTAMPTZ NOT NULL, anchor_price NUMERIC(14, 4) NOT NULL, predictions JSONB NOT NULL, model_version TEXT NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
  await sql.query(`CREATE TABLE IF NOT EXISTS gold_forecast_errors (target_at TIMESTAMPTZ PRIMARY KEY REFERENCES gold_locked_forecasts(target_at) ON DELETE CASCADE, forecast_price NUMERIC(14, 4) NOT NULL, actual_price NUMERIC(14, 4) NOT NULL, error NUMERIC(14, 4) NOT NULL, evaluated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
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

    let usdBdt: number | null = null;
    try {
      const exchangeResponse = await fetch("https://open.er-api.com/v6/latest/USD", { next: { revalidate: 3_600 } });
      const exchange = (await exchangeResponse.json()) as ExchangeRateResponse;
      if (exchangeResponse.ok && exchange.result === "success" && exchange.rates?.BDT && Number.isFinite(exchange.rates.BDT)) {
        usdBdt = exchange.rates.BDT;
      }
    } catch {
      // The dashboard can fall back to the published Bangladesh price if FX data is unavailable.
    }

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
    const storedForecasts = await sql.query(
      `SELECT generated_at, expires_at, anchor_price, predictions
       FROM gold_forecast_snapshots
       WHERE generated_at >= NOW() - INTERVAL '31 days'
       ORDER BY generated_at ASC`,
    ) as StoredForecast[];
    const futures = stored.filter((row) => row.instrument === "GC=F");
    const spot = stored.filter((row) => row.instrument === "XAU/USD");
    const basis = futures.length ? current.price - Number(futures.at(-1)!.price_usd) : 0;
    const history = futures.map((row) => ({ time: row.observed_at, value: Number(row.price_usd) + basis }));
    const liveHistory = spot.map((row) => ({ time: row.observed_at, value: Number(row.price_usd) }));
    const forecastBucket = Math.floor(Date.now() / (5 * 60_000)) * 5 * 60_000;
    const forecastGeneratedAt = new Date(forecastBucket).toISOString();
    const existingRollingState = await sql.query(`SELECT generated_at, predictions FROM gold_forecast_state WHERE id = 1`) as RollingStateRow[];

    if ((!existingRollingState[0] || Date.parse(existingRollingState[0].generated_at) < forecastBucket) && futures.length >= 24) {
      const hourlyModelData: GoldPoint[] = futures.slice(-48).map((row) => ({ time: row.observed_at, value: Number(row.price_usd) }));
      const minuteByTime = new Map<number, GoldPoint>();
      spot.forEach((row) => {
        const minute = Math.floor(Date.parse(row.observed_at) / 60_000) * 60_000;
        minuteByTime.set(minute, { time: new Date(minute).toISOString(), value: Number(row.price_usd) });
      });
      const minuteModelData = [...minuteByTime.values()].sort((a, b) => Date.parse(a.time) - Date.parse(b.time)).slice(-120);
      const errorStats = await sql.query(`SELECT COUNT(*)::int AS sample_count, COALESCE(AVG(error), 0)::float8 AS mean_error FROM gold_forecast_errors`) as ErrorStatRow[];
      const sampleCount = Number(errorStats[0]?.sample_count ?? 0);
      const rawCorrection = Number(errorStats[0]?.mean_error ?? 0) * Math.min(1, sampleCount / 30);
      const correctionLimit = current.price * 0.005;
      const correction = Math.max(-correctionLimit, Math.min(correctionLimit, rawCorrection));
      const predictions = buildRollingGoldForecast(hourlyModelData, minuteModelData, { time: forecastGeneratedAt, value: current.price }, correction);
      const locked = predictions.filter((point) => Date.parse(point.time) <= forecastBucket + 60 * 60_000);

      await sql.query(`INSERT INTO gold_locked_forecasts (target_at, forecast_price, low_price, high_price, generated_at, locked_at, model_version) SELECT target_time, value_price, low_value, high_value, $5, NOW(), 'rolling-adaptive-v3' FROM UNNEST($1::timestamptz[], $2::numeric[], $3::numeric[], $4::numeric[]) AS forecast_values(target_time, value_price, low_value, high_value) ON CONFLICT (target_at) DO NOTHING`, [locked.map((point) => point.time), locked.map((point) => point.value), locked.map((point) => point.low), locked.map((point) => point.high), forecastGeneratedAt]);
      await sql.query(`INSERT INTO gold_forecast_state (id, generated_at, anchor_price, predictions, model_version, updated_at) VALUES (1, $1, $2, $3::jsonb, 'rolling-adaptive-v3', NOW()) ON CONFLICT (id) DO UPDATE SET generated_at = EXCLUDED.generated_at, anchor_price = EXCLUDED.anchor_price, predictions = EXCLUDED.predictions, model_version = EXCLUDED.model_version, updated_at = NOW()`, [forecastGeneratedAt, current.price, JSON.stringify(predictions)]);
    }

    const rollingState = await sql.query(`SELECT generated_at, predictions FROM gold_forecast_state WHERE id = 1`) as RollingStateRow[];
    const lockedRows = await sql.query(`SELECT target_at, forecast_price, low_price, high_price FROM gold_locked_forecasts WHERE target_at >= NOW() - INTERVAL '30 days' AND target_at <= NOW() + INTERVAL '65 minutes' ORDER BY target_at ASC`) as LockedForecastRow[];
    const [accuracy] = await sql.query(
      `SELECT COUNT(*)::int AS sample_count,
              COALESCE(AVG(ABS(error)), 0)::float8 AS mae,
              COALESCE(AVG(ABS(error) / actual_price) * 100, 0)::float8 AS mape,
              COALESCE(AVG(error), 0)::float8 AS bias
       FROM gold_forecast_errors`,
    ) as AccuracyRow[];
    const actualByMinute = new Map(spot.map((row) => [
      Math.floor(Date.parse(row.observed_at) / 60_000) * 60_000,
      Number(row.price_usd),
    ]));
    const parsedForecasts = storedForecasts.map((snapshot) => ({
      ...snapshot,
      predictions: typeof snapshot.predictions === "string" ? JSON.parse(snapshot.predictions) as Record<string, GoldForecastPoint[]> : snapshot.predictions,
    }));
    const forecastEvaluations = parsedForecasts.flatMap((snapshot) => {
      const lockedHour = snapshot.predictions[String(5 * 60_000)]?.slice(0, 12) ?? [];
      return lockedHour.flatMap((point) => {
        const targetMinute = Math.floor(Date.parse(point.time) / 60_000) * 60_000;
        const actual = actualByMinute.get(targetMinute);
        return actual === undefined ? [] : [{
          generatedAt: snapshot.generated_at,
          time: point.time,
          actual,
          forecast: point.value,
          anchor: Number(snapshot.anchor_price),
        }];
      });
    });
    const latestForecast = parsedForecasts.at(-1);
    const rollingPredictions = rollingState[0]
      ? typeof rollingState[0].predictions === "string" ? JSON.parse(rollingState[0].predictions) as GoldForecastPoint[] : rollingState[0].predictions
      : [];
    const lockedForecastHistory = lockedRows.map((row) => ({
      time: row.target_at,
      value: Number(row.forecast_price),
      low: Number(row.low_price),
      high: Number(row.high_price),
      locked: true,
    }));
    const lockedNextHour = lockedForecastHistory.filter((point) => Date.parse(point.time) > Date.now());
    const lockedByTime = new Map(lockedNextHour.map((point) => [Date.parse(point.time), point]));
    const rollingForecast = rollingPredictions
      .filter((point) => Date.parse(point.time) > Date.now())
      .map((point) => lockedByTime.get(Date.parse(point.time)) ?? { ...point, locked: false });

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
      liveBhoriBdt: usdBdt ? current.price / 31.1034768 * 11.664 * (22 / 24) * usdBdt : null,
      usdBdt,
      bhoriGrams: 11.664,
      bangladeshUpdatedAt,
      backfill,
      lockedForecast: latestForecast ? {
        generatedAt: latestForecast.generated_at,
        expiresAt: latestForecast.expires_at,
        projections: latestForecast.predictions,
      } : null,
      forecastEvaluations,
      rollingForecast,
      lockedNextHour,
      lockedForecastHistory,
      rollingForecastGeneratedAt: rollingState[0]?.generated_at ?? null,
      forecastAccuracy: {
        sampleCount: Number(accuracy?.sample_count ?? 0),
        mae: Number(accuracy?.mae ?? 0),
        mape: Number(accuracy?.mape ?? 0),
        bias: Number(accuracy?.bias ?? 0),
      },
    });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to load gold data." }, { status: 502 });
  }
}
