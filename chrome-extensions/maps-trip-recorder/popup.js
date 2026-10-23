const $ = (id) => document.getElementById(id);
const fields = ["start", "destination", "duration", "distance", "travelMode"];
let capturedUrl = "";

async function renderCollectionStatus() {
  const stored = await chrome.storage.local.get("collectionEnabled");
  const enabled = stored.collectionEnabled !== false;
  $("collection-enabled").checked = enabled;
  $("collection-status").textContent = enabled ? "Recording monitored routes" : "Paused — no automatic data is recorded";
}

function notice(message, type = "") { $("notice").textContent = message; $("notice").className = `notice ${type}`; }

async function capture() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !/^https:\/\/(www\.|maps\.)?google\.(com|com\.bd)\/maps\//.test(tab.url || "")) {
    notice("Open a Google Maps directions page first.", "error"); return;
  }
  try {
    const data = await chrome.tabs.sendMessage(tab.id, { type: "CAPTURE_ROUTE" });
    fields.forEach((key) => { if (data?.[key]) $(key).value = data[key]; });
    capturedUrl = data?.url || tab.url || "";
    notice(data?.start && data?.destination ? "Monitoring this journey. The shortest route and its distance are saved each minute." : "Waiting for complete route details from Google Maps.", data?.start ? "success" : "");
  } catch {
    notice("Reload Google Maps once, then click Refresh.", "error");
  }
}

async function records() { return (await chrome.storage.local.get("trips")).trips || []; }
function tripKey(trip) { return `${trip.start || ""}|${trip.destination || ""}`.toLowerCase(); }

async function render() {
  const trips = await records();
  const routes = new Map();
  trips.forEach((trip) => {
    const key = tripKey(trip);
    const group = routes.get(key);
    if (group) group.count += 1;
    else routes.set(key, { latest: trip, count: 1 });
  });
  $("records").innerHTML = routes.size ? [...routes.entries()].map(([key, route]) => {
    const trip = route.latest;
    return `<article class="trip"><strong>${escapeHtml(trip.start)} → ${escapeHtml(trip.destination)}</strong><p>${escapeHtml(trip.duration)}${trip.distance ? ` · ${escapeHtml(trip.distance)}` : ""}${trip.travelMode ? ` · ${escapeHtml(trip.travelMode)}` : ""}<br>${route.count} snapshot${route.count === 1 ? "" : "s"} · Latest ${new Date(trip.savedAt).toLocaleString()}</p><button class="remove" data-route-key="${encodeURIComponent(key)}" title="Remove this monitored route and its snapshots">×</button></article>`;
  }).join("") : '<div class="empty">No monitored routes yet.</div>';
}

function escapeHtml(value = "") { const div = document.createElement("div"); div.textContent = value; return div.innerHTML; }
function csvValue(value = "") { return `"${String(value).replaceAll('"', '""')}"`; }
function currentMinuteIso() { const now = new Date(); now.setSeconds(0, 0); return now.toISOString(); }

$("trip-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const trip = Object.fromEntries(fields.map((key) => [key, $(key).value.trim()]));
  trip.notes = $("notes").value.trim(); trip.url = capturedUrl; trip.savedAt = currentMinuteIso(); trip.id = crypto.randomUUID();
  const stored = await chrome.storage.local.get("monitoredRoutes");
  const monitoredRoutes = Array.isArray(stored.monitoredRoutes) ? stored.monitoredRoutes : [];
  const key = `${trip.start}|${trip.destination}`.toLowerCase();
  const route = { key, start: trip.start, destination: trip.destination, url: trip.url, savedAt: trip.savedAt };
  const trips = await records(); trips.unshift(trip); await chrome.storage.local.set({ trips, monitoredRoutes: [route, ...monitoredRoutes.filter((item) => item.key !== key)].slice(0, 50) });
  notice("Trip saved to local history.", "success"); $("notes").value = ""; await render();
});

$("refresh").addEventListener("click", capture);
$("collection-enabled").addEventListener("change", async (event) => {
  const enabled = event.target.checked;
  await chrome.storage.local.set({ collectionEnabled: enabled });
  await chrome.runtime.sendMessage({ type: enabled ? "START_ROUTE_COLLECTION" : "STOP_ROUTE_COLLECTION" }).catch(() => undefined);
  await renderCollectionStatus();
  notice(enabled ? "Automatic data collection resumed." : "Automatic data collection stopped. Existing trips are unchanged.", "success");
});
$("records").addEventListener("click", async (event) => {
  const encodedKey = event.target.dataset?.routeKey;
  if (!encodedKey) return;
  const key = decodeURIComponent(encodedKey);
  const stored = await chrome.storage.local.get(["trips", "monitoredRoutes"]);
  const trips = Array.isArray(stored.trips) ? stored.trips.filter((trip) => tripKey(trip) !== key) : [];
  const monitoredRoutes = Array.isArray(stored.monitoredRoutes) ? stored.monitoredRoutes.filter((route) => route.key !== key) : [];
  await chrome.storage.local.set({ trips, monitoredRoutes });
  await chrome.runtime.sendMessage({ type: "STOP_ROUTE_COLLECTION" }).catch(() => undefined);
  if (monitoredRoutes.length) await chrome.runtime.sendMessage({ type: "START_ROUTE_COLLECTION" }).catch(() => undefined);
  await render();
});
$("clear").addEventListener("click", async () => {
  if (!confirm("Clear all trips and stop monitoring every saved route?")) return;
  await chrome.storage.local.remove(["trips", "monitoredRoutes", "lastAutoSignature"]);
  await chrome.runtime.sendMessage({ type: "STOP_ROUTE_COLLECTION" }).catch(() => undefined);
  await render();
});
$("export").addEventListener("click", async () => {
  const trips = await records(); if (!trips.length) return notice("There are no trips to export.", "error");
  const headers = ["Saved at","Starting point","Destination","Travel time","Distance","Travel mode","Notes","Google Maps URL"];
  const rows = trips.map((t) => [t.savedAt,t.start,t.destination,t.duration,t.distance,t.travelMode,t.notes,t.url].map(csvValue).join(","));
  const url = URL.createObjectURL(new Blob([[headers.map(csvValue).join(","), ...rows].join("\r\n")], { type: "text/csv" }));
  await chrome.downloads.download({ url, filename: `maps-trips-${new Date().toISOString().slice(0,10)}.csv`, saveAs: true }); setTimeout(() => URL.revokeObjectURL(url), 1000);
});

capture(); render(); renderCollectionStatus();
