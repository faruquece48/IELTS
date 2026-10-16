import { neon } from "@neondatabase/serverless";

type GoldApiResponse = {
  price?: number;
  updatedAt?: string;
};

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return Response.json({ error: "DATABASE_URL is not configured." }, { status: 503 });
  }

  try {
    const response = await fetch("https://api.gold-api.com/price/XAU/USD", {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    const current = (await response.json()) as GoldApiResponse;

    if (!response.ok || !current.price || !Number.isFinite(current.price)) {
      throw new Error("The gold provider returned an invalid price.");
    }

    const observedAt = new Date(Math.floor(Date.now() / 60_000) * 60_000).toISOString();
    const sql = neon(connectionString);

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

    await sql.query(
      `INSERT INTO gold_price_samples (observed_at, price_usd, instrument, source, interval_name)
       VALUES ($1, $2, 'XAU/USD', 'Gold-API.com minute collector', '1m')
       ON CONFLICT (observed_at, instrument, source)
       DO UPDATE SET price_usd = EXCLUDED.price_usd`,
      [observedAt, current.price],
    );

    return Response.json({
      success: true,
      observedAt,
      providerUpdatedAt: current.updatedAt ?? null,
      price: current.price,
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to collect the gold price." },
      { status: 502 },
    );
  }
}
