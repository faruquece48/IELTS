import { DHAKA_TRAFFIC_ROADS } from "@/lib/dhakaTrafficRoads";
import { DHAKA_TRAFFIC_ROUTE_WAYPOINTS, type TrafficPoint } from "@/lib/dhakaTrafficRouteGeometry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type OsrmResponse = {
  routes?: Array<{ distance?: number; geometry?: { coordinates?: TrafficPoint[] } }>;
};

function validPoint(value: unknown): value is TrafficPoint {
  return Array.isArray(value) && value.length === 2 && value.every((coordinate) => typeof coordinate === "number" && Number.isFinite(coordinate));
}

function validPath(value: unknown): value is TrafficPoint[] {
  return Array.isArray(value) && value.length > 2 && value.every(validPoint);
}

async function junctionGeometry(waypoints: readonly TrafficPoint[]) {
  const coordinates = waypoints.map(([longitude, latitude]) => `${longitude},${latitude}`).join(";");
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson&steps=false&alternatives=false`,
      { cache: "no-store" },
    );
    if (!response.ok) return null;
    const payload = await response.json() as OsrmResponse;
    const route = payload.routes?.[0];
    const geometry = route?.geometry?.coordinates;
    return validPath(geometry) ? { geometry, distanceKm: Math.round(((route?.distance ?? 0) / 1000) * 10) / 10 } : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const entries = await Promise.all(DHAKA_TRAFFIC_ROADS.map(async (road) => {
    const waypoints = DHAKA_TRAFFIC_ROUTE_WAYPOINTS[road.id];
    const geometry = await junctionGeometry(waypoints);
    return [road.id, geometry] as const;
  }));
  const available = entries.flatMap(([id, geometry]) => geometry ? [[id, geometry] as const] : []);

  return Response.json({
    routes: Object.fromEntries(available.map(([id, route]) => [id, route.geometry])),
    distances: Object.fromEntries(available.map(([id, route]) => [id, route.distanceKm])),
    sources: Object.fromEntries(available.map(([id]) => [id, "fixed-major-junction-corridor"])),
    junctionRoutes: available.length,
    routeVersion: "junction-corridors-2026-10-23-2",
  }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } });
}
