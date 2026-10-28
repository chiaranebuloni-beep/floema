// Indirizzo pubblico del sito: serve a sitemap, anteprime di condivisione e dati per Google.
// Quando ci sarà il dominio basta impostare NEXT_PUBLIC_SITE_URL su Vercel.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://floema-orcin.vercel.app").replace(/\/$/, "");
