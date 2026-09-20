import type { Metadata } from "next";
import { Desktop } from "../components/desktop";

export const metadata: Metadata = {
  title: "About — Chin Wei Ling",
  description:
    "About Chin Wei Ling — student at UKM, TEDx lead organiser, and multi-domain leader.",
};

export default function AboutRoute() {
  return <Desktop initialApp="about" />;
}
