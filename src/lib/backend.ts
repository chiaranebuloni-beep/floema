import "server-only";

// Backend Django (gestione ordini). Se BACKEND_URL non è impostata il sito usa i dati locali in data/.
export const backendUrl = () => process.env.BACKEND_URL?.replace(/\/$/, "") || "";

export async function backendFetch(path: string, init?: { method?: string; body?: unknown }) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.BACKEND_API_KEY) headers["X-Floema-Key"] = process.env.BACKEND_API_KEY;
  return fetch(`${backendUrl()}${path}`, {
    method: init?.method ?? "GET",
    headers,
    body: init?.body === undefined ? undefined : JSON.stringify(init.body),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
}
