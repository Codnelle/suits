import type { Metadata } from "next";
import { Bodoni_Moda, Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/ui/SmoothScroll";
import BookBar from "@/components/ui/BookBar";
import TapeCursor from "@/components/ui/TapeCursor";

// DISPLAY — Bodoni Moda. High contrast, sharp serifs. The house voice.
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

// BODY — Archivo. A neutral grotesk with good bones. The workhorse.
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

// MONO — JetBrains Mono. The tape measure: numbers and section markers.
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shahee Suits — Royal Indian Luxury",
  description:
    "Made for the discerning, tailored for you. Bespoke, made-to-measure suits with Master G at your doorstep in Bengaluru — the finest silks, chanderi and banarasi, cut for one man and no other.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bodoni.variable} ${archivo.variable} ${mono.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="grain" aria-hidden />
        <TapeCursor />
        <BookBar />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
