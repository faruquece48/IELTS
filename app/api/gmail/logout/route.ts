import { clearSession } from "@/lib/gmail";
export async function POST(){await clearSession();return Response.json({ok:true})}