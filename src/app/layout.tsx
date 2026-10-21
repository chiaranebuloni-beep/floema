import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Montserrat, Cinzel } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Cursor } from "@/components/Cursor";
import { Header } from "@/components/Header";
import { Preloader } from "@/components/Preloader";

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

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-montserrat",
  display: "swap",
});

// Cinzel (versione Google della Cinzel Pro) usato solo per pochi accenti editoriali.
const cinzel = Cinzel({ subsets: ["latin"], weight: ["400"], variable: "--font-cinzel", display: "swap" });

export const metadata: Metadata = {
  title: "FLOEMA Wood Studio — Dalla natura, l'essenza del design",
  description:
    "FLOEMA Wood Studio: arredi di design in legno massello, realizzati a mano a Livigno. Scopri la prima creazione, uno sgabello che diventa tavolino.",
};

export const viewport: Viewport = { themeColor: "#1e1e1e" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${groupe.variable} ${montserrat.variable} ${cinzel.variable}`}>
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
