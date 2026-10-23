"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";

type Trip = {
  id: string;
  start: string;
  destination: string;
  duration: string;
  distance?: string;
  travelMode?: string;
  notes?: string;
  routeName?: string;
  routeSummary?: string;
  savedAt: string;
  url?: string;
  automatic?: boolean;
  trafficPortions?: {
    green: number;
    yellow: number;
    orange?: number;
    red: number;
    maroon: number;
    method: "visible-map-estimate";
    sampledPixels: number;
  };
};

function TrafficPortion({ value, color, distance }: { value?: number; color: string; distance: number }) {
  if (value === undefined) return <span className="text-xs text-slate-400">—</span>;
  return <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-black text-slate-700" title="Estimated from traffic-colored pixels in the visible Google Maps area">
    <i className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />{distance ? `${(distance * value / 100).toFixed(1)} km` : `${value.toFixed(1)}%`} {distance ? <small className="font-semibold text-slate-400">({value.toFixed(1)}%)</small> : null}
  </span>;
}

type TrafficColor = "green" | "yellow" | "red" | "maroon";

function trafficValue(trip: Trip, color: TrafficColor) {
  if (!trip.trafficPortions) return undefined;
  return color === "yellow" ? trip.trafficPortions.yellow + (trip.trafficPortions.orange || 0) : trip.trafficPortions[color];
}

function averageTrafficPercentage(records: Trip[], color: TrafficColor) {
  const values = records.flatMap((trip) => {
    const percentage = trafficValue(trip, color);
    return percentage === undefined ? [] : [percentage];
  });
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

function TrafficHeading({ label, color, records }: { label: string; color: TrafficColor; records: Trip[] }) {
  const averagePercentage = averageTrafficPercentage(records, color);
  return <span className="block whitespace-nowrap">{label} ({averagePercentage === null ? "—" : `${Math.round(averagePercentage)}%`})</span>;
}

function TrafficSummary({ records }: { records: Trip[] }) {
  const colors: Array<[TrafficColor, string, string]> = [["green", "Green", "#34d399"], ["yellow", "Yellow", "#facc15"], ["red", "Red", "#ef4444"], ["maroon", "Maroon", "#be123c"]];
  return <div className="flex shrink-0 items-center gap-2">{colors.map(([key, label, color]) => {
    const value = averageTrafficPercentage(records, key);
    return <span key={key} className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-white/10 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wide ring-1 ring-white/15"><i className="h-2 w-2 rounded-sm" style={{ backgroundColor: color }} />{label} {value === null ? "—" : `${Math.round(value)}%`}</span>;
  })}</div>;
}

function JourneySummary({ records }: { records: Trip[] }) {
  const measured = records.map((trip) => ({ minutes: durationMinutes(trip.duration), kilometres: distanceKilometres(trip.distance) }))
    .filter((item) => item.minutes > 0 && item.kilometres > 0);
  const totalMinutes = measured.reduce((sum, item) => sum + item.minutes, 0);
  const totalKilometres = measured.reduce((sum, item) => sum + item.kilometres, 0);
  const averageMinutesPerKm = totalKilometres ? totalMinutes / totalKilometres : 0;
  return <span className="shrink-0 whitespace-nowrap rounded-lg bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-teal-100 ring-1 ring-white/15">{records.length} snapshot{records.length === 1 ? "" : "s"} · Avg {averageMinutesPerKm ? `${averageMinutesPerKm.toFixed(2)} min/km` : "—"}</span>;
}

const TRAFFIC_MESSAGE = "MAPS_TRIP_RECORDER_DATA";
const TRAFFIC_REQUEST = "MAPS_TRIP_RECORDER_REQUEST";
const TRAFFIC_CLEAR = "MAPS_TRIP_RECORDER_CLEAR";

function durationMinutes(value: string) {
  const hours = Number(value.match(/(\d+)\s*(?:hr|hour|hours|h)\b/i)?.[1] || 0);
  const minutes = Number(value.match(/(\d+)\s*(?:min|mins|minute|minutes)\b/i)?.[1] || 0);
  return hours * 60 + minutes;
}

function distanceKilometres(value = "") {
  const match = value.toLowerCase().replace(",", ".").match(/(\d+(?:\.\d+)?)\s*(km|miles?|mi|m)\b/);
  if (!match) return 0;
  const amount = Number(match[1]);
  if (match[2] === "m") return amount / 1000;
  if (match[2] === "mi" || match[2].startsWith("mile")) return amount * 1.609344;
  return amount;
}

function routeKey(trip: Trip) {
  return `${trip.start.trim().toLocaleLowerCase()}|${trip.destination.trim().toLocaleLowerCase()}`;
}

function safeTrips(value: unknown): Trip[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is Trip => {
    if (!item || typeof item !== "object") return false;
    const trip = item as Partial<Trip>;
    return typeof trip.id === "string" && typeof trip.start === "string" &&
      typeof trip.destination === "string" && typeof trip.duration === "string" &&
      typeof trip.savedAt === "string";
  });
}

function roundedDate(value: string) {
  const date = new Date(value);
  date.setSeconds(0, 0);
  return date;
}

export default function TrafficTracker() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [connected, setConnected] = useState(false);
  const [checked, setChecked] = useState(false);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("All modes");
  const [day, setDay] = useState("");

  useEffect(() => {
    function receive(event: MessageEvent) {
      if (event.source !== window || event.origin !== window.location.origin || event.data?.type !== TRAFFIC_MESSAGE) return;
      setTrips(safeTrips(event.data.trips));
      setConnected(true);
      setChecked(true);
    }
    window.addEventListener("message", receive);
    window.postMessage({ type: TRAFFIC_REQUEST }, window.location.origin);
    const timer = window.setTimeout(() => setChecked(true), 1200);
    return () => { window.removeEventListener("message", receive); window.clearTimeout(timer); };
  }, []);

  const shortestTrips = useMemo(() => {
    const byJourneyMinute = new Map<string, Trip>();
    trips.forEach((trip) => {
      const key = `${routeKey(trip)}|${trip.savedAt.slice(0, 16)}`;
      const current = byJourneyMinute.get(key);
      const minutes = durationMinutes(trip.duration) || Number.POSITIVE_INFINITY;
      const currentMinutes = current ? durationMinutes(current.duration) || Number.POSITIVE_INFINITY : Number.POSITIVE_INFINITY;
      if (!current || minutes < currentMinutes) byJourneyMinute.set(key, trip);
    });
    return [...byJourneyMinute.values()];
  }, [trips]);

  const modes = useMemo(() => ["All modes", ...new Set(shortestTrips.map((trip) => trip.travelMode).filter(Boolean) as string[])], [shortestTrips]);
  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return shortestTrips.filter((trip) => mode === "All modes" || trip.travelMode === mode)
      .filter((trip) => !day || trip.savedAt.slice(0, 10) === day)
      .filter((trip) => !query || `${trip.start} ${trip.destination} ${trip.routeName || ""} ${trip.duration} ${trip.distance || ""} ${trip.travelMode || ""} ${trip.notes || ""}`.toLowerCase().includes(query))
      .sort((a, b) => Date.parse(b.savedAt) - Date.parse(a.savedAt));
  }, [shortestTrips, search, mode, day]);

  const routeGroups = useMemo(() => {
    const groups = new Map<string, Trip[]>();
    visible.forEach((trip) => groups.set(routeKey(trip), [...(groups.get(routeKey(trip)) || []), trip]));
    return [...groups.values()].map((records) => {
      const measured = records.map((trip) => ({ minutes: durationMinutes(trip.duration), kilometres: distanceKilometres(trip.distance) }))
        .filter((item) => item.minutes > 0 && item.kilometres > 0);
      const totalMinutes = measured.reduce((sum, item) => sum + item.minutes, 0);
      const totalKilometres = measured.reduce((sum, item) => sum + item.kilometres, 0);
      return { records, averageMinutesPerKm: totalKilometres ? totalMinutes / totalKilometres : 0 };
    });
  }, [visible]);

  const stats = useMemo(() => {
    const measured = shortestTrips.map((trip) => durationMinutes(trip.duration)).filter((value) => value > 0);
    const routes = new Set(shortestTrips.map((trip) => `${trip.start.toLowerCase()}|${trip.destination.toLowerCase()}`));
    return {
      routes: routes.size,
      fastest: measured.length ? Math.min(...measured) : 0,
      latest: shortestTrips.reduce<Trip | undefined>((best, trip) => !best || Date.parse(trip.savedAt) > Date.parse(best.savedAt) ? trip : best, undefined),
    };
  }, [shortestTrips]);

  async function exportExcel() {
    const ExcelJS = (await import("exceljs")).default;
    const workbook = new ExcelJS.Workbook();
    const usedNames = new Set<string>();
    routeGroups.forEach(({ records }, index) => {
      const base = `${records[0].start} to ${records[0].destination}`.replace(/[\\/*?:[\]]/g, " ").slice(0, 31).trim() || `Route ${index + 1}`;
      let name = base;
      let suffix = 2;
      while (usedNames.has(name)) name = `${base.slice(0, 27)} ${suffix++}`;
      usedNames.add(name);
      const sheet = workbook.addWorksheet(name);
      sheet.columns = [
        { header: "Recorded", key: "recorded", width: 22 },
        { header: "Time", key: "time", width: 14 },
        { header: "Distance", key: "distance", width: 14 },
        { header: "Mode", key: "mode", width: 16 },
        { header: "Green %", key: "green", width: 12 },
        { header: "Yellow %", key: "yellow", width: 12 },
        { header: "Red %", key: "red", width: 12 },
        { header: "Maroon %", key: "maroon", width: 12 },
        { header: "Notes", key: "notes", width: 42 },
        { header: "Map", key: "map", width: 50 },
      ];
      records.forEach((trip) => sheet.addRow({
        recorded: roundedDate(trip.savedAt), time: trip.duration, distance: trip.distance || "—",
        mode: trip.travelMode || "Unknown", green: trip.trafficPortions?.green ?? "—",
        yellow: trip.trafficPortions ? trip.trafficPortions.yellow + (trip.trafficPortions.orange || 0) : "—",
        red: trip.trafficPortions?.red ?? "—", maroon: trip.trafficPortions?.maroon ?? "—",
        notes: trip.notes || (trip.automatic ? "Automatic snapshot" : "—"), map: trip.url || "—",
      }));
      sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
      sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0F172A" } };
      sheet.getColumn("recorded").numFmt = "yyyy-mm-dd hh:mm:ss";
      sheet.views = [{ state: "frozen", ySplit: 1 }];
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer as BlobPart], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `traffic-history-${new Date().toISOString().slice(0, 10)}.xlsx`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function clearAllData() {
    if (!window.confirm("Clear all traffic snapshots and stop monitoring every saved route?")) return;
    setTrips([]);
    setSearch("");
    setMode("All modes");
    setDay("");
    window.postMessage({ type: TRAFFIC_CLEAR }, window.location.origin);
  }

  return <main className="min-h-screen bg-[#f3f6f8] text-slate-900">
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Home"><Image src="/fa.png" alt="IELTS Logo" width={58} height={58} className="rounded-full" unoptimized /></Link>
        <Navbar />
      </div>
    </header>

    <section className="border-b border-emerald-900/10 bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 text-white">
      <div className="mx-auto grid max-w-[1500px] gap-8 px-4 py-9 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
        <div><p className="text-xs font-black uppercase tracking-[.24em] text-teal-300">Personal utility</p><h1 className="mt-2 text-4xl font-black tracking-tight">Traffic trip recorder</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-teal-50/80">Open a journey in Google Maps and review the shortest travel time and its matching distance for every minute.</p></div>
        <a href="https://www.google.com/maps/dir/" target="_blank" rel="noreferrer" className="self-center rounded-xl bg-amber-300 px-5 py-3 text-sm font-black text-slate-950 shadow-lg transition hover:bg-amber-200">Open Google Maps ↗</a>
      </div>
    </section>

    <div className="mx-auto max-w-[1500px] space-y-5 px-4 py-6 sm:px-6 lg:px-8">
      {checked && !connected && <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><strong>Connect the Chrome extension to see your history.</strong> Load <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs">chrome-extensions/maps-trip-recorder</code> as an unpacked extension, then reload this page. The extension keeps the data in Chrome and shares it with this dashboard.</div>}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[["Snapshots", String(shortestTrips.length)], ["Routes", String(stats.routes)], ["Fastest time", stats.fastest ? `${stats.fastest} min` : "—"], ["Latest reading", stats.latest?.duration || "—"]].map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-black uppercase tracking-wider text-slate-400">{label}</p><p className="mt-2 text-2xl font-black text-slate-950">{value}</p></div>)}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap gap-2 p-3">
          <input aria-label="Search traffic records" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search route, place, note or duration" className="min-w-64 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
          <select aria-label="Travel mode" value={mode} onChange={(event) => setMode(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm">{modes.map((item) => <option key={item}>{item}</option>)}</select>
          <input aria-label="Recorded date" type="date" value={day} onChange={(event) => setDay(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm" />
          {(search || day || mode !== "All modes") && <button onClick={() => { setSearch(""); setDay(""); setMode("All modes"); }} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600">Clear</button>}
          <button onClick={() => void exportExcel()} disabled={!visible.length} className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40">Export {visible.length ? visible.length : ""} Excel</button>
          <button onClick={clearAllData} disabled={!trips.length} className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-black text-rose-700 disabled:cursor-not-allowed disabled:opacity-40">Clear all data</button>
        </div>
      </section>

      {routeGroups.map(({ records }) => <details key={routeKey(records[0])} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <summary className="flex cursor-pointer list-none flex-nowrap items-center gap-4 overflow-x-auto bg-gradient-to-r from-slate-950 to-emerald-950 px-5 py-3 text-white">
          <h2 title={`${records[0].start} → ${records[0].destination}`} className="min-w-0 flex-1 truncate text-base font-black lg:text-lg">{records[0].start} <span className="text-teal-300">→</span> {records[0].destination}</h2>
          <JourneySummary records={records} />
          <TrafficSummary records={records} />
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-lg font-black transition group-open:rotate-180" aria-hidden="true">⌄</span>
        </summary>
        <div className="overflow-x-auto"><table className="w-full min-w-[920px] border-collapse text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-4 py-3">Recorded</th><th className="px-4 py-3">Time</th><th className="px-4 py-3">Distance</th><th className="px-4 py-3 text-emerald-700"><TrafficHeading label="Green" color="green" records={records} /></th><th className="px-4 py-3 text-yellow-700"><TrafficHeading label="Yellow" color="yellow" records={records} /></th><th className="px-4 py-3 text-red-700"><TrafficHeading label="Red" color="red" records={records} /></th><th className="px-4 py-3 text-rose-950"><TrafficHeading label="Maroon" color="maroon" records={records} /></th><th className="px-4 py-3">Map</th></tr></thead>
          <tbody className="divide-y divide-slate-100">{records.map((trip) => <tr key={trip.id} className="align-top hover:bg-teal-50/40">
            <td className="whitespace-nowrap px-4 py-4 text-xs font-semibold text-slate-500"><span className="block text-slate-800">{new Date(trip.savedAt).toLocaleDateString()}</span>{new Date(trip.savedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</td>
            <td className="whitespace-nowrap px-4 py-4"><span className="rounded-lg bg-emerald-100 px-2.5 py-1.5 font-black text-emerald-800">{trip.duration}</span></td>
            <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-600">{trip.distance || "—"}</td>
            <td className="px-4 py-4"><TrafficPortion value={trafficValue(trip, "green")} color="#18c979" distance={distanceKilometres(trip.distance)} /></td>
            <td className="px-4 py-4"><TrafficPortion value={trafficValue(trip, "yellow")} color="#facc15" distance={distanceKilometres(trip.distance)} /></td>
            <td className="px-4 py-4"><TrafficPortion value={trafficValue(trip, "red")} color="#dc2626" distance={distanceKilometres(trip.distance)} /></td>
            <td className="px-4 py-4"><TrafficPortion value={trafficValue(trip, "maroon")} color="#881337" distance={distanceKilometres(trip.distance)} /></td>
            <td className="px-4 py-4">{trip.url ? <a href={trip.url} target="_blank" rel="noreferrer" className="font-black text-teal-700 hover:text-teal-900">Open ↗</a> : "—"}</td>
          </tr>)}</tbody>
        </table></div>
      </details>)}

      {!routeGroups.length && <section className="rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm"><p className="font-black text-slate-400">{trips.length ? "No records match these filters." : connected ? "No trips recorded yet." : "Waiting for extension data…"}</p><p className="mt-2 text-sm text-slate-400">Choose a route in Google Maps and leave the tab open to collect snapshots.</p></section>}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-500"><span>{visible.length} of {shortestTrips.length} snapshots across {routeGroups.length} route{routeGroups.length === 1 ? "" : "s"}</span><span className={connected ? "text-emerald-700" : "text-amber-700"}>{connected ? "● Extension connected" : "● Extension not detected"}</span></div>
    </div>
  </main>;
}
