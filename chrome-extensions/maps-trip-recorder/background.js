importScripts("dhaka-roads.js");

const COLLECT_ALARM = "collect-monitored-routes";
const ADVANCE_PREFIX = "advance-collector-tab-";
const TRAFFIC_API = "http://localhost:3000/api/traffic";
const advanceTimers = new Map();
let snapshotSaveQueue = Promise.resolve();
let collectorStarting = false;

function saveRouteSnapshot(payload) {
  const operation = snapshotSaveQueue.catch(() => undefined).then(async () => {
    const snapshots = Array.isArray(payload?.snapshots) ? payload.snapshots : [];
    const monitoredRoute = payload?.monitoredRoute;
    if (!snapshots.length || !monitoredRoute?.key) return;
    const response = await fetch(TRAFFIC_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ snapshots, monitoredRoute }),
    });
    if (!response.ok) throw new Error(`Local traffic server returned ${response.status}.`);
    await chrome.storage.local.set({ lastAutoSignature: payload.signature || "" });
  });
  snapshotSaveQueue = operation.catch(() => undefined);
  return operation;
}

async function migrateBrowserRecords() {
  const stored = await chrome.storage.local.get(["trips", "monitoredRoutes", "trafficFileMigrationComplete"]);
  if (stored.trafficFileMigrationComplete) return;
  const trips = Array.isArray(stored.trips) ? stored.trips : [];
  const monitoredRoutes = Array.isArray(stored.monitoredRoutes) ? stored.monitoredRoutes : [];
  try {
    for (let index = 0; index < trips.length; index += 250) {
      const response = await fetch(TRAFFIC_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ snapshots: trips.slice(index, index + 250), monitoredRoutes: index === 0 ? monitoredRoutes : [] }),
      });
      if (!response.ok) throw new Error(`Migration failed with ${response.status}.`);
    }
    if (!trips.length && monitoredRoutes.length) {
      const response = await fetch(TRAFFIC_API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ monitoredRoutes }) });
      if (!response.ok) throw new Error(`Migration failed with ${response.status}.`);
    }
    await chrome.storage.local.remove("trips");
    await chrome.storage.local.set({ trafficFileMigrationComplete: true });
  } catch { /* Retry after the local website server is started. */ }
}

async function collectorTabIds() {
  const { collectorTabIds = [] } = await chrome.storage.session.get("collectorTabIds");
  const openIds = [];
  for (const tabId of collectorTabIds) {
    try { await chrome.tabs.get(tabId); openIds.push(tabId); } catch { /* The collector tab is already closed. */ }
  }
  await chrome.storage.session.set({ collectorTabIds: openIds });
  return openIds;
}

async function forgetCollectorTab(tabId) {
  clearTimeout(advanceTimers.get(tabId));
  advanceTimers.delete(tabId);
  await chrome.alarms.clear(`${ADVANCE_PREFIX}${tabId}`);
  const ids = await collectorTabIds();
  await chrome.storage.session.set({ collectorTabIds: ids.filter((id) => id !== tabId) });
}

async function stopCollection() {
  const ids = await collectorTabIds();
  await chrome.storage.session.set({ collectorTabIds: [] });
  ids.forEach((tabId) => {
    clearTimeout(advanceTimers.get(tabId));
    advanceTimers.delete(tabId);
    void chrome.alarms.clear(`${ADVANCE_PREFIX}${tabId}`);
  });
  await Promise.all(ids.map((tabId) => chrome.tabs.remove(tabId).catch(() => undefined)));
}

async function collectionEnabled() {
  const stored = await chrome.storage.local.get("collectionEnabled");
  return stored.collectionEnabled !== false;
}

async function scheduleCollection() {
  await chrome.alarms.create(COLLECT_ALARM, { periodInMinutes: 1 });
}

async function ensureDhakaRoads() {
  const { monitoredRoutes = [] } = await chrome.storage.local.get("monitoredRoutes");
  const existing = Array.isArray(monitoredRoutes) ? monitoredRoutes : [];
  const builtInIds = new Set(DHAKA_ROADS.map((route) => route.id));
  const previousBuiltIns = new Map(existing.filter((route) => route.builtIn || builtInIds.has(route.id)).map((route) => [route.id, route]));
  const builtIns = DHAKA_ROADS.map((route) => ({ ...route, savedAt: previousBuiltIns.get(route.id)?.savedAt || new Date().toISOString() }));
  await chrome.storage.local.set({ monitoredRoutes: builtIns });
}

async function configuredRoutes() {
  const { monitoredRoutes = [] } = await chrome.storage.local.get("monitoredRoutes");
  return Array.isArray(monitoredRoutes)
    ? monitoredRoutes.filter((route) => /^https:\/\/(www\.|maps\.)?google\.(com|com\.bd)\/maps\//.test(route.url || "")).slice(0, 20)
    : [];
}

async function advanceCollectorTab(tabId) {
  if (!await collectionEnabled()) return stopCollection();
  const routes = await configuredRoutes();
  if (!routes.length) return;
  const state = await chrome.storage.session.get("nextRouteIndex");
  const index = Number.isInteger(state.nextRouteIndex) ? state.nextRouteIndex % routes.length : 0;
  await chrome.storage.session.set({ nextRouteIndex: (index + 1) % routes.length });
  try {
    await chrome.tabs.update(tabId, { url: routes[index].url, active: false });
    await chrome.alarms.create(`${ADVANCE_PREFIX}${tabId}`, { delayInMinutes: 0.5 });
  } catch {
    await forgetCollectorTab(tabId);
    await collectMonitoredRoutes();
  }
}

async function scheduleNextRoute(tabId) {
  const ids = await collectorTabIds();
  if (!ids.includes(tabId)) return;
  clearTimeout(advanceTimers.get(tabId));
  await chrome.alarms.clear(`${ADVANCE_PREFIX}${tabId}`);
  const timer = setTimeout(() => {
    advanceTimers.delete(tabId);
    void advanceCollectorTab(tabId);
  }, 7000);
  advanceTimers.set(tabId, timer);
}

async function collectMonitoredRoutes() {
  if (collectorStarting) return;
  collectorStarting = true;
  try {
  if (!await collectionEnabled()) {
    await stopCollection();
    return;
  }
  const activeCollectors = await collectorTabIds();
  if (activeCollectors.length) return;
  const routes = await configuredRoutes();
  if (!routes.length) return;
  const opened = [];
  try {
    const collectorWindow = await chrome.windows.create({ url: routes[0].url, focused: false, state: "normal", type: "popup", width: 1100, height: 760 });
    const firstTab = collectorWindow.tabs?.[0] || (await chrome.tabs.query({ windowId: collectorWindow.id }))[0];
    if (firstTab?.id) opened.push(firstTab.id);
    for (const route of routes.slice(1)) {
      const tab = await chrome.tabs.create({ windowId: collectorWindow.id, url: route.url, active: false });
      if (tab.id) opened.push(tab.id);
    }
  } catch {
    for (const route of routes) {
      const tab = await chrome.tabs.create({ url: route.url, active: false, pinned: false });
      if (tab.id) opened.push(tab.id);
    }
  }
  if (!opened.length) return;
  await chrome.storage.session.set({ collectorTabIds: opened });
  } finally {
    collectorStarting = false;
  }
}

chrome.runtime.onInstalled.addListener(() => { void stopCollection().then(ensureDhakaRoads).then(migrateBrowserRecords).then(scheduleCollection).then(collectMonitoredRoutes); });
chrome.runtime.onStartup.addListener(() => { void ensureDhakaRoads().then(migrateBrowserRecords).then(scheduleCollection).then(collectMonitoredRoutes); });
async function captureTab(tab) {
  if (tab.active && Number.isInteger(tab.windowId)) {
    try { return await chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }); } catch { /* A minimized window falls back to optional debugger capture below. */ }
  }
  if (!Number.isInteger(tab.id)) return null;
  const target = { tabId: tab.id };
  try {
    await chrome.debugger.attach(target, "1.3");
    const result = await chrome.debugger.sendCommand(target, "Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
    return result?.data ? `data:image/png;base64,${result.data}` : null;
  } catch {
    return null;
  } finally {
    await chrome.debugger.detach(target).catch(() => undefined);
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "STOP_ROUTE_COLLECTION") void stopCollection();
  if (message?.type === "START_ROUTE_COLLECTION") void collectMonitoredRoutes();
  if (message?.type === "CAPTURE_VISIBLE_TRAFFIC") {
    if (!sender.tab) { sendResponse({ unavailable: true }); return; }
    captureTab(sender.tab)
      .then((image) => sendResponse(image ? { image } : { unavailable: true }))
      .catch(() => sendResponse({ unavailable: true }));
    return true;
  }
  if (message?.type === "SAVE_ROUTE_SNAPSHOT") {
    saveRouteSnapshot(message)
      .then(() => {
        sendResponse({ saved: true });
      })
      .catch((error) => sendResponse({ saved: false, error: String(error) }));
    return true;
  }
});
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !changes.collectionEnabled) return;
  if (changes.collectionEnabled.newValue === false) void stopCollection();
  else void collectMonitoredRoutes();
});
chrome.tabs.onRemoved.addListener((tabId) => { void forgetCollectorTab(tabId); });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === COLLECT_ALARM) {
    void collectorTabIds().then(async (ids) => {
      if (!ids.length) return collectMonitoredRoutes();
      await Promise.all(ids.map((tabId) => chrome.tabs.sendMessage(tabId, { type: "CAPTURE_NOW" }).catch(() => undefined)));
    });
    return;
  }
});

void ensureDhakaRoads().then(migrateBrowserRecords).then(scheduleCollection).then(async () => {
  const ids = await collectorTabIds();
  if (ids.length) {
    await Promise.all(ids.map((tabId) => chrome.tabs.reload(tabId).catch(() => undefined)));
    return;
  }
  await collectMonitoredRoutes();
});
