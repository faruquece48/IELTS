export const dynamic = "force-dynamic";

const boundaryUrl = "https://nominatim.openstreetmap.org/search?format=geojson&polygon_geojson=1&polygon_threshold=0.0003&limit=1&city=Dhaka&country=Bangladesh";

export async function GET() {
  try {
    const response = await fetch(boundaryUrl, {
      headers: { "User-Agent": "IELTS-Personal-Traffic-Map/1.0" },
      next: { revalidate: 604_800 },
    });
    if (!response.ok) return Response.json({ error: `Boundary provider returned ${response.status}.` }, { status: 502 });
    return new Response(await response.arrayBuffer(), {
      headers: { "Content-Type": "application/geo+json; charset=utf-8", "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" },
    });
  } catch {
    return Response.json({ error: "Dhaka boundary is temporarily unavailable." }, { status: 502 });
  }
}
