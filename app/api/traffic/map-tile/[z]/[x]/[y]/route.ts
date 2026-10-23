type Context = { params: Promise<{ z: string; x: string; y: string }> };

export async function GET(_request: Request, { params }: Context) {
  const { z, x, y } = await params;
  if (![z, x, y].every((value) => /^\d+$/.test(value))) return new Response("Invalid tile.", { status: 400 });
  const response = await fetch(`https://tile.openstreetmap.org/${z}/${x}/${y}.png`, {
    headers: { "User-Agent": "IELTS-Personal-Traffic-Map/1.0" },
    next: { revalidate: 2_592_000 },
  });
  if (!response.ok) return new Response("Map tile unavailable.", { status: 502 });
  return new Response(await response.arrayBuffer(), {
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=2592000, immutable" },
  });
}
