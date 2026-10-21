import { NextResponse } from "next/server";
import { readCollection, writeCollection } from "@/lib/store";

type Subscriber = { email: string; profile: "privato" | "architetto"; createdAt: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const profile = body?.profile === "architetto" ? "architetto" : "privato";

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Inserisci un indirizzo email valido." }, { status: 400 });
  }
  if (body?.consent !== true) {
    return NextResponse.json({ error: "Serve il consenso al trattamento dei dati." }, { status: 400 });
  }

  const subscribers = await readCollection<Subscriber[]>("subscribers", []);
  if (!subscribers.some((s) => s.email === email)) {
    subscribers.push({ email, profile, createdAt: new Date().toISOString() });
    await writeCollection("subscribers", subscribers);
  }
  return NextResponse.json({ ok: true });
}
