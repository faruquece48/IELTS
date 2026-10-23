import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type StoredObject = Record<string, unknown>;
type TrafficStore = {
  version: 1;
  updatedAt: string | null;
  trips: StoredObject[];
  monitoredRoutes: StoredObject[];
};

const dataFile = path.join(process.cwd(), "data", "traffic-records.json");
let writeQueue = Promise.resolve();
const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type", "Cache-Control": "no-store" };

function emptyStore(): TrafficStore {
  return { version: 1, updatedAt: null, trips: [], monitoredRoutes: [] };
}

async function readStore(): Promise<TrafficStore> {
  try {
    const parsed = JSON.parse(await readFile(dataFile, "utf8")) as Partial<TrafficStore>;
    return {
      version: 1,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : null,
      trips: Array.isArray(parsed.trips) ? parsed.trips : [],
      monitoredRoutes: Array.isArray(parsed.monitoredRoutes) ? parsed.monitoredRoutes : [],
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    return emptyStore();
  }
}

async function writeStore(store: TrafficStore) {
  await mkdir(path.dirname(dataFile), { recursive: true });
  await writeFile(dataFile, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

function queueWrite<T>(operation: () => Promise<T>) {
  const current = writeQueue.catch(() => undefined).then(operation);
  writeQueue = current.then(() => undefined, () => undefined);
  return current;
}

function isObject(value: unknown): value is StoredObject {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

export async function GET() {
  await writeQueue;
  return Response.json(await readStore(), { headers: corsHeaders });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { snapshots?: unknown; monitoredRoute?: unknown; monitoredRoutes?: unknown } | null;
  const snapshots = Array.isArray(body?.snapshots) ? body.snapshots.filter(isObject) : [];
  const suppliedRoutes = Array.isArray(body?.monitoredRoutes) ? body.monitoredRoutes.filter(isObject) : [];
  if (isObject(body?.monitoredRoute)) suppliedRoutes.unshift(body.monitoredRoute);
  if (!snapshots.length && !suppliedRoutes.length) return Response.json({ saved: false, error: "No valid traffic records supplied." }, { status: 400, headers: corsHeaders });

  const result = await queueWrite(async () => {
    const store = await readStore();
    const incomingIds = new Set(snapshots.map((trip) => trip.id).filter((id): id is string => typeof id === "string"));
    const incomingRouteKeys = new Set(suppliedRoutes.map((route) => route.key).filter((key): key is string => typeof key === "string"));
    const next: TrafficStore = {
      version: 1,
      updatedAt: new Date().toISOString(),
      trips: [...snapshots, ...store.trips.filter((trip) => typeof trip.id !== "string" || !incomingIds.has(trip.id))].slice(0, 10000),
      monitoredRoutes: [...suppliedRoutes, ...store.monitoredRoutes.filter((route) => typeof route.key !== "string" || !incomingRouteKeys.has(route.key))].slice(0, 50),
    };
    await writeStore(next);
    return { saved: true, trips: next.trips.length, file: dataFile };
  });
  return Response.json(result, { headers: corsHeaders });
}

export async function DELETE(request: Request) {
  const body = await request.json().catch(() => null) as { routeKey?: unknown } | null;
  const routeKey = typeof body?.routeKey === "string" ? body.routeKey.toLowerCase() : "";
  await queueWrite(async () => {
    const store = await readStore();
    const trips = routeKey ? store.trips.filter((trip) => `${trip.start || ""}|${trip.destination || ""}`.toLowerCase() !== routeKey) : [];
    const monitoredRoutes = routeKey ? store.monitoredRoutes.filter((route) => route.key !== routeKey || route.builtIn === true) : store.monitoredRoutes;
    await writeStore({ ...store, updatedAt: new Date().toISOString(), trips, monitoredRoutes });
  });
  return Response.json({ deleted: true }, { headers: corsHeaders });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: { ...corsHeaders, "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS" } });
}
