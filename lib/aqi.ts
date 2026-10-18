import type { NeonQueryFunction } from "@neondatabase/serverless";

export type Campus = {
  id: string;
  name: string;
  shortName: string;
  district: string;
  division: string;
  latitude: number;
  longitude: number;
};

export type AqiReading = {
  campusId: string;
  observedAt: string;
  usAqi: number | null;
  pm25: number | null;
  pm10: number | null;
  carbonMonoxide: number | null;
  carbonDioxide: number | null;
  nitrogenDioxide: number | null;
  sulphurDioxide: number | null;
  ozone: number | null;
};

export type DailyAqi = {
  campusId: string;
  date: string;
  usAqiMin: number | null;
  usAqiMax: number | null;
  pm25Min: number | null;
  pm25Max: number | null;
  pm10Min: number | null;
  pm10Max: number | null;
  carbonMonoxideMin: number | null;
  carbonMonoxideMax: number | null;
  carbonDioxideMin: number | null;
  carbonDioxideMax: number | null;
  nitrogenDioxideMin: number | null;
  nitrogenDioxideMax: number | null;
  sulphurDioxideMin: number | null;
  sulphurDioxideMax: number | null;
  ozoneMin: number | null;
  ozoneMax: number | null;
};

export const AQI_ARCHIVE_START = "2022-09-01";
export const pollutantDefinitions = [
  { id: "us_aqi", label: "US AQI", unit: "AQI", minKey: "usAqiMin", maxKey: "usAqiMax" },
  { id: "pm2_5", label: "PM2.5", unit: "µg/m³", minKey: "pm25Min", maxKey: "pm25Max" },
  { id: "pm10", label: "PM10", unit: "µg/m³", minKey: "pm10Min", maxKey: "pm10Max" },
  { id: "carbon_monoxide", label: "Carbon monoxide (CO)", unit: "µg/m³", minKey: "carbonMonoxideMin", maxKey: "carbonMonoxideMax" },
  { id: "carbon_dioxide", label: "Carbon dioxide (CO₂)", unit: "ppm", minKey: "carbonDioxideMin", maxKey: "carbonDioxideMax" },
  { id: "nitrogen_dioxide", label: "Nitrogen dioxide (NO₂)", unit: "µg/m³", minKey: "nitrogenDioxideMin", maxKey: "nitrogenDioxideMax" },
  { id: "sulphur_dioxide", label: "Sulphur dioxide (SO₂)", unit: "µg/m³", minKey: "sulphurDioxideMin", maxKey: "sulphurDioxideMax" },
  { id: "ozone", label: "Ozone (O₃)", unit: "µg/m³", minKey: "ozoneMin", maxKey: "ozoneMax" },
] as const;

export const campuses: Campus[] = [
  { id: "buet", name: "Bangladesh University of Engineering and Technology", shortName: "BUET", district: "Dhaka", division: "Dhaka", latitude: 23.7267, longitude: 90.3925 },
  { id: "bau", name: "Bangladesh Agricultural University", shortName: "BAU", district: "Mymensingh", division: "Mymensingh", latitude: 24.7249, longitude: 90.4362 },
  { id: "cuet", name: "Chittagong University of Engineering and Technology", shortName: "CUET", district: "Chattogram", division: "Chattogram", latitude: 22.4600, longitude: 91.9718 },
  { id: "nstu", name: "Noakhali Science and Technology University", shortName: "NSTU", district: "Noakhali", division: "Chattogram", latitude: 22.7923, longitude: 91.1017 },
  { id: "ruet", name: "Rajshahi University of Engineering and Technology", shortName: "RUET", district: "Rajshahi", division: "Rajshahi", latitude: 24.3635, longitude: 88.6279 },
  { id: "kuet", name: "Khulna University of Engineering and Technology", shortName: "KUET", district: "Khulna", division: "Khulna", latitude: 22.9005, longitude: 89.5024 },
  { id: "sust", name: "Shahjalal University of Science and Technology", shortName: "SUST", district: "Sylhet", division: "Sylhet", latitude: 24.9180, longitude: 91.8317 },
  { id: "bu", name: "University of Barishal", shortName: "BU", district: "Barishal", division: "Barishal", latitude: 22.6590, longitude: 90.3620 },
  { id: "brur", name: "Begum Rokeya University, Rangpur", shortName: "BRUR", district: "Rangpur", division: "Rangpur", latitude: 25.7171, longitude: 89.2588 },
  { id: "hstu", name: "Hajee Mohammad Danesh Science and Technology University", shortName: "HSTU", district: "Dinajpur", division: "Rangpur", latitude: 25.6973, longitude: 88.6514 },
];

const activeCampusIds = new Set(campuses.map((campus) => campus.id));

type OpenMeteoCurrent = {
  time?: string;
  us_aqi?: number;
  pm2_5?: number;
  pm10?: number;
  carbon_monoxide?: number;
  carbon_dioxide?: number;
  nitrogen_dioxide?: number;
  sulphur_dioxide?: number;
  ozone?: number;
};

type OpenMeteoResponse = { current?: OpenMeteoCurrent };

const nullable = (value: number | undefined) => Number.isFinite(value) ? value! : null;

export async function prepareAqiDatabase(sql: NeonQueryFunction<false, false>) {
  await sql.query(`CREATE TABLE IF NOT EXISTS campus_aqi_samples (
    id BIGSERIAL PRIMARY KEY,
    campus_id TEXT NOT NULL,
    observed_at TIMESTAMPTZ NOT NULL,
    us_aqi NUMERIC(8, 2),
    pm2_5 NUMERIC(10, 3),
    pm10 NUMERIC(10, 3),
    carbon_monoxide NUMERIC(12, 3),
    carbon_dioxide NUMERIC(12, 3),
    nitrogen_dioxide NUMERIC(10, 3),
    sulphur_dioxide NUMERIC(10, 3),
    ozone NUMERIC(10, 3),
    source TEXT NOT NULL DEFAULT 'Open-Meteo CAMS',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (campus_id, observed_at)
  )`);
  await sql.query(`ALTER TABLE campus_aqi_samples ADD COLUMN IF NOT EXISTS carbon_dioxide NUMERIC(12, 3)`);
  await sql.query(`CREATE INDEX IF NOT EXISTS campus_aqi_samples_campus_time_idx ON campus_aqi_samples (campus_id, observed_at DESC)`);
  await sql.query(`CREATE TABLE IF NOT EXISTS campus_aqi_daily (
    campus_id TEXT NOT NULL,
    day DATE NOT NULL,
    us_aqi_min NUMERIC(10, 3), us_aqi_max NUMERIC(10, 3),
    pm2_5_min NUMERIC(10, 3), pm2_5_max NUMERIC(10, 3),
    pm10_min NUMERIC(10, 3), pm10_max NUMERIC(10, 3),
    carbon_monoxide_min NUMERIC(12, 3), carbon_monoxide_max NUMERIC(12, 3),
    carbon_dioxide_min NUMERIC(12, 3), carbon_dioxide_max NUMERIC(12, 3),
    nitrogen_dioxide_min NUMERIC(10, 3), nitrogen_dioxide_max NUMERIC(10, 3),
    sulphur_dioxide_min NUMERIC(10, 3), sulphur_dioxide_max NUMERIC(10, 3),
    ozone_min NUMERIC(10, 3), ozone_max NUMERIC(10, 3),
    source TEXT NOT NULL DEFAULT 'Open-Meteo CAMS Global',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (campus_id, day)
  )`);
  await sql.query(`CREATE INDEX IF NOT EXISTS campus_aqi_daily_day_idx ON campus_aqi_daily (day DESC)`);
  const campusIds = campuses.map((campus) => campus.id);
  await sql.query(`DELETE FROM campus_aqi_samples WHERE NOT (campus_id = ANY($1::text[]))`, [campusIds]);
  await sql.query(`DELETE FROM campus_aqi_daily WHERE NOT (campus_id = ANY($1::text[]))`, [campusIds]);
}

export async function fetchCurrentCampusAqi(observedAt?: string): Promise<AqiReading[]> {
  const parameters = "us_aqi,pm2_5,pm10,carbon_monoxide,carbon_dioxide,nitrogen_dioxide,sulphur_dioxide,ozone";
  const collectionInterval = 60 * 60_000;
  const collectedAt = observedAt ?? new Date(Math.floor(Date.now() / collectionInterval) * collectionInterval).toISOString();
  const url = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
  url.searchParams.set("latitude", campuses.map((campus) => campus.latitude).join(","));
  url.searchParams.set("longitude", campuses.map((campus) => campus.longitude).join(","));
  url.searchParams.set("current", parameters);
  url.searchParams.set("timezone", "Asia/Dhaka");
  const response = await fetch(url, { cache: "no-store", headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`AQI provider returned ${response.status}.`);
  const payload = await response.json() as OpenMeteoResponse | OpenMeteoResponse[];
  const results = Array.isArray(payload) ? payload : [payload];

  return campuses.map((campus, index) => {
    const current = results[index]?.current ?? {};
    return {
      campusId: campus.id,
      observedAt: collectedAt,
      usAqi: nullable(current.us_aqi),
      pm25: nullable(current.pm2_5),
      pm10: nullable(current.pm10),
      carbonMonoxide: nullable(current.carbon_monoxide),
      carbonDioxide: nullable(current.carbon_dioxide),
      nitrogenDioxide: nullable(current.nitrogen_dioxide),
      sulphurDioxide: nullable(current.sulphur_dioxide),
      ozone: nullable(current.ozone),
    };
  });
}

export async function saveCampusAqi(sql: NeonQueryFunction<false, false>, readings: AqiReading[]) {
  const activeReadings = readings.filter((reading) => activeCampusIds.has(reading.campusId));
  if (!activeReadings.length) return;
  await sql.query(
    `INSERT INTO campus_aqi_samples (campus_id, observed_at, us_aqi, pm2_5, pm10, carbon_monoxide, carbon_dioxide, nitrogen_dioxide, sulphur_dioxide, ozone)
     SELECT * FROM UNNEST($1::text[], $2::timestamptz[], $3::numeric[], $4::numeric[], $5::numeric[], $6::numeric[], $7::numeric[], $8::numeric[], $9::numeric[], $10::numeric[])
     ON CONFLICT (campus_id, observed_at) DO UPDATE SET us_aqi = EXCLUDED.us_aqi, pm2_5 = EXCLUDED.pm2_5, pm10 = EXCLUDED.pm10, carbon_monoxide = EXCLUDED.carbon_monoxide, carbon_dioxide = EXCLUDED.carbon_dioxide, nitrogen_dioxide = EXCLUDED.nitrogen_dioxide, sulphur_dioxide = EXCLUDED.sulphur_dioxide, ozone = EXCLUDED.ozone`,
    [
      activeReadings.map((reading) => reading.campusId), activeReadings.map((reading) => reading.observedAt),
      activeReadings.map((reading) => reading.usAqi), activeReadings.map((reading) => reading.pm25), activeReadings.map((reading) => reading.pm10),
      activeReadings.map((reading) => reading.carbonMonoxide), activeReadings.map((reading) => reading.carbonDioxide), activeReadings.map((reading) => reading.nitrogenDioxide),
      activeReadings.map((reading) => reading.sulphurDioxide), activeReadings.map((reading) => reading.ozone),
    ],
  );
}

type HistoricHourly = { time?: string[] } & Record<string, Array<number | null> | string[] | undefined>;
type HistoricPayload = { hourly?: HistoricHourly };

const minMax = (values: Array<number | null>) => {
  const valid = values.filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  return { min: valid.length ? Math.min(...valid) : null, max: valid.length ? Math.max(...valid) : null };
};

function dhakaDate(value = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(value);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value;
  const year = part("year");
  const month = part("month");
  const day = part("day");
  if (!year || !month || !day) throw new Error("Unable to determine the current date in Asia/Dhaka.");
  return `${year}-${month}-${day}`;
}

function dailyRowsFromHourly(campus: Campus, hourly?: HistoricHourly): DailyAqi[] {
  const times = hourly?.time ?? [];
  const indexesByDate = new Map<string, number[]>();
  times.forEach((time, index) => {
    const date = time.slice(0, 10);
    indexesByDate.set(date, [...(indexesByDate.get(date) ?? []), index]);
  });

  return [...indexesByDate.entries()].map(([date, indexes]) => {
    const stats = Object.fromEntries(pollutantDefinitions.map((pollutant) => {
      const source = (hourly?.[pollutant.id] ?? []) as Array<number | null>;
      return [pollutant.id, minMax(indexes.map((index) => source[index] ?? null))];
    })) as Record<(typeof pollutantDefinitions)[number]["id"], { min: number | null; max: number | null }>;
    return {
      campusId: campus.id, date,
      usAqiMin: stats.us_aqi.min, usAqiMax: stats.us_aqi.max,
      pm25Min: stats.pm2_5.min, pm25Max: stats.pm2_5.max,
      pm10Min: stats.pm10.min, pm10Max: stats.pm10.max,
      carbonMonoxideMin: stats.carbon_monoxide.min, carbonMonoxideMax: stats.carbon_monoxide.max,
      carbonDioxideMin: stats.carbon_dioxide.min, carbonDioxideMax: stats.carbon_dioxide.max,
      nitrogenDioxideMin: stats.nitrogen_dioxide.min, nitrogenDioxideMax: stats.nitrogen_dioxide.max,
      sulphurDioxideMin: stats.sulphur_dioxide.min, sulphurDioxideMax: stats.sulphur_dioxide.max,
      ozoneMin: stats.ozone.min, ozoneMax: stats.ozone.max,
    };
  });
}

export async function fetchDailyCampusAqi(campus: Campus, startDate: string, endDate: string): Promise<DailyAqi[]> {
  const variables = pollutantDefinitions.map((item) => item.id).join(",");
  const url = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
  url.searchParams.set("latitude", String(campus.latitude));
  url.searchParams.set("longitude", String(campus.longitude));
  url.searchParams.set("hourly", variables);
  url.searchParams.set("start_date", startDate);
  url.searchParams.set("end_date", endDate);
  url.searchParams.set("domains", "cams_global");
  url.searchParams.set("timezone", "Asia/Dhaka");
  const response = await fetch(url, { cache: "no-store", headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`AQI archive returned ${response.status}.`);
  return dailyRowsFromHourly(campus, ((await response.json()) as HistoricPayload).hourly);
}

export async function saveDailyCampusAqi(sql: NeonQueryFunction<false, false>, rows: DailyAqi[]) {
  const activeRows = rows.filter((row) => activeCampusIds.has(row.campusId));
  for (let start = 0; start < activeRows.length; start += 400) {
    const chunk = activeRows.slice(start, start + 400);
    await sql.query(`INSERT INTO campus_aqi_daily (campus_id, day, us_aqi_min, us_aqi_max, pm2_5_min, pm2_5_max, pm10_min, pm10_max, carbon_monoxide_min, carbon_monoxide_max, carbon_dioxide_min, carbon_dioxide_max, nitrogen_dioxide_min, nitrogen_dioxide_max, sulphur_dioxide_min, sulphur_dioxide_max, ozone_min, ozone_max)
      SELECT * FROM UNNEST($1::text[], $2::date[], $3::numeric[], $4::numeric[], $5::numeric[], $6::numeric[], $7::numeric[], $8::numeric[], $9::numeric[], $10::numeric[], $11::numeric[], $12::numeric[], $13::numeric[], $14::numeric[], $15::numeric[], $16::numeric[], $17::numeric[], $18::numeric[])
      ON CONFLICT (campus_id, day) DO UPDATE SET us_aqi_min=EXCLUDED.us_aqi_min, us_aqi_max=EXCLUDED.us_aqi_max, pm2_5_min=EXCLUDED.pm2_5_min, pm2_5_max=EXCLUDED.pm2_5_max, pm10_min=EXCLUDED.pm10_min, pm10_max=EXCLUDED.pm10_max, carbon_monoxide_min=EXCLUDED.carbon_monoxide_min, carbon_monoxide_max=EXCLUDED.carbon_monoxide_max, carbon_dioxide_min=EXCLUDED.carbon_dioxide_min, carbon_dioxide_max=EXCLUDED.carbon_dioxide_max, nitrogen_dioxide_min=EXCLUDED.nitrogen_dioxide_min, nitrogen_dioxide_max=EXCLUDED.nitrogen_dioxide_max, sulphur_dioxide_min=EXCLUDED.sulphur_dioxide_min, sulphur_dioxide_max=EXCLUDED.sulphur_dioxide_max, ozone_min=EXCLUDED.ozone_min, ozone_max=EXCLUDED.ozone_max, updated_at=NOW()`, [
        chunk.map((row) => row.campusId), chunk.map((row) => row.date), chunk.map((row) => row.usAqiMin), chunk.map((row) => row.usAqiMax),
        chunk.map((row) => row.pm25Min), chunk.map((row) => row.pm25Max), chunk.map((row) => row.pm10Min), chunk.map((row) => row.pm10Max),
        chunk.map((row) => row.carbonMonoxideMin), chunk.map((row) => row.carbonMonoxideMax), chunk.map((row) => row.carbonDioxideMin), chunk.map((row) => row.carbonDioxideMax),
        chunk.map((row) => row.nitrogenDioxideMin), chunk.map((row) => row.nitrogenDioxideMax), chunk.map((row) => row.sulphurDioxideMin), chunk.map((row) => row.sulphurDioxideMax), chunk.map((row) => row.ozoneMin), chunk.map((row) => row.ozoneMax),
      ]);
  }
}

export async function syncRecentCampusAqi(sql: NeonQueryFunction<false, false>, days = 30) {
  const dhakaToday = new Date(`${dhakaDate()}T00:00:00Z`);
  const end = new Date(dhakaToday);
  end.setUTCDate(end.getUTCDate() - 1);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (days - 1));
  const date = (value: Date) => value.toISOString().slice(0, 10);
  const startDate = date(start);
  const endDate = date(end);

  const [coverage] = await sql.query(
    `SELECT COUNT(*)::int AS saved
     FROM campus_aqi_daily
     WHERE campus_id = ANY($1::text[]) AND day BETWEEN $2::date AND $3::date`,
    [campuses.map((campus) => campus.id), startDate, endDate],
  ) as Array<{ saved: number }>;
  const expected = campuses.length * days;
  if (Number(coverage?.saved ?? 0) >= expected) {
    return { status: "complete", saved: 0, startDate, endDate };
  }

  const url = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
  url.searchParams.set("latitude", campuses.map((campus) => campus.latitude).join(","));
  url.searchParams.set("longitude", campuses.map((campus) => campus.longitude).join(","));
  url.searchParams.set("hourly", pollutantDefinitions.map((item) => item.id).join(","));
  url.searchParams.set("start_date", startDate);
  url.searchParams.set("end_date", endDate);
  url.searchParams.set("domains", "cams_global");
  url.searchParams.set("timezone", "Asia/Dhaka");
  const response = await fetch(url, { cache: "no-store", headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Recent AQI archive returned ${response.status}.`);
  const payload = await response.json() as HistoricPayload | HistoricPayload[];
  const results = Array.isArray(payload) ? payload : [payload];
  if (results.length !== campuses.length) throw new Error("Recent AQI archive did not return all campuses.");
  const rows = results.flatMap((result, index) => dailyRowsFromHourly(campuses[index], result.hourly));
  await saveDailyCampusAqi(sql, rows);
  return { status: `${startDate}:${endDate}`, saved: rows.length, startDate, endDate };
}

export async function backfillNextCampusYear(sql: NeonQueryFunction<false, false>, campus: Campus) {
  const [state] = await sql.query(
    `SELECT TO_CHAR(candidate.day, 'YYYY-MM-DD') AS next_day
     FROM generate_series($2::date, (NOW() AT TIME ZONE 'Asia/Dhaka')::date - 1, INTERVAL '1 day') AS candidate(day)
     WHERE NOT EXISTS (
       SELECT 1 FROM campus_aqi_daily saved
       WHERE saved.campus_id = $1 AND saved.day = candidate.day::date
     )
     ORDER BY candidate.day ASC LIMIT 1`,
    [campus.id, AQI_ARCHIVE_START],
  ) as Array<{ next_day: string | null }>;
  if (!state?.next_day) return { status: "complete", saved: 0 };
  const start = new Date(`${state.next_day}T00:00:00Z`);
  const yesterday = new Date(`${dhakaDate()}T00:00:00Z`);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  if (start > yesterday) return { status: "complete", saved: 0 };
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 364);
  if (end > yesterday) end.setTime(yesterday.getTime());
  const date = (value: Date) => value.toISOString().slice(0, 10);
  const rows = await fetchDailyCampusAqi(campus, date(start), date(end));
  await saveDailyCampusAqi(sql, rows);
  return { status: `${date(start)}:${date(end)}`, saved: rows.length };
}

export function describeAqi(value: number | null) {
  if (value === null) return { label: "Unavailable", color: "#64748b", background: "#f1f5f9", advice: "No current AQI reading is available." };
  if (value <= 50) return { label: "Good", color: "#15803d", background: "#dcfce7", advice: "Air quality is satisfactory. Outdoor activity is suitable for most people." };
  if (value <= 100) return { label: "Moderate", color: "#a16207", background: "#fef9c3", advice: "Sensitive people should reduce prolonged or unusually heavy outdoor exertion." };
  if (value <= 150) return { label: "Unhealthy for sensitive groups", color: "#c2410c", background: "#ffedd5", advice: "Children, older adults and people with heart or lung conditions should limit prolonged outdoor activity." };
  if (value <= 200) return { label: "Unhealthy", color: "#b91c1c", background: "#fee2e2", advice: "Reduce prolonged outdoor exertion; sensitive groups should avoid it." };
  if (value <= 300) return { label: "Very unhealthy", color: "#7e22ce", background: "#f3e8ff", advice: "Avoid strenuous outdoor activity and consider a well-fitted respirator outdoors." };
  return { label: "Hazardous", color: "#881337", background: "#ffe4e6", advice: "Avoid outdoor activity where possible and keep indoor air clean." };
}
