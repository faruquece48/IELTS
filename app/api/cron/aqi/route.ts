import { neon } from "@neondatabase/serverless";
import { backfillNextCampusYear, campuses, fetchCurrentCampusAqi, prepareAqiDatabase, saveCampusAqi } from "@/lib/aqi";
import { backfillNextDistrictMonth, fetchDistrictAqi, prepareDistrictAqiDatabase, saveDistrictAqi } from "@/lib/districtAqi";

const connectionString = process.env.DATABASE_URL;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!connectionString) return Response.json({ error: "DATABASE_URL is not configured." }, { status: 500 });

  try {
    const sql = neon(connectionString);
    await prepareAqiDatabase(sql);
    const readings = await fetchCurrentCampusAqi();
    await saveCampusAqi(sql, readings);
    await prepareDistrictAqiDatabase(sql);
    const districtReadings = await fetchDistrictAqi();
    await saveDistrictAqi(sql, districtReadings);
    const backfillCampus = campuses[Math.floor(Date.now() / (15 * 60_000)) % campuses.length];
    const backfill = await backfillNextCampusYear(sql, backfillCampus);
    const districtBackfill = await backfillNextDistrictMonth(sql);
    return Response.json({ success: true, collectedAt: new Date().toISOString(), campuses: readings.length, districts: districtReadings.length, backfillCampus: backfillCampus.id, backfill, districtBackfill });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "AQI collection failed." }, { status: 500 });
  }
}

