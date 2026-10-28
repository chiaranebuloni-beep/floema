import { ImageResponse } from "next/og";
import { MARK_PATH, MARK_VIEWBOX } from "@/components/Logo";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Icona per la schermata Home di iPhone: pittogramma chiaro su fondo carbone.
export default function AppleIcon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK_VIEWBOX}"><path fill="#f3ede5" d="${MARK_PATH}"/></svg>`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#2a2c2a" }}>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`} width={120} height={121} />
      </div>
    ),
    size,
  );
}
