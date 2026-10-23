const $ = (id) => document.getElementById(id);
const fields = ["start", "destination", "duration", "distance", "travelMode"];
const TRAFFIC_API = "http://localhost:3000/api/traffic";
let capturedUrl = "";

async function renderCollectionStatus() {
  const { collectionEnabled } = await chrome.storage.local.get("collectionEnabled");
  const enabled = collectionEnabled !== false;
  $("collection-enabled").checked = enabled;
  $("collection-status").textContent = enabled ? "Recording monitored routes" : "Paused — no automatic data is recorded";
}
function notice(message, type = "") { $("notice").textContent = message; $("notice").className = `notice ${type}`; }
function tripKey(trip) { return `${trip.start || ""}|${trip.destination || ""}`.toLowerCase(); }
function configuredRoad(trip) {
  const value = tripKey(trip);
  return DHAKA_ROADS.find((road) => {
    if (trip.roadId === road.id || trip.roadName === road.roadName) return true;
    const starts = road.startAliases || [road.start.split(",")[0].toLowerCase()];
    const destinations = road.destinationAliases || [road.destination.split(",")[0].toLowerCase()];
    return starts.some((alias) => value.includes(alias)) && destinations.some((alias) => value.includes(alias));
  });
}
function escapeHtml(value = "") { const div = document.createElement("div"); div.textContent = value; return div.innerHTML; }
function csvValue(value = "") { return `"${String(value || "").replaceAll('"', '""')}"`; }
function currentMinuteIso() { const now = new Date(); now.setSeconds(0, 0); return now.toISOString(); }
async function fileData() {
  const response = await fetch(TRAFFIC_API, { cache: "no-store" });
  if (!response.ok) throw new Error(`Local traffic server returned ${response.status}.`);
  return response.json();
}
async function records() { return ((await fileData()).trips || []).filter(configuredRoad); }

async function capture() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !/^https:\/\/(www\.|maps\.)?google\.(com|com\.bd)\/maps\//.test(tab.url || "")) return notice("Open a Google Maps directions page first.", "error");
  try {
    const data = await chrome.tabs.sendMessage(tab.id, { type: "CAPTURE_ROUTE" });
    fields.forEach((key) => { if (data?.[key]) $(key).value = data[key]; });
    capturedUrl = data?.url || tab.url || "";
    notice(data?.start && data?.destination ? "Monitoring this journey. The shortest route is saved each minute." : "Waiting for complete route details from Google Maps.", data?.start ? "success" : "");
  } catch { notice("Reload Google Maps once, then click Refresh.", "error"); }
}

async function render() {
  let data;
  try { data = await fileData(); }
  catch { $("records").innerHTML = '<div class="empty">Start the website on localhost:3000 to read the shared traffic file.</div>'; return; }
  const trips = (data.trips || []).filter(configuredRoad);
  const stored = await chrome.storage.local.get("monitoredRoutes");
  const storedById = new Map((stored.monitoredRoutes || []).map((route) => [route.id, route]));
  const monitoredRoutes = DHAKA_ROADS.map((route) => storedById.get(route.id) || route);
  const routes = new Map();
  trips.forEach((trip) => {
    const key = trip.roadId ? `dhaka-road:${trip.roadId}` : tripKey(trip);
    const group = routes.get(key);
    if (group) group.count += 1;
    else routes.set(key, { latest: trip, count: 1 });
  });
  if (Array.isArray(monitoredRoutes)) monitoredRoutes.forEach((route) => {
    if (!routes.has(route.key)) routes.set(route.key, { latest: route, count: 0 });
  });
  $("records").innerHTML = routes.size ? [...routes.entries()].map(([key, route]) => {
    const item = route.latest;
    const heading = item.roadName ? `${escapeHtml(item.roadName)}<small style="display:block;margin-top:2px;font-size:9px;text-transform:uppercase;letter-spacing:.08em;color:#0f766e">Built-in Dhaka road</small>` : `${escapeHtml(item.start)} → ${escapeHtml(item.destination)}`;
    const latest = route.count && item.savedAt ? ` · Latest ${new Date(item.savedAt).toLocaleString()}` : " · Awaiting first snapshot";
    const remove = item.builtIn || item.roadId ? "" : `<button class="remove" data-route-key="${encodeURIComponent(key)}" title="Remove route and snapshots">×</button>`;
    return `<article class="trip"><strong>${heading}</strong><p>${escapeHtml(item.start)} → ${escapeHtml(item.destination)}<br>${route.count} snapshot${route.count === 1 ? "" : "s"}${latest}</p>${remove}</article>`;
  }).join("") : '<div class="empty">No monitored routes yet.</div>';
}

$("trip-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const trip = Object.fromEntries(fields.map((key) => [key, $(key).value.trim()]));
  Object.assign(trip, { notes: $("notes").value.trim(), url: capturedUrl, savedAt: currentMinuteIso(), id: crypto.randomUUID() });
  const { monitoredRoutes = [] } = await chrome.storage.local.get("monitoredRoutes");
  const key = tripKey(trip);
  const route = { key, start: trip.start, destination: trip.destination, url: trip.url, savedAt: trip.savedAt };
  const response = await fetch(TRAFFIC_API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ snapshots: [trip], monitoredRoute: route }) });
  if (!response.ok) return notice("Start the website on localhost:3000, then save again.", "error");
  await chrome.storage.local.set({ monitoredRoutes: [route, ...monitoredRoutes.filter((item) => item.key !== key)].slice(0, 50) });
  notice("Trip saved to local history.", "success"); $("notes").value = ""; await render();
});
$("refresh").addEventListener("click", capture);
$("collection-enabled").addEventListener("change", async (event) => {
  const enabled = event.target.checked;
  await chrome.storage.local.set({ collectionEnabled: enabled });
  await chrome.runtime.sendMessage({ type: enabled ? "START_ROUTE_COLLECTION" : "STOP_ROUTE_COLLECTION" }).catch(() => undefined);
  await renderCollectionStatus(); notice(enabled ? "Automatic data collection resumed." : "Automatic data collection stopped.", "success");
});
$("records").addEventListener("click", async (event) => {
  const encodedKey = event.target.dataset?.routeKey; if (!encodedKey) return;
  const key = decodeURIComponent(encodedKey);
  const stored = await chrome.storage.local.get("monitoredRoutes");
  const monitoredRoutes = (stored.monitoredRoutes || []).filter((route) => route.key !== key || route.builtIn);
  const response = await fetch(TRAFFIC_API, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ routeKey: key }) });
  if (!response.ok) return notice("The local traffic file is unavailable.", "error");
  await chrome.storage.local.set({ monitoredRoutes });
  await chrome.runtime.sendMessage({ type: "STOP_ROUTE_COLLECTION" }).catch(() => undefined);
  if (monitoredRoutes.length) await chrome.runtime.sendMessage({ type: "START_ROUTE_COLLECTION" }).catch(() => undefined);
  await render();
});
$("clear").addEventListener("click", async () => {
  if (!confirm("Clear all recorded snapshots? The ten built-in Dhaka roads will continue to be monitored.")) return;
  const response = await fetch(TRAFFIC_API, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: "{}" });
  if (!response.ok) return notice("The local traffic file is unavailable.", "error");
  await chrome.storage.local.remove("lastAutoSignature"); await render();
});
$("export").addEventListener("click", async () => {
  const trips = await records(); if (!trips.length) return notice("There are no trips to export.", "error");
  const headers = ["Saved at", "Road", "Starting point", "Destination", "Travel time", "Distance", "Travel mode", "Notes", "Google Maps URL"];
  const rows = trips.map((trip) => [trip.savedAt, trip.roadName, trip.start, trip.destination, trip.duration, trip.distance, trip.travelMode, trip.notes, trip.url].map(csvValue).join(","));
  const url = URL.createObjectURL(new Blob([[headers.map(csvValue).join(","), ...rows].join("\r\n")], { type: "text/csv" }));
  await chrome.downloads.download({ url, filename: `maps-trips-${new Date().toISOString().slice(0, 10)}.csv`, saveAs: true }); setTimeout(() => URL.revokeObjectURL(url), 1000);
});

capture(); render(); renderCollectionStatus();
