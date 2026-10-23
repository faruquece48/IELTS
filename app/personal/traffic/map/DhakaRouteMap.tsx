"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { DHAKA_TRAFFIC_ROADS } from "@/lib/dhakaTrafficRoads";
import { DHAKA_TRAFFIC_ROUTE_JUNCTIONS, DHAKA_TRAFFIC_ROUTE_WAYPOINTS, type TrafficPoint } from "@/lib/dhakaTrafficRouteGeometry";

type Point = TrafficPoint;
type RouteId = (typeof DHAKA_TRAFFIC_ROADS)[number]["id"];

const studyRouteColor = "#087faf";
const mapSize = 900;
const tileSize = 256;
const zoom = 12;
const center: Point = [90.390, 23.790];

function worldPixel([longitude, latitude]: Point) {
  const scale = tileSize * 2 ** zoom;
  const latitudeRadians = latitude * Math.PI / 180;
  return [
    ((longitude + 180) / 360) * scale,
    (1 - Math.log(Math.tan(latitudeRadians) + 1 / Math.cos(latitudeRadians)) / Math.PI) / 2 * scale,
  ] as const;
}

const centerPixel = worldPixel(center);
const mapOrigin = [centerPixel[0] - mapSize / 2, centerPixel[1] - mapSize / 2] as const;
const firstTileX = Math.floor(mapOrigin[0] / tileSize);
const firstTileY = Math.floor(mapOrigin[1] / tileSize);
const lastTileX = Math.floor((mapOrigin[0] + mapSize) / tileSize);
const lastTileY = Math.floor((mapOrigin[1] + mapSize) / tileSize);
const mapTiles = Array.from({ length: lastTileY - firstTileY + 1 }, (_, row) =>
  Array.from({ length: lastTileX - firstTileX + 1 }, (_, column) => ({ x: firstTileX + column, y: firstTileY + row })),
).flat();

function project(point: Point) {
  const [x, y] = worldPixel(point);
  return [x - mapOrigin[0], y - mapOrigin[1]] as const;
}

function line(points: readonly Point[]) {
  return points.map((point) => project(point).join(",")).join(" ");
}

export default function DhakaRouteMap() {
  const [selectedId, setSelectedId] = useState<RouteId | null>(null);
  const [showAllRoutes, setShowAllRoutes] = useState(true);
  const [roadRoutes, setRoadRoutes] = useState<Partial<Record<RouteId, Point[]>>>({});
  const [routeDistances, setRouteDistances] = useState<Partial<Record<RouteId, number>>>({});
  const [exporting, setExporting] = useState(false);
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/traffic/routes?version=junction-corridors-2026-10-23-2`, { cache: "no-store" }).then((response) => response.ok ? response.json() : Promise.reject()).then((payload: { routes?: Partial<Record<RouteId, Point[]>>; distances?: Partial<Record<RouteId, number>> }) => {
      if (!cancelled && payload.routes) {
        setRoadRoutes(payload.routes);
        setRouteDistances(payload.distances ?? {});
      }
    }).catch(() => undefined);
    return () => { cancelled = true; };
  }, []);
  const selected = DHAKA_TRAFFIC_ROADS.find((road) => road.id === selectedId);

  function selectRoad(id: RouteId) {
    setSelectedId(id);
    setShowAllRoutes(false);
  }

  async function downloadMapPng() {
    setExporting(true);
    try {
      const scale = 2;
      const canvas = document.createElement("canvas");
      canvas.width = mapSize * scale;
      canvas.height = mapSize * scale;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.scale(scale, scale);
      context.fillStyle = "#f8fafc";
      context.fillRect(0, 0, mapSize, mapSize);
      const images = await Promise.all(mapTiles.map((tile) => new Promise<{ image: HTMLImageElement; x: number; y: number }>((resolve, reject) => {
        const image = new window.Image();
        image.crossOrigin = "anonymous";
        image.onload = () => resolve({ image, x: tile.x * tileSize - mapOrigin[0], y: tile.y * tileSize - mapOrigin[1] });
        image.onerror = reject;
        image.src = `/api/traffic/map-tile/${zoom}/${tile.x}/${tile.y}`;
      })));
      images.forEach(({ image, x, y }) => context.drawImage(image, x, y, tileSize, tileSize));

      Object.entries(roadRoutes).forEach(([routeId, geometry]) => {
        if (!geometry?.length) return;
        const drawRoute = (strokeStyle: string, lineWidth: number) => {
          context.beginPath();
          geometry.forEach((point, index) => { const [x, y] = project(point); if (index) context.lineTo(x, y); else context.moveTo(x, y); });
          context.strokeStyle = strokeStyle;
          context.lineWidth = lineWidth;
          context.lineCap = "round";
          context.lineJoin = "round";
          context.stroke();
        };
        drawRoute("#ffffff", 6);
        drawRoute("#111827", 3);
      });

      context.fillStyle = "rgba(255,255,255,.95)";
      context.strokeStyle = "#cbd5e1";
      context.lineWidth = 1;
      context.beginPath(); context.roundRect(24, 824, 176, 52, 10); context.fill(); context.stroke();
      context.strokeStyle = studyRouteColor; context.lineWidth = 7; context.beginPath(); context.moveTo(43, 850); context.lineTo(83, 850); context.stroke();
      context.fillStyle = "#0f172a"; context.font = "700 15px Arial"; context.fillText("Study routes", 96, 855);

      context.fillStyle = "rgba(255,255,255,.95)";
      context.beginPath(); context.roundRect(814, 24, 62, 88, 12); context.fill();
      context.fillStyle = "#0f172a"; context.font = "800 18px Arial"; context.textAlign = "center"; context.fillText("N", 845, 49);
      context.beginPath(); context.moveTo(845, 58); context.lineTo(831, 94); context.lineTo(845, 86); context.lineTo(859, 94); context.closePath(); context.fill();

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "dhaka-study-routes.png";
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2 lg:px-8">
          <Link href="/" aria-label="Home"><Image src="/fa.png" alt="IELTS Logo" width={56} height={56} className="rounded-full" unoptimized /></Link>
          <Navbar />
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="flex flex-col gap-5 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 px-7 py-8 text-white shadow-xl md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-teal-300">Dhaka traffic coverage</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Project route map</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Each study corridor follows fixed major junctions, making its stops and coverage clear. Select one route or show all ten together.</p>
          </div>
          <Link href="/personal/traffic" className="inline-flex w-fit rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-900 shadow transition hover:bg-teal-50">View recorded traffic data</Link>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_370px]">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{selected ? "Selected route" : "Study route network"}</p><h2 className="mt-1 font-bold text-slate-900">{selected?.name ?? "All study routes"}</h2></div>
              <div className="flex flex-wrap items-center justify-end gap-2">{selectedId ? <button type="button" onClick={() => setShowAllRoutes((visible) => !visible)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50">{showAllRoutes ? "Selected route only" : "Show all routes"}</button> : null}<button type="button" onClick={() => void downloadMapPng()} disabled={exporting || !Object.keys(roadRoutes).length} className="rounded-lg bg-sky-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-sky-800 disabled:cursor-wait disabled:opacity-50">{exporting ? "Preparing PNG…" : "Download PNG"}</button><span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">10 routes</span></div>
            </div>
            <div className="bg-[#e8eff0] p-2 sm:p-5">
              <div className="relative mx-auto aspect-square w-full max-w-[900px] overflow-hidden rounded-2xl bg-slate-200 shadow-inner">
              <svg viewBox="0 0 900 900" role="img" aria-labelledby="map-title map-description" className="absolute inset-0 h-full w-full">
                <title id="map-title">Map of the ten monitored traffic routes in Dhaka</title>
                <desc id="map-description">A geographic street map of Dhaka showing the start, destination, and path of each project route.</desc>
                <defs>
                  <filter id="route-shadow"><feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.22" /></filter>
                </defs>
                {mapTiles.map((tile) => <image key={`${tile.x}-${tile.y}`} href={`/api/traffic/map-tile/${zoom}/${tile.x}/${tile.y}`} x={tile.x * tileSize - mapOrigin[0]} y={tile.y * tileSize - mapOrigin[1]} width={tileSize} height={tileSize} preserveAspectRatio="none" />)}
                {DHAKA_TRAFFIC_ROADS.filter((road) => showAllRoutes || road.id === selectedId).sort((first, second) => Number(first.id === selectedId) - Number(second.id === selectedId)).map((road) => {
                  const active = road.id === selectedId;
                  const geometry = roadRoutes[road.id];
                  if (!geometry?.length) return null;
                  return (
                    <g key={road.id} onClick={() => selectRoad(road.id)} className="cursor-pointer" role="button" aria-label={`Select ${road.name}`} tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") selectRoad(road.id); }}>
                      <polyline points={line(geometry)} fill="none" stroke="white" strokeWidth={active ? 10 : 6} strokeLinecap="round" strokeLinejoin="round" opacity={active ? 1 : .8} />
                      <polyline points={line(geometry)} fill="none" stroke={active ? "#008dcc" : "#111827"} strokeWidth={active ? 6 : 3} strokeLinecap="round" strokeLinejoin="round" opacity={active ? 1 : .9} filter={active ? "url(#route-shadow)" : undefined} />
                      {active ? DHAKA_TRAFFIC_ROUTE_WAYPOINTS[road.id].map((point, pointIndex) => {
                        const [x, y] = project(point);
                        const endpoint = pointIndex === 0 || pointIndex === DHAKA_TRAFFIC_ROUTE_WAYPOINTS[road.id].length - 1;
                        return <g key={pointIndex}><circle cx={x} cy={y} r={endpoint ? "11" : "8"} fill="#008dcc" stroke="white" strokeWidth="3" /><text x={x} y={y + 4} textAnchor="middle" fill="white" fontSize="9" fontWeight="800">{pointIndex + 1}</text></g>;
                      }) : null}
                    </g>
                  );
                })}
                <g transform="translate(720 24)"><rect width="156" height="42" rx="12" fill="white" opacity=".94" /><text x="78" y="26" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="800">DHAKA CITY</text></g>
              </svg>
                <div className="absolute bottom-5 left-5 rounded-xl border border-slate-300 bg-white/95 p-3 text-[11px] font-bold text-slate-800 shadow-md">
                  {showAllRoutes ? <span className="flex items-center gap-2"><i className="block h-1 w-8 bg-slate-800" />{selectedId ? "Other study routes" : "Study routes"}</span> : null}
                  {selectedId ? <span className="mt-2 flex items-center gap-2"><i className="block h-1.5 w-8" style={{ backgroundColor: studyRouteColor }} />Selected route</span> : null}
                </div>
                <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="absolute bottom-1 right-2 rounded bg-white/90 px-1.5 py-0.5 text-[10px] text-slate-600 hover:underline">© OpenStreetMap contributors</a>
              </div>
            </div>
            <div className="border-t border-slate-200 px-5 py-4 text-sm text-slate-600">
              {selected ? <><span className="font-bold text-slate-900">{selected.start}</span><span className="mx-2 text-teal-600">→</span><span className="font-bold text-slate-900">{selected.destination}</span>
              <p className="mt-1 text-xs text-slate-400">{Object.keys(roadRoutes).length ? `Fixed major-junction survey circuit · ${routeDistances[selected.id] ?? "…"} km · live traffic is ignored` : "Loading major-junction road geometry…"}</p>
              <p className="mt-2 text-xs font-semibold leading-5 text-slate-600">Junctions: {DHAKA_TRAFFIC_ROUTE_JUNCTIONS[selected.id].join(" → ")}</p></> : <><span className="font-bold text-slate-900">Full Dhaka study-route network</span><p className="mt-1 text-xs text-slate-400">Select a route to inspect it. PNG export always uses all routes in black.</p></>}
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="px-2 pb-3"><h2 className="text-lg font-black">Covered routes</h2><p className="mt-1 text-sm text-slate-500">Select a route to highlight it on the map.</p></div>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
              {DHAKA_TRAFFIC_ROADS.map((road, index) => {
                const active = road.id === selectedId;
                return (
                  <button key={road.id} type="button" onClick={() => selectRoad(road.id)} className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${active ? "border-teal-500 bg-teal-50 shadow-sm" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black text-white" style={{ backgroundColor: studyRouteColor }}>{index + 1}</span>
                    <span className="min-w-0"><span className="block text-sm font-bold text-slate-900">{road.name}</span><span className="mt-0.5 block truncate text-xs text-slate-500">{road.start} → {road.destination}</span></span>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
