function text(element) {
  return element?.textContent?.replace(/\s+/g, " ").trim() || "";
}

function visible(element) {
  if (!(element instanceof HTMLElement)) return false;
  const style = getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden" && element.offsetParent !== null;
}

function routeInputs() {
  const inputs = [...document.querySelectorAll("input")].filter(visible);
  const routeLike = inputs.filter((input) => {
    const label = `${input.getAttribute("aria-label") || ""} ${input.placeholder || ""}`.toLowerCase();
    return /starting point|origin|destination|choose destination|choose starting/i.test(label);
  });
  const candidates = routeLike.length >= 2 ? routeLike : inputs.filter((input) => input.value?.trim()).slice(0, 2);
  return { start: candidates[0]?.value?.trim() || "", destination: candidates[1]?.value?.trim() || "" };
}

function routeDetails() {
  const durationPattern = /(?:\d+\s*(?:hr|hour|hours|h)\s*)?(?:\d+\s*(?:min|mins|minute|minutes))|\d+\s*(?:hr|hour|hours)/i;
  const distancePattern = /\d+(?:[.,]\d+)?\s*(?:km|mi|miles|m)\b/i;
  const durationMinutes = (value) => {
    const match = value.match(durationPattern)?.[0] || "";
    const hours = Number(match.match(/(\d+)\s*(?:hr|hour|hours|h)/i)?.[1] || 0);
    const minutes = Number(match.match(/(\d+)\s*(?:min|mins|minute|minutes)/i)?.[1] || 0);
    return hours * 60 + minutes || Number.POSITIVE_INFINITY;
  };
  const durationNodes = [...document.querySelectorAll("[role='main'] div, [role='main'] span")].filter((node) => {
    const value = text(node);
    return visible(node) && value.length < 40 && durationPattern.test(value);
  });
  const routes = durationNodes.flatMap((durationNode) => {
    let container = durationNode;
    for (let level = 0; level < 8 && container; level += 1, container = container.parentElement) {
      const value = text(container);
      const duration = value.match(durationPattern)?.[0] || "";
      const distance = value.match(distancePattern)?.[0] || "";
      if (duration && distance && value.length < 600) {
        const via = value.match(/\bvia\s+(.+?)(?=\s+(?:\d+\s*(?:hr|hour|hours|h|min|mins|minute|minutes)|\d+(?:[.,]\d+)?\s*(?:km|mi|miles|m)\b)|$)/i)?.[1]?.trim();
        const routeName = via ? `via ${via}` : `${distance} route`;
        return [{ duration, distance, routeName, routeSummary: value.slice(0, 240), minutes: durationMinutes(duration), length: value.length }];
      }
    }
    return [];
  });
  const distinctRoutes = new Map();
  routes.forEach((route) => {
    const key = `${route.routeName}|${route.distance}`.toLowerCase();
    const existing = distinctRoutes.get(key);
    if (!existing || route.length < existing.length) distinctRoutes.set(key, route);
  });
  return [...distinctRoutes.values()].sort((a, b) => a.minutes - b.minutes || a.length - b.length);
}

function travelMode() {
  const modePattern = /\b(driving|car|transit|public transport|walking|walk|cycling|bicycling|bicycle|motorcycle|two-wheeler)\b/i;
  const selectedControls = [...document.querySelectorAll("[aria-selected='true'], [aria-pressed='true'], [aria-checked='true']")].filter(visible);
  const selected = selectedControls.find((node) => modePattern.test(`${node.getAttribute("aria-label") || ""} ${node.getAttribute("data-tooltip") || ""} ${node.getAttribute("title") || ""} ${text(node)}`));
  const label = `${selected?.getAttribute("aria-label") || ""} ${selected?.getAttribute("data-tooltip") || ""} ${selected?.getAttribute("title") || ""}`.trim();
  const mode = label.match(modePattern)?.[1]?.toLowerCase();
  if (!mode) return "";
  if (["car", "driving"].includes(mode)) return "Driving";
  if (["transit", "public transport"].includes(mode)) return "Transit";
  if (["walking", "walk"].includes(mode)) return "Walking";
  if (["cycling", "bicycling", "bicycle"].includes(mode)) return "Bicycling";
  return "Motorcycle";
}

function currentMinuteIso() {
  const now = new Date();
  now.setSeconds(0, 0);
  return now.toISOString();
}

function googleRouteCoordinates() {
  const points = [...location.href.matchAll(/!1d(-?\d+(?:\.\d+)?)!2d(-?\d+(?:\.\d+)?)/g)]
    .map((match) => [Number(match[1]), Number(match[2])])
    .filter(([longitude, latitude]) => Number.isFinite(longitude) && Number.isFinite(latitude));
  if (points.length < 2) return null;
  return {
    source: "google-maps-extension",
    origin: points[0],
    destination: points[points.length - 1],
    ...(points.length > 2 ? { path: points } : {}),
    capturedAt: new Date().toISOString(),
  };
}

function normalizedPlace(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function placeMatches(value, aliases) {
  const normalized = normalizedPlace(value);
  return aliases.some((alias) => {
    const candidate = normalizedPlace(alias);
    return candidate.length > 3 && (normalized.includes(candidate) || candidate.includes(normalized));
  });
}

function studyRouteId() {
  try {
    return new URL(location.href).searchParams.get("study_route_id") || "";
  } catch {
    return "";
  }
}

async function estimateTrafficPortions() {
  const response = await chrome.runtime.sendMessage({ type: "CAPTURE_VISIBLE_TRAFFIC" }).catch(() => null);
  if (!response?.image) return null;
  const image = new Image();
  image.src = response.image;
  await image.decode();
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return null;
  context.drawImage(image, 0, 0);

  const mapCanvas = [...document.querySelectorAll("canvas")]
    .map((element) => element.getBoundingClientRect())
    .filter((rect) => rect.width > innerWidth * 0.35 && rect.height > innerHeight * 0.35)
    .sort((a, b) => b.width * b.height - a.width * a.height)[0];
  const scaleX = image.naturalWidth / innerWidth;
  const scaleY = image.naturalHeight / innerHeight;
  const bounds = mapCanvas || { left: 0, top: 48, right: innerWidth, bottom: innerHeight };
  const left = Math.max(0, Math.floor(bounds.left * scaleX));
  const top = Math.max(0, Math.floor(bounds.top * scaleY));
  const right = Math.min(image.naturalWidth, Math.ceil(bounds.right * scaleX));
  const bottom = Math.min(image.naturalHeight, Math.ceil(bounds.bottom * scaleY));
  const pixels = context.getImageData(left, top, right - left, bottom - top).data;
  const counts = { green: 0, yellow: 0, red: 0, maroon: 0 };

  for (let index = 0; index < pixels.length; index += 16) {
    const red = pixels[index];
    const green = pixels[index + 1];
    const blue = pixels[index + 2];
    if (green > 105 && green > red * 1.22 && green > blue * 1.2) counts.green += 1;
    else if (red > 185 && green >= 75 && green < 230 && blue < 115) counts.yellow += 1;
    else if (red >= 165 && green < 90 && blue < 90) counts.red += 1;
    else if (red >= 85 && red < 165 && green < 75 && blue < 85) counts.maroon += 1;
  }

  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  if (total < 40) return null;
  const portions = Object.fromEntries(Object.entries(counts).map(([color, count]) => [color, Number((count * 100 / total).toFixed(1))]));
  return { ...portions, method: "visible-map-estimate", sampledPixels: total };
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "CAPTURE_NOW") {
    automaticallyRecordRoute(true).then(() => sendResponse({ captured: true })).catch(() => sendResponse({ captured: false }));
    return true;
  }
  if (message?.type !== "CAPTURE_ROUTE") return;
  const inputs = routeInputs();
  const details = routeDetails()[0] || { duration: "", distance: "", routeName: "", routeSummary: "" };
  sendResponse({
    ...inputs,
    ...details,
    travelMode: travelMode(),
    pageTitle: document.title,
    url: location.href
  });
});

let captureTimer;
let lastObservedSignature = "";
let extensionActive = true;
let collectionEnabled = false;
let snapshotInterval;
let readinessInterval;
let routeObserver;

function stopCollector() {
  extensionActive = false;
  clearTimeout(captureTimer);
  clearInterval(snapshotInterval);
  clearInterval(readinessInterval);
  routeObserver?.disconnect();
}

async function automaticallyRecordRoute(forceSnapshot = false) {
  if (!extensionActive || !collectionEnabled) return;
  try {
    const inputs = routeInputs();
    const shortestRoute = routeDetails()[0];
    if (!inputs.start || !inputs.destination || !shortestRoute) return;
    const routes = [shortestRoute];
    const mode = travelMode();
    const signature = [inputs.start, inputs.destination, mode, ...routes.map((route) => `${route.routeName}|${route.duration}|${route.distance}`)].join("|").toLowerCase();
    if (!forceSnapshot && signature === lastObservedSignature) return;
    lastObservedSignature = signature;

    const stored = await chrome.storage.local.get(["lastAutoSignature", "monitoredRoutes"]);
    if (!forceSnapshot && stored.lastAutoSignature === signature) return;
    const savedAt = currentMinuteIso();
    const trafficPortions = await estimateTrafficPortions();
    const routeCoordinates = googleRouteCoordinates();
    const snapshots = routes.map((route) => ({
      id: crypto.randomUUID(), ...inputs, ...route, travelMode: mode,
      notes: "Automatic one-minute shortest-route snapshot", savedAt, url: location.href, automatic: true,
      ...(trafficPortions ? { trafficPortions } : {}),
      ...(routeCoordinates ? { routeCoordinates } : {})
    }));
    const monitoredRoutes = Array.isArray(stored.monitoredRoutes) ? stored.monitoredRoutes : [];
    const monitorKey = `${inputs.start}|${inputs.destination}`.toLowerCase();
    const configuredRoute = monitoredRoutes.find((route) => route.builtIn && route.id === studyRouteId()) || monitoredRoutes.filter((route) => {
      const startAliases = route.startAliases || [route.start.split(",")[0].toLowerCase()];
      const destinationAliases = route.destinationAliases || [route.destination.split(",")[0].toLowerCase()];
      const firstWaypointAliases = route.waypoints?.[0] ? [route.waypoints[0].split(",")[0]] : [];
      return route.builtIn && placeMatches(inputs.start, startAliases) && (placeMatches(inputs.destination, destinationAliases) || placeMatches(inputs.destination, firstWaypointAliases));
    }).sort((first, second) => {
      const page = normalizedPlace(location.href);
      const matchingWaypoints = (route) => (route.waypoints || []).slice(1, 3).filter((waypoint) => page.includes(normalizedPlace(waypoint))).length;
      return matchingWaypoints(second) - matchingWaypoints(first);
    })[0];
    const monitoredRoute = configuredRoute
      ? { ...configuredRoute, start: inputs.start, destination: inputs.destination, url: location.href, savedAt, ...(routeCoordinates ? { routeCoordinates } : {}) }
      : { key: monitorKey, start: inputs.start, destination: inputs.destination, url: location.href, savedAt, ...(routeCoordinates ? { routeCoordinates } : {}) };
    snapshots.forEach((snapshot) => {
      if (configuredRoute?.roadName) snapshot.roadName = configuredRoute.roadName;
      if (configuredRoute?.id) snapshot.roadId = configuredRoute.id;
    });
    const saved = await chrome.runtime.sendMessage({ type: "SAVE_ROUTE_SNAPSHOT", snapshots, monitoredRoute, signature });
    if (!saved?.saved) throw new Error(saved?.error || "The background worker could not save the route snapshot.");
  } catch (error) {
    if (String(error).includes("Extension context invalidated")) stopCollector();
    else throw error;
  }
}

function scheduleAutomaticCapture() {
  if (!extensionActive || !collectionEnabled) return;
  clearTimeout(captureTimer);
  captureTimer = setTimeout(() => automaticallyRecordRoute(false), 2500);
}

routeObserver = new MutationObserver(scheduleAutomaticCapture);
routeObserver.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-selected", "aria-pressed"] });
window.addEventListener("popstate", scheduleAutomaticCapture);
chrome.storage.local.get("collectionEnabled").then((stored) => {
  collectionEnabled = stored.collectionEnabled !== false;
  if (collectionEnabled) scheduleAutomaticCapture();
}).catch(() => stopCollector());
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !changes.collectionEnabled) return;
  collectionEnabled = changes.collectionEnabled.newValue !== false;
  clearTimeout(captureTimer);
  if (collectionEnabled) scheduleAutomaticCapture();
});
readinessInterval = setInterval(() => automaticallyRecordRoute(false), 5_000);
