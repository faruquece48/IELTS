"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";

type Point = { time: string; value: number };
type ForecastPoint = Point & { low: number; high: number };
type GoldData = {
  error?: string;
  currentUsd?: number;
  updatedAt?: string;
  source?: string;
  history?: Point[];
  liveHistory?: Point[];
  storedCount?: number;
  historicalSource?: string;
  bhoriBdt?: number | null;
  bhoriGrams?: number;
  bangladeshUpdatedAt?: string | null;
};

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
const taka = new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 });
const timeframes = [
  { label: "15m", milliseconds: 15 * 60_000 },
  { label: "30m", milliseconds: 30 * 60_000 },
  { label: "1H", milliseconds: 60 * 60_000 },
  { label: "4H", milliseconds: 4 * 60 * 60_000 },
  { label: "12H", milliseconds: 12 * 60 * 60_000 },
  { label: "1D", milliseconds: 24 * 60 * 60_000 },
  { label: "1W", milliseconds: 7 * 24 * 60 * 60_000 },
] as const;
const yearRanges = [
  { label: "1 Year", milliseconds: 365 * 24 * 60 * 60_000 },
  { label: "2 Years", milliseconds: 730 * 24 * 60 * 60_000 },
  { label: "All Data", milliseconds: null },
] as const;
const validationRanges = [
  { label: "5m", observations: 5, source: "live" },
  { label: "15m", observations: 15, source: "live" },
  { label: "30m", observations: 30, source: "live" },
  { label: "1H", observations: 1, source: "hourly" },
  { label: "4H", observations: 4, source: "hourly" },
  { label: "12H", observations: 12, source: "hourly" },
  { label: "1D", observations: 24, source: "hourly" },
  { label: "3D", observations: 72, source: "hourly" },
  { label: "7D", observations: 168, source: "hourly" },
  { label: "30D", observations: 720, source: "hourly" },
] as const;
const forecastIntervals = [
  { label: "5m", milliseconds: 5 * 60_000 },
  { label: "15m", milliseconds: 15 * 60_000 },
  { label: "30m", milliseconds: 30 * 60_000 },
  { label: "1H", milliseconds: 60 * 60_000 },
  { label: "4H", milliseconds: 4 * 60 * 60_000 },
  { label: "12H", milliseconds: 12 * 60 * 60_000 },
  { label: "1D", milliseconds: 24 * 60 * 60_000 },
] as const;

function fitLine(values: number[]) {
  const n = values.length;
  const meanX = (n - 1) / 2;
  const meanY = values.reduce((sum, value) => sum + value, 0) / n;
  let numerator = 0;
  let denominator = 0;
  values.forEach((value, index) => {
    numerator += (index - meanX) * (value - meanY);
    denominator += (index - meanX) ** 2;
  });
  return { intercept: meanY - (denominator ? numerator / denominator : 0) * meanX, slope: denominator ? numerator / denominator : 0 };
}

function forecast(points: Point[], steps: number, intervalMs = 3_600_000, anchor?: Point): ForecastPoint[] {
  const sample = points.slice(-48);
  const values = sample.map((point) => point.value);
  const { intercept, slope } = fitLine(values);
  const fittedLast = intercept + slope * (values.length - 1);
  const forecastAnchor = anchor ?? sample.at(-1)!;
  const offset = forecastAnchor.value - fittedLast;
  const returns = values.slice(1).map((value, index) => value - values[index]);
  const volatility = Math.sqrt(returns.reduce((sum, value) => sum + value ** 2, 0) / Math.max(1, returns.length));
  const latestTime = Date.parse(forecastAnchor.time);
  const start = Math.floor(latestTime / intervalMs) * intervalMs;

  return Array.from({ length: steps }, (_, index) => {
    const step = (index + 1) * intervalMs / 3_600_000;
    const value = intercept + slope * (values.length - 1 + step) + offset * Math.exp(-step / 12);
    const band = Math.max(volatility * Math.sqrt(step) * 1.65, value * 0.0015);
    return { time: new Date(start + (index + 1) * intervalMs).toISOString(), value, low: value - band, high: value + band };
  });
}

function buildBacktest(points: Point[], requestedObservations: number, maximumGapMs: number) {
  const start = Math.max(24, points.length - requestedObservations - 1);
  const rows = points.slice(start).flatMap((point, offset) => {
    const index = start + offset;
    const previous = points[index - 1];
    if (!previous || Date.parse(point.time) - Date.parse(previous.time) > maximumGapMs) return [];
    const predicted = forecast(points.slice(0, index), 1)[0];
    return predicted ? [{ time: point.time, actual: point.value, forecast: predicted.value, previous: previous.value }] : [];
  });
  const mae = rows.reduce((sum, row) => sum + Math.abs(row.actual - row.forecast), 0) / rows.length;
  const mape = rows.reduce((sum, row) => sum + Math.abs((row.actual - row.forecast) / row.actual), 0) / rows.length * 100;
  const directionAccuracy = rows.filter((row) => Math.sign(row.actual - row.previous) === Math.sign(row.forecast - row.previous)).length / rows.length * 100;
  return { rows, mae, mape, directionAccuracy };
}

function path(points: Point[], width: number, height: number, min: number, max: number, minTime: number, maxTime: number) {
  const range = max - min || 1;
  const timeRange = maxTime - minTime || 1;
  return points.map((point, index) => {
    const x = ((Date.parse(point.time) - minTime) / timeRange) * width;
    const y = height - ((point.value - min) / range) * height;
    return `${index ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

function LineChart({ series, labels, tickIntervalMs }: { series: Array<{ name: string; color: string; points: Point[] }>; labels?: boolean; tickIntervalMs?: number }) {
  const [hovered, setHovered] = useState<{ point: Point; color: string; x: number; y: number } | null>(null);
  const values = series.flatMap((item) => item.points.map((point) => point.value));
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const padding = Math.max((maximum - minimum) * 0.12, maximum * 0.001);
  const min = minimum - padding;
  const max = maximum + padding;
  const times = series.flatMap((item) => item.points.map((point) => Date.parse(point.time)));
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const duration = maxTime - minTime;
  const formatTime = (time: number) => new Intl.DateTimeFormat(undefined, duration > 86_400_000
    ? { month: "short", day: "numeric" }
    : { hour: "2-digit", minute: "2-digit" }).format(time);
  const yTicks = Array.from({ length: 5 }, (_, index) => min + ((max - min) * index) / 4);
  const xTicks = (() => {
    if (duration > 48 * 60 * 60_000) {
      return Array.from({ length: 5 }, (_, index) => minTime + (duration * index) / 4);
    }

    const intervals = [60_000, 2 * 60_000, 5 * 60_000, 10 * 60_000, 15 * 60_000, 30 * 60_000, 60 * 60_000, 2 * 60 * 60_000, 3 * 60 * 60_000, 4 * 60 * 60_000, 6 * 60 * 60_000, 12 * 60 * 60_000];
    const interval = tickIntervalMs ?? intervals.find((value) => value >= duration / 8) ?? 12 * 60 * 60_000;
    const firstTick = Math.ceil(minTime / interval) * interval;
    const ticks: number[] = [];
    for (let tick = firstTick; tick <= maxTime; tick += interval) ticks.push(tick);
    return ticks;
  })();
  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const viewBoxX = ((event.clientX - bounds.left) / bounds.width) * 800;
    const plotX = Math.min(708, Math.max(0, viewBoxX - 72));
    const targetTime = minTime + (plotX / 708) * (maxTime - minTime);
    const closest = series
      .flatMap((item) => item.points.map((point) => ({ point, color: item.color })))
      .reduce((best, candidate) => Math.abs(Date.parse(candidate.point.time) - targetTime) < Math.abs(Date.parse(best.point.time) - targetTime) ? candidate : best);
    const x = ((Date.parse(closest.point.time) - minTime) / (maxTime - minTime || 1)) * 708;
    const y = 220 - ((closest.point.value - min) / (max - min || 1)) * 220;
    setHovered({ ...closest, x, y });
  };

  return (
    <div>
      <svg viewBox="0 0 800 320" role="img" aria-label={`Time versus price: ${series.map((item) => item.name).join(" and ")}`} className="h-72 w-full overflow-visible touch-none" onPointerMove={handlePointerMove} onPointerLeave={() => setHovered(null)}>
        <g transform="translate(72 22)">
          {yTicks.map((tick, index) => <g key={tick}><line x1="0" x2="708" y1={220 - index * 55} y2={220 - index * 55} stroke="#e2e8f0" strokeDasharray="4 6" /><text x="-10" y={224 - index * 55} textAnchor="end" className="fill-black text-[12px] font-semibold">{money.format(tick)}</text></g>)}
          {xTicks.map((tick) => { const x = ((tick - minTime) / (duration || 1)) * 708; return <g key={tick}><line x1={x} x2={x} y1="0" y2="220" stroke="#f1f5f9" /><text x={x} y="244" textAnchor="middle" className="fill-black text-[12px] font-semibold">{formatTime(tick)}</text></g>; })}
          {series.map((item) => <path key={item.name} d={path(item.points, 708, 220, min, max, minTime, maxTime)} fill="none" stroke={item.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />)}
          <rect width="708" height="220" fill="transparent" />
          {hovered && <g className="pointer-events-none">
            <line x1={hovered.x} x2={hovered.x} y1="0" y2="220" stroke="#94a3b8" strokeDasharray="4 4" />
            <line x1="0" x2="708" y1={hovered.y} y2={hovered.y} stroke="#94a3b8" strokeDasharray="4 4" />
            <circle cx={hovered.x} cy={hovered.y} r="5" fill="white" stroke={hovered.color} strokeWidth="3" />
            <g transform={`translate(614 ${Math.max(0, Math.min(194, hovered.y - 13))})`}>
              <rect width="94" height="26" rx="6" fill="#0f172a" />
              <text x="47" y="17" textAnchor="middle" className="fill-white text-[10px] font-bold">{money.format(hovered.point.value)}</text>
            </g>
            <g transform={`translate(${Math.max(0, Math.min(588, hovered.x - 60))} 220)`}>
              <rect width="120" height="25" rx="6" fill="#0f172a" />
              <text x="60" y="17" textAnchor="middle" className="fill-white text-[9px] font-bold">{new Date(hovered.point.time).toLocaleString()}</text>
            </g>
            <g transform={`translate(${hovered.x > 540 ? hovered.x - 154 : hovered.x + 10} ${Math.max(6, Math.min(164, hovered.y - 28))})`}>
              <rect width="144" height="50" rx="9" fill="#0f172a" opacity="0.96" />
              <text x="10" y="20" className="fill-white text-[12px] font-bold">{money.format(hovered.point.value)}</text>
              <text x="10" y="38" className="fill-slate-300 text-[10px]">{new Date(hovered.point.time).toLocaleString()}</text>
            </g>
          </g>}
          <text x="0" y="-8" textAnchor="start" className="fill-black text-[12px] font-bold">Price (USD/oz)</text>
          <text x="354" y="278" textAnchor="middle" className="fill-black text-[13px] font-bold">Time</text>
        </g>
      </svg>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-black">
        {labels && <div className="flex gap-4">{series.map((item) => <span key={item.name} className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />{item.name}</span>)}</div>}
      </div>
    </div>
  );
}

export default function GoldDashboard() {
  const [data, setData] = useState<GoldData | null>(null);
  const [loading, setLoading] = useState(true);
  const [rangeMs, setRangeMs] = useState<number | null>(24 * 60 * 60_000);
  const [validationRange, setValidationRange] = useState("12H");
  const [forecastIntervalMs, setForecastIntervalMs] = useState(60 * 60_000);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/gold", { cache: "no-store" });
      const payload = await response.json() as GoldData;
      setData(payload);
    } catch {
      setData({ error: "Unable to contact the free gold data service." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialData() {
      try {
        const response = await fetch("/api/gold", { cache: "no-store" });
        const payload = await response.json() as GoldData;
        if (!cancelled) setData(payload);
      } catch {
        if (!cancelled) setData({ error: "Unable to contact the free gold data service." });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadInitialData();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => { void load(); }, 60_000);
    return () => window.clearInterval(timer);
  }, [load]);

  const hourlyHistory = useMemo(() => data?.history ?? [], [data]);
  const liveHistory = useMemo(() => data?.liveHistory ?? [], [data]);
  const projection = useMemo(() => {
    if (hourlyHistory.length < 24 || !data?.currentUsd || !data.updatedAt) return [];
    return forecast(hourlyHistory, 24, forecastIntervalMs, { time: data.updatedAt, value: data.currentUsd });
  }, [data, forecastIntervalMs, hourlyHistory]);
  const backtest = useMemo(() => {
    const selected = validationRanges.find((range) => range.label === validationRange) ?? validationRanges[5];
    const points = selected.source === "live" ? liveHistory : hourlyHistory;
    if (points.length < 26) return null;
    const result = buildBacktest(points, selected.observations, selected.source === "live" ? 3 * 60_000 : 2 * 60 * 60_000);
    return result.rows.length ? result : null;
  }, [hourlyHistory, liveHistory, validationRange]);
  const change = liveHistory.length > 1 ? liveHistory.at(-1)!.value - liveHistory.at(-2)!.value : 0;
  const marketPoints = useMemo(() => {
    const allPoints = [...hourlyHistory, ...liveHistory];
    const latestTime = Math.max(...allPoints.map((point) => Date.parse(point.time)));
    const cutoff = rangeMs === null ? Number.NEGATIVE_INFINITY : latestTime - rangeMs;
    return allPoints
      .filter((point) => Date.parse(point.time) >= cutoff)
      .sort((a, b) => Date.parse(a.time) - Date.parse(b.time));
  }, [hourlyHistory, liveHistory, rangeMs]);

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-800">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 lg:px-8">
          <Link href="/" aria-label="Home"><Image src="/fa.png" alt="IELTS Logo" width={58} height={58} className="rounded-full" unoptimized /></Link>
          <Navbar />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <section className="overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-xl md:p-9">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div><p className="text-xs font-bold uppercase tracking-[.22em] text-amber-400">Personal · Market lab</p><h1 className="mt-2 text-4xl font-black tracking-tight">Gold Intelligence</h1><p className="mt-2 text-sm text-slate-400">Live XAU/USD · hourly outlook · transparent backtest</p></div>
            <button type="button" onClick={() => void load()} disabled={loading} className="self-start rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-bold hover:bg-white/15 disabled:opacity-50">{loading ? "Updating…" : "Refresh"}</button>
          </div>
        </section>

        {loading && !data ? <div className="mt-6 grid min-h-72 place-items-center rounded-3xl border border-slate-200 bg-white text-sm font-semibold text-slate-400">Loading market data…</div> : data?.error ? (
          <section className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-8">
            <p className="text-xs font-bold uppercase tracking-wider text-rose-700">Connection unavailable</p><h2 className="mt-2 text-2xl font-black text-slate-900">Live price could not be loaded</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{data.error}</p>
          </section>
        ) : data && (
          <>
            <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <Metric label="Gold spot" value={money.format(data.currentUsd!)} note="per troy ounce" />
              <Metric label="Gold per gram" value={money.format(data.currentUsd! / 31.1034768)} note="estimated 24K · USD" />
              <Metric label="1 Bhori · 22K" value={data.bhoriBdt ? taka.format(data.bhoriBdt) : "Unavailable"} note={<>{data.bhoriGrams ?? 11.664}g · <a href="https://gold-price.bd/" target="_blank" rel="noreferrer" className="font-bold underline">Gold Price Bangladesh</a></>} />
              <Metric label="Latest move" value={`${change >= 0 ? "+" : ""}${money.format(change)}`} note="from the previous saved sample" tone={change >= 0 ? "green" : "red"} />
              <Metric label="Updated" value={new Date(data.updatedAt!).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} note={`${data.source} · ${new Date(data.updatedAt!).toLocaleDateString()}`} />
            </section>

            <section className="mt-6 grid items-stretch gap-6 lg:grid-cols-5">
              <div className="grid gap-6 lg:col-span-3">
                <ChartCard eyebrow="Gold market" title="Gold Price History">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="mr-1 text-xs font-medium text-slate-500">Time</span>
                      {timeframes.map((range) => <button key={range.label} type="button" onClick={() => setRangeMs(range.milliseconds)} className={`rounded-md px-2 py-1 text-xs font-bold transition ${rangeMs === range.milliseconds ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-100 hover:text-black"}`}>{range.label}</button>)}
                    </div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      History
                      <select aria-label="Historical year range" value={rangeMs === null ? "all" : yearRanges.some((range) => range.milliseconds === rangeMs) ? String(rangeMs) : ""} onChange={(event) => setRangeMs(event.target.value === "all" ? null : Number(event.target.value))} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-bold text-black outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20">
                        <option value="" disabled>Years</option>
                        {yearRanges.map((range) => <option key={range.label} value={range.milliseconds === null ? "all" : range.milliseconds}>{range.label}</option>)}
                      </select>
                    </label>
                  </div>
                  {marketPoints.length > 1 ? <LineChart tickIntervalMs={rangeMs === 15 * 60_000 ? 2 * 60_000 : undefined} series={[{ name: "Gold price", color: "#d97706", points: marketPoints }]} /> : <EmptyChart text="Not enough saved observations in this range yet." />}
                </ChartCard>

                <ChartCard eyebrow="Historical backtest" title="Actual vs Forecast" description={backtest ? `MAE ${money.format(backtest.mae)} · MAPE ${backtest.mape.toFixed(2)}% · Direction ${backtest.directionAccuracy.toFixed(0)}%` : "Not enough data"}>
                  <div className="mb-5 flex flex-wrap items-center gap-1 border-b border-slate-200 pb-3"><span className="mr-2 text-xs font-medium text-slate-500">History</span>{validationRanges.map((range) => <button key={range.label} type="button" onClick={() => setValidationRange(range.label)} className={`rounded-md px-2.5 py-1 text-xs font-bold transition ${validationRange === range.label ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-100 hover:text-black"}`}>{range.label}</button>)}</div>
                  {backtest && backtest.rows.length > 1 ? <LineChart labels series={[{ name: "Actual", color: "#d97706", points: backtest.rows.map((row) => ({ time: row.time, value: row.actual })) }, { name: "Forecast", color: "#2563eb", points: backtest.rows.map((row) => ({ time: row.time, value: row.forecast })) }]} /> : <EmptyChart text="Not enough continuous history for this validation range." />}
                </ChartCard>
              </div>

              <div className="lg:relative lg:col-span-2 lg:min-h-0">
                <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white lg:absolute lg:inset-0">
                  <div className="border-b border-slate-100 p-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-black">Market outlook</p>
                    <h2 className="mt-1 text-2xl font-black text-black">Price Forecast</h2>
                    <div className="mt-4 flex flex-wrap gap-1">{forecastIntervals.map((interval) => <button key={interval.label} type="button" onClick={() => setForecastIntervalMs(interval.milliseconds)} className={`rounded-md px-2.5 py-1 text-xs font-bold transition ${forecastIntervalMs === interval.milliseconds ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600 hover:text-black"}`}>{interval.label}</button>)}</div>
                  </div>
                  <div className="max-h-[540px] flex-1 divide-y divide-slate-100 overflow-y-auto lg:max-h-none">{projection.length ? projection.map((point) => <div key={point.time} className="grid grid-cols-[1fr_auto] gap-4 px-6 py-3 text-sm text-black"><div><p className="font-bold">{forecastIntervalMs >= 12 * 60 * 60_000 ? new Date(point.time).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : new Date(point.time).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</p><p className="mt-0.5 text-xs font-medium text-black">{money.format(point.low)}–{money.format(point.high)}</p></div><p className="text-base font-black text-black">{money.format(point.value)}</p></div>) : <p className="p-6 text-sm leading-6 text-black">Forecast levels will appear after 24 observations have been collected.</p>}</div>
                </div>
              </div>
            </section>

            <p className="mt-6 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-xs leading-5 text-slate-500"><strong className="text-slate-700">Data and model:</strong> historical hourly data comes from {data.historicalSource ?? "the free historical feed"}; live spot readings come from Gold-API.com. All observations are persisted in Neon. The projection extrapolates recent trend and volatility and is not financial advice.</p>
          </>
        )}
      </div>
    </main>
  );
}

function Metric({ label, value, note, tone }: { label: string; value: string; note: React.ReactNode; tone?: "green" | "red" }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p><p className={`mt-2 text-2xl font-black ${tone === "green" ? "text-emerald-600" : tone === "red" ? "text-rose-600" : "text-slate-950"}`}>{value}</p><p className="mt-1 text-xs text-slate-500">{note}</p></div>;
}

function ChartCard({ eyebrow, title, description, className = "", children }: { eyebrow: string; title: string; description?: string; className?: string; children: React.ReactNode }) {
  return <section className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}><div className="mb-6"><p className="text-xs font-bold uppercase tracking-wider text-black">{eyebrow}</p><div className="mt-1 flex flex-wrap items-end justify-between gap-2"><h2 className="text-2xl font-black text-black">{title}</h2>{description ? <p className="text-sm font-medium text-black">{description}</p> : null}</div></div>{children}</section>;
}

function EmptyChart({ text }: { text: string }) {
  return <div className="grid h-64 place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center text-sm font-semibold text-slate-400">{text}</div>;
}
