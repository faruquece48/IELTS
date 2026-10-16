import ExcelJS from "exceljs";
import { neon } from "@neondatabase/serverless";
import { campuses, pollutantDefinitions, prepareAqiDatabase } from "@/lib/aqi";

type ExportRow = { day: string; minimum: string | number | null; maximum: string | number | null };

const connectionString = process.env.DATABASE_URL;
const columns: Record<string, [string, string]> = {
  us_aqi: ["us_aqi_min", "us_aqi_max"],
  pm2_5: ["pm2_5_min", "pm2_5_max"],
  pm10: ["pm10_min", "pm10_max"],
  carbon_monoxide: ["carbon_monoxide_min", "carbon_monoxide_max"],
  carbon_dioxide: ["carbon_dioxide_min", "carbon_dioxide_max"],
  nitrogen_dioxide: ["nitrogen_dioxide_min", "nitrogen_dioxide_max"],
  sulphur_dioxide: ["sulphur_dioxide_min", "sulphur_dioxide_max"],
  ozone: ["ozone_min", "ozone_max"],
};

export async function GET(request: Request) {
  if (!connectionString) return Response.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
  const search = new URL(request.url).searchParams;
  const campus = campuses.find((item) => item.id === search.get("campus"));
  const pollutant = pollutantDefinitions.find((item) => item.id === search.get("pollutant"));
  if (!campus || !pollutant) return Response.json({ error: "Invalid campus or pollutant." }, { status: 400 });
  const [minimumColumn, maximumColumn] = columns[pollutant.id];
  const days = Math.max(0, Math.min(1_900, Number(search.get("days") ?? 0) || 0));
  const sql = neon(connectionString);
  await prepareAqiDatabase(sql);
  const rows = await sql.query(
    `SELECT day::text, ${minimumColumn} AS minimum, ${maximumColumn} AS maximum
     FROM campus_aqi_daily
     WHERE campus_id = $1 AND ($2::int = 0 OR day >= CURRENT_DATE - $2::int)
     ORDER BY day ASC`,
    [campus.id, days],
  ) as ExportRow[];

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Bangladesh University AQI Monitor";
  workbook.created = new Date();
  const sheet = workbook.addWorksheet(pollutant.label.slice(0, 31), { views: [{ state: "frozen", ySplit: 1 }] });
  sheet.columns = [
    { header: "Date", key: "date", width: 14 },
    { header: `Daily minimum (${pollutant.unit})`, key: "minimum", width: 25 },
    { header: `Daily maximum (${pollutant.unit})`, key: "maximum", width: 25 },
  ];
  rows.forEach((row) => sheet.addRow({ date: row.day, minimum: row.minimum === null ? null : Number(row.minimum), maximum: row.maximum === null ? null : Number(row.maximum) }));
  sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0E7490" } };
  sheet.autoFilter = { from: "A1", to: "C1" };

  const metadata = workbook.addWorksheet("Metadata");
  metadata.addRows([
    ["University", campus.name], ["Campus code", campus.shortName], ["District", campus.district],
    ["Latitude", campus.latitude], ["Longitude", campus.longitude], ["Variable", pollutant.label],
    ["Unit", pollutant.unit], ["Source", "Open-Meteo CAMS Global"], ["Spatial resolution", "Approximately 45 km"],
    ["Coverage", rows.length ? `${rows[0].day} to ${rows.at(-1)!.day}` : "No saved rows"], ["Generated", new Date().toISOString()],
  ]);
  metadata.getColumn(1).width = 22;
  metadata.getColumn(2).width = 55;
  metadata.getColumn(1).font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();
  const safeName = `${campus.shortName}-${pollutant.id}-daily-min-max.xlsx`.toLowerCase();
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${safeName}"`,
      "Cache-Control": "no-store",
    },
  });
}

