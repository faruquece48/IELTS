import { readFile } from "node:fs/promises";
import path from "node:path";
import { QURAN_FIRST_PAGE, QURAN_LAST_PAGE } from "@/lib/quran";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ page: string }> },
) {
  const value = Number((await params).page);

  if (!Number.isInteger(value) || value < QURAN_FIRST_PAGE || value > QURAN_LAST_PAGE) {
    return new Response("Quran page not found", { status: 404 });
  }

  try {
    const file = await readFile(path.join(process.cwd(), "app", "quran", `quran_${value}.png`));
    return new Response(file, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Quran page not found", { status: 404 });
  }
}
