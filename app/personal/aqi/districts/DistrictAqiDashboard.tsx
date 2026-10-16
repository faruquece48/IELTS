"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import type { District, DistrictAqi } from "@/lib/districtAqi";

type History = { time: string; average_aqi: string | number; maximum_aqi: string | number };
type Position = [number, number];
type PolygonCoordinates = Position[][];
type BoundaryGeometry = { type: "Polygon"; coordinates: PolygonCoordinates } | { type: "MultiPolygon"; coordinates: PolygonCoordinates[] };
type Boundary = { features: Array<{ properties: { shapeName?: string }; geometry: BoundaryGeometry }> };
type Payload = { error?: string; collectionWarning?: string | null; generatedAt?: string; source?: string; period?: { year: number; month: number }; periods?: Array<{ year: number; month: number }>; districts?: District[]; readings?: DistrictAqi[]; history?: History[]; backfill?: { status: string; saved: number } | null };
const colors = ["#22c55e", "#84cc16", "#f59e0b", "#ef4444", "#a855f7", "#7f1d1d"];
const colorFor = (value: number | null) => value === null ? "#dfe7e5" : colors[value <= 50 ? 0 : value <= 100 ? 1 : value <= 150 ? 2 : value <= 200 ? 3 : value <= 300 ? 4 : 5];
const initialDate = new Date();
const initialYear = initialDate.getFullYear();
const initialMonth = initialDate.getMonth() + 1;
const monthNames = Array.from({ length: 12 }, (_, index) => new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(2020, index, 1)));

function downloadDistrictMap(titleText: string, meanAqi: number, sourceId = "district-aqi-map", lineContours = false) {
  const source = document.getElementById(sourceId) as SVGSVGElement | null;
  if (!source) return;
  const namespace = "http://www.w3.org/2000/svg";
  const clone = source.cloneNode(true) as SVGSVGElement;
  const sourceElements = [source, ...Array.from(source.querySelectorAll("*"))];
  const clonedElements = [clone, ...Array.from(clone.querySelectorAll("*"))];
  sourceElements.forEach((element, index) => {
    const target = clonedElements[index] as SVGElement | undefined;
    if (!target) return;
    const style = window.getComputedStyle(element);
    target.style.fill = style.fill;
    target.style.stroke = style.stroke;
    target.style.opacity = style.opacity;
  });
  const exportSvg = document.createElementNS(namespace, "svg");
  exportSvg.setAttribute("xmlns", namespace);
  exportSvg.setAttribute("viewBox", "0 0 560 710");
  exportSvg.setAttribute("font-family", "'Times New Roman', Times, serif");
  const background = document.createElementNS(namespace, "rect");
  background.setAttribute("width", "560"); background.setAttribute("height", "710"); background.setAttribute("fill", "#ffffff"); background.setAttribute("stroke", "#dbe4ea");
  exportSvg.appendChild(background);
  const title = document.createElementNS(namespace, "text");
  title.setAttribute("x", "20"); title.setAttribute("y", "31"); title.setAttribute("fill", "#000000"); title.setAttribute("font-family", "'Times New Roman', Times, serif"); title.setAttribute("font-size", "18"); title.setAttribute("font-weight", "700"); title.textContent = titleText;
  exportSvg.appendChild(title);
  const mean = document.createElementNS(namespace, "text");
  mean.setAttribute("x", "540"); mean.setAttribute("y", "31"); mean.setAttribute("text-anchor", "end"); mean.setAttribute("fill", "#000000"); mean.setAttribute("font-family", "'Times New Roman', Times, serif"); mean.setAttribute("font-size", "12"); mean.setAttribute("font-weight", "700"); mean.textContent = `Mean AQI: ${Math.round(meanAqi)}`;
  exportSvg.appendChild(mean);
  clone.setAttribute("x", "0"); clone.setAttribute("y", "42"); clone.setAttribute("width", "560"); clone.setAttribute("height", "610");
  exportSvg.appendChild(clone);
  let legendX = 66;
  const legend = lineContours ? [["AQI 50","#22c55e"],["AQI 100","#84cc16"],["AQI 150","#f59e0b"],["AQI 200","#ef4444"],["AQI 300","#a855f7"]] : [["Good","#22c55e"],["Moderate","#84cc16"],["Sensitive","#f59e0b"],["Unhealthy","#ef4444"],["Very unhealthy","#a855f7"]];
  legend.forEach(([label,color]) => {
    const marker = document.createElementNS(namespace, lineContours ? "line" : "circle");
    if (lineContours) { marker.setAttribute("x1", String(legendX - 3)); marker.setAttribute("x2", String(legendX + 7)); marker.setAttribute("y1", "674"); marker.setAttribute("y2", "674"); marker.setAttribute("stroke", color); marker.setAttribute("stroke-width", "2"); }
    else { marker.setAttribute("cx", String(legendX)); marker.setAttribute("cy", "674"); marker.setAttribute("r", "4"); marker.setAttribute("fill", color); }
    exportSvg.appendChild(marker);
    const text = document.createElementNS(namespace, "text"); text.setAttribute("x", String(legendX + 8)); text.setAttribute("y", "678"); text.setAttribute("fill", "#000000"); text.setAttribute("font-family", "'Times New Roman', Times, serif"); text.setAttribute("font-size", "9"); text.setAttribute("font-weight", "700"); text.textContent = label; exportSvg.appendChild(text);
    legendX += label.length * 5.5 + 35;
  });
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(exportSvg)], { type: "image/svg+xml;charset=utf-8" }));
  const image = new window.Image();
  image.onload = () => { const canvas = document.createElement("canvas"); canvas.width = 1120; canvas.height = 1420; const context = canvas.getContext("2d"); if (!context) return; context.scale(2, 2); context.drawImage(image, 0, 0, 560, 710); canvas.toBlob((blob) => { URL.revokeObjectURL(url); if (!blob) return; const pngUrl = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = pngUrl; link.download = lineContours ? "bangladesh-aqi-line-contour-map.png" : "bangladesh-64-district-aqi-contour-map.png"; link.click(); URL.revokeObjectURL(pngUrl); }, "image/png"); };
  image.onerror = () => URL.revokeObjectURL(url);
  image.src = url;
}
export const BANGLADESH_PATHS = [
  "M227.7,144.6 L229.2,129.9 L230.3,120.0 L227.3,110.4 L227.9,103.7 L231.3,95.3 L229.8,89.1 L226.1,84.7 L224.4,79.5 L218.5,71.2 L212.2,69.1 L207.2,67.1 L204.3,76.1 L208.6,77.8 L203.2,82.5 L203.1,89.1 L198.0,86.9 L187.4,81.8 L183.0,86.1 L171.0,79.3 L158.9,68.6 L156.8,59.6 L153.4,52.6 L144.9,47.9 L133.4,51.5 L142.6,56.4 L148.2,61.8 L139.1,64.5 L130.9,62.9 L125.7,62.8 L117.2,54.7 L111.9,50.2 L104.2,43.1 L99.6,45.0 L93.4,40.1 L86.3,28.9 L76.3,43.3 L81.7,43.4 L90.1,45.1 L93.0,54.4 L79.9,59.4 L74.9,69.3 L62.2,75.1 L60.9,86.3 L52.9,97.2 L58.4,106.4 L67.0,105.2 L75.9,109.2 L87.7,117.7 L95.1,128.2 L105.6,131.2 L117.1,132.0 L124.7,129.0 L128.4,142.2 L139.1,156.1 L127.6,158.7 L112.5,158.3 L95.3,158.1 L90.4,164.0 L86.9,170.5 L85.3,178.6 L78.5,187.0 L70.5,186.6 L56.9,184.5 L53.9,196.9 L48.4,207.0 L58.5,222.2 L71.9,226.3 L98.2,239.6 L109.5,239.9 L118.1,245.8 L118.5,261.9 L116.0,277.4 L106.0,283.3 L103.2,293.2 L109.0,304.7 L117.9,335.7 L137.8,340.1 L132.3,349.8 L135.0,366.7 L136.8,383.5 L141.6,396.1 L144.4,418.2 L153.6,438.1 L154.8,460.6 L168.7,477.7 L169.9,485.5 L175.0,477.8 L182.6,460.6 L185.1,476.1 L193.1,472.8 L196.1,459.2 L199.5,471.7 L215.0,473.7 L225.9,468.1 L232.3,451.1 L236.9,435.5 L243.0,452.5 L247.2,451.7 L247.7,461.1 L256.1,468.2 L268.4,468.7 L274.4,459.1 L284.0,442.6 L300.9,441.2 L303.9,409.2 L295.8,391.5 L313.1,372.6 L286.5,357.6 L304.0,354.6 L338.9,399.5 L349.2,429.9 L359.1,429.3 L347.0,401.1 L351.7,378.4 L386.4,380.5 L409.2,398.9 L430.7,437.3 L435.2,488.5 L447.5,511.8 L468.6,553.6 L475.5,550.9 L473.6,537.3 L468.2,523.7 L472.0,506.8 L480.1,499.9 L489.9,509.5 L499.8,508.7 L504.6,519.7 L514.1,514.9 L509.8,500.2 L507.9,464.9 L505.6,439.7 L499.9,404.3 L491.7,379.6 L483.9,357.7 L481.9,335.4 L477.8,316.8 L473.5,297.9 L468.9,294.7 L466.9,293.7 L455.6,294.1 L446.9,297.9 L439.4,300.9 L433.4,318.7 L422.8,334.9 L427.2,348.0 L418.6,358.6 L407.6,361.6 L398.5,354.3 L389.4,335.4 L384.2,345.1 L382.0,351.1 L375.4,330.3 L360.8,301.2 L368.2,288.3 L376.9,268.5 L385.3,262.8 L392.5,258.6 L409.2,254.4 L422.5,252.8 L433.6,252.0 L437.6,241.9 L444.2,232.2 L461.0,229.9 L463.0,215.7 L468.5,202.6 L477.3,188.2 L494.0,181.2 L479.1,168.6 L466.1,164.2 L439.3,159.8 L412.5,163.3 L395.0,163.4 L372.6,157.3 L345.5,159.6 L314.0,161.6 L292.1,161.8 L252.6,153.6 L228.1,148.6 Z",
  "M308.7,451.5 L318.2,445.1 L328.3,436.7 L331.0,422.3 L331.6,415.4 L334.1,406.7 L325.6,397.2 L319.1,382.8 L311.2,379.9 L302.4,388.6 L306.1,397.1 L309.5,407.2 L312.8,417.8 L311.9,430.5 L304.7,439.7 L306.5,445.7 L308.7,451.5 Z",
  "M391.7,396.3 L378.6,389.9 L384.6,396.5 L383.7,409.1 L392.8,414.3 L396.3,419.7 L402.0,415.5 L399.3,404.9 L391.7,396.3 Z",
  "M291.8,457.3 L292.5,451.6 L288.2,446.8 L282.6,449.0 L279.7,457.0 L276.7,466.1 L279.4,466.8 L283.1,458.5 L290.3,459.4 Z",
];

function exactBoundaryPaths(boundary?: Boundary) {
  if (!boundary?.features?.length) return [];
  return boundary.features.flatMap((feature) => {
    const polygons = feature.geometry.type === "Polygon" ? [feature.geometry.coordinates] : feature.geometry.coordinates;
    return polygons.map((polygon) =>
      polygon.map((ring) => ring.map(([longitude, latitude], index) => {
        const px = 45 + ((longitude - 88.0) / 4.7) * 470;
        const py = 570 - ((latitude - 20.7) / 5.8) * 530;
        return `${index ? "L" : "M"}${px.toFixed(2)},${py.toFixed(2)}`;
      }).join(" ") + " Z").join(" "),
    );
  });
}

const districtNameAliases: Record<string, string> = {
  bogra: "bogura",
  chittagong: "chattogram",
  comilla: "cumilla",
  jessore: "jashore",
};

function districtKey(name = "") {
  const key = name.toLowerCase().replace(/[^a-z]/g, "");
  return districtNameAliases[key] ?? key;
}

function BangladeshContour({ readings, boundary }: { readings: DistrictAqi[]; boundary?: Boundary }) {
  const [hovered, setHovered] = useState<{ name: string; value: number | null; x: number; y: number } | null>(null);
  const x = (lon: number) => 45 + ((lon - 88.0) / 4.7) * 470;
  const y = (lat: number) => 570 - ((lat - 20.7) / 5.8) * 530;
  const paths = exactBoundaryPaths(boundary);
  const readingsByDistrict = new Map(readings.map((reading) => [districtKey(reading.name), reading]));
  const regions = boundary?.features.map((feature) => ({
    name: feature.properties.shapeName ?? "Unknown district",
    paths: exactBoundaryPaths({ features: [feature] }),
  })) ?? [];
  if (!paths.length) return <div className="grid h-[560px] place-items-center rounded-2xl bg-slate-50 text-center text-sm font-bold text-slate-400">Loading the official 64-district boundary map…</div>;
  return <div className="relative" onPointerLeave={() => setHovered(null)}><svg id="district-aqi-map" viewBox="0 0 560 610" className="h-[560px] w-full" role="img" aria-label="Bangladesh district AQI contour map">
    <defs><clipPath id="bd-clip">{paths.map((path, index) => <path key={index} d={path} fillRule="evenodd" clipRule="evenodd" />)}</clipPath><filter id="soft"><feGaussianBlur stdDeviation="27" /></filter></defs>
    {paths.map((path, index) => <path key={`base-${index}`} d={path} fill="#e5ecea" fillRule="evenodd" stroke="#8aa3a0" strokeWidth="1.2" />)}
    <g clipPath="url(#bd-clip)" filter="url(#soft)">{readings.map((row) => <circle key={`heat-${row.id}`} cx={x(row.longitude)} cy={y(row.latitude)} r="58" fill={colorFor(row.usAqi)} opacity="0.8" />)}</g>
    {paths.map((path, index) => <path key={`edge-${index}`} d={path} fill="none" stroke="#64748b" strokeWidth="1.2" />)}
    {regions.flatMap((region) => region.paths.map((path, index) => <path key={`hover-${region.name}-${index}`} d={path} fill="transparent" fillRule="evenodd" className="cursor-crosshair" onPointerMove={(event) => { const rect = event.currentTarget.ownerSVGElement?.getBoundingClientRect(); if (!rect) return; const reading = readingsByDistrict.get(districtKey(region.name)); setHovered({ name: reading?.name ?? region.name, value: reading?.usAqi ?? null, x: event.clientX - rect.left, y: event.clientY - rect.top }); }} />))}
  </svg>{hovered ? <div className="pointer-events-none absolute z-10 min-w-28 -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-center shadow-lg backdrop-blur-sm" style={{ left: hovered.x, top: hovered.y }}><p className="whitespace-nowrap text-[11px] font-bold text-slate-600">{hovered.name}</p><p className="mt-0.5 text-sm font-black text-slate-950">{hovered.value === null ? "No data" : `AQI ${hovered.value}`}</p></div> : null}</div>;
}

function lineContourPaths(readings: DistrictAqi[], threshold: number) {
  const samples = readings.filter((row): row is DistrictAqi & { usAqi: number } => row.usAqi !== null).map((row) => ({ x: 45 + ((row.longitude - 88) / 4.7) * 470, y: 570 - ((row.latitude - 20.7) / 5.8) * 530, value: row.usAqi }));
  if (samples.length < 2) return [];
  const columns = 60, rows = 72, left = 45, top = 40, width = 470, height = 530;
  const dx = width / columns, dy = height / rows;
  const valueAt = (x: number, y: number) => {
    let weighted = 0, total = 0;
    const nearest = samples
      .map((sample) => ({ sample, distanceSquared: (x - sample.x) ** 2 + (y - sample.y) ** 2 }))
      .sort((a, b) => a.distanceSquared - b.distanceSquared)
      .slice(0, 8);
    for (const { sample, distanceSquared } of nearest) {
      if (distanceSquared < 1) return sample.value;
      const weight = 1 / (distanceSquared * distanceSquared);
      weighted += sample.value * weight;
      total += weight;
    }
    return weighted / total;
  };
  const grid = Array.from({ length: rows + 1 }, (_, row) => Array.from({ length: columns + 1 }, (_, column) => valueAt(left + column * dx, top + row * dy)));
  const paths: string[] = [];
  const crossing = (ax: number, ay: number, av: number, bx: number, by: number, bv: number) => { const ratio = av === bv ? 0.5 : (threshold - av) / (bv - av); return [ax + (bx - ax) * ratio, ay + (by - ay) * ratio] as const; };
  for (let row = 0; row < rows; row++) for (let column = 0; column < columns; column++) {
    const x = left + column * dx, y = top + row * dy;
    const corners = [[x,y,grid[row][column]],[x+dx,y,grid[row][column+1]],[x+dx,y+dy,grid[row+1][column+1]],[x,y+dy,grid[row+1][column]]] as const;
    const points: Array<readonly [number, number]> = [];
    for (let edge = 0; edge < 4; edge++) { const a = corners[edge], b = corners[(edge + 1) % 4]; if ((a[2] < threshold && b[2] >= threshold) || (a[2] >= threshold && b[2] < threshold)) points.push(crossing(a[0], a[1], a[2], b[0], b[1], b[2])); }
    for (let index = 0; index + 1 < points.length; index += 2) paths.push(`M${points[index][0].toFixed(1)},${points[index][1].toFixed(1)} L${points[index+1][0].toFixed(1)},${points[index+1][1].toFixed(1)}`);
  }
  return paths;
}

function BangladeshLineContour({ readings, boundary }: { readings: DistrictAqi[]; boundary?: Boundary }) {
  const paths = exactBoundaryPaths(boundary);
  const levels = [{ value: 50, color: "#22c55e" }, { value: 100, color: "#84cc16" }, { value: 150, color: "#f59e0b" }, { value: 200, color: "#ef4444" }, { value: 300, color: "#a855f7" }];
  const contours = levels.map((level) => ({ ...level, paths: lineContourPaths(readings, level.value) }));
  const labelFor = (path: string) => {
    const values = path.match(/-?\d+(?:\.\d+)?/g)?.map(Number);
    if (!values || values.length < 4) return null;
    const [x1, y1, x2, y2] = values;
    let angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    if (angle > 90 || angle < -90) angle += 180;
    return { x: (x1 + x2) / 2, y: (y1 + y2) / 2, angle };
  };
  if (!paths.length) return <div className="grid h-[560px] place-items-center rounded-2xl bg-slate-50 text-sm font-bold text-slate-400">Loading boundary map…</div>;
  return <svg id="district-aqi-line-map" viewBox="0 0 560 610" className="h-[560px] w-full" role="img" aria-label="Bangladesh AQI line contour map">
    <defs><clipPath id="bd-line-clip">{paths.map((path, index) => <path key={index} d={path} fillRule="evenodd" clipRule="evenodd" />)}</clipPath></defs>
    {paths.map((path, index) => <path key={`line-base-${index}`} d={path} fill="#e5e7eb" fillRule="evenodd" stroke="#94a3b8" strokeWidth="1" />)}
    {paths.map((path, index) => <path key={`line-edge-${index}`} d={path} fill="none" stroke="#64748b" strokeWidth="1.1" />)}
    <g clipPath="url(#bd-line-clip)">{contours.flatMap((level) => level.paths.map((path, index) => <path key={`${level.value}-${index}`} d={path} fill="none" stroke={level.color} strokeWidth="2.4" strokeLinecap="round" />))}{contours.flatMap((level) => {
      if (!level.paths.length) return [];
      const labelIndexes = [0.18, 0.38, 0.58, 0.78].map((ratio) => Math.min(level.paths.length - 1, Math.floor(level.paths.length * ratio)));
      return [...new Set(labelIndexes)].map((index) => { const label = labelFor(level.paths[index]); return label ? <text key={`label-${level.value}-${index}`} x={label.x} y={label.y} transform={`rotate(${label.angle} ${label.x} ${label.y})`} textAnchor="middle" dominantBaseline="central" fill={level.color} stroke="#ffffff" strokeWidth="3.5" paintOrder="stroke" fontFamily="'Times New Roman', Times, serif" fontSize="11" fontWeight="700">{level.value}</text> : null; });
    })}</g>
  </svg>;
}

export default function DistrictAqiDashboard() {
  const [data, setData] = useState<Payload | null>(null);
  const [lineData, setLineData] = useState<Payload | null>(null);
  const [analysisData, setAnalysisData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [boundary, setBoundary] = useState<Boundary | undefined>();
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [lineYear, setLineYear] = useState(initialYear);
  const [lineMonth, setLineMonth] = useState(initialMonth);
  const [analysisYear, setAnalysisYear] = useState(initialYear);
  const [analysisMonth, setAnalysisMonth] = useState(initialMonth);
  const load = useCallback(async (selectedYear: number, selectedMonth: number) => { setLoading(true); try { const response = await fetch(`/api/aqi/districts?year=${selectedYear}&month=${selectedMonth}&backfill=1`, { cache: "no-store" }); const payload = await response.json() as Payload; setData(payload); if (lineYear === selectedYear && lineMonth === selectedMonth) setLineData(payload); if (analysisYear === selectedYear && analysisMonth === selectedMonth) setAnalysisData(payload); } catch { setData({ error: "Unable to contact the district AQI service." }); } finally { setLoading(false); } }, [analysisMonth, analysisYear, lineMonth, lineYear]);
  const loadLine = useCallback(async (selectedYear: number, selectedMonth: number) => { const response = await fetch(`/api/aqi/districts?year=${selectedYear}&month=${selectedMonth}`, { cache: "no-store" }); setLineData(await response.json() as Payload); }, []);
  const loadAnalysis = useCallback(async (selectedYear: number, selectedMonth: number) => { const response = await fetch(`/api/aqi/districts?year=${selectedYear}&month=${selectedMonth}`, { cache: "no-store" }); setAnalysisData(await response.json() as Payload); }, []);
  useEffect(() => { let cancelled = false; async function initialLoad() { try { const [dataResponse, boundaryResponse] = await Promise.all([fetch(`/api/aqi/districts?year=${initialYear}&month=${initialMonth}`, { cache: "no-store" }), fetch("/api/aqi/districts/boundary")]); const payload = await dataResponse.json() as Payload; const boundaryPayload = boundaryResponse.ok ? await boundaryResponse.json() as Boundary : undefined; if (!cancelled) { setData(payload); setLineData(payload); setAnalysisData(payload); setBoundary(boundaryPayload); } } catch { if (!cancelled) setData({ error: "Unable to contact the district AQI service." }); } finally { if (!cancelled) setLoading(false); } } void initialLoad(); return () => { cancelled = true; }; }, []);
  useEffect(() => { const timer = window.setInterval(() => { void load(year, month); void loadLine(lineYear, lineMonth); void loadAnalysis(analysisYear, analysisMonth); }, 15 * 60_000); return () => window.clearInterval(timer); }, [analysisMonth, analysisYear, lineMonth, lineYear, load, loadAnalysis, loadLine, month, year]);
  const readings = useMemo(() => data?.readings ?? [], [data?.readings]);
  const ranked = useMemo(() => [...readings].sort((a,b) => (b.usAqi ?? -1) - (a.usAqi ?? -1)), [readings]);
  const filtered = ranked.filter((item) => `${item.name} ${item.division}`.toLowerCase().includes(query.toLowerCase()));
  const national = readings.filter(r=>r.usAqi!==null).reduce((sum,row)=>sum+(row.usAqi ?? 0),0) / Math.max(1,readings.filter(r=>r.usAqi!==null).length);
  const periodLabel = `${monthNames[month - 1]} ${year}`;
  const mapTitle = `Bangladesh AQI · ${periodLabel}`;
  const lineReadings = useMemo(() => lineData?.readings ?? [], [lineData?.readings]);
  const lineNational = lineReadings.filter(r=>r.usAqi!==null).reduce((sum,row)=>sum+(row.usAqi ?? 0),0) / Math.max(1,lineReadings.filter(r=>r.usAqi!==null).length);
  const linePeriodLabel = `${monthNames[lineMonth - 1]} ${lineYear}`;
  const archiveYears = Array.from({ length: initialYear - 2022 + 1 }, (_, index) => initialYear - index);
  const availableYears = archiveYears;
  const lineAvailableYears = archiveYears;
  const analysisReadings = useMemo(() => analysisData?.readings ?? [], [analysisData?.readings]);
  const analysisRanked = useMemo(() => [...analysisReadings].sort((a,b) => (b.usAqi ?? -1) - (a.usAqi ?? -1)), [analysisReadings]);
  const divisionRows = useMemo(() => Object.entries(analysisReadings.reduce<Record<string, number[]>>((acc,row) => { if (row.usAqi !== null) (acc[row.division] ??= []).push(row.usAqi); return acc; }, {})).map(([division,values]) => ({ division, average: values.reduce((a,b)=>a+b,0)/values.length })).sort((a,b)=>b.average-a.average), [analysisReadings]);
  const analysisPeriodLabel = `${monthNames[analysisMonth - 1]} ${analysisYear}`;
  const analysisAvailableYears = archiveYears;
  return <main className="min-h-screen bg-[#f4f8f8] text-slate-900"><header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-sm"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 lg:px-8"><Link suppressHydrationWarning href="/"><Image src="/fa.png" alt="IELTS Logo" width={58} height={58} className="rounded-full" unoptimized /></Link><Navbar /></div></header>
    <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10"><section className="relative overflow-hidden rounded-[2rem] bg-[#062c30] p-7 text-white shadow-xl md:p-10"><div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl"/><div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-black uppercase tracking-[.24em] text-cyan-300">Bangladesh · District air</p><h1 className="mt-3 text-4xl font-black md:text-5xl">64-District AQI Atlas</h1><p className="mt-3 text-sm text-cyan-50/70">Monthly maximum air quality patterns and comparisons across every district.</p></div><div className="grid grid-cols-3 gap-3"><Link suppressHydrationWarning href="/personal/aqi" className="flex h-[76px] min-w-[132px] flex-col justify-center rounded-2xl border border-white/15 bg-white/10 px-5 transition hover:bg-white/15"><span className="text-[10px] font-bold uppercase tracking-wider text-cyan-100/60">Explore</span><strong className="mt-1 whitespace-nowrap text-lg">32 campuses</strong></Link><div className="flex h-[76px] min-w-[132px] flex-col justify-center rounded-2xl border border-white/15 bg-white/10 px-5"><p className="text-[10px] font-bold uppercase tracking-wider text-cyan-100/60">Coverage</p><p className="mt-1 whitespace-nowrap text-lg font-black">64 districts</p></div><button onClick={() => void load(year, month)} disabled={loading} className="flex h-[76px] min-w-[132px] flex-col justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/15 px-5 text-left transition hover:bg-cyan-300/25 disabled:cursor-wait disabled:opacity-60"><span className="text-[10px] font-bold uppercase tracking-wider text-cyan-100/60">Latest data</span><strong className="mt-1 text-lg">{loading ? "Updating…" : "Refresh"}</strong></button></div></div></section>
    {data?.collectionWarning ? <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-900">{data.collectionWarning}</div> : null}
    {data?.error ? <div className="mt-6 rounded-2xl bg-rose-50 p-6 text-rose-700">{data.error}</div> : <><section className="mt-6 grid gap-6 lg:grid-cols-2"><article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-col gap-3"><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-wider text-cyan-700">Monthly spatial distribution</p><h2 className="mt-1 whitespace-nowrap text-xl font-black lg:text-[22px]">{mapTitle}</h2></div><span className="shrink-0 rounded-lg bg-slate-100 px-3 py-2 text-xs font-black text-slate-700">Mean AQI {Math.round(national)}</span></div><div className="flex flex-nowrap items-center gap-2"><select aria-label="Map month" value={month} onChange={(event) => { const value = Number(event.target.value); setMonth(value); void load(year, value); }} className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold">{monthNames.map((name, index) => <option key={name} value={index + 1}>{name}</option>)}</select><select aria-label="Map year" value={year} onChange={(event) => { const value = Number(event.target.value); setYear(value); void load(value, month); }} className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold">{availableYears.map((value) => <option key={value} value={value}>{value}</option>)}</select><button type="button" onClick={() => downloadDistrictMap(mapTitle, national)} disabled={!boundary} className="shrink-0 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-cyan-800 hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-40">PNG</button></div></div><BangladeshContour readings={readings} boundary={boundary}/><div className="flex flex-wrap justify-center gap-3 text-[10px] font-bold">{[["Good","#22c55e"],["Moderate","#84cc16"],["Sensitive","#f59e0b"],["Unhealthy","#ef4444"],["Very unhealthy","#a855f7"]].map(([label,color])=><span key={label} className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-full" style={{background:color}}/>{label}</span>)}</div></article>
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-col gap-3"><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-wider text-cyan-700">Monthly spatial distribution</p><h2 className="mt-1 whitespace-nowrap text-xl font-black lg:text-[22px]">Bangladesh AQI · {linePeriodLabel}</h2></div><span className="shrink-0 rounded-lg bg-slate-100 px-3 py-2 text-xs font-black text-slate-700">Mean AQI {Math.round(lineNational)}</span></div><div className="flex flex-nowrap items-center gap-2"><select aria-label="Line contour month" value={lineMonth} onChange={(event) => { const value = Number(event.target.value); setLineMonth(value); void loadLine(lineYear, value); }} className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold">{monthNames.map((name, index) => <option key={name} value={index + 1}>{name}</option>)}</select><select aria-label="Line contour year" value={lineYear} onChange={(event) => { const value = Number(event.target.value); setLineYear(value); void loadLine(value, lineMonth); }} className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold">{lineAvailableYears.map((value) => <option key={value} value={value}>{value}</option>)}</select><button type="button" onClick={() => downloadDistrictMap(`Bangladesh AQI · ${linePeriodLabel}`, lineNational, "district-aqi-line-map", true)} disabled={!boundary} className="shrink-0 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-cyan-800 hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-40">PNG</button></div></div><BangladeshLineContour readings={lineReadings} boundary={boundary}/><div className="flex flex-wrap justify-center gap-4 text-xs font-bold">{[["50","#22c55e"],["100","#84cc16"],["150","#f59e0b"],["200","#ef4444"],["300","#a855f7"]].map(([label,color])=><span key={label} className="flex items-center gap-2"><i className="h-0.5 w-6" style={{background:color}}/>AQI {label}</span>)}</div></article></section>
      <section className="mt-6"><div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-wider text-cyan-700">Comparative analysis</p><h2 className="mt-1 text-2xl font-black">AQI rankings · {analysisPeriodLabel}</h2></div><div className="flex flex-nowrap items-center gap-2"><select aria-label="Comparison month" value={analysisMonth} onChange={(event) => { const value = Number(event.target.value); setAnalysisMonth(value); void loadAnalysis(analysisYear, value); }} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold">{monthNames.map((name, index) => <option key={name} value={index + 1}>{name}</option>)}</select><select aria-label="Comparison year" value={analysisYear} onChange={(event) => { const value = Number(event.target.value); setAnalysisYear(value); void loadAnalysis(value, analysisMonth); }} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold">{analysisAvailableYears.map((value) => <option key={value} value={value}>{value}</option>)}</select></div></div><div className="grid gap-6 lg:grid-cols-2"><article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-baseline justify-between"><h3 className="text-xl font-black">Division averages</h3><span className="text-xs font-bold text-slate-400">US AQI</span></div><div className="mt-5 flex justify-between border-b border-dashed border-slate-200 pb-2 text-[10px] font-bold text-slate-400"><span>0</span><span>100</span><span>200</span><span>300</span></div><div className="mt-4 space-y-4">{divisionRows.map((row,index)=><div key={row.division} className="grid grid-cols-[7rem_1fr_2.5rem] items-center gap-3"><span className="truncate text-xs font-bold">{index+1}. {row.division}</span><div className="relative h-6 overflow-hidden rounded-md bg-slate-100"><div className="h-full rounded-md transition-all" style={{width:`${Math.min(100,row.average/3)}%`,background:`linear-gradient(90deg, ${colorFor(row.average)}99, ${colorFor(row.average)})`}}/></div><strong className="text-right text-sm" style={{color:colorFor(row.average)}}>{Math.round(row.average)}</strong></div>)}</div></article><article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-baseline justify-between"><h3 className="text-xl font-black">Highest districts</h3><span className="text-xs font-bold text-slate-400">Monthly maximum</span></div><div className="mt-5 flex justify-between border-b border-dashed border-slate-200 pb-2 text-[10px] font-bold text-slate-400"><span>0</span><span>100</span><span>200</span><span>300</span></div><div className="mt-4 space-y-3">{analysisRanked.slice(0,10).map((row,index)=><button key={row.id} onClick={()=>setSelected(row.id)} className="grid w-full grid-cols-[9rem_1fr_2.5rem] items-center gap-3 text-left"><span className="truncate text-xs font-bold"><i className="mr-2 inline-grid h-5 w-5 place-items-center rounded-full bg-slate-100 not-italic text-[10px] text-slate-500">{index+1}</i>{row.name}</span><span className="relative h-6 overflow-hidden rounded-md bg-slate-100"><i className="block h-full rounded-md transition-all" style={{width:`${Math.min(100,(row.usAqi ?? 0)/3)}%`,background:`linear-gradient(90deg, ${colorFor(row.usAqi)}99, ${colorFor(row.usAqi)})`}}/></span><strong className="text-right text-sm" style={{color:colorFor(row.usAqi)}}>{row.usAqi===null?"—":Math.round(row.usAqi)}</strong></button>)}</div></article></div></section>
      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-wider text-cyan-700">District directory</p><h2 className="mt-1 text-2xl font-black">All 64 districts</h2></div><button type="button" aria-expanded={directoryOpen} aria-controls="district-directory-list" onClick={() => setDirectoryOpen((open) => !open)} className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-100">{directoryOpen ? "Minimize" : "Show districts"} <span aria-hidden="true">{directoryOpen ? "−" : "+"}</span></button></div>{directoryOpen ? <div id="district-directory-list"><div className="mt-5 flex justify-end"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search district or division" className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm sm:w-72"/></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{filtered.map(row=><button key={row.id} onClick={()=>setSelected(row.id)} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-left"><span><b className="text-sm">{row.name}</b><small className="block text-slate-400">{row.division}</small></span><strong style={{color:colorFor(row.usAqi)}}>{row.usAqi===null?"—":Math.round(row.usAqi)}</strong></button>)}</div></div> : null}</section></>}</div></main>;
}
