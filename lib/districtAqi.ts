import type { NeonQueryFunction } from "@neondatabase/serverless";

export type District = { id: string; name: string; division: string; latitude: number; longitude: number };
export type DistrictAqi = District & { observedAt: string; usAqi: number | null; pm25: number | null; pm10: number | null; carbonMonoxide: number | null; carbonDioxide: number | null; nitrogenDioxide: number | null; sulphurDioxide: number | null; ozone: number | null };
type Triple = { min: number | null; max: number | null; mean: number | null };
export type DailyDistrictAqi = { districtId: string; date: string; usAqi: Triple; pm25: Triple; pm10: Triple; carbonMonoxide: Triple; carbonDioxide: Triple; nitrogenDioxide: Triple; sulphurDioxide: Triple; ozone: Triple };
export const DISTRICT_AQI_ARCHIVE_START = "2022-08-01";

export const districts: District[] = [
  ["bagerhat","Bagerhat","Khulna",22.66,89.79],["bandarban","Bandarban","Chattogram",22.20,92.22],["barguna","Barguna","Barishal",22.16,90.13],["barishal","Barishal","Barishal",22.70,90.37],
  ["bhola","Bhola","Barishal",22.69,90.65],["bogura","Bogura","Rajshahi",24.85,89.37],["brahmanbaria","Brahmanbaria","Chattogram",23.96,91.11],["chandpur","Chandpur","Chattogram",23.23,90.67],
  ["chapainawabganj","Chapainawabganj","Rajshahi",24.60,88.28],["chattogram","Chattogram","Chattogram",22.36,91.78],["chuadanga","Chuadanga","Khulna",23.64,88.85],["cumilla","Cumilla","Chattogram",23.46,91.18],
  ["coxsbazar","Cox's Bazar","Chattogram",21.43,92.01],["dhaka","Dhaka","Dhaka",23.81,90.41],["dinajpur","Dinajpur","Rangpur",25.63,88.64],["faridpur","Faridpur","Dhaka",23.61,89.84],
  ["feni","Feni","Chattogram",23.02,91.40],["gaibandha","Gaibandha","Rangpur",25.33,89.54],["gazipur","Gazipur","Dhaka",24.00,90.42],["gopalganj","Gopalganj","Dhaka",23.01,89.83],
  ["habiganj","Habiganj","Sylhet",24.37,91.42],["jamalpur","Jamalpur","Mymensingh",24.94,89.94],["jashore","Jashore","Khulna",23.17,89.21],["jhalokati","Jhalokati","Barishal",22.64,90.20],
  ["jhenaidah","Jhenaidah","Khulna",23.54,89.17],["joypurhat","Joypurhat","Rajshahi",25.10,89.02],["khagrachhari","Khagrachhari","Chattogram",23.11,91.99],["khulna","Khulna","Khulna",22.85,89.54],
  ["kishoreganj","Kishoreganj","Dhaka",24.44,90.78],["kurigram","Kurigram","Rangpur",25.81,89.65],["kushtia","Kushtia","Khulna",23.90,89.12],["lakshmipur","Lakshmipur","Chattogram",22.94,90.84],
  ["lalmonirhat","Lalmonirhat","Rangpur",25.92,89.45],["madaripur","Madaripur","Dhaka",23.16,90.19],["magura","Magura","Khulna",23.49,89.42],["manikganj","Manikganj","Dhaka",23.86,90.00],
  ["meherpur","Meherpur","Khulna",23.77,88.63],["moulvibazar","Moulvibazar","Sylhet",24.48,91.78],["munshiganj","Munshiganj","Dhaka",23.54,90.53],["mymensingh","Mymensingh","Mymensingh",24.75,90.41],
  ["naogaon","Naogaon","Rajshahi",24.81,88.94],["narail","Narail","Khulna",23.17,89.50],["narayanganj","Narayanganj","Dhaka",23.62,90.50],["narsingdi","Narsingdi","Dhaka",23.92,90.72],
  ["natore","Natore","Rajshahi",24.42,89.00],["netrokona","Netrokona","Mymensingh",24.88,90.73],["nilphamari","Nilphamari","Rangpur",25.93,88.86],["noakhali","Noakhali","Chattogram",22.87,91.10],
  ["pabna","Pabna","Rajshahi",24.01,89.24],["panchagarh","Panchagarh","Rangpur",26.34,88.56],["patuakhali","Patuakhali","Barishal",22.36,90.33],["pirojpur","Pirojpur","Barishal",22.58,89.98],
  ["rajbari","Rajbari","Dhaka",23.76,89.65],["rajshahi","Rajshahi","Rajshahi",24.37,88.60],["rangamati","Rangamati","Chattogram",22.65,92.18],["rangpur","Rangpur","Rangpur",25.74,89.28],
  ["satkhira","Satkhira","Khulna",22.72,89.08],["shariatpur","Shariatpur","Dhaka",23.24,90.43],["sherpur","Sherpur","Mymensingh",25.02,90.02],["sirajganj","Sirajganj","Rajshahi",24.45,89.70],
  ["sunamganj","Sunamganj","Sylhet",25.07,91.40],["sylhet","Sylhet","Sylhet",24.89,91.87],["tangail","Tangail","Dhaka",24.25,89.92],["thakurgaon","Thakurgaon","Rangpur",26.03,88.47],
].map(([id,name,division,latitude,longitude]) => ({ id: String(id), name: String(name), division: String(division), latitude: Number(latitude), longitude: Number(longitude) }));

export async function prepareDistrictAqiDatabase(sql: NeonQueryFunction<false, false>) {
  await sql.query(`CREATE TABLE IF NOT EXISTS district_aqi_samples (district_id TEXT NOT NULL, observed_at TIMESTAMPTZ NOT NULL, us_aqi NUMERIC(8,2), pm2_5 NUMERIC(10,3), pm10 NUMERIC(10,3), carbon_monoxide NUMERIC(12,3), carbon_dioxide NUMERIC(12,3), nitrogen_dioxide NUMERIC(10,3), sulphur_dioxide NUMERIC(10,3), ozone NUMERIC(10,3), source TEXT NOT NULL DEFAULT 'Open-Meteo CAMS', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), PRIMARY KEY (district_id, observed_at))`);
  await sql.query(`ALTER TABLE district_aqi_samples ADD COLUMN IF NOT EXISTS carbon_monoxide NUMERIC(12,3), ADD COLUMN IF NOT EXISTS carbon_dioxide NUMERIC(12,3), ADD COLUMN IF NOT EXISTS nitrogen_dioxide NUMERIC(10,3), ADD COLUMN IF NOT EXISTS sulphur_dioxide NUMERIC(10,3)`);
  await sql.query(`CREATE INDEX IF NOT EXISTS district_aqi_samples_time_idx ON district_aqi_samples (observed_at DESC)`);
  await sql.query(`CREATE TABLE IF NOT EXISTS district_aqi_daily (district_id TEXT NOT NULL, day DATE NOT NULL, us_aqi_min NUMERIC(10,3), us_aqi_max NUMERIC(10,3), us_aqi_mean NUMERIC(10,3), pm2_5_min NUMERIC(10,3), pm2_5_max NUMERIC(10,3), pm2_5_mean NUMERIC(10,3), pm10_min NUMERIC(10,3), pm10_max NUMERIC(10,3), pm10_mean NUMERIC(10,3), carbon_monoxide_min NUMERIC(12,3), carbon_monoxide_max NUMERIC(12,3), carbon_monoxide_mean NUMERIC(12,3), carbon_dioxide_min NUMERIC(12,3), carbon_dioxide_max NUMERIC(12,3), carbon_dioxide_mean NUMERIC(12,3), nitrogen_dioxide_min NUMERIC(10,3), nitrogen_dioxide_max NUMERIC(10,3), nitrogen_dioxide_mean NUMERIC(10,3), sulphur_dioxide_min NUMERIC(10,3), sulphur_dioxide_max NUMERIC(10,3), sulphur_dioxide_mean NUMERIC(10,3), ozone_min NUMERIC(10,3), ozone_max NUMERIC(10,3), ozone_mean NUMERIC(10,3), source TEXT NOT NULL DEFAULT 'Open-Meteo CAMS Global', updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), PRIMARY KEY (district_id, day))`);
  await sql.query(`ALTER TABLE district_aqi_daily ADD COLUMN IF NOT EXISTS carbon_monoxide_min NUMERIC(12,3), ADD COLUMN IF NOT EXISTS carbon_monoxide_max NUMERIC(12,3), ADD COLUMN IF NOT EXISTS carbon_monoxide_mean NUMERIC(12,3), ADD COLUMN IF NOT EXISTS carbon_dioxide_min NUMERIC(12,3), ADD COLUMN IF NOT EXISTS carbon_dioxide_max NUMERIC(12,3), ADD COLUMN IF NOT EXISTS carbon_dioxide_mean NUMERIC(12,3), ADD COLUMN IF NOT EXISTS nitrogen_dioxide_min NUMERIC(10,3), ADD COLUMN IF NOT EXISTS nitrogen_dioxide_max NUMERIC(10,3), ADD COLUMN IF NOT EXISTS nitrogen_dioxide_mean NUMERIC(10,3), ADD COLUMN IF NOT EXISTS sulphur_dioxide_min NUMERIC(10,3), ADD COLUMN IF NOT EXISTS sulphur_dioxide_max NUMERIC(10,3), ADD COLUMN IF NOT EXISTS sulphur_dioxide_mean NUMERIC(10,3)`);
  await sql.query(`CREATE INDEX IF NOT EXISTS district_aqi_daily_day_idx ON district_aqi_daily (day DESC)`);
  await sql.query(`CREATE TABLE IF NOT EXISTS district_aqi_backfill_months (month DATE PRIMARY KEY, completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), row_count INTEGER NOT NULL)`);
}

export async function fetchDistrictAqi(): Promise<DistrictAqi[]> {
  const results: DistrictAqi[] = [];
  const collectionInterval = 15 * 60_000;
  const collectedAt = new Date(Math.floor(Date.now() / collectionInterval) * collectionInterval).toISOString();
  for (let offset = 0; offset < districts.length; offset += 32) {
    const batch = districts.slice(offset, offset + 32);
    const url = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
    url.searchParams.set("latitude", batch.map((item) => item.latitude).join(","));
    url.searchParams.set("longitude", batch.map((item) => item.longitude).join(","));
    url.searchParams.set("current", "us_aqi,pm2_5,pm10,carbon_monoxide,carbon_dioxide,nitrogen_dioxide,sulphur_dioxide,ozone");
    url.searchParams.set("timezone", "Asia/Dhaka");
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`District AQI provider returned ${response.status}.`);
    const payload = await response.json() as Array<{ current?: Record<string, number | string> }>;
    const rows = Array.isArray(payload) ? payload : [payload];
    batch.forEach((district, index) => { const current = rows[index]?.current ?? {}; const value = (key: string) => Number.isFinite(Number(current[key])) ? Number(current[key]) : null; results.push({ ...district, observedAt: collectedAt, usAqi: value("us_aqi"), pm25: value("pm2_5"), pm10: value("pm10"), carbonMonoxide: value("carbon_monoxide"), carbonDioxide: value("carbon_dioxide"), nitrogenDioxide: value("nitrogen_dioxide"), sulphurDioxide: value("sulphur_dioxide"), ozone: value("ozone") }); });
  }
  return results;
}

export async function saveDistrictAqi(sql: NeonQueryFunction<false, false>, rows: DistrictAqi[]) {
  await sql.query(`INSERT INTO district_aqi_samples (district_id, observed_at, us_aqi, pm2_5, pm10, carbon_monoxide, carbon_dioxide, nitrogen_dioxide, sulphur_dioxide, ozone) SELECT * FROM UNNEST($1::text[], $2::timestamptz[], $3::numeric[], $4::numeric[], $5::numeric[], $6::numeric[], $7::numeric[], $8::numeric[], $9::numeric[], $10::numeric[]) ON CONFLICT (district_id, observed_at) DO UPDATE SET us_aqi=EXCLUDED.us_aqi, pm2_5=EXCLUDED.pm2_5, pm10=EXCLUDED.pm10, carbon_monoxide=EXCLUDED.carbon_monoxide, carbon_dioxide=EXCLUDED.carbon_dioxide, nitrogen_dioxide=EXCLUDED.nitrogen_dioxide, sulphur_dioxide=EXCLUDED.sulphur_dioxide, ozone=EXCLUDED.ozone`, [rows.map(r=>r.id), rows.map(r=>r.observedAt), rows.map(r=>r.usAqi), rows.map(r=>r.pm25), rows.map(r=>r.pm10), rows.map(r=>r.carbonMonoxide), rows.map(r=>r.carbonDioxide), rows.map(r=>r.nitrogenDioxide), rows.map(r=>r.sulphurDioxide), rows.map(r=>r.ozone)]);
  await sql.query(`INSERT INTO district_aqi_daily (district_id, day, us_aqi_min, us_aqi_max, us_aqi_mean, pm2_5_min, pm2_5_max, pm2_5_mean, pm10_min, pm10_max, pm10_mean, carbon_monoxide_min, carbon_monoxide_max, carbon_monoxide_mean, carbon_dioxide_min, carbon_dioxide_max, carbon_dioxide_mean, nitrogen_dioxide_min, nitrogen_dioxide_max, nitrogen_dioxide_mean, sulphur_dioxide_min, sulphur_dioxide_max, sulphur_dioxide_mean, ozone_min, ozone_max, ozone_mean) SELECT district_id, (observed_at AT TIME ZONE 'Asia/Dhaka')::date, MIN(us_aqi), MAX(us_aqi), AVG(us_aqi), MIN(pm2_5), MAX(pm2_5), AVG(pm2_5), MIN(pm10), MAX(pm10), AVG(pm10), MIN(carbon_monoxide), MAX(carbon_monoxide), AVG(carbon_monoxide), MIN(carbon_dioxide), MAX(carbon_dioxide), AVG(carbon_dioxide), MIN(nitrogen_dioxide), MAX(nitrogen_dioxide), AVG(nitrogen_dioxide), MIN(sulphur_dioxide), MAX(sulphur_dioxide), AVG(sulphur_dioxide), MIN(ozone), MAX(ozone), AVG(ozone) FROM district_aqi_samples WHERE (observed_at AT TIME ZONE 'Asia/Dhaka')::date >= (NOW() AT TIME ZONE 'Asia/Dhaka')::date - 1 GROUP BY district_id, 2 ON CONFLICT (district_id, day) DO UPDATE SET us_aqi_min=EXCLUDED.us_aqi_min, us_aqi_max=EXCLUDED.us_aqi_max, us_aqi_mean=EXCLUDED.us_aqi_mean, pm2_5_min=EXCLUDED.pm2_5_min, pm2_5_max=EXCLUDED.pm2_5_max, pm2_5_mean=EXCLUDED.pm2_5_mean, pm10_min=EXCLUDED.pm10_min, pm10_max=EXCLUDED.pm10_max, pm10_mean=EXCLUDED.pm10_mean, carbon_monoxide_min=EXCLUDED.carbon_monoxide_min, carbon_monoxide_max=EXCLUDED.carbon_monoxide_max, carbon_monoxide_mean=EXCLUDED.carbon_monoxide_mean, carbon_dioxide_min=EXCLUDED.carbon_dioxide_min, carbon_dioxide_max=EXCLUDED.carbon_dioxide_max, carbon_dioxide_mean=EXCLUDED.carbon_dioxide_mean, nitrogen_dioxide_min=EXCLUDED.nitrogen_dioxide_min, nitrogen_dioxide_max=EXCLUDED.nitrogen_dioxide_max, nitrogen_dioxide_mean=EXCLUDED.nitrogen_dioxide_mean, sulphur_dioxide_min=EXCLUDED.sulphur_dioxide_min, sulphur_dioxide_max=EXCLUDED.sulphur_dioxide_max, sulphur_dioxide_mean=EXCLUDED.sulphur_dioxide_mean, ozone_min=EXCLUDED.ozone_min, ozone_max=EXCLUDED.ozone_max, ozone_mean=EXCLUDED.ozone_mean, updated_at=NOW()`);
}

type HistoricHourly = { time?: string[]; us_aqi?: Array<number | null>; pm2_5?: Array<number | null>; pm10?: Array<number | null>; carbon_monoxide?: Array<number | null>; carbon_dioxide?: Array<number | null>; nitrogen_dioxide?: Array<number | null>; sulphur_dioxide?: Array<number | null>; ozone?: Array<number | null> };
const statistics = (values: Array<number | null>) => { const valid = values.filter((value): value is number => typeof value === "number" && Number.isFinite(value)); return { min: valid.length ? Math.min(...valid) : null, max: valid.length ? Math.max(...valid) : null, mean: valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : null }; };
const dailyRowsFromHourly = (district: District, hourly?: HistoricHourly): DailyDistrictAqi[] => {
  const indexesByDate = new Map<string, number[]>();
  (hourly?.time ?? []).forEach((time, index) => { const date = time.slice(0, 10); indexesByDate.set(date, [...(indexesByDate.get(date) ?? []), index]); });
  return [...indexesByDate.entries()].map(([date, indexes]) => { const pick = (values: Array<number | null> | undefined) => statistics(indexes.map((index) => values?.[index] ?? null)); return { districtId: district.id, date, usAqi: pick(hourly?.us_aqi), pm25: pick(hourly?.pm2_5), pm10: pick(hourly?.pm10), carbonMonoxide: pick(hourly?.carbon_monoxide), carbonDioxide: pick(hourly?.carbon_dioxide), nitrogenDioxide: pick(hourly?.nitrogen_dioxide), sulphurDioxide: pick(hourly?.sulphur_dioxide), ozone: pick(hourly?.ozone) }; });
};

export async function fetchDailyDistrictAqi(district: District, startDate: string, endDate: string): Promise<DailyDistrictAqi[]> {
  const url = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
  url.searchParams.set("latitude", String(district.latitude)); url.searchParams.set("longitude", String(district.longitude));
  url.searchParams.set("hourly", "us_aqi,pm2_5,pm10,carbon_monoxide,carbon_dioxide,nitrogen_dioxide,sulphur_dioxide,ozone"); url.searchParams.set("start_date", startDate); url.searchParams.set("end_date", endDate); url.searchParams.set("domains", "cams_global"); url.searchParams.set("timezone", "Asia/Dhaka");
  const response = await fetch(url, { cache: "no-store", headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`District AQI archive returned ${response.status}.`);
  return dailyRowsFromHourly(district, ((await response.json()) as { hourly?: HistoricHourly }).hourly);
}

async function fetchDistrictMonth(startDate: string, endDate: string) {
  const results: DailyDistrictAqi[] = [];
  for (let offset = 0; offset < districts.length; offset += 16) {
    const batch = districts.slice(offset, offset + 16); const url = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
    url.searchParams.set("latitude", batch.map((district) => district.latitude).join(",")); url.searchParams.set("longitude", batch.map((district) => district.longitude).join(",")); url.searchParams.set("hourly", "us_aqi,pm2_5,pm10,carbon_monoxide,carbon_dioxide,nitrogen_dioxide,sulphur_dioxide,ozone"); url.searchParams.set("start_date", startDate); url.searchParams.set("end_date", endDate); url.searchParams.set("domains", "cams_global"); url.searchParams.set("timezone", "Asia/Dhaka");
    const response = await fetch(url, { cache: "no-store", headers: { Accept: "application/json" } }); if (!response.ok) throw new Error(`District AQI monthly archive returned ${response.status}.`);
    const payload = await response.json() as Array<{ hourly?: HistoricHourly }> | { hourly?: HistoricHourly }; const rows = Array.isArray(payload) ? payload : [payload]; batch.forEach((district, index) => results.push(...dailyRowsFromHourly(district, rows[index]?.hourly)));
  }
  return results;
}

export async function saveDailyDistrictAqi(sql: NeonQueryFunction<false, false>, rows: DailyDistrictAqi[]) {
  const fields: Array<keyof Omit<DailyDistrictAqi, "districtId" | "date">> = ["usAqi","pm25","pm10","carbonMonoxide","carbonDioxide","nitrogenDioxide","sulphurDioxide","ozone"];
  for (let start = 0; start < rows.length; start += 400) { const chunk = rows.slice(start, start + 400); const parameters: unknown[] = [chunk.map(r=>r.districtId), chunk.map(r=>r.date)]; for (const field of fields) for (const statistic of ["min","max","mean"] as const) parameters.push(chunk.map((row) => row[field][statistic])); await sql.query(`INSERT INTO district_aqi_daily (district_id, day, us_aqi_min, us_aqi_max, us_aqi_mean, pm2_5_min, pm2_5_max, pm2_5_mean, pm10_min, pm10_max, pm10_mean, carbon_monoxide_min, carbon_monoxide_max, carbon_monoxide_mean, carbon_dioxide_min, carbon_dioxide_max, carbon_dioxide_mean, nitrogen_dioxide_min, nitrogen_dioxide_max, nitrogen_dioxide_mean, sulphur_dioxide_min, sulphur_dioxide_max, sulphur_dioxide_mean, ozone_min, ozone_max, ozone_mean) SELECT * FROM UNNEST($1::text[], $2::date[], $3::numeric[], $4::numeric[], $5::numeric[], $6::numeric[], $7::numeric[], $8::numeric[], $9::numeric[], $10::numeric[], $11::numeric[], $12::numeric[], $13::numeric[], $14::numeric[], $15::numeric[], $16::numeric[], $17::numeric[], $18::numeric[], $19::numeric[], $20::numeric[], $21::numeric[], $22::numeric[], $23::numeric[], $24::numeric[], $25::numeric[], $26::numeric[]) ON CONFLICT (district_id, day) DO UPDATE SET us_aqi_min=EXCLUDED.us_aqi_min, us_aqi_max=EXCLUDED.us_aqi_max, us_aqi_mean=EXCLUDED.us_aqi_mean, pm2_5_min=EXCLUDED.pm2_5_min, pm2_5_max=EXCLUDED.pm2_5_max, pm2_5_mean=EXCLUDED.pm2_5_mean, pm10_min=EXCLUDED.pm10_min, pm10_max=EXCLUDED.pm10_max, pm10_mean=EXCLUDED.pm10_mean, carbon_monoxide_min=EXCLUDED.carbon_monoxide_min, carbon_monoxide_max=EXCLUDED.carbon_monoxide_max, carbon_monoxide_mean=EXCLUDED.carbon_monoxide_mean, carbon_dioxide_min=EXCLUDED.carbon_dioxide_min, carbon_dioxide_max=EXCLUDED.carbon_dioxide_max, carbon_dioxide_mean=EXCLUDED.carbon_dioxide_mean, nitrogen_dioxide_min=EXCLUDED.nitrogen_dioxide_min, nitrogen_dioxide_max=EXCLUDED.nitrogen_dioxide_max, nitrogen_dioxide_mean=EXCLUDED.nitrogen_dioxide_mean, sulphur_dioxide_min=EXCLUDED.sulphur_dioxide_min, sulphur_dioxide_max=EXCLUDED.sulphur_dioxide_max, sulphur_dioxide_mean=EXCLUDED.sulphur_dioxide_mean, ozone_min=EXCLUDED.ozone_min, ozone_max=EXCLUDED.ozone_max, ozone_mean=EXCLUDED.ozone_mean, updated_at=NOW()`, parameters); }
}

export async function backfillNextDistrictYear(sql: NeonQueryFunction<false, false>, district: District) {
  const [state] = await sql.query(`SELECT MAX(day)::text AS latest_day FROM district_aqi_daily WHERE district_id=$1 AND day < (NOW() AT TIME ZONE 'Asia/Dhaka')::date`, [district.id]) as Array<{ latest_day: string | null }>;
  const start = new Date(`${state?.latest_day ?? DISTRICT_AQI_ARCHIVE_START}T00:00:00Z`); if (state?.latest_day) start.setUTCDate(start.getUTCDate() + 1);
  const yesterday = new Date(); yesterday.setUTCDate(yesterday.getUTCDate() - 1); yesterday.setUTCHours(0,0,0,0);
  if (start > yesterday) return { status: "complete", saved: 0 };
  const end = new Date(start); end.setUTCDate(end.getUTCDate() + 364); if (end > yesterday) end.setTime(yesterday.getTime());
  const date = (value: Date) => value.toISOString().slice(0,10); const rows = await fetchDailyDistrictAqi(district, date(start), date(end)); await saveDailyDistrictAqi(sql, rows);
  return { status: `${date(start)}:${date(end)}`, saved: rows.length };
}

export async function backfillNextDistrictMonth(sql: NeonQueryFunction<false, false>, preferredMonth?: string) {
  let candidate: { month: string } | undefined;
  if (/^\d{4}-\d{2}-01$/.test(preferredMonth ?? "")) {
    [candidate] = await sql.query(`SELECT $1::date::text AS month WHERE $1::date >= DATE '${DISTRICT_AQI_ARCHIVE_START}' AND $1::date < date_trunc('month', NOW() AT TIME ZONE 'Asia/Dhaka')::date AND NOT EXISTS (SELECT 1 FROM district_aqi_backfill_months done WHERE done.month=$1::date)`, [preferredMonth]) as Array<{ month: string }>;
  }
  if (!candidate) [candidate] = await sql.query(`SELECT month_start::date::text AS month FROM generate_series(date_trunc('month', NOW() AT TIME ZONE 'Asia/Dhaka') - INTERVAL '1 month', DATE '${DISTRICT_AQI_ARCHIVE_START}', INTERVAL '-1 month') AS months(month_start) WHERE NOT EXISTS (SELECT 1 FROM district_aqi_backfill_months done WHERE done.month=month_start::date) ORDER BY month_start DESC LIMIT 1`) as Array<{ month: string }>;
  if (!candidate) return { status: "complete", saved: 0 };
  const start = new Date(`${candidate.month}T00:00:00Z`); const end = new Date(start); end.setUTCMonth(end.getUTCMonth() + 1); end.setUTCDate(0); const endDate = end.toISOString().slice(0,10);
  const rows = await fetchDistrictMonth(candidate.month, endDate); await saveDailyDistrictAqi(sql, rows);
  await sql.query(`INSERT INTO district_aqi_backfill_months (month,row_count) VALUES ($1,$2) ON CONFLICT (month) DO UPDATE SET completed_at=NOW(), row_count=EXCLUDED.row_count`, [candidate.month, rows.length]);
  return { status: `${candidate.month}:${endDate}`, saved: rows.length };
}
