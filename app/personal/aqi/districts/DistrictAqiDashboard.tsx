"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import AqiResearchPlots from "@/components/AqiResearchPlots";
import DailyDistrictPollutantTrend from "@/components/DailyDistrictPollutantTrend";
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

function downloadDistrictMap(titleText: string, meanAqi: number, sourceId = "district-aqi-map", lineContours = false, fileName?: string) {
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
  const legend = lineContours ? [] : [["Good","#22c55e"],["Moderate","#84cc16"],["Sensitive","#f59e0b"],["Unhealthy","#ef4444"],["Very unhealthy","#a855f7"]];
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
  image.onload = () => { const canvas = document.createElement("canvas"); canvas.width = 1120; canvas.height = 1420; const context = canvas.getContext("2d"); if (!context) return; context.scale(2, 2); context.drawImage(image, 0, 0, 560, 710); canvas.toBlob((blob) => { URL.revokeObjectURL(url); if (!blob) return; const pngUrl = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = pngUrl; link.download = fileName ?? (lineContours ? "bangladesh-aqi-line-contour-map.png" : "bangladesh-64-district-aqi-contour-map.png"); link.click(); URL.revokeObjectURL(pngUrl); }, "image/png"); };
  image.onerror = () => URL.revokeObjectURL(url);
  image.src = url;
}

function downloadSvgChart(sourceId: string, fileName: string, title?: string) {
  const source = document.getElementById(sourceId) as SVGSVGElement | null;
  if (!source) return;
  const clone = source.cloneNode(true) as SVGSVGElement;
  const viewBox = source.viewBox.baseVal;
  const width = viewBox.width || 920;
  const height = viewBox.height || 345;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", String(width)); clone.setAttribute("height", String(height));
  clone.querySelectorAll('text[fill="#64748b"], text[fill="#475569"], text[fill="#334155"], text[fill="#1e293b"]').forEach((element) => element.setAttribute("fill", "#000000"));
  clone.querySelectorAll('line[stroke="#94a3b8"], line[stroke="#64748b"]').forEach((element) => element.setAttribute("stroke", "#000000"));
  const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  background.setAttribute("width", String(width)); background.setAttribute("height", String(height)); background.setAttribute("fill", "#ffffff");
  clone.insertBefore(background, clone.firstChild);
  if (title) {
    const heading = document.createElementNS("http://www.w3.org/2000/svg", "text");
    heading.setAttribute("x", String(width / 2)); heading.setAttribute("y", "26"); heading.setAttribute("text-anchor", "middle");
    heading.setAttribute("fill", "#0f172a"); heading.setAttribute("font-family", "Arial, sans-serif"); heading.setAttribute("font-size", "18"); heading.setAttribute("font-weight", "700");
    heading.textContent = title;
    clone.insertBefore(heading, background.nextSibling);
  }
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml;charset=utf-8" }));
  const image = new window.Image();
  image.onload = () => { const canvas = document.createElement("canvas"); canvas.width = width * 2; canvas.height = height * 2; const context = canvas.getContext("2d"); if (!context) return; context.scale(2, 2); context.drawImage(image, 0, 0, width, height); canvas.toBlob((blob) => { URL.revokeObjectURL(url); if (!blob) return; const pngUrl = URL.createObjectURL(blob), link = document.createElement("a"); link.href = pngUrl; link.download = fileName; link.click(); URL.revokeObjectURL(pngUrl); }, "image/png"); };
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

function boundaryLabels(boundary?: Boundary) {
  if (!boundary?.features?.length) return [];
  const pointInRing = (x: number, y: number, ring: Array<{ x: number; y: number }>) => {
    let inside = false;
    for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index++) {
      const a = ring[index], b = ring[previous];
      if ((a.y > y) !== (b.y > y) && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
    }
    return inside;
  };
  const distanceToEdge = (x: number, y: number, ring: Array<{ x: number; y: number }>) => ring.reduce((nearest, point, index) => {
    const next = ring[(index + 1) % ring.length], dx = next.x - point.x, dy = next.y - point.y;
    const ratio = dx === 0 && dy === 0 ? 0 : Math.max(0, Math.min(1, ((x - point.x) * dx + (y - point.y) * dy) / (dx * dx + dy * dy)));
    return Math.min(nearest, Math.hypot(x - (point.x + ratio * dx), y - (point.y + ratio * dy)));
  }, Number.POSITIVE_INFINITY);
  const interiorPoint = (ring: Array<{ x: number; y: number }>) => {
    const minX = Math.min(...ring.map((point) => point.x)), maxX = Math.max(...ring.map((point) => point.x));
    const minY = Math.min(...ring.map((point) => point.y)), maxY = Math.max(...ring.map((point) => point.y));
    let best = { x: (minX + maxX) / 2, y: (minY + maxY) / 2, distance: -1 };
    const search = (left: number, right: number, top: number, bottom: number, step: number) => {
      for (let y = top; y <= bottom; y += step) for (let x = left; x <= right; x += step) {
        if (!pointInRing(x, y, ring)) continue;
        const distance = distanceToEdge(x, y, ring);
        if (distance > best.distance) best = { x, y, distance };
      }
    };
    search(minX, maxX, minY, maxY, Math.max(1.5, Math.min(maxX - minX, maxY - minY) / 8));
    for (const step of [0.75, 0.3]) search(best.x - step * 3, best.x + step * 3, best.y - step * 3, best.y + step * 3, step);
    return best;
  };
  return boundary.features.map((feature) => {
    const polygons = feature.geometry.type === "Polygon" ? [feature.geometry.coordinates] : feature.geometry.coordinates;
    const ringArea = (ring: Position[]) => Math.abs(ring.reduce((sum, point, index) => { const next = ring[(index + 1) % ring.length]; return sum + point[0] * next[1] - next[0] * point[1]; }, 0) / 2);
    const ring = polygons.map((polygon) => polygon[0] ?? []).sort((a, b) => ringArea(b) - ringArea(a))[0] ?? [];
    if (!ring.length) return null;
    const points = ring.map(([longitude, latitude]) => ({ x: 45 + ((longitude - 88.0) / 4.7) * 470, y: 570 - ((latitude - 20.7) / 5.8) * 530 }));
    const name = feature.properties.shapeName ?? "Unknown";
    const safest = interiorPoint(points);
    const fontSize = Math.max(1.8, Math.min(6.5, (safest.distance * 0.9) / Math.max(1.8, name.length * 0.31)));
    return { name, x: safest.x, y: safest.y, fontSize };
  }).filter((label): label is { name: string; x: number; y: number; fontSize: number } => label !== null);
}

function DistrictLabels({ boundary }: { boundary?: Boundary }) {
  return <g aria-hidden="true" className="pointer-events-none">{boundaryLabels(boundary).map((label) => <text key={label.name} x={label.x} y={label.y} textAnchor="middle" dominantBaseline="central" fill="#000000" stroke="none" fontFamily="Arial, sans-serif" fontSize={label.fontSize} fontWeight="700">{label.name}</text>)}</g>;
}

function pollutantLabel(name: string) {
  if (name === "PM2.5") return "PM 2.5";
  if (name === "PM10") return "PM 10";
  if (name === "NO2") return "NO₂";
  if (name === "SO2") return "SO₂";
  if (name === "CO2") return "CO₂";
  if (name === "O3") return "O₃";
  return name;
}

const districtNameAliases: Record<string, string> = {
  barisal: "barishal",
  bogra: "bogura",
  brahamanbaria: "brahmanbaria",
  chittagong: "chattogram",
  comilla: "cumilla",
  jessore: "jashore",
  maulvibazar: "moulvibazar",
  nawabganj: "chapainawabganj",
  netrakona: "netrokona",
};

function districtKey(name = "") {
  const key = name.toLowerCase().replace(/[^a-z]/g, "");
  return districtNameAliases[key] ?? key;
}

function BangladeshContour({ readings, boundary, id = "district-aqi-map" }: { readings: DistrictAqi[]; boundary?: Boundary; id?: string }) {
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
  const clipId = `${id}-clip`, filterId = `${id}-soft`;
  return <div className="relative" onPointerLeave={() => setHovered(null)}><svg id={id} viewBox="0 0 560 610" className="h-[560px] w-full" role="img" aria-label="Bangladesh district AQI contour map">
    <defs><clipPath id={clipId}>{paths.map((path, index) => <path key={index} d={path} fillRule="evenodd" clipRule="evenodd" />)}</clipPath><filter id={filterId}><feGaussianBlur stdDeviation="27" /></filter></defs>
    {paths.map((path, index) => <path key={`base-${index}`} d={path} fill="#e5ecea" fillRule="evenodd" stroke="#8aa3a0" strokeWidth="1.2" />)}
    <g clipPath={`url(#${clipId})`} filter={`url(#${filterId})`}>{readings.map((row) => <circle key={`heat-${row.id}`} cx={x(row.longitude)} cy={y(row.latitude)} r="58" fill={colorFor(row.usAqi)} opacity="0.8" />)}</g>
    {paths.map((path, index) => <path key={`edge-${index}`} d={path} fill="none" stroke="#64748b" strokeWidth="1.2" />)}
    <DistrictLabels boundary={boundary}/>
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
  const segments = paths.map((path) => path.match(/-?\d+(?:\.\d+)?/g)?.map(Number)).filter((values): values is number[] => Boolean(values && values.length >= 4)).map(([x1, y1, x2, y2]) => [[x1, y1], [x2, y2]] as Array<[number, number]>);
  const samePoint = (a: [number, number], b: [number, number]) => Math.hypot(a[0] - b[0], a[1] - b[1]) <= 1.5;
  const joined: Array<Array<[number, number]>> = [];
  while (segments.length) {
    const line = segments.pop()!;
    let extended = true;
    while (extended) {
      extended = false;
      for (let index = segments.length - 1; index >= 0; index--) {
        const segment = segments[index], first = line[0], last = line[line.length - 1];
        if (samePoint(last, segment[0])) line.push(segment[1]);
        else if (samePoint(last, segment[1])) line.push(segment[0]);
        else if (samePoint(first, segment[1])) line.unshift(segment[0]);
        else if (samePoint(first, segment[0])) line.unshift(segment[1]);
        else continue;
        segments.splice(index, 1); extended = true;
      }
    }
    joined.push(line);
  }
  return joined.map((line) => line.map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" "));
}

function contourLevels(readings: DistrictAqi[]) {
  const values = readings.flatMap((row) => row.usAqi === null ? [] : [row.usAqi]);
  if (values.length < 2) return [];
  const minimum = Math.min(...values), maximum = Math.max(...values);
  if (minimum === maximum) return [];
  const contourColors = ["#16a34a", "#65a30d", "#ca8a04", "#f59e0b", "#f97316", "#ef4444", "#db2777", "#9333ea"];
  const firstInteger = Math.floor(minimum) + 1, lastInteger = Math.ceil(maximum) - 1;
  const availableIntegers = lastInteger - firstInteger + 1;
  if (availableIntegers < 8) return Array.from({ length: Math.max(0, availableIntegers) }, (_, index) => ({ value: firstInteger + index, color: contourColors[Math.min(7, Math.round((index * 7) / Math.max(1, availableIntegers - 1)))] }));
  return Array.from({ length: 8 }, (_, index) => ({ value: Math.round(firstInteger + ((lastInteger - firstInteger) * index) / 7), color: contourColors[index] }));
}

const formatContourValue = (value: number) => String(Math.round(value));

function BangladeshLineContour({ readings, boundary, id = "district-aqi-line-map" }: { readings: DistrictAqi[]; boundary?: Boundary; id?: string }) {
  const paths = exactBoundaryPaths(boundary);
  const contourClipPaths = BANGLADESH_PATHS;
  const levels = contourLevels(readings);
  const contours = levels.map((level) => ({ ...level, paths: lineContourPaths(readings, level.value) }));
  const boundaryRings = contourClipPaths.map((path) => {
    const values = path.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
    return Array.from({ length: Math.floor(values.length / 2) }, (_, index) => ({ x: values[index * 2], y: values[index * 2 + 1] }));
  });
  const isInsideBoundary = (x: number, y: number) => boundaryRings.some((ring) => {
    let inside = false;
    for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index++) { const a = ring[index], b = ring[previous]; if ((a.y > y) !== (b.y > y) && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) inside = !inside; }
    return inside;
  });
  const labelsForPath = (path: string) => {
    const values = path.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
    const points = Array.from({ length: Math.floor(values.length / 2) }, (_, index) => ({ x: values[index * 2], y: values[index * 2 + 1] }));
    const visibleRuns: Array<typeof points> = [];
    let run: typeof points = [];
    for (let index = 0; index + 1 < points.length; index++) {
      const first = points[index], second = points[index + 1];
      if (isInsideBoundary((first.x + second.x) / 2, (first.y + second.y) / 2)) {
        if (!run.length) run.push(first);
        run.push(second);
      } else if (run.length) { visibleRuns.push(run); run = []; }
    }
    if (run.length) visibleRuns.push(run);
    const visibleSegments = visibleRuns.flatMap((visible) => visible.slice(0, -1).map((first, index) => ({ first, second: visible[index + 1], length: Math.hypot(visible[index + 1].x - first.x, visible[index + 1].y - first.y) })));
    if (!visibleSegments.length) return [];
    const visibleLength = visibleSegments.reduce((sum, segment) => sum + segment.length, 0);
    const halfway = visibleLength / 2;
    let travelled = 0, segmentIndex = 0;
    while (segmentIndex < visibleSegments.length - 1 && travelled + visibleSegments[segmentIndex].length < halfway) travelled += visibleSegments[segmentIndex++].length;
    const segment = visibleSegments[segmentIndex], ratio = segment.length ? (halfway - travelled) / segment.length : 0.5;
    let angle = Math.atan2(segment.second.y - segment.first.y, segment.second.x - segment.first.x) * 180 / Math.PI;
    if (angle > 90 || angle < -90) angle += 180;
    return [{ x: segment.first.x + (segment.second.x - segment.first.x) * ratio, y: segment.first.y + (segment.second.y - segment.first.y) * ratio, angle, visibleLength }];
  };
  const labelForLevel = (contourPaths: string[]) => contourPaths.flatMap(labelsForPath).sort((a, b) => b.visibleLength - a.visibleLength)[0];
  if (!paths.length) return <div className="grid h-[560px] place-items-center rounded-2xl bg-slate-50 text-sm font-bold text-slate-400">Loading boundary map…</div>;
  const clipId = `${id}-clip`;
  return <svg id={id} viewBox="0 0 560 610" className="h-[560px] w-full [&+div]:hidden" role="img" aria-label="Bangladesh AQI line contour map">
    <defs><clipPath id={clipId}>{contourClipPaths.map((path, index) => <path key={index} d={path} />)}</clipPath></defs>
    {paths.map((path, index) => <path key={`line-base-${index}`} d={path} fill="#e5e7eb" fillRule="evenodd" stroke="#94a3b8" strokeWidth="1" />)}
    {paths.map((path, index) => <path key={`line-edge-${index}`} d={path} fill="none" stroke="#64748b" strokeWidth="1.1" />)}
    <g clipPath={`url(#${clipId})`}>{contours.flatMap((level) => level.paths.map((path, index) => <path key={`${level.value}-${index}`} d={path} fill="none" stroke={level.color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />))}{contours.map((level) => { const label = labelForLevel(level.paths); return label ? <text key={`label-${level.value}`} x={label.x} y={label.y} transform={`rotate(${label.angle} ${label.x} ${label.y})`} textAnchor="middle" dominantBaseline="central" fill={level.color} stroke="#ffffff" strokeWidth="3.5" paintOrder="stroke" fontFamily="'Times New Roman', Times, serif" fontSize="9" fontWeight="700">{formatContourValue(level.value)}</text> : null; })}</g>
    <DistrictLabels boundary={boundary}/>
  </svg>;
}

function YearlyPeakMaps({ boundary, years, mapYear, lineYear, mapReadings, lineReadings, mapMean, lineMean, onMapYearChange, onLineYearChange }: { boundary?: Boundary; years: number[]; mapYear: number; lineYear: number; mapReadings: DistrictAqi[]; lineReadings: DistrictAqi[]; mapMean: number; lineMean: number; onMapYearChange: (year: number) => void; onLineYearChange: (year: number) => void }) {
  const categoryLegend = [["Good","#22c55e"],["Moderate","#84cc16"],["Sensitive","#f59e0b"],["Unhealthy","#ef4444"],["Very unhealthy","#a855f7"]];
  const lineLegend = contourLevels(lineReadings);
  return <section className="mt-6 grid gap-6 lg:grid-cols-2">
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-col gap-3"><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-wider text-cyan-700">Yearly peak spatial distribution</p><h2 className="mt-1 whitespace-nowrap text-xl font-black lg:text-[22px]">Bangladesh peak AQI · {mapYear}</h2></div><span className="shrink-0 rounded-lg bg-slate-100 px-3 py-2 text-xs font-black text-slate-700">Mean peak {Math.round(mapMean)}</span></div><div className="flex flex-nowrap items-center gap-2"><select aria-label="Yearly peak map year" value={mapYear} onChange={(event) => onMapYearChange(Number(event.target.value))} className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold">{years.map((value) => <option key={value} value={value}>{value}</option>)}</select><button type="button" onClick={() => downloadDistrictMap(`Bangladesh peak AQI · ${mapYear}`, mapMean, "district-aqi-yearly-map", false, `bangladesh-peak-aqi-${mapYear}.png`)} disabled={!boundary} className="shrink-0 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-cyan-800 hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-40">PNG</button></div></div><BangladeshContour id="district-aqi-yearly-map" readings={mapReadings} boundary={boundary}/><div className="flex flex-wrap justify-center gap-3 text-[10px] font-bold">{categoryLegend.map(([label,color])=><span key={label} className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-full" style={{background:color}}/>{label}</span>)}</div></article>
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-col gap-3"><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-wider text-cyan-700">Yearly peak contour lines</p><h2 className="mt-1 whitespace-nowrap text-xl font-black lg:text-[22px]">Bangladesh peak AQI · {lineYear}</h2></div><span className="shrink-0 rounded-lg bg-slate-100 px-3 py-2 text-xs font-black text-slate-700">Mean peak {Math.round(lineMean)}</span></div><div className="flex flex-nowrap items-center gap-2"><select aria-label="Yearly peak line contour year" value={lineYear} onChange={(event) => onLineYearChange(Number(event.target.value))} className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold">{years.map((value) => <option key={value} value={value}>{value}</option>)}</select><button type="button" onClick={() => downloadDistrictMap(`Bangladesh peak AQI · ${lineYear}`, lineMean, "district-aqi-yearly-line-map", true, `bangladesh-peak-aqi-contours-${lineYear}.png`)} disabled={!boundary} className="shrink-0 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-cyan-800 hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-40">PNG</button></div></div><BangladeshLineContour id="district-aqi-yearly-line-map" readings={lineReadings} boundary={boundary}/><div className="flex flex-wrap justify-center gap-3 text-[10px] font-bold">{lineLegend.map((level)=><span key={level.value} className="flex items-center gap-1.5"><i className="h-0.5 w-5" style={{background:level.color}}/>AQI {formatContourValue(level.value)}</span>)}</div></article>
  </section>;
}

type StatisticsPayload = { error?: string; monthly?: Array<{ year: number; month: number; value: string | number }>; annualDistrict?: Array<{ year: number; district_id: string; value: string | number; is_complete: boolean }>; seasonal?: Array<{ pollutant: string; season: string; minimum: string | number; q1: string | number; median: string | number; q3: string | number; maximum: string | number }>; seasonalDistrict?: Array<{ district_id: string; season: string; value: string | number }>; districtMonth?: Array<{ district_id: string; month: number; value: string | number }>; districtTrend?: Array<{ district_id: string; year: number; month: number; aqi: string | number; pm2_5: string | number; pm10: string | number; no2: string | number; so2: string | number; co: string | number; o3: string | number }>; pollutantSample?: Array<{ day: string; aqi: string | number; pm2_5: string | number; pm10: string | number; no2: string | number; so2: string | number; co: string | number; o3: string | number }>; seasonalPoints?: Array<{ pollutant: string; season: string; value: string | number }>; correlations?: Array<{ x: string; y: string; value: string | number }> };

function MonthlyMeanChart({ monthly }: { monthly: NonNullable<StatisticsPayload["monthly"]> }) {
  const years = Array.from({ length: initialYear - 2022 + 1 }, (_, index) => initialYear - index);
  const yearsWithData = new Set(monthly.map((row) => Number(row.year)));
  const [selectedYears, setSelectedYears] = useState(() => years.filter((year) => yearsWithData.has(year)).slice(0, 3));
  const selectedRows = monthly.filter((row) => selectedYears.includes(Number(row.year)));
  const maximum = Math.max(100, ...selectedRows.map((row) => Number(row.value) || 0)), chartMaximum = Math.ceil(maximum / 50) * 50;
  const point = (month: number, value: number) => ({ x: 62 + ((month - 1) / 11) * 810, y: 272 - (value / chartMaximum) * 220 });
  const palette = ["#0891b2", "#ef4444", "#f59e0b", "#16a34a", "#9333ea"];
  const toggleYear = (year: number) => setSelectedYears((selected) => selected.includes(year) ? selected.filter((value) => value !== year) : [...selected, year].sort((a, b) => b - a));
  const pointMarker = (row: { month: number; value: string | number }, color: string) => { const p = point(Number(row.month), Number(row.value)); return <circle key={row.month} cx={p.x} cy={p.y} r="2.5" fill={color}/>; };
  return <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h3 className="text-center text-xl font-black">Monthly mean AQI of Bangladesh</h3><div className="mt-4 flex justify-center gap-2"><details className="relative"><summary className="min-w-40 cursor-pointer list-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold">{selectedYears.length ? `${selectedYears.length} years selected` : "Select years"} <span aria-hidden="true" className="float-right ml-3">▾</span></summary><div className="absolute left-1/2 z-20 mt-1 w-44 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">{years.map((year)=><label key={year} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-xs font-bold hover:bg-slate-50"><input type="checkbox" checked={selectedYears.includes(year)} onChange={() => toggleYear(year)} className="h-4 w-4 accent-cyan-700"/><span>{year}</span>{!yearsWithData.has(year)?<small className="ml-auto text-[9px] text-slate-400">No data</small>:null}</label>)}</div></details><button type="button" onClick={() => downloadSvgChart("monthly-mean-aqi-chart", "bangladesh-monthly-mean-aqi-selected-years.png", "Monthly mean AQI of Bangladesh")} className="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-cyan-800 hover:bg-cyan-100">PNG</button></div><div className="mt-4 overflow-x-auto"><svg id="monthly-mean-aqi-chart" viewBox="0 0 920 345" className="min-w-[720px] w-full" role="img" aria-label="Monthly mean AQI of Bangladesh for selected years">{[0,.25,.5,.75,1].map((ratio) => <g key={ratio}><line x1="62" x2="872" y1={272-ratio*220} y2={272-ratio*220} stroke="#e2e8f0"/><text x="50" y={276-ratio*220} textAnchor="end" fontSize="11" fill="#64748b">{Math.round(chartMaximum*ratio)}</text></g>)}{monthNames.map((name,index)=><text key={name} x={62+(index/11)*810} y="296" textAnchor="middle" fontSize="11" fill="#475569">{name.slice(0,3)}</text>)}{selectedYears.map((year,yearIndex)=>{const rows=monthly.filter((row)=>Number(row.year)===year).sort((a,b)=>Number(a.month)-Number(b.month));const groups=rows.reduce<typeof rows[]>((result,row)=>{const group=result[result.length-1];if(!group||Number(row.month)!==Number(group[group.length-1].month)+1)result.push([row]);else group.push(row);return result;},[]);const color=palette[yearIndex%palette.length];return <g key={year}>{groups.map((group,groupIndex)=>{const path=group.map((row,index)=>{const p=point(Number(row.month),Number(row.value));return `${index?"L":"M"}${p.x},${p.y}`;}).join(" ");return group.length>1?<path key={groupIndex} d={path} fill="none" stroke={color} strokeWidth="3"/>:null;})}{rows.map((row)=>pointMarker(row,color))}</g>;})}{!selectedRows.length?<text x="467" y="160" textAnchor="middle" fontSize="16" fontWeight="700" fill="#94a3b8">No stored AQI data for the selected years</text>:null}<g>{selectedYears.map((year,index)=>{const itemWidth=82,start=460-(selectedYears.length*itemWidth)/2,x=start+index*itemWidth,color=palette[index%palette.length];return <g key={year}><line x1={x} x2={x+24} y1="325" y2="325" stroke={color} strokeWidth="3"/><text x={x+30} y="329" fontSize="11" fontWeight="700" fill="#334155">{year}</text></g>;})}</g></svg></div><p className="mt-2 text-center text-xs font-medium text-slate-500">Only stored months are plotted; missing months remain unconnected.</p></article>;
}

function AnnualMeanAqiMaps({ boundary, rows }: { boundary?: Boundary; rows: NonNullable<StatisticsPayload["annualDistrict"]> }) {
  const years = [...new Set(rows.map((row) => Number(row.year)))].sort((a, b) => b - a).slice(0, 4).sort((a, b) => a - b);
  const annualColor = (value: number | null) => value === null ? "#e2e8f0" : value <= 50 ? "#fff7bc" : value <= 100 ? "#fec44f" : value <= 150 ? "#fe9929" : value <= 200 ? "#ef5350" : value <= 250 ? "#d81b60" : "#a50f15";
  if (!boundary?.features?.length) return <article className="grid h-72 place-items-center rounded-3xl border border-slate-200 bg-white text-sm font-bold text-slate-400">Loading annual district maps…</article>;
  return <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-xl font-black">Annual mean AQI by district</h3><p className="mt-1 text-xs font-medium text-slate-500">Latest four stored years · incomplete years marked YTD</p></div><button type="button" onClick={() => downloadSvgChart("annual-mean-aqi-maps", "bangladesh-annual-mean-aqi-maps.png", "Annual mean AQI by district")} className="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-cyan-800 hover:bg-cyan-100">PNG</button></div><div className="mt-4 overflow-x-auto"><svg id="annual-mean-aqi-maps" viewBox="0 0 920 330" className="min-w-[760px] w-full" role="img" aria-label="District annual mean and year-to-date AQI maps for the latest four stored years"><defs><filter id="annual-map-shadow" x="-15%" y="-15%" width="130%" height="130%"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0f172a" floodOpacity=".15"/></filter></defs>{years.map((year,index)=>{const yearRows=rows.filter((row)=>Number(row.year)===year),values=new Map(yearRows.map((row)=>[districtKey(row.district_id),Number(row.value)])),isComplete=yearRows.every((row)=>row.is_complete);const offset=15+index*220;return <g key={year}><text x={offset+90} y="48" textAnchor="middle" fontSize="18" fontWeight="800" fill="#0f172a">{year}{isComplete?"":" YTD"}</text><g transform={`translate(${offset} 50) scale(.32)`} filter="url(#annual-map-shadow)">{boundary.features.flatMap((feature)=>{const value=values.get(districtKey(feature.properties.shapeName))??null;return exactBoundaryPaths({features:[feature]}).map((path,pathIndex)=><path key={`${feature.properties.shapeName}-${pathIndex}`} d={path} fill={annualColor(value)} fillRule="evenodd" stroke="#64748b" strokeWidth="1.6"/>);})}</g></g>;})}<g transform="translate(862 36)"><text x="8" y="0" textAnchor="middle" fontSize="14" fontWeight="800">N</text><path d="M8 8 L0 34 L8 29 L16 34 Z" fill="#0f172a"/><path d="M8 12 L8 29 L3 31 Z" fill="#ffffff"/></g><text x="70" y="273" fontSize="13" fontWeight="800" fill="#334155">Annual mean AQI</text>{["#fff7bc","#fec44f","#fe9929","#ef5350","#d81b60","#a50f15"].map((color,index)=><rect key={color} x={70+index*58} y="282" width="58" height="18" fill={color} stroke="#ffffff"/>)}{[0,50,100,150,200,250,300].map((value,index)=><text key={value} x={70+index*58} y="317" textAnchor={index===0?"start":index===6?"end":"middle"} fontSize="10" fontWeight="600" fill="#475569">{value}</text>)}<g transform="translate(760 286)"><rect x="0" y="0" width="32.3" height="8" fill="#0f172a"/><rect x="32.3" y="0" width="32.3" height="8" fill="#ffffff" stroke="#0f172a"/><rect x="64.6" y="0" width="32.3" height="8" fill="#0f172a"/><text x="0" y="27" textAnchor="middle" fontSize="9" fontWeight="600">0</text><text x="32.3" y="27" textAnchor="middle" fontSize="9" fontWeight="600">100</text><text x="64.6" y="27" textAnchor="middle" fontSize="9" fontWeight="600">200</text><text x="96.9" y="27" textAnchor="middle" fontSize="9" fontWeight="600">300</text><text x="111" y="27" fontSize="9" fontWeight="600">km</text></g></svg></div></article>;
}

function SeasonalPollutantOverview({ seasonal, seasonalPoints }: { seasonal: NonNullable<StatisticsPayload["seasonal"]>; seasonalPoints: NonNullable<StatisticsPayload["seasonalPoints"]> }) {
  const [selectedSeason, setSelectedSeason] = useState("DJF");
  const seasons = [
    { id: "DJF", label: "Winter" },
    { id: "MAM", label: "Pre-monsoon" },
    { id: "JJA", label: "Monsoon" },
    { id: "SON", label: "Post-monsoon" },
  ];
  const pollutantOrder = ["PM2.5", "PM10", "NO2", "SO2", "CO", "O3"];
  const rows = pollutantOrder.map((pollutant) => seasonal.find((row) => row.season === selectedSeason && row.pollutant === pollutant)).filter((row): row is NonNullable<typeof row> => Boolean(row));
  const colors: Record<string, string> = { "PM2.5": "#2563eb", PM10: "#7c3aed", NO2: "#dc2626", SO2: "#ea580c", CO: "#0891b2", O3: "#db2777" };
  const rawMaximum = Math.max(1, ...rows.map((row) => Number(row.maximum) || 0));
  const chartMaximum = Math.ceil(rawMaximum / (rawMaximum > 500 ? 500 : rawMaximum > 200 ? 100 : 50)) * (rawMaximum > 500 ? 500 : rawMaximum > 200 ? 100 : 50);
  const y = (value: number) => 260 - (Math.log1p(Math.max(0, value)) / Math.log1p(chartMaximum)) * 210;
  const scaleTick = (ratio: number) => Math.round(Math.expm1(Math.log1p(chartMaximum) * ratio));
  const seasonName = seasons.find((season) => season.id === selectedSeason)?.label ?? selectedSeason;
  return <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-xl font-black">All pollutants by selected season</h3><p className="mt-1 text-xs font-medium text-slate-500">Shared logarithmic µg/m³ scale with sampled observations · CO₂ omitted</p></div><div className="flex items-center gap-2"><select aria-label="Overview season" value={selectedSeason} onChange={(event) => setSelectedSeason(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold">{seasons.map((season) => <option key={season.id} value={season.id}>{season.id} · {season.label}</option>)}</select><button type="button" onClick={() => downloadSvgChart("seasonal-all-pollutants-chart", `bangladesh-${selectedSeason.toLowerCase()}-all-pollutants.png`, `${seasonName} pollutant distributions`)} className="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-cyan-800 hover:bg-cyan-100">PNG</button></div></div>
    <div className="mt-4 overflow-x-auto"><svg id="seasonal-all-pollutants-chart" viewBox="0 0 920 340" className="min-w-[760px] w-full" role="img" aria-label={`${seasonName} distributions for all pollutants except carbon dioxide on a logarithmic scale`}>{[0,.25,.5,.75,1].map((ratio)=><g key={ratio}><line x1="72" x2="890" y1={260-ratio*210} y2={260-ratio*210} stroke={ratio===0?"#94a3b8":"#e2e8f0"}/><text x="60" y={264-ratio*210} textAnchor="end" fontSize="11" fontWeight="600" fill="#64748b">{scaleTick(ratio)}</text></g>)}{rows.map((row,index)=>{const x=145+index*142,minimum=Number(row.minimum),q1=Number(row.q1),median=Number(row.median),q3=Number(row.q3),maximum=Number(row.maximum),color=colors[row.pollutant]??"#334155",points=seasonalPoints.filter((point)=>point.season===selectedSeason&&point.pollutant===row.pollutant);return <g key={row.pollutant}>{points.map((point,pointIndex)=>{const jitter=((((pointIndex*37)%101)/100)-.5)*76;return <circle key={pointIndex} cx={x+jitter} cy={y(Number(point.value))} r="2.4" fill="#ffffff" fillOpacity=".8" stroke={color} strokeWidth="1" strokeOpacity=".72"/>;})}<line x1={x} x2={x} y1={y(maximum)} y2={y(minimum)} stroke={color} strokeWidth="2"/><line x1={x-20} x2={x+20} y1={y(maximum)} y2={y(maximum)} stroke={color} strokeWidth="2"/><line x1={x-20} x2={x+20} y1={y(minimum)} y2={y(minimum)} stroke={color} strokeWidth="2"/><rect x={x-34} y={y(q3)} width="68" height={Math.max(4,y(q1)-y(q3))} rx="2" fill={color} fillOpacity=".2" stroke={color} strokeWidth="2.5"/><line x1={x-34} x2={x+34} y1={y(median)} y2={y(median)} stroke={color} strokeWidth="3"/><text x={x+40} y={y(median)+4} fontSize="9" fontWeight="800" fill={color}>{median.toFixed(1)}</text><text x={x} y="286" textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f172a">{pollutantLabel(row.pollutant)}</text></g>})}<text x="17" y="155" transform="rotate(-90 17 155)" textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155">Concentration (µg/m³, log scale)</text><g transform="translate(727 320)"><circle cx="4" cy="0" r="3" fill="#ffffff" stroke="#64748b"/><text x="14" y="4" fontSize="10" fontWeight="600" fill="#64748b">Sampled observations</text></g></svg></div>
  </article>;
}

function DescriptiveStatistics({ boundary }: { boundary?: Boundary }) {
  const [statistics, setStatistics] = useState<StatisticsPayload | null>(null);
  const [seasonalPollutant, setSeasonalPollutant] = useState("PM2.5");
  useEffect(() => { let cancelled = false; async function loadStatistics() { try { const response = await fetch("/api/aqi/districts/statistics", { cache: "no-store" }); const payload = await response.json() as StatisticsPayload; if (!cancelled) setStatistics(payload); } catch { if (!cancelled) setStatistics({ error: "Unable to load descriptive AQI statistics." }); } } void loadStatistics(); return () => { cancelled = true; }; }, []);
  if (statistics?.error) return <section className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm font-bold text-amber-900">{statistics.error}</section>;
  if (!statistics) return <section className="mt-6 grid h-48 place-items-center rounded-3xl border border-slate-200 bg-white text-sm font-bold text-slate-400">Loading descriptive analysis…</section>;
  const monthly = statistics.monthly ?? [];
  const seasonStyles: Record<string, { color: string; light: string; label: string }> = {
    DJF: { color: "#2563eb", light: "#dbeafe", label: "Winter" },
    MAM: { color: "#16a34a", light: "#dcfce7", label: "Pre-monsoon" },
    JJA: { color: "#0891b2", light: "#cffafe", label: "Monsoon" },
    SON: { color: "#ea580c", light: "#ffedd5", label: "Post-monsoon" },
  };
  const pollutantNames = ["PM2.5","PM10","NO2","SO2","CO","CO2","O3"];
  const seasonal = (statistics.seasonal ?? []).filter((row) => row.pollutant === seasonalPollutant), seasonalMaximum = Math.max(1, ...seasonal.map((row) => Number(row.maximum) || 0));
  const particlePoints = (statistics.seasonalPoints ?? []).filter((row) => row.pollutant === seasonalPollutant);
  const showParticlePoints = seasonalPollutant === "PM2.5" || seasonalPollutant === "PM10";
  const sy = (value: number) => 260 - (value / seasonalMaximum) * 210;
  const pollutants = ["PM2.5","PM10","NO2","SO2","CO","O3"];
  const correlationMap = new Map((statistics.correlations ?? []).map((row) => [`${row.x}:${row.y}`, Number(row.value)]));
  const correlationColor = (value: number) => {
    const strength = Math.max(0, Math.min(1, value));
    const target = [185, 28, 28];
    return `rgb(${target.map((channel) => Math.round(248 + (channel - 248) * strength)).join(" ")})`;
  };
  return <section className="mt-6 space-y-6"><div><p className="text-xs font-black uppercase tracking-wider text-cyan-700">Descriptive and seasonal analysis</p><h2 className="mt-1 text-2xl font-black">Bangladesh historical AQI patterns</h2></div>
    <MonthlyMeanChart monthly={monthly}/>
    <AnnualMeanAqiMaps boundary={boundary} rows={statistics.annualDistrict ?? []}/>
    <SeasonalPollutantOverview seasonal={statistics.seasonal ?? []} seasonalPoints={statistics.seasonalPoints ?? []}/>
    <AqiResearchPlots seasonalDistrict={statistics.seasonalDistrict ?? []} districtMonth={statistics.districtMonth ?? []} districtTrend={statistics.districtTrend ?? []} pollutantSample={statistics.pollutantSample ?? []}/>
    <DailyDistrictPollutantTrend districts={[...new Set((statistics.seasonalDistrict ?? []).map((row)=>row.district_id))].sort()}/>
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-xl font-black">Seasonal pollutant variation</h3><p className="mt-1 text-xs font-medium text-slate-500">{showParticlePoints ? "Box plot with sampled raw observations" : "Distribution by Bangladesh climate season"}</p></div><div className="flex items-center gap-2"><select aria-label="Seasonal pollutant" value={seasonalPollutant} onChange={(event) => setSeasonalPollutant(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold">{pollutantNames.map((name)=><option key={name} value={name}>{pollutantLabel(name)}</option>)}</select><button type="button" onClick={() => downloadSvgChart("seasonal-pollutant-chart", `bangladesh-seasonal-${seasonalPollutant.toLowerCase().replace(".", "-")}.png`, `Seasonal ${pollutantLabel(seasonalPollutant)} variation`)} className="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-cyan-800 hover:bg-cyan-100">PNG</button></div></div><div className="mt-4 overflow-x-auto"><svg id="seasonal-pollutant-chart" viewBox="0 0 920 340" className="min-w-[720px] w-full" role="img" aria-label={`Seasonal ${pollutantLabel(seasonalPollutant)} box plots`}>{[0,.25,.5,.75,1].map((ratio)=><g key={ratio}><line x1="70" x2="880" y1={260-ratio*210} y2={260-ratio*210} stroke={ratio===0?"#94a3b8":"#e2e8f0"}/><text x="58" y={264-ratio*210} textAnchor="end" fontSize="11" fontWeight="600" fill="#64748b">{Math.round(seasonalMaximum*ratio)}</text></g>)}{seasonal.map((row,index)=>{const x=170+index*190,min=sy(Number(row.minimum)),q1=sy(Number(row.q1)),median=sy(Number(row.median)),q3=sy(Number(row.q3)),max=sy(Number(row.maximum)),style=seasonStyles[row.season]??seasonStyles.DJF,points=showParticlePoints?particlePoints.filter((point)=>point.season===row.season):[];return <g key={row.season}>{points.map((point,pointIndex)=>{const jitter=((((pointIndex*37)%101)/100)-.5)*100;return <circle key={pointIndex} cx={x+jitter} cy={sy(Number(point.value))} r="2.5" fill="#ffffff" fillOpacity=".8" stroke={style.color} strokeWidth="1" strokeOpacity=".7"/>;})}<line x1={x} x2={x} y1={max} y2={min} stroke={style.color} strokeWidth="2"/><line x1={x-25} x2={x+25} y1={max} y2={max} stroke={style.color} strokeWidth="2"/><line x1={x-25} x2={x+25} y1={min} y2={min} stroke={style.color} strokeWidth="2"/><rect x={x-42} y={q3} width="84" height={Math.max(4,q1-q3)} rx="2" fill={style.light} fillOpacity=".92" stroke={style.color} strokeWidth="2.5"/><line x1={x-42} x2={x+42} y1={median} y2={median} stroke={style.color} strokeWidth="3"/><text x={x+51} y={median+4} fontSize="10" fontWeight="800" fill={style.color}>{Number(row.median).toFixed(1)}</text><text x={x} y="286" textAnchor="middle" fontSize="14" fontWeight="800" fill="#0f172a">{row.season}</text><text x={x} y="305" textAnchor="middle" fontSize="11" fontWeight="600" fill="#64748b">{style.label}</text></g>})}{!seasonal.length?<text x="475" y="160" textAnchor="middle" fontSize="15" fontWeight="700" fill="#94a3b8">No seasonal data available</text>:null}<text x="17" y="155" transform="rotate(-90 17 155)" textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155">{pollutantLabel(seasonalPollutant)} ({seasonalPollutant === "CO2" ? "ppm" : "µg/m³"})</text>{showParticlePoints?<g transform="translate(702 324)"><circle cx="4" cy="0" r="3" fill="#ffffff" stroke="#64748b"/><text x="14" y="4" fontSize="10" fontWeight="600" fill="#64748b">Sampled observations</text></g>:null}</svg></div></article>
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-xl font-black">Pollutant correlation matrix</h3><p className="mt-1 text-xs font-medium text-slate-500">Pearson correlation from 0 to +1</p></div><button type="button" onClick={() => downloadSvgChart("pollutant-correlation-chart", "bangladesh-pollutant-correlation-matrix.png", "Pollutant correlation matrix")} className="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-cyan-800 hover:bg-cyan-100">PNG</button></div><div className="mt-4 overflow-x-auto"><svg id="pollutant-correlation-chart" viewBox="0 0 920 520" className="min-w-[720px] w-full" role="img" aria-label="Pollutant correlation heatmap"><defs><linearGradient id="correlation-scale" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor="#f8fafc"/><stop offset="100%" stopColor="#b91c1c"/></linearGradient></defs>{pollutants.map((name,index)=><text key={`top-${name}`} x={182+index*64} y="75" textAnchor="middle" fontSize="13" fontWeight="700" fill="#334155">{pollutantLabel(name)}</text>)}{pollutants.map((row,rowIndex)=><g key={row}><text x="132" y={126+rowIndex*64} textAnchor="end" dominantBaseline="middle" fontSize="13" fontWeight="700" fill="#334155">{pollutantLabel(row)}</text>{pollutants.map((column,columnIndex)=>{const value=correlationMap.get(`${column}:${row}`) ?? (row===column?1:0);return <g key={`${row}-${column}`}><rect x={151+columnIndex*64} y={95+rowIndex*64} width="62" height="62" rx="5" fill={correlationColor(value)} stroke="#ffffff" strokeWidth="1.5"/><text x={182+columnIndex*64} y={126+rowIndex*64} textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="700" fill={value>.48?"#ffffff":"#334155"}>{value.toFixed(2)}</text></g>;})}</g>)}<rect x="610" y="95" width="28" height="382" rx="5" fill="url(#correlation-scale)" stroke="#cbd5e1"/><text x="652" y="100" fontSize="12" fontWeight="700" fill="#475569">1.0</text><text x="652" y="290" fontSize="12" fontWeight="700" fill="#475569">0.5</text><text x="652" y="477" fontSize="12" fontWeight="700" fill="#475569">0.0</text></svg></div></article>
  </section>;
}

export default function DistrictAqiDashboard() {
  const [data, setData] = useState<Payload | null>(null);
  const [lineData, setLineData] = useState<Payload | null>(null);
  const [yearlyData, setYearlyData] = useState<Payload | null>(null);
  const [yearlyLineData, setYearlyLineData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [boundary, setBoundary] = useState<Boundary | undefined>();
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [lineYear, setLineYear] = useState(initialYear);
  const [lineMonth, setLineMonth] = useState(initialMonth);
  const [yearlyYear, setYearlyYear] = useState(initialYear);
  const [yearlyLineYear, setYearlyLineYear] = useState(initialYear);
  const mapRequest = useRef(0), lineRequest = useRef(0), yearlyRequest = useRef(0), yearlyLineRequest = useRef(0);
  const load = useCallback(async (selectedYear: number, selectedMonth: number) => { const request = ++mapRequest.current; await Promise.resolve(); setLoading(true); setData(null); try { const response = await fetch(`/api/aqi/districts?year=${selectedYear}&month=${selectedMonth}`, { cache: "no-store" }); const payload = await response.json() as Payload; if (request === mapRequest.current) setData(payload); } catch { if (request === mapRequest.current) setData({ readings: [], collectionWarning: "Unable to contact the district AQI service." }); } finally { if (request === mapRequest.current) setLoading(false); } }, []);
  const loadLine = useCallback(async (selectedYear: number, selectedMonth: number) => { const request = ++lineRequest.current; await Promise.resolve(); setLineData(null); try { const response = await fetch(`/api/aqi/districts?collect=0&year=${selectedYear}&month=${selectedMonth}`, { cache: "no-store" }); const payload = await response.json() as Payload; if (request === lineRequest.current) setLineData(payload); } catch { if (request === lineRequest.current) setLineData({ readings: [] }); } }, []);
  const loadYearly = useCallback(async (selectedYear: number) => { const request = ++yearlyRequest.current; await Promise.resolve(); setYearlyData(null); try { const response = await fetch(`/api/aqi/districts?scope=year&year=${selectedYear}`, { cache: "no-store" }); const payload = await response.json() as Payload; if (request === yearlyRequest.current) setYearlyData(payload); } catch { if (request === yearlyRequest.current) setYearlyData({ readings: [] }); } }, []);
  const loadYearlyLine = useCallback(async (selectedYear: number) => { const request = ++yearlyLineRequest.current; await Promise.resolve(); setYearlyLineData(null); try { const response = await fetch(`/api/aqi/districts?scope=year&year=${selectedYear}`, { cache: "no-store" }); const payload = await response.json() as Payload; if (request === yearlyLineRequest.current) setYearlyLineData(payload); } catch { if (request === yearlyLineRequest.current) setYearlyLineData({ readings: [] }); } }, []);
  useEffect(() => { let cancelled = false; const timer = window.setTimeout(() => { void load(initialYear, initialMonth); void loadLine(initialYear, initialMonth); void loadYearly(initialYear); void loadYearlyLine(initialYear); }, 0); async function loadBoundary() { try { const response = await fetch("/api/aqi/districts/boundary"); const payload = response.ok ? await response.json() as Boundary : undefined; if (!cancelled) setBoundary(payload); } catch { /* The maps keep their loading placeholder when the boundary is unavailable. */ } } void loadBoundary(); return () => { cancelled = true; window.clearTimeout(timer); }; }, [load, loadLine, loadYearly, loadYearlyLine]);
  useEffect(() => { const timer = window.setInterval(() => { void load(year, month); void loadLine(lineYear, lineMonth); void loadYearly(yearlyYear); void loadYearlyLine(yearlyLineYear); }, 60 * 60_000); return () => window.clearInterval(timer); }, [lineMonth, lineYear, load, loadLine, loadYearly, loadYearlyLine, month, year, yearlyLineYear, yearlyYear]);
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
  const yearlyReadings = useMemo(() => yearlyData?.readings ?? [], [yearlyData?.readings]);
  const yearlyNational = yearlyReadings.filter(r=>r.usAqi!==null).reduce((sum,row)=>sum+(row.usAqi ?? 0),0) / Math.max(1,yearlyReadings.filter(r=>r.usAqi!==null).length);
  const yearlyLineReadings = useMemo(() => yearlyLineData?.readings ?? [], [yearlyLineData?.readings]);
  const yearlyLineNational = yearlyLineReadings.filter(r=>r.usAqi!==null).reduce((sum,row)=>sum+(row.usAqi ?? 0),0) / Math.max(1,yearlyLineReadings.filter(r=>r.usAqi!==null).length);
  return <main className="min-h-screen bg-[#f4f8f8] text-slate-900"><header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-sm"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 lg:px-8"><Link suppressHydrationWarning href="/"><Image src="/fa.png" alt="IELTS Logo" width={58} height={58} className="rounded-full" unoptimized /></Link><Navbar /></div></header>
    <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10"><section className="relative overflow-hidden rounded-[2rem] bg-[#062c30] p-7 text-white shadow-xl md:p-10"><div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl"/><div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-black uppercase tracking-[.24em] text-cyan-300">Bangladesh · District air</p><h1 className="mt-3 text-4xl font-black md:text-5xl">64-District AQI Atlas</h1><p className="mt-3 text-sm text-cyan-50/70">Monthly maximum air quality patterns and comparisons across every district.</p></div><div className="grid grid-cols-3 gap-3"><Link suppressHydrationWarning href="/personal/aqi" className="flex h-[76px] min-w-[132px] flex-col justify-center rounded-2xl border border-white/15 bg-white/10 px-5 transition hover:bg-white/15"><span className="text-[10px] font-bold uppercase tracking-wider text-cyan-100/60">Explore</span><strong className="mt-1 whitespace-nowrap text-lg">10 campuses</strong></Link><div className="flex h-[76px] min-w-[132px] flex-col justify-center rounded-2xl border border-white/15 bg-white/10 px-5"><p className="text-[10px] font-bold uppercase tracking-wider text-cyan-100/60">Coverage</p><p className="mt-1 whitespace-nowrap text-lg font-black">64 districts</p></div><button onClick={() => void load(year, month)} disabled={loading} className="flex h-[76px] min-w-[132px] flex-col justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/15 px-5 text-left transition hover:bg-cyan-300/25 disabled:cursor-wait disabled:opacity-60"><span className="text-[10px] font-bold uppercase tracking-wider text-cyan-100/60">Latest data</span><strong className="mt-1 text-lg">{loading ? "Updating…" : "Refresh"}</strong></button></div></div></section>
    {data?.collectionWarning ? <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-900">{data.collectionWarning}</div> : null}
    {data?.error ? <div className="mt-6 rounded-2xl bg-rose-50 p-6 text-rose-700">{data.error}</div> : <><section className="mt-6 grid gap-6 lg:grid-cols-2"><article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-col gap-3"><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-wider text-cyan-700">Monthly spatial distribution</p><h2 className="mt-1 whitespace-nowrap text-xl font-black lg:text-[22px]">{mapTitle}</h2></div><span className="shrink-0 rounded-lg bg-slate-100 px-3 py-2 text-xs font-black text-slate-700">Mean AQI {Math.round(national)}</span></div><div className="flex flex-nowrap items-center gap-2"><select aria-label="Map month" value={month} onChange={(event) => { const value = Number(event.target.value); setMonth(value); void load(year, value); }} className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold">{monthNames.map((name, index) => <option key={name} value={index + 1}>{name}</option>)}</select><select aria-label="Map year" value={year} onChange={(event) => { const value = Number(event.target.value); setYear(value); void load(value, month); }} className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold">{availableYears.map((value) => <option key={value} value={value}>{value}</option>)}</select><button type="button" onClick={() => downloadDistrictMap(mapTitle, national)} disabled={!boundary} className="shrink-0 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-cyan-800 hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-40">PNG</button></div></div><BangladeshContour readings={readings} boundary={boundary}/><div className="flex flex-wrap justify-center gap-3 text-[10px] font-bold">{[["Good","#22c55e"],["Moderate","#84cc16"],["Sensitive","#f59e0b"],["Unhealthy","#ef4444"],["Very unhealthy","#a855f7"]].map(([label,color])=><span key={label} className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-full" style={{background:color}}/>{label}</span>)}</div></article>
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-col gap-3"><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-wider text-cyan-700">Monthly spatial distribution</p><h2 className="mt-1 whitespace-nowrap text-xl font-black lg:text-[22px]">Bangladesh AQI · {linePeriodLabel}</h2></div><span className="shrink-0 rounded-lg bg-slate-100 px-3 py-2 text-xs font-black text-slate-700">Mean AQI {Math.round(lineNational)}</span></div><div className="flex flex-nowrap items-center gap-2"><select aria-label="Line contour month" value={lineMonth} onChange={(event) => { const value = Number(event.target.value); setLineMonth(value); void loadLine(lineYear, value); }} className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold">{monthNames.map((name, index) => <option key={name} value={index + 1}>{name}</option>)}</select><select aria-label="Line contour year" value={lineYear} onChange={(event) => { const value = Number(event.target.value); setLineYear(value); void loadLine(value, lineMonth); }} className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold">{lineAvailableYears.map((value) => <option key={value} value={value}>{value}</option>)}</select><button type="button" onClick={() => downloadDistrictMap(`Bangladesh AQI · ${linePeriodLabel}`, lineNational, "district-aqi-line-map", true)} disabled={!boundary} className="shrink-0 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-cyan-800 hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-40">PNG</button></div></div><BangladeshLineContour readings={lineReadings} boundary={boundary}/><div className="flex flex-wrap justify-center gap-4 text-xs font-bold">{[["50","#22c55e"],["100","#84cc16"],["150","#f59e0b"],["200","#ef4444"],["300","#a855f7"]].map(([label,color])=><span key={label} className="flex items-center gap-2"><i className="h-0.5 w-6" style={{background:color}}/>AQI {label}</span>)}</div></article></section>
      <YearlyPeakMaps boundary={boundary} years={archiveYears} mapYear={yearlyYear} lineYear={yearlyLineYear} mapReadings={yearlyReadings} lineReadings={yearlyLineReadings} mapMean={yearlyNational} lineMean={yearlyLineNational} onMapYearChange={(value) => { setYearlyYear(value); void loadYearly(value); }} onLineYearChange={(value) => { setYearlyLineYear(value); void loadYearlyLine(value); }}/>
      <DescriptiveStatistics boundary={boundary}/>
      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-wider text-cyan-700">District directory</p><h2 className="mt-1 text-2xl font-black">All 64 districts</h2></div><button type="button" aria-expanded={directoryOpen} aria-controls="district-directory-list" onClick={() => setDirectoryOpen((open) => !open)} className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-100">{directoryOpen ? "Minimize" : "Show districts"} <span aria-hidden="true">{directoryOpen ? "−" : "+"}</span></button></div>{directoryOpen ? <div id="district-directory-list"><div className="mt-5 flex justify-end"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search district or division" className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm sm:w-72"/></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{filtered.map(row=><button key={row.id} onClick={()=>setSelected(row.id)} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-left"><span><b className="text-sm">{row.name}</b><small className="block text-slate-400">{row.division}</small></span><strong style={{color:colorFor(row.usAqi)}}>{row.usAqi===null?"—":Math.round(row.usAqi)}</strong></button>)}</div></div> : null}</section></>}</div></main>;
}
