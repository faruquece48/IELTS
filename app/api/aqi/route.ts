import { neon } from "@neondatabase/serverless";
import { AQI_ARCHIVE_START, backfillNextCampusYear, campuses, fetchCurrentCampusAqi, prepareAqiDatabase, saveCampusAqi, syncRecentCampusAqi, type DailyAqi } from "@/lib/aqi";

type HistoryRow = {
  observed_at: string;
  us_aqi: string | number | null;
  pm2_5: string | number | null;
  pm10: string | number | null;
};

type HourlyPayload = {
  hourly?: {
    time?: string[];
    us_aqi?: Array<number | null>;
    pm2_5?: Array<number | null>;
    pm10?: Array<number | null>;
    carbon_monoxide?: Array<number | null>;
    carbon_dioxide?: Array<number | null>;
    nitrogen_dioxide?: Array<number | null>;
    sulphur_dioxide?: Array<number | null>;
    ozone?: Array<number | null>;
  };
};

type DailyRow = Record<string, string | number | null> & { day: string };

const connectionString = process.env.DATABASE_URL;

export async function GET(request: Request) {
  try {
    if (!connectionString) return Response.json({ error: "DATABASE_URL is not configured." }, { status: 500 });

    const requestedId = new URL(request.url).searchParams.get("campus") ?? campuses[0].id;
    const selectedCampus = campuses.find((campus) => campus.id === requestedId) ?? campuses[0];
    const sql = neon(connectionString);
    await prepareAqiDatabase(sql);

    const readings = await fetchCurrentCampusAqi();
    await saveCampusAqi(sql, readings);
    const recentSync = await syncRecentCampusAqi(sql, 30);
    const backfill = recentSync.saved > 0
      ? { status: "complete", saved: 0 }
      : await backfillNextCampusYear(sql, selectedCampus);

    const forecastUrl = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
    forecastUrl.searchParams.set("latitude", String(selectedCampus.latitude));
    forecastUrl.searchParams.set("longitude", String(selectedCampus.longitude));
    forecastUrl.searchParams.set("hourly", "us_aqi,pm2_5,pm10,carbon_monoxide,carbon_dioxide,nitrogen_dioxide,sulphur_dioxide,ozone");
    forecastUrl.searchParams.set("past_days", "2");
    forecastUrl.searchParams.set("forecast_days", "3");
    forecastUrl.searchParams.set("timezone", "Asia/Dhaka");
    const forecastResponse = await fetch(forecastUrl, { cache: "no-store", headers: { Accept: "application/json" } });
    if (!forecastResponse.ok) throw new Error(`AQI forecast provider returned ${forecastResponse.status}.`);
    const forecastPayload = await forecastResponse.json() as HourlyPayload;
    const hourly = forecastPayload.hourly;
    const timeline = (hourly?.time ?? []).map((time, index) => ({
      time: new Date(`${time}:00+06:00`).toISOString(),
      usAqi: hourly?.us_aqi?.[index] ?? null,
      pm25: hourly?.pm2_5?.[index] ?? null,
      pm10: hourly?.pm10?.[index] ?? null,
      carbonMonoxide: hourly?.carbon_monoxide?.[index] ?? null,
      carbonDioxide: hourly?.carbon_dioxide?.[index] ?? null,
      nitrogenDioxide: hourly?.nitrogen_dioxide?.[index] ?? null,
      sulphurDioxide: hourly?.sulphur_dioxide?.[index] ?? null,
      ozone: hourly?.ozone?.[index] ?? null,
    }));

    const historyRows = await sql.query(
      `SELECT observed_at, us_aqi, pm2_5, pm10
       FROM campus_aqi_samples
       WHERE campus_id = $1 AND observed_at >= NOW() - INTERVAL '30 days'
       ORDER BY observed_at ASC`,
      [selectedCampus.id],
    ) as HistoryRow[];
    const dailyRows = await sql.query(`SELECT campus_id, day::text AS day, us_aqi_min, us_aqi_max, pm2_5_min, pm2_5_max, pm10_min, pm10_max, carbon_monoxide_min, carbon_monoxide_max, carbon_dioxide_min, carbon_dioxide_max, nitrogen_dioxide_min, nitrogen_dioxide_max, sulphur_dioxide_min, sulphur_dioxide_max, ozone_min, ozone_max FROM campus_aqi_daily WHERE campus_id = $1 ORDER BY day ASC`, [selectedCampus.id]) as DailyRow[];
    const dailyHistory: DailyAqi[] = dailyRows.map((row) => ({
      campusId: selectedCampus.id,
      date: String(row.day).slice(0, 10),
      usAqiMin: row.us_aqi_min === null ? null : Number(row.us_aqi_min), usAqiMax: row.us_aqi_max === null ? null : Number(row.us_aqi_max),
      pm25Min: row.pm2_5_min === null ? null : Number(row.pm2_5_min), pm25Max: row.pm2_5_max === null ? null : Number(row.pm2_5_max),
      pm10Min: row.pm10_min === null ? null : Number(row.pm10_min), pm10Max: row.pm10_max === null ? null : Number(row.pm10_max),
      carbonMonoxideMin: row.carbon_monoxide_min === null ? null : Number(row.carbon_monoxide_min), carbonMonoxideMax: row.carbon_monoxide_max === null ? null : Number(row.carbon_monoxide_max),
      carbonDioxideMin: row.carbon_dioxide_min === null ? null : Number(row.carbon_dioxide_min), carbonDioxideMax: row.carbon_dioxide_max === null ? null : Number(row.carbon_dioxide_max),
      nitrogenDioxideMin: row.nitrogen_dioxide_min === null ? null : Number(row.nitrogen_dioxide_min), nitrogenDioxideMax: row.nitrogen_dioxide_max === null ? null : Number(row.nitrogen_dioxide_max),
      sulphurDioxideMin: row.sulphur_dioxide_min === null ? null : Number(row.sulphur_dioxide_min), sulphurDioxideMax: row.sulphur_dioxide_max === null ? null : Number(row.sulphur_dioxide_max),
      ozoneMin: row.ozone_min === null ? null : Number(row.ozone_min), ozoneMax: row.ozone_max === null ? null : Number(row.ozone_max),
    }));

    return Response.json({
      source: "Open-Meteo CAMS Global",
      generatedAt: new Date().toISOString(),
      campuses,
      readings,
      selectedCampus,
      history: historyRows.map((row) => ({
        time: row.observed_at,
        usAqi: row.us_aqi === null ? null : Number(row.us_aqi),
        pm25: row.pm2_5 === null ? null : Number(row.pm2_5),
        pm10: row.pm10 === null ? null : Number(row.pm10),
      })),
      timeline,
      dailyHistory,
      archiveStart: AQI_ARCHIVE_START,
      recentSync,
      backfill,
    });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to load campus AQI data." }, { status: 500 });
  }
}

