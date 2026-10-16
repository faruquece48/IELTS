export const dynamic = "force-dynamic";
const boundaryRevalidate = 86_400;

const boundaryUrl = "https://media.githubusercontent.com/media/wmgeolab/geoBoundaries/9469f09592ced973a3448cf66b6100b741b64c0d/releaseData/gbOpen/BGD/ADM2/geoBoundaries-BGD-ADM2_simplified.geojson";

export async function GET() {
  const response = await fetch(boundaryUrl, { next: { revalidate: boundaryRevalidate } });
  if (!response.ok) return Response.json({ error: `District boundary provider returned ${response.status}.` }, { status: 502 });
  return new Response(await response.arrayBuffer(), { headers: { "Content-Type": "application/geo+json; charset=utf-8", "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" } });
}
