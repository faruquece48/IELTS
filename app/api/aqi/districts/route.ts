import { neon } from "@neondatabase/serverless";
import { backfillNextDistrictMonth, districts, fetchDistrictAqi, prepareDistrictAqiDatabase, saveDistrictAqi } from "@/lib/districtAqi";

export const dynamic = "force-dynamic";

type MonthlyRow = { district_id: string; observed_at: string; us_aqi: string | number | null; pm2_5: string | number | null; pm10: string | number | null; carbon_monoxide: string | number | null; carbon_dioxide: string | number | null; nitrogen_dioxide: string | number | null; sulphur_dioxide: string | number | null; ozone: string | number | null };

export async function GET(request: Request) {
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) return Response.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
    const sql = neon(connectionString);
    await prepareDistrictAqiDatabase(sql);
    const search = new URL(request.url).searchParams;
    const now = new Date();
    const year = Math.max(2022, Math.min(now.getUTCFullYear(), Number(search.get("year")) || now.getUTCFullYear()));
    const month = Math.max(1, Math.min(12, Number(search.get("month")) || now.getUTCMonth() + 1));
    let collectionWarning: string | null = null;
    if (year === now.getUTCFullYear() && month === now.getUTCMonth() + 1) {
      try {
        const readings = await fetchDistrictAqi();
        await saveDistrictAqi(sql, readings);
      } catch (error) {
        collectionWarning = error instanceof Error ? error.message : "Live AQI collection is temporarily unavailable.";
      }
    }
    let backfill = null;
    if (search.get("backfill") === "1") {
      try {
        const selectedMonth = year === now.getUTCFullYear() && month === now.getUTCMonth() + 1 ? undefined : `${year}-${String(month).padStart(2, "0")}-01`;
        backfill = await backfillNextDistrictMonth(sql, selectedMonth);
      } catch (error) {
        const message = error instanceof Error ? error.message : "AQI archive backfill is temporarily unavailable.";
        collectionWarning ??= message.includes("429") ? "Open-Meteo has temporarily rate-limited archive downloads. Please wait before trying this month again." : message;
      }
    }
    const monthlyRows = await sql.query(`SELECT district_id, MAX(day)::text AS observed_at, MAX(us_aqi_max) AS us_aqi, MAX(pm2_5_max) AS pm2_5, MAX(pm10_max) AS pm10, MAX(carbon_monoxide_max) AS carbon_monoxide, MAX(carbon_dioxide_max) AS carbon_dioxide, MAX(nitrogen_dioxide_max) AS nitrogen_dioxide, MAX(sulphur_dioxide_max) AS sulphur_dioxide, MAX(ozone_max) AS ozone FROM district_aqi_daily WHERE day >= make_date($1::int,$2::int,1) AND day < make_date($1::int,$2::int,1) + INTERVAL '1 month' GROUP BY district_id`, [year, month]) as MonthlyRow[];
    const monthlyByDistrict = new Map(monthlyRows.map((row) => [row.district_id, row]));
    const monthlyReadings = districts.map((district) => {
      const row = monthlyByDistrict.get(district.id);
      return { ...district, observedAt: row?.observed_at ?? "", usAqi: row?.us_aqi == null ? null : Number(row.us_aqi), pm25: row?.pm2_5 == null ? null : Number(row.pm2_5), pm10: row?.pm10 == null ? null : Number(row.pm10), carbonMonoxide: row?.carbon_monoxide == null ? null : Number(row.carbon_monoxide), carbonDioxide: row?.carbon_dioxide == null ? null : Number(row.carbon_dioxide), nitrogenDioxide: row?.nitrogen_dioxide == null ? null : Number(row.nitrogen_dioxide), sulphurDioxide: row?.sulphur_dioxide == null ? null : Number(row.sulphur_dioxide), ozone: row?.ozone == null ? null : Number(row.ozone) };
    });
    const periods = await sql.query(`SELECT DISTINCT EXTRACT(YEAR FROM day)::int AS year, EXTRACT(MONTH FROM day)::int AS month FROM district_aqi_daily ORDER BY year DESC, month DESC`);
    const history = await sql.query(`SELECT date_trunc('hour', observed_at) AS time, ROUND(AVG(us_aqi), 1) AS average_aqi, MAX(us_aqi) AS maximum_aqi FROM district_aqi_samples WHERE observed_at >= NOW() - INTERVAL '7 days' GROUP BY 1 ORDER BY 1 ASC`);
    return Response.json({ generatedAt: new Date().toISOString(), source: "Open-Meteo CAMS", period: { year, month }, periods, districts, readings: monthlyReadings, history, backfill, collectionWarning });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to load district AQI." }, { status: 502 });
  }
}
