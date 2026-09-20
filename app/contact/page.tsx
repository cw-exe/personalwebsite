import type { Metadata } from "next";
import { Desktop } from "../components/desktop";

export const metadata: Metadata = {
  title: "Contact — Chin Wei Ling",
  description: "Get in touch with Chin Wei Ling.",
};

export default function ContactRoute() {
  return <Desktop initialApp="contact" />;
}
