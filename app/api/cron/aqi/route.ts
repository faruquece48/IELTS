import { neon } from "@neondatabase/serverless";
import { campuses, fetchCurrentCampusAqi, prepareAqiDatabase, saveCampusAqi, syncRecentCampusAqi, type AqiReading } from "@/lib/aqi";
import { districts, fetchDistrictAqi, prepareDistrictAqiDatabase, saveDistrictAqi, type DistrictAqi } from "@/lib/districtAqi";

const connectionString = process.env.DATABASE_URL;
const pollutantFields = ["usAqi", "pm25", "pm10", "carbonMonoxide", "carbonDioxide", "nitrogenDioxide", "sulphurDioxide", "ozone"] as const;

function assertCompleteBatch(readings: Array<AqiReading | DistrictAqi>, expected: number, label: string) {
  if (readings.length !== expected) throw new Error(`Expected ${expected} ${label} readings but received ${readings.length}.`);
  const incomplete = readings.filter((reading) => pollutantFields.some((field) => !Number.isFinite(reading[field])));
  if (incomplete.length) throw new Error(`${label} provider response contained ${incomplete.length} incomplete pollutant readings.`);
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!connectionString) return Response.json({ error: "DATABASE_URL is not configured." }, { status: 500 });

  try {
    const sql = neon(connectionString);
    const interval = 60 * 60_000;
    const collectedAt = new Date(Math.floor(Date.now() / interval) * interval).toISOString();
    await prepareAqiDatabase(sql);
    const readings = await fetchCurrentCampusAqi(collectedAt);
    assertCompleteBatch(readings, campuses.length, "campus");
    await saveCampusAqi(sql, readings);
    const recentArchive = await syncRecentCampusAqi(sql, 30);
    await prepareDistrictAqiDatabase(sql);
    const districtReadings = await fetchDistrictAqi(collectedAt);
    assertCompleteBatch(districtReadings, districts.length, "district");
    await saveDistrictAqi(sql, districtReadings);
    return Response.json({ success: true, collectedAt, pollutants: pollutantFields.length, campuses: readings.length, districts: districtReadings.length, recentArchive });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "AQI collection failed." }, { status: 500 });
  }
}

