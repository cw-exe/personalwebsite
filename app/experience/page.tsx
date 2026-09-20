import type { Metadata } from "next";
import { Desktop } from "../components/desktop";

export const metadata: Metadata = {
  title: "Experience — Chin Wei Ling",
  description:
    "Leadership roles, conference organising, and competition achievements — the timeline.",
};

export default function ExperienceRoute() {
  return <Desktop initialApp="experience" />;
}
