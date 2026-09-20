import type { Metadata } from "next";
import { Desktop } from "../components/desktop";

export const metadata: Metadata = {
  title: "Writing — Chin Wei Ling",
  description: "Drafts, notes, and essays from Chin Wei Ling.",
};

export default function WritingRoute() {
  return <Desktop initialApp="writing" />;
}
