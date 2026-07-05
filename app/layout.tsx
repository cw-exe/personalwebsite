import type { Metadata } from "next";
import { Anton, Fraunces, Inter } from "next/font/google";
import { Providers } from "./providers";
import { GrainOverlay } from "./components/grain-overlay";
import "./globals.css";

/* Coolvetica placeholder — swap when owner supplies the font file */
const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chin Wei Ling",
  description:
    "Leader, Builder, Founder. Student at Universiti Kebangsaan Malaysia — TEDxUKM lead organiser, startup founder, and multi-domain leader.",
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
      className={`${anton.variable} ${fraunces.variable} ${inter.variable}`}
    >
      <body className="font-sans antialiased">
        <GrainOverlay />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
