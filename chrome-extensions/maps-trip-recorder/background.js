const COLLECT_ALARM = "collect-monitored-routes";
const CLOSE_PREFIX = "close-collector-tab-";

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
  const ids = await collectorTabIds();
  await chrome.storage.session.set({ collectorTabIds: ids.filter((id) => id !== tabId) });
}

async function stopCollection() {
  const ids = await collectorTabIds();
  await chrome.storage.session.set({ collectorTabIds: [] });
  await Promise.all(ids.map((tabId) => chrome.tabs.remove(tabId).catch(() => undefined)));
}

async function collectionEnabled() {
  const stored = await chrome.storage.local.get("collectionEnabled");
  return stored.collectionEnabled !== false;
}

async function scheduleCollection() {
  await chrome.alarms.create(COLLECT_ALARM, { periodInMinutes: 1 });
}

async function collectMonitoredRoutes() {
  if (!await collectionEnabled()) {
    await stopCollection();
    return;
  }
  const activeCollectors = await collectorTabIds();
  if (activeCollectors.length) return;
  const { monitoredRoutes = [] } = await chrome.storage.local.get("monitoredRoutes");
  const routes = Array.isArray(monitoredRoutes) ? monitoredRoutes.filter((route) => /^https:\/\/(www\.|maps\.)?google\.(com|com\.bd)\/maps\//.test(route.url || "")) : [];
  const opened = [];
  for (const route of routes.slice(0, 20)) {
    try {
      const tab = await chrome.tabs.create({ url: route.url, active: false });
      if (!tab.id) continue;
      opened.push(tab.id);
      await chrome.alarms.create(`${CLOSE_PREFIX}${tab.id}`, { delayInMinutes: 0.4 });
    } catch { /* Try the route again on the next collection cycle. */ }
  }
  await chrome.storage.session.set({ collectorTabIds: opened });
}

chrome.runtime.onInstalled.addListener(() => { void scheduleCollection(); });
chrome.runtime.onStartup.addListener(() => { void scheduleCollection(); void collectMonitoredRoutes(); });
async function captureTab(tab) {
  if (tab.active && Number.isInteger(tab.windowId)) {
    try { return await chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }); } catch { /* Use DevTools capture below. */ }
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
});
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !changes.collectionEnabled) return;
  if (changes.collectionEnabled.newValue === false) void stopCollection();
  else void collectMonitoredRoutes();
});
chrome.tabs.onRemoved.addListener((tabId) => { void forgetCollectorTab(tabId); });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === COLLECT_ALARM) { void collectMonitoredRoutes(); return; }
  if (!alarm.name.startsWith(CLOSE_PREFIX)) return;
  const tabId = Number(alarm.name.slice(CLOSE_PREFIX.length));
  if (!Number.isInteger(tabId)) return;
  void forgetCollectorTab(tabId);
  void chrome.tabs.remove(tabId).catch(() => undefined);
});

void scheduleCollection();
