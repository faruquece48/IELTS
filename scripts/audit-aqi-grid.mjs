import { districts } from "../lib/districtAqi.ts";

const resolved = [];
for (let offset = 0; offset < districts.length; offset += 32) {
  const batch = districts.slice(offset, offset + 32);
  const url = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
  url.searchParams.set("latitude", batch.map((district) => district.latitude).join(","));
  url.searchParams.set("longitude", batch.map((district) => district.longitude).join(","));
  url.searchParams.set("current", "us_aqi");
  url.searchParams.set("domains", "cams_global");
  url.searchParams.set("timezone", "Asia/Dhaka");
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`AQI grid audit returned ${response.status}.`);
  const payload = await response.json();
  const locations = Array.isArray(payload) ? payload : [payload];
  batch.forEach((district, index) => {
    const location = locations[index] ?? {};
    resolved.push({
      district: district.id,
      requested: [district.latitude, district.longitude],
      resolved: [Number(location.latitude), Number(location.longitude)],
    });
  });
}

const groups = new Map();
for (const location of resolved) {
  const key = location.resolved.join(",");
  groups.set(key, [...(groups.get(key) ?? []), location.district]);
}

console.log(JSON.stringify({
  requestedDistricts: districts.length,
  distinctResolvedLocations: groups.size,
  sharedLocations: [...groups.entries()].filter(([, districtIds]) => districtIds.length > 1).map(([location, districtIds]) => ({ location, districtIds })),
  resolved,
}, null, 2));
