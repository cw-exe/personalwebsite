"use client";

import { ThemeProvider } from "next-themes";
import { LenisProvider } from "./components/lenis-provider";
import { CursorGlow } from "./components/cursor-glow";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      <LenisProvider />
      <CursorGlow />
      {children}
    </ThemeProvider>
  );
}
