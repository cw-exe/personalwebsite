"use client";

import { ThemeProvider } from "next-themes";
import { SfxProvider } from "./components/sfx";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <SfxProvider>{children}</SfxProvider>
    </ThemeProvider>
  );
}
