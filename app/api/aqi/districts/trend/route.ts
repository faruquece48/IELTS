import { neon } from "@neondatabase/serverless";
import { prepareDistrictAqiDatabase } from "@/lib/districtAqi";

export const dynamic = "force-dynamic";

const pollutantColumns = {
  aqi: "us_aqi_mean",
  pm2_5: "pm2_5_mean",
  pm10: "pm10_mean",
  no2: "nitrogen_dioxide_mean",
  so2: "sulphur_dioxide_mean",
  co: "carbon_monoxide_mean",
  o3: "ozone_mean",
} as const;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const district = url.searchParams.get("district")?.trim().toLowerCase() || "dhaka";
    const pollutant = url.searchParams.get("pollutant") || "pm2_5";
    const column = pollutantColumns[pollutant as keyof typeof pollutantColumns];
    if (!column) return Response.json({ error: "Unsupported pollutant." }, { status: 400 });

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) return Response.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
    const sql = neon(connectionString);
    await prepareDistrictAqiDatabase(sql);
    const rows = await sql.query(
      `SELECT day::text AS day, ROUND(${column}, 2) AS value
       FROM district_aqi_daily
       WHERE district_id = $1 AND ${column} IS NOT NULL
       ORDER BY day`,
      [district],
    );
    return Response.json({ district, pollutant, rows });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to load daily trend data." }, { status: 502 });
  }
}
