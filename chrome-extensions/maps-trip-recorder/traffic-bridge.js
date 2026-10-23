const TRAFFIC_MESSAGE = "MAPS_TRIP_RECORDER_DATA";
const TRAFFIC_REQUEST = "MAPS_TRIP_RECORDER_REQUEST";
const TRAFFIC_CLEAR = "MAPS_TRIP_RECORDER_CLEAR";

async function publishTrips() {
  if (!location.pathname.startsWith("/personal/traffic")) return;
  const { trips = [] } = await chrome.storage.local.get("trips");
  window.postMessage({ type: TRAFFIC_MESSAGE, trips }, location.origin);
}

window.addEventListener("message", (event) => {
  if (event.source !== window || event.origin !== location.origin) return;
  if (event.data?.type === TRAFFIC_REQUEST) publishTrips();
  if (event.data?.type === TRAFFIC_CLEAR) {
    chrome.storage.local.remove(["trips", "monitoredRoutes", "lastAutoSignature"]).then(() => {
      chrome.runtime.sendMessage({ type: "STOP_ROUTE_COLLECTION" }).catch(() => undefined);
      return publishTrips();
    });
  }
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.trips) publishTrips();
});

document.addEventListener("DOMContentLoaded", publishTrips, { once: true });
