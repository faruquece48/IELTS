"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { describeAqi, pollutantDefinitions, type AqiReading, type Campus, type DailyAqi } from "@/lib/aqi";

type TimelinePoint = { time: string; usAqi: number | null; pm25: number | null; pm10: number | null; carbonMonoxide?: number | null; carbonDioxide?: number | null; nitrogenDioxide?: number | null; sulphurDioxide?: number | null; ozone?: number | null };
type AqiData = {
  error?: string;
  source?: string;
  generatedAt?: string;
  campuses?: Campus[];
  readings?: AqiReading[];
  selectedCampus?: Campus;
  history?: TimelinePoint[];
  timeline?: TimelinePoint[];
  dailyHistory?: DailyAqi[];
  archiveStart?: string;
  backfill?: { status: string; saved: number };
};

const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

function niceAxisStep(value: number) {
  if (!Number.isFinite(value) || value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;
  const rounded = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return rounded * magnitude;
}

function downloadChartPng(chartId: string, filename: string, options?: { title?: string; unit?: string; legend?: Array<{ label: string; color: string }> }) {
  const container = document.getElementById(chartId);
  const source = container instanceof SVGSVGElement ? container : container?.querySelector("svg") ?? null;
  if (!source) return;
  const clone = source.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const sourceElements = [source, ...Array.from(source.querySelectorAll("*"))];
  const clonedElements = [clone, ...Array.from(clone.querySelectorAll("*"))];
  sourceElements.forEach((element, index) => {
    const target = clonedElements[index] as SVGElement | undefined;
    if (!target) return;
    const style = window.getComputedStyle(element);
    target.style.fill = style.fill;
    target.style.stroke = style.stroke;
    target.style.fontFamily = style.fontFamily;
    target.style.fontSize = style.fontSize;
    target.style.fontWeight = style.fontWeight;
    target.style.opacity = style.opacity;
  });
  const viewBox = source.viewBox.baseVal;
  const width = viewBox.width || source.clientWidth;
  const chartHeight = viewBox.height || source.clientHeight;
  const headerHeight = options?.title ? 72 : 0;
  const height = chartHeight + headerHeight;
  const namespace = "http://www.w3.org/2000/svg";
  const exportSvg = document.createElementNS(namespace, "svg");
  exportSvg.setAttribute("xmlns", namespace);
  exportSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  exportSvg.setAttribute("width", String(width));
  exportSvg.setAttribute("height", String(height));
  const background = document.createElementNS(namespace, "rect");
  background.setAttribute("x", "1");
  background.setAttribute("y", "1");
  background.setAttribute("width", String(width - 2));
  background.setAttribute("height", String(height - 2));
  background.setAttribute("rx", "0");
  background.setAttribute("fill", "#ffffff");
  background.setAttribute("stroke", "#dbe4ea");
  exportSvg.appendChild(background);
  if (options?.title) {
    const title = document.createElementNS(namespace, "text");
    title.setAttribute("x", "18");
    title.setAttribute("y", "27");
    title.setAttribute("fill", "#0f172a");
    title.setAttribute("font-family", "Arial, sans-serif");
    title.setAttribute("font-size", "17");
    title.setAttribute("font-weight", "800");
    title.textContent = options.title;
    exportSvg.appendChild(title);
    let legendX = 18;
    (options.legend ?? []).forEach((item) => {
      const marker = document.createElementNS(namespace, "circle");
      marker.setAttribute("cx", String(legendX + 4));
      marker.setAttribute("cy", "49");
      marker.setAttribute("r", "4");
      marker.setAttribute("fill", item.color);
      exportSvg.appendChild(marker);
      const label = document.createElementNS(namespace, "text");
      label.setAttribute("x", String(legendX + 12));
      label.setAttribute("y", "53");
      label.setAttribute("fill", item.color);
      label.setAttribute("font-family", "Arial, sans-serif");
      label.setAttribute("font-size", "11");
      label.setAttribute("font-weight", "700");
      label.textContent = item.label;
      exportSvg.appendChild(label);
      legendX += item.label.length * 7 + 28;
    });
    if (options.unit) {
      const unit = document.createElementNS(namespace, "text");
      unit.setAttribute("x", String(legendX));
      unit.setAttribute("y", "53");
      unit.setAttribute("fill", "#94a3b8");
      unit.setAttribute("font-family", "Arial, sans-serif");
      unit.setAttribute("font-size", "11");
      unit.textContent = options.unit;
      exportSvg.appendChild(unit);
    }
  }
  clone.setAttribute("x", "0");
  clone.setAttribute("y", String(headerHeight));
  clone.setAttribute("width", String(width));
  clone.setAttribute("height", String(chartHeight));
  exportSvg.appendChild(clone);
  const svgUrl = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(exportSvg)], { type: "image/svg+xml;charset=utf-8" }));
  const image = new window.Image();
  image.onload = () => {
    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;
    const context = canvas.getContext("2d");
    if (!context) return URL.revokeObjectURL(svgUrl);
    context.scale(scale, scale);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    canvas.toBlob((blob) => {
      URL.revokeObjectURL(svgUrl);
      if (!blob) return;
      const pngUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(pngUrl);
    }, "image/png");
  };
  image.onerror = () => URL.revokeObjectURL(svgUrl);
  image.src = svgUrl;
}

function AqiChart({ points, forecast = false, chartId }: { points: TimelinePoint[]; forecast?: boolean; chartId: string }) {
  const usable = points.filter((point): point is TimelinePoint & { usAqi: number } => point.usAqi !== null && Number.isFinite(point.usAqi));
  const [hovered, setHovered] = useState<(TimelinePoint & { usAqi: number }) | null>(null);
  if (usable.length < 2) return <div className="grid min-h-80 place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm font-semibold text-slate-400">History will appear after another scheduled collection.</div>;

  const times = usable.map((point) => Date.parse(point.time));
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const values = usable.map((point) => point.usAqi);
  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);
  const dataRange = Math.max(dataMax - dataMin, Math.max(dataMax * 0.08, 5));
  const axisStep = niceAxisStep(dataRange / 4);
  const axisMin = Math.max(0, Math.floor((dataMin - axisStep) / axisStep) * axisStep);
  const axisMax = Math.ceil((dataMax + axisStep) / axisStep) * axisStep;
  const axisRange = Math.max(axisMax - axisMin, axisStep);
  const plotHeight = 300;
  const path = usable.map((point, index) => {
    const x = ((Date.parse(point.time) - minTime) / (maxTime - minTime || 1)) * 700;
    const y = plotHeight - ((point.usAqi - axisMin) / axisRange) * 270;
    return `${index ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const ticks = Array.from({ length: 5 }, (_, index) => minTime + ((maxTime - minTime) * index) / 4);
  const yTicks = Array.from({ length: Math.round(axisRange / axisStep) + 1 }, (_, index) => axisMin + index * axisStep);

  const move = (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const target = minTime + Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)) * (maxTime - minTime);
    setHovered(usable.reduce((best, point) => Math.abs(Date.parse(point.time) - target) < Math.abs(Date.parse(best.time) - target) ? point : best));
  };

  return (
    <div>
      <svg id={chartId} viewBox="0 0 780 400" className="h-auto w-full touch-none overflow-visible" role="img" aria-label={`${forecast ? "Forecast" : "Historical"} US AQI chart`} onPointerMove={move} onPointerLeave={() => setHovered(null)}>
        <g transform="translate(55 18)">
          {yTicks.map((tick) => { const y = plotHeight - ((tick - axisMin) / axisRange) * 270; return <g key={tick}><line x1="0" x2="700" y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="4 6" /><text x="-10" y={y + 4} textAnchor="end" className="fill-slate-500 text-[11px] font-semibold">{number.format(tick)}</text></g>; })}
          {ticks.map((tick) => { const x = ((tick - minTime) / (maxTime - minTime || 1)) * 700; return <text key={tick} x={x} y="333" textAnchor="middle" className="fill-slate-500 text-[10px] font-semibold">{new Date(tick).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</text>; })}
          <path d={path} fill="none" stroke="#0891b2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <rect width="700" height={plotHeight} fill="transparent" />
          {hovered ? (() => {
            const x = ((Date.parse(hovered.time) - minTime) / (maxTime - minTime || 1)) * 700;
            const y = plotHeight - ((hovered.usAqi - axisMin) / axisRange) * 270;
            return <g className="pointer-events-none"><line x1={x} x2={x} y1="0" y2={plotHeight} stroke="#64748b" strokeDasharray="4 4" /><circle cx={x} cy={y} r="6" fill="white" stroke="#0891b2" strokeWidth="4" /><g transform={`translate(${Math.max(0, Math.min(560, x - 70))} ${Math.max(0, y - 52)})`}><rect width="140" height="42" rx="9" fill="#0f172a" /><text x="70" y="17" textAnchor="middle" className="fill-white text-[10px] font-bold">AQI {Math.round(hovered.usAqi)}</text><text x="70" y="32" textAnchor="middle" className="fill-slate-300 text-[9px]">{new Date(hovered.time).toLocaleString()}</text></g></g>;
          })() : null}
          <text x="350" y="378" textAnchor="middle" className="fill-slate-800 text-[11px] font-bold">Time · Asia/Dhaka</text>
        </g>
      </svg>
    </div>
  );
}

function DailyRangeChart({ rows, pollutant }: { rows: DailyAqi[]; pollutant: (typeof pollutantDefinitions)[number] }) {
  const minKey = pollutant.minKey as keyof DailyAqi;
  const maxKey = pollutant.maxKey as keyof DailyAqi;
  const usable = rows.flatMap((row) => {
    const minimum = row[minKey];
    const maximum = row[maxKey];
    return typeof minimum === "number" && typeof maximum === "number" ? [{ row, minimum, maximum }] : [];
  });
  const [hovered, setHovered] = useState<(typeof usable)[number] | null>(null);
  if (usable.length < 2) return <div className="grid h-52 place-items-center rounded-2xl bg-slate-50 text-center text-xs font-semibold text-slate-400">Backfilling this campus from September 2022…</div>;
  const minTime = Date.parse(`${usable[0].row.date}T00:00:00+06:00`);
  const maxTime = Date.parse(`${usable.at(-1)!.row.date}T00:00:00+06:00`);
  const values = usable.flatMap((point) => [point.minimum, point.maximum]);
  const low = Math.min(...values);
  const high = Math.max(...values);
  const padding = Math.max((high - low) * 0.08, 1);
  const yMin = Math.max(0, low - padding);
  const yMax = high + padding;
  const line = (key: "minimum" | "maximum") => usable.map((point, index) => {
    const time = Date.parse(`${point.row.date}T00:00:00+06:00`);
    const x = ((time - minTime) / (maxTime - minTime || 1)) * 620;
    const y = 165 - ((point[key] - yMin) / (yMax - yMin || 1)) * 145;
    return `${index ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const move = (event: React.PointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const target = minTime + Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)) * (maxTime - minTime);
    setHovered(usable.reduce((best, point) => Math.abs(Date.parse(`${point.row.date}T00:00:00+06:00`) - target) < Math.abs(Date.parse(`${best.row.date}T00:00:00+06:00`) - target) ? point : best));
  };
  const ticks = Array.from({ length: 4 }, (_, index) => minTime + ((maxTime - minTime) * index) / 3);
  return <svg viewBox="0 0 690 230" className="h-52 w-full touch-none" onPointerMove={move} onPointerLeave={() => setHovered(null)} role="img" aria-label={`${pollutant.label} daily minimum and maximum chart`}><g transform="translate(48 14)">{[0, 1, 2, 3].map((index) => { const value = yMin + ((yMax - yMin) * index) / 3; return <g key={index}><line x1="0" x2="620" y1={165 - index * 48.3} y2={165 - index * 48.3} stroke="#e2e8f0" strokeDasharray="4 5" /><text x="-8" y={169 - index * 48.3} textAnchor="end" className="fill-slate-500 text-[9px] font-semibold">{number.format(value)}</text></g>; })}{ticks.map((tick) => { const x = ((tick - minTime) / (maxTime - minTime || 1)) * 620; return <text key={tick} x={x} y="190" textAnchor="middle" className="fill-slate-500 text-[9px] font-semibold">{new Date(tick).toLocaleDateString([], { month: "short", year: "2-digit" })}</text>; })}<path d={line("minimum")} fill="none" stroke="#f59e0b" strokeWidth="2" /><path d={line("maximum")} fill="none" stroke="#0891b2" strokeWidth="2.5" /><rect width="620" height="165" fill="transparent" />{hovered ? (() => { const time = Date.parse(`${hovered.row.date}T00:00:00+06:00`); const x = ((time - minTime) / (maxTime - minTime || 1)) * 620; return <g className="pointer-events-none"><line x1={x} x2={x} y1="0" y2="165" stroke="#64748b" strokeDasharray="3 3" /><g transform={`translate(${Math.max(0, Math.min(470, x - 75))} 4)`}><rect width="150" height="50" rx="8" fill="#0f172a" /><text x="75" y="15" textAnchor="middle" className="fill-white text-[9px] font-bold">{hovered.row.date}</text><text x="75" y="29" textAnchor="middle" className="fill-amber-300 text-[9px]">Min {number.format(hovered.minimum)} {pollutant.unit}</text><text x="75" y="42" textAnchor="middle" className="fill-cyan-300 text-[9px]">Max {number.format(hovered.maximum)} {pollutant.unit}</text></g></g>; })() : null}</g></svg>;
}

export default function AqiDashboard() {
  const [data, setData] = useState<AqiData | null>(null);
  const [selectedId, setSelectedId] = useState("du");
  const [district, setDistrict] = useState("All districts");
  const [query, setQuery] = useState("");
  const [chartMode, setChartMode] = useState<"history" | "forecast">("forecast");
  const [researchDays, setResearchDays] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (campusId: string, quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const response = await fetch(`/api/aqi?campus=${encodeURIComponent(campusId)}`, { cache: "no-store" });
      const payload = await response.json() as AqiData;
      setData(payload);
    } catch {
      setData({ error: "Unable to contact the campus air-quality service." });
    } finally {
      if (!quiet) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadInitialCampus() {
      setLoading(true);
      try {
        const response = await fetch("/api/aqi?campus=du", { cache: "no-store" });
        const payload = await response.json() as AqiData;
        if (!cancelled) setData(payload);
      } catch {
        if (!cancelled) setData({ error: "Unable to contact the campus air-quality service." });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void loadInitialCampus();
    return () => { cancelled = true; };
  }, []);
  useEffect(() => {
    const timer = window.setInterval(() => { void load(selectedId, true); }, 15 * 60_000);
    return () => window.clearInterval(timer);
  }, [load, selectedId]);

  const readingMap = useMemo(() => new Map((data?.readings ?? []).map((reading) => [reading.campusId, reading])), [data?.readings]);
  const selected = data?.selectedCampus;
  const selectedReading = selected ? readingMap.get(selected.id) : undefined;
  const status = describeAqi(selectedReading?.usAqi ?? null);
  const districts = useMemo(() => ["All districts", ...new Set((data?.campuses ?? []).map((campus) => campus.district).sort())], [data?.campuses]);
  const visibleCampuses = useMemo(() => (data?.campuses ?? []).filter((campus) => {
    const matchesDistrict = district === "All districts" || campus.district === district;
    const text = `${campus.name} ${campus.shortName} ${campus.district}`.toLowerCase();
    return matchesDistrict && text.includes(query.trim().toLowerCase());
  }), [data?.campuses, district, query]);
  const referenceTime = data?.generatedAt ? Date.parse(data.generatedAt) : 0;
  const forecastPoints = (data?.timeline ?? []).filter((point) => Date.parse(point.time) >= referenceTime - 60 * 60_000);
  const chartPoints = chartMode === "history" ? data?.history ?? [] : forecastPoints;
  const dailyHistory = useMemo(() => {
    if (!researchDays) return data?.dailyHistory ?? [];
    const cutoff = referenceTime - researchDays * 24 * 60 * 60_000;
    return (data?.dailyHistory ?? []).filter((row) => Date.parse(`${row.date}T00:00:00+06:00`) >= cutoff);
  }, [data?.dailyHistory, referenceTime, researchDays]);

  return (
    <main className="min-h-screen bg-[#f4f8f8] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 lg:px-8"><Link href="/" aria-label="Home"><Image src="/fa.png" alt="IELTS Logo" width={58} height={58} className="rounded-full" unoptimized /></Link><Navbar /></div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
        <section className="relative overflow-hidden rounded-[2rem] bg-[#062c30] p-7 text-white shadow-xl md:p-10">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div><p className="text-xs font-black uppercase tracking-[.24em] text-cyan-300">Bangladesh · Campus air</p><h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">University AQI Monitor</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-cyan-50/70">Live modeled air quality and hourly outlook for major university campuses across Bangladesh.</p></div>
            <div className="flex flex-wrap gap-3"><div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3"><p className="text-[10px] font-bold uppercase tracking-wider text-cyan-100/60">Coverage</p><p className="mt-1 text-xl font-black">{data?.campuses?.length ?? 32} campuses</p></div><Link href="/personal/aqi/districts" className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15"><span className="block text-[10px] uppercase text-cyan-100/60">National atlas</span><span className="mt-1 block text-xl">64 districts</span></Link><button type="button" onClick={() => void load(selectedId)} disabled={loading} className="rounded-2xl border border-white/15 bg-white px-5 py-3 text-sm font-black text-[#062c30] transition hover:bg-cyan-50 disabled:opacity-60">{loading ? "Updating…" : "Refresh"}</button></div>
          </div>
        </section>

        {data?.error ? <section className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-7"><p className="text-sm font-black text-rose-700">AQI data unavailable</p><p className="mt-2 text-sm text-rose-600">{data.error}</p></section> : (
          <>
            <section className="mt-6 grid items-stretch gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(340px,1fr)]">
              <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-wider text-cyan-700">Selected campus</p><h2 className="mt-1 text-2xl font-black">AQI timeline</h2></div><div className="flex flex-wrap items-center gap-2"><div className="flex rounded-xl bg-slate-100 p-1">{(["history", "forecast"] as const).map((mode) => <button key={mode} type="button" onClick={() => setChartMode(mode)} className={`rounded-lg px-3 py-2 text-xs font-black capitalize transition ${chartMode === mode ? "bg-white text-cyan-800 shadow-sm" : "text-slate-500"}`}>{mode === "forecast" ? "72h outlook" : "Saved history"}</button>)}</div><button type="button" onClick={() => downloadChartPng("aqi-timeline-chart", `${selected?.shortName ?? "campus"}-aqi-${chartMode}.png`.toLowerCase(), { title: `${selected?.shortName ?? "Campus"} AQI timeline`, unit: "US AQI", legend: [{ label: chartMode === "forecast" ? "72-hour outlook" : "Saved history", color: "#0891b2" }] })} className="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-cyan-800 hover:bg-cyan-100">PNG</button></div></div>
                <div className="mt-5"><AqiChart chartId="aqi-timeline-chart" points={chartPoints} forecast={chartMode === "forecast"} /></div>
              </div>

              <aside className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-[#d4d9d7] bg-gradient-to-br from-[#f1f3f2] via-[#e7eae8] to-[#dce1df] p-5 text-slate-900 shadow-sm" style={{ borderTopColor: status.color, borderTopWidth: 4 }}>
                <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-white/50 blur-3xl" />
                <div className="flex items-start justify-between gap-4">
                  <div className="relative"><p className="text-[11px] font-black uppercase tracking-wider text-slate-500">Health guidance</p><h2 className="mt-1 text-xl font-black" style={{ color: status.color }}>{status.label}</h2></div>
                  <div className="relative rounded-xl border border-white/70 bg-white/55 px-2.5 py-1.5 text-right shadow-sm"><p className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Observed</p><p className="mt-0.5 text-[11px] font-black text-slate-800">{selectedReading?.observedAt ? new Date(selectedReading.observedAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}</p></div>
                </div>
                <p className="relative mt-3 text-xs leading-5 text-slate-600">{status.advice}</p>
                <div className="relative mt-4 grid grid-cols-2 gap-2">
                  <SmallMetric label="US AQI" value={selectedReading?.usAqi} unit="AQI" />
                  <SmallMetric label="PM2.5" value={selectedReading?.pm25} />
                  <SmallMetric label="PM10" value={selectedReading?.pm10} />
                  <SmallMetric label="O₃" value={selectedReading?.ozone} />
                  <SmallMetric label="CO" value={selectedReading?.carbonMonoxide} />
                  <SmallMetric label="CO₂" value={selectedReading?.carbonDioxide} unit="ppm" />
                  <SmallMetric label="NO₂" value={selectedReading?.nitrogenDioxide} />
                  <SmallMetric label="SO₂" value={selectedReading?.sulphurDioxide} />
                </div>
                <p className="relative mt-auto border-t border-slate-300/80 pt-3 text-[10px] leading-4 text-slate-500">All values share the observation time shown above. CAMS provides regional modeled conditions, not an on-campus regulatory measurement.</p>
              </aside>
            </section>

            <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between"><div><p className="text-xs font-black uppercase tracking-wider text-cyan-700">Research archive</p><h2 className="mt-1 text-2xl font-black">Daily pollutant minimum and maximum</h2><p className="mt-2 text-xs text-slate-500">CAMS Global archive begins September 2022. Saved coverage grows automatically and new daily values remain in Neon.</p></div><div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">{[{ label: "30D", days: 30 }, { label: "1Y", days: 365 }, { label: "3Y", days: 1095 }, { label: "5Y", days: 1825 }, { label: "Max", days: 0 }].map((range) => <button key={range.label} type="button" onClick={() => setResearchDays(range.days)} className={`rounded-lg px-3 py-2 text-xs font-black transition ${researchDays === range.days ? "bg-white text-cyan-800 shadow-sm" : "text-slate-500"}`}>{range.label}</button>)}</div></div>
              {data?.backfill && data.backfill.status !== "complete" ? <p className="mt-4 rounded-xl bg-cyan-50 px-4 py-3 text-xs font-semibold text-cyan-800">Archive sync: saved {data.backfill.saved} days from {data.backfill.status.replace(":", " to ")}. Refreshing advances the selected campus by another year.</p> : null}
              <div className="mt-6 grid gap-5 xl:grid-cols-2">{pollutantDefinitions.map((pollutant) => <article id={`pollutant-chart-${pollutant.id}`} key={pollutant.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="text-base font-black">{pollutant.label}</h3><p className="mt-1 text-[11px] text-slate-400"><span className="font-bold text-amber-600">Minimum</span> · <span className="font-bold text-cyan-700">Maximum</span> · {pollutant.unit}</p></div><div className="flex shrink-0 gap-2"><button type="button" onClick={() => downloadChartPng(`pollutant-chart-${pollutant.id}`, `${selected?.shortName ?? "campus"}-${pollutant.id}-daily-min-max.png`.toLowerCase(), { title: pollutant.label, unit: pollutant.unit, legend: [{ label: "Minimum", color: "#f59e0b" }, { label: "Maximum", color: "#0891b2" }] })} className="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-cyan-800 hover:bg-cyan-100">PNG</button><a href={`/api/aqi/export?campus=${selectedId}&pollutant=${pollutant.id}&days=${researchDays}`} className="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-cyan-800 hover:bg-cyan-100">Excel</a></div></div><div className="mt-3"><DailyRangeChart rows={dailyHistory} pollutant={pollutant} /></div></article>)}</div>
            </section>

            <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-black uppercase tracking-wider text-cyan-700">National comparison</p><h2 className="mt-1 text-2xl font-black">Major university campuses</h2></div><div className="grid gap-3 sm:grid-cols-2"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search university or district" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/15" /><select value={district} onChange={(event) => setDistrict(event.target.value)} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold outline-none focus:border-cyan-600">{districts.map((item) => <option key={item}>{item}</option>)}</select></div></div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{visibleCampuses.map((campus) => {
                const reading = readingMap.get(campus.id);
                const campusStatus = describeAqi(reading?.usAqi ?? null);
                return <button key={campus.id} type="button" onClick={() => { setSelectedId(campus.id); void load(campus.id); window.scrollTo({ top: 0, behavior: "smooth" }); }} className={`flex items-center justify-between gap-4 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${selectedId === campus.id ? "border-cyan-600 ring-2 ring-cyan-600/15" : "border-slate-200"}`}><div className="min-w-0"><p className="truncate text-sm font-black">{campus.shortName} <span className="font-medium text-slate-400">· {campus.district}</span></p><p className="mt-1 truncate text-xs text-slate-500">{campus.name}</p><span className="mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-black" style={{ color: campusStatus.color, background: campusStatus.background }}>{campusStatus.label}</span></div><p className="shrink-0 text-2xl font-black" style={{ color: campusStatus.color }}>{reading?.usAqi === null || reading?.usAqi === undefined ? "—" : Math.round(reading.usAqi)}</p></button>;
              })}</div>
            </section>

            <p className="mt-6 text-center text-[11px] leading-5 text-slate-500">Source: {data?.source ?? "Open-Meteo CAMS Global"}. Automatically refreshed every 15 minutes while open; scheduled collection persists observations in Neon.</p>
          </>
        )}
      </div>
    </main>
  );
}

function SmallMetric({ label, value, text, unit = "µg/m³" }: { label: string; value?: number | null; text?: string; unit?: string }) {
  return <div className="min-w-0 rounded-xl border border-white/80 bg-white/55 p-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"><p className="text-[9px] font-bold uppercase text-slate-500">{label}</p><p className="mt-0.5 whitespace-nowrap text-xs font-black text-slate-900">{text ?? (value === null || value === undefined ? "—" : `${number.format(value)} ${unit}`)}</p></div>;
}

