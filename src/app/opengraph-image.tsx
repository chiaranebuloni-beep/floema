import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { WORD_PATHS, WORD_VIEWBOX } from "@/components/Logo";

export const alt = "FLOEMA Wood Studio — Dalla natura, l'essenza del design";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Anteprima mostrata quando il sito viene condiviso (WhatsApp, Instagram, LinkedIn…).
export default async function OpengraphImage() {
  const photo = await readFile(path.join(process.cwd(), "public/images/sgabello-fume-studio.jpg"));
  const word = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${WORD_VIEWBOX}">${WORD_PATHS.map((d) => `<path fill="#f3ede5" d="${d}"/>`).join("")}</svg>`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#2a2c2a" }}>
        <div style={{ width: 640, display: "flex", flexDirection: "column", justifyContent: "center", gap: 36, padding: "72px 64px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img src={`data:image/svg+xml;utf8,${encodeURIComponent(word)}`} width={480} height={74} />
          <div style={{ fontSize: 20, letterSpacing: 8, color: "#a29686", textTransform: "uppercase" }}>Wood Studio · Livigno</div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img
          src={`data:image/jpeg;base64,${photo.toString("base64")}`}
          width={560}
          height={630}
          style={{ objectFit: "cover" }}
        />
      </div>
    ),
    size,
  );
}
