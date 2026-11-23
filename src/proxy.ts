import { NextResponse, type NextRequest } from "next/server";

// Domini che per ora mostrano solo «Sito in costruzione» (src/app/in-costruzione/route.ts).
// L'indirizzo vercel.app continua a mostrare il sito completo.
// Per aprire il sito sul dominio: su Vercel imposta COMING_SOON_HOSTS a "off" e ripubblica.
const HOSTS = (process.env.COMING_SOON_HOSTS ?? "floemawoodstudio.it,www.floemawoodstudio.it")
  .split(",")
  .map((h) => h.trim().toLowerCase())
  .filter(Boolean);

export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  if (!HOSTS.includes(host)) return NextResponse.next();
  return NextResponse.rewrite(new URL("/in-costruzione", request.url));
}

export const config = {
  // Restano raggiungibili i file tecnici (immagini, icone, anteprima) e le API.
  matcher: ["/((?!_next/|api/|images/|email/|in-costruzione|icon|apple-icon|opengraph-image|favicon|robots.txt|sitemap.xml).*)"],
};
