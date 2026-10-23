import { NextResponse } from "next/server";
import { backendFetch, backendUrl } from "@/lib/backend";

// Inoltra il modulo Contatti al backend; senza backend risponde 503 e il modulo ripiega sull'email.
export async function POST(req: Request) {
  if (!backendUrl()) return NextResponse.json({ error: "Backend non collegato." }, { status: 503 });
  const body = await req.json().catch(() => null);
  try {
    const res = await backendFetch("/api/contact/", { method: "POST", body });
    return NextResponse.json(await res.json(), { status: res.status });
  } catch {
    return NextResponse.json({ error: "Backend non raggiungibile." }, { status: 503 });
  }
}
