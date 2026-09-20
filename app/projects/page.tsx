import type { Metadata } from "next";
import { Desktop } from "../components/desktop";

export const metadata: Metadata = {
  title: "Ventures — Chin Wei Ling",
  description:
    "Polarvoid photobooth, Aceterus edtech, and other things Chin Wei has founded or built.",
};

export default function VenturesRoute() {
  return <Desktop initialApp="ventures" />;
}
