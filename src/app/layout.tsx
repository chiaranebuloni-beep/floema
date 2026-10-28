import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Cursor } from "@/components/Cursor";
import { Header } from "@/components/Header";
import { Preloader } from "@/components/Preloader";
import { INTRO_KEY } from "@/lib/intro";
import { SITE_URL } from "@/lib/site";

const groupe = localFont({
  src: [
    { path: "../fonts/groupe-thin.otf", weight: "200" },
    { path: "../fonts/groupe-light.otf", weight: "300" },
    { path: "../fonts/groupe-regular.otf", weight: "400" },
    { path: "../fonts/groupe-medium.otf", weight: "500" },
  ],
  variable: "--font-groupe",
  display: "swap",
});

const TITLE = "FLOEMA Wood Studio — Dalla natura, l'essenza del design";
const DESCRIPTION =
  "FLOEMA Wood Studio: arredi di design in legno massello, realizzati a mano a Livigno. Scopri la prima creazione, uno sgabello che diventa tavolino d'appoggio e comodino.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { type: "website", locale: "it_IT", siteName: "FLOEMA Wood Studio", title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export const viewport: Viewport = { themeColor: "#1e1e1e" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${groupe.variable}`} suppressHydrationWarning>
      <head>
        {/* Prima del disegno della pagina: se l'ingresso è già stato visto in questa visita, il preloader non compare. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("${INTRO_KEY}"))document.documentElement.classList.add("no-intro")}catch(e){}`,
          }}
        />
      </head>
      <body>
        <CartProvider>
          <Preloader />
          <SmoothScroll />
          <Cursor />
          <Header />
          {children}
          <CartDrawer />
        </CartProvider>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
