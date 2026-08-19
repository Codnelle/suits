import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/ui/SmoothScroll";
import BookBar from "@/components/ui/BookBar";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ashford & Vane — The Anatomy of a Suit",
  description:
    "Bespoke tailoring since 1887. A suit, assembled layer by layer. Full canvas, hand finished, cut for one man and one body.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="grain" aria-hidden />
        <BookBar />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
