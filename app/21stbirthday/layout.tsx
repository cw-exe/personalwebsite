import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "You're invited — Chin Wei's 21st",
  description: "A letter for you.",
  robots: { index: false, follow: false },
};

export default function BirthdayLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
