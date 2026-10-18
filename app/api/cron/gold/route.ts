import { neon } from "@neondatabase/serverless";
import { buildRollingGoldForecast, type GoldPoint } from "@/lib/goldForecast";
import { backfillNextCampusYear, campuses, fetchCurrentCampusAqi, prepareAqiDatabase, saveCampusAqi } from "@/lib/aqi";
import { backfillNextDistrictMonth, fetchDistrictAqi, prepareDistrictAqiDatabase, saveDistrictAqi } from "@/lib/districtAqi";

type GoldApiResponse = { price?: number; updatedAt?: string };
type PriceRow = { observed_at: string; price_usd: string | number };
type ForecastStateRow = { generated_at: string };
type ErrorStatRow = { sample_count: string | number; mean_error: string | number };

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return Response.json({ error: "DATABASE_URL is not configured." }, { status: 503 });

  try {
    const response = await fetch("https://api.gold-api.com/price/XAU/USD", { cache: "no-store", headers: { Accept: "application/json" } });
    const current = (await response.json()) as GoldApiResponse;
    if (!response.ok || !current.price || !Number.isFinite(current.price)) throw new Error("The gold provider returned an invalid price.");

    const observedAt = new Date(Math.floor(Date.now() / 60_000) * 60_000).toISOString();
    const observedAtMs = Date.parse(observedAt);
    const sql = neon(connectionString);

    await sql.query(`CREATE TABLE IF NOT EXISTS gold_price_samples (id BIGSERIAL PRIMARY KEY, observed_at TIMESTAMPTZ NOT NULL, price_usd NUMERIC(14, 4) NOT NULL CHECK (price_usd > 0), instrument TEXT NOT NULL, source TEXT NOT NULL, interval_name TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE (observed_at, instrument, source))`);
    await sql.query(`CREATE TABLE IF NOT EXISTS gold_locked_forecasts (target_at TIMESTAMPTZ PRIMARY KEY, forecast_price NUMERIC(14, 4) NOT NULL, low_price NUMERIC(14, 4) NOT NULL, high_price NUMERIC(14, 4) NOT NULL, generated_at TIMESTAMPTZ NOT NULL, locked_at TIMESTAMPTZ NOT NULL, model_version TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
    await sql.query(`CREATE TABLE IF NOT EXISTS gold_forecast_state (id SMALLINT PRIMARY KEY CHECK (id = 1), generated_at TIMESTAMPTZ NOT NULL, anchor_price NUMERIC(14, 4) NOT NULL, predictions JSONB NOT NULL, model_version TEXT NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
    await sql.query(`CREATE TABLE IF NOT EXISTS gold_forecast_errors (target_at TIMESTAMPTZ PRIMARY KEY REFERENCES gold_locked_forecasts(target_at) ON DELETE CASCADE, forecast_price NUMERIC(14, 4) NOT NULL, actual_price NUMERIC(14, 4) NOT NULL, error NUMERIC(14, 4) NOT NULL, evaluated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);

    await sql.query(`INSERT INTO gold_price_samples (observed_at, price_usd, instrument, source, interval_name) VALUES ($1, $2, 'XAU/USD', 'Gold-API.com minute collector', '1m') ON CONFLICT (observed_at, instrument, source) DO UPDATE SET price_usd = EXCLUDED.price_usd`, [observedAt, current.price]);
    await sql.query(`INSERT INTO gold_forecast_errors (target_at, forecast_price, actual_price, error) SELECT target_at, forecast_price, $2, $2 - forecast_price FROM gold_locked_forecasts WHERE target_at = $1 ON CONFLICT (target_at) DO NOTHING`, [observedAt, current.price]);

    const fiveMinuteBucket = Math.floor(observedAtMs / (5 * 60_000)) * 5 * 60_000;
    const state = await sql.query(`SELECT generated_at FROM gold_forecast_state WHERE id = 1`) as ForecastStateRow[];
    const shouldRefreshForecast = observedAtMs === fiveMinuteBucket && (!state[0] || Date.parse(state[0].generated_at) < fiveMinuteBucket);
    let forecastStatus = "unchanged";
    let aqiStatus = "unchanged";

    if (shouldRefreshForecast) {
      const hourlyRows = await sql.query(`SELECT observed_at, price_usd FROM gold_price_samples WHERE instrument = 'GC=F' ORDER BY observed_at DESC LIMIT 48`) as PriceRow[];
      const minuteRows = await sql.query(`SELECT observed_at, price_usd FROM (SELECT DISTINCT ON (date_trunc('minute', observed_at)) observed_at, price_usd FROM gold_price_samples WHERE instrument = 'XAU/USD' ORDER BY date_trunc('minute', observed_at) DESC, observed_at DESC) minute_prices ORDER BY observed_at DESC LIMIT 120`) as PriceRow[];

      if (hourlyRows.length >= 24) {
        const hourly: GoldPoint[] = hourlyRows.reverse().map((row) => ({ time: row.observed_at, value: Number(row.price_usd) }));
        const minute: GoldPoint[] = minuteRows.reverse().map((row) => ({ time: row.observed_at, value: Number(row.price_usd) }));
        const errorStats = await sql.query(`SELECT COUNT(*)::int AS sample_count, COALESCE(AVG(error), 0)::float8 AS mean_error FROM gold_forecast_errors`) as ErrorStatRow[];
        const sampleCount = Number(errorStats[0]?.sample_count ?? 0);
        const rawCorrection = Number(errorStats[0]?.mean_error ?? 0) * Math.min(1, sampleCount / 30);
        const correctionLimit = current.price * 0.005;
        const correction = Math.max(-correctionLimit, Math.min(correctionLimit, rawCorrection));
        const predictions = buildRollingGoldForecast(hourly, minute, { time: observedAt, value: current.price }, correction);
        const lockBoundary = observedAtMs + 60 * 60_000;
        const locked = predictions.filter((point) => Date.parse(point.time) <= lockBoundary);

        await sql.query(`INSERT INTO gold_locked_forecasts (target_at, forecast_price, low_price, high_price, generated_at, locked_at, model_version) SELECT target_time, value_price, low_value, high_value, $5, $5, 'rolling-adaptive-v3' FROM UNNEST($1::timestamptz[], $2::numeric[], $3::numeric[], $4::numeric[]) AS forecast_values(target_time, value_price, low_value, high_value) ON CONFLICT (target_at) DO NOTHING`, [locked.map((point) => point.time), locked.map((point) => point.value), locked.map((point) => point.low), locked.map((point) => point.high), observedAt]);
        await sql.query(`INSERT INTO gold_forecast_state (id, generated_at, anchor_price, predictions, model_version, updated_at) VALUES (1, $1, $2, $3::jsonb, 'rolling-adaptive-v3', NOW()) ON CONFLICT (id) DO UPDATE SET generated_at = EXCLUDED.generated_at, anchor_price = EXCLUDED.anchor_price, predictions = EXCLUDED.predictions, model_version = EXCLUDED.model_version, updated_at = NOW()`, [observedAt, current.price, JSON.stringify(predictions)]);
        forecastStatus = "refreshed";
      } else {
        forecastStatus = "waiting-for-history";
      }
    }

    if (observedAtMs % (60 * 60_000) === 0) {
      try {
        await prepareAqiDatabase(sql);
        const campusReadings = await fetchCurrentCampusAqi();
        await saveCampusAqi(sql, campusReadings);
        await prepareDistrictAqiDatabase(sql);
        const districtReadings = await fetchDistrictAqi();
        await saveDistrictAqi(sql, districtReadings);
        const backfillCampus = campuses[Math.floor(observedAtMs / (60 * 60_000)) % campuses.length];
        const backfill = await backfillNextCampusYear(sql, backfillCampus);
        const districtBackfill = await backfillNextDistrictMonth(sql);
        aqiStatus = `saved-${campusReadings.length}-campuses-${districtReadings.length}-districts; backfill-${backfillCampus.id}-${backfill.saved}; district-backfill-${districtBackfill.status}-${districtBackfill.saved}`;
      } catch {
        aqiStatus = "provider-unavailable";
      }
    }

    return Response.json({ success: true, observedAt, providerUpdatedAt: current.updatedAt ?? null, price: current.price, forecastStatus, aqiStatus });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to collect the gold price." }, { status: 502 });
  }
}
