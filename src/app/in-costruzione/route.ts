import { MARK_PATH, MARK_VIEWBOX, WORD_PATHS, WORD_VIEWBOX } from "@/components/Logo";
import { COMPANY } from "@/lib/company";

// Pagina «Sito in costruzione»: la vede solo chi arriva dal dominio pubblico (vedi src/proxy.ts).
// È un HTML a sé, senza header, carrello e animazioni del sito.
const EMAIL = "info@floemawoodstudio.it";

const html = `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#eee7de">
<title>FLOEMA Wood Studio — Sito in costruzione</title>
<meta name="description" content="FLOEMA Wood Studio: arredi di design in legno massello, realizzati a mano a Livigno. Il sito è in costruzione.">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%}
  body{background:#eee7de;color:#2a2c2a;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;
    display:flex;flex-direction:column;min-height:100svh;padding:40px 48px}

  main{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:64px 0}
  .mark{width:64px;height:64px;color:#2a2c2a;margin-bottom:36px}
  .word{width:min(420px,70vw);height:auto;color:#2a2c2a}
  .rule{width:48px;height:1px;background:#2a2c2a;margin:44px auto 36px;opacity:.5}
  h1{font-weight:200;font-size:clamp(26px,3.4vw,40px);letter-spacing:.08em;text-transform:uppercase;line-height:1.15}
  p{margin-top:20px;max-width:440px;font-size:15px;line-height:1.65;color:#4d4a45}
  a.mail{display:inline-block;margin-top:36px;padding:16px 26px;border:1px solid #2a2c2a;color:#2a2c2a;text-decoration:none;
    font-size:11px;letter-spacing:.24em;text-transform:uppercase;transition:background .3s,border-color .3s}
  a.mail:hover{background:#d8c8b8;border-color:#d8c8b8}
  footer{text-align:center;font-size:10px;letter-spacing:.14em;line-height:1.7;color:#8a847c}
  @media (max-width:640px){
    body{padding:24px 20px}
    .mark{width:52px;height:52px;margin-bottom:28px}
  }
</style>
</head>
<body>
  <main>
    <svg class="mark" viewBox="${MARK_VIEWBOX}" fill="currentColor" aria-hidden="true"><path d="${MARK_PATH}"/></svg>
    <svg class="word" viewBox="${WORD_VIEWBOX}" fill="currentColor" role="img" aria-label="FLOEMA">${WORD_PATHS.map((d) => `<path d="${d}"/>`).join("")}</svg>
    <div class="rule"></div>
    <h1>Sito in costruzione</h1>
    <p>Arredi di design in legno massello, realizzati a mano nel nostro laboratorio di Livigno. Il nuovo sito arriva presto.</p>
    <a class="mail" href="mailto:${EMAIL}">Scrivici</a>
  </main>
  <footer>
    <span>© FLOEMA Wood Studio — ${COMPANY.name}</span>
  </footer>
</body>
</html>`;

export function GET() {
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex", "cache-control": "public, max-age=300" },
  });
}
