import type { Metadata } from "next";
import { Fredoka, Bricolage_Grotesque } from "next/font/google";
import { Providers } from "./providers";
import { GrainOverlay } from "./components/grain-overlay";
import { siteMeta } from "./content/site";
import "./globals.css";

/* Wordmark / name — rounded, chunky, cartoon-friendly */
const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

/* Display + body — variable, plays cute at wide grades */
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: siteMeta.title,
  description: siteMeta.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fredoka.variable} ${bricolage.variable}`}
    >
      <body className="font-sans antialiased">
        <GrainOverlay />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
