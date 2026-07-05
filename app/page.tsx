import { Nav } from "./components/nav";
import { Hero } from "./components/hero";
import { AboutTeaser } from "./components/about-teaser";
import { VenturesTeaser } from "./components/ventures-teaser";
import { RolesStrip } from "./components/roles-strip";
import { Footer } from "./components/footer";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <AboutTeaser />
        <VenturesTeaser />
        <RolesStrip />
      </main>
      <Footer />
    </>
  );
}
