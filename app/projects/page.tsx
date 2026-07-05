"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Nav } from "../components/nav";
import { Footer } from "../components/footer";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* owner to fill in descriptions/dates/media when ready */
const VENTURES = [
  {
    name: "Polarvoid",
    type: "Photobooth Business",
    year: "2025",
    status: "Active",
    description: null, // owner to supply
  },
  {
    name: "Aceterus",
    type: "EdTech Startup",
    year: "2025",
    status: "Active",
    description: null, // owner to supply
  },
];

/* owner to supply tech project details */
const TECH_PROJECTS: { title: string; stack?: string; description: string | null }[] = [
  { title: "Project one",   stack: undefined, description: null },
  { title: "Project two",   stack: undefined, description: null },
  { title: "Project three", stack: undefined, description: null },
];

export default function ProjectsPage() {
  const reduce = useReducedMotion();

  const reveal = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 50, filter: "blur(4px)" },
          whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
          viewport: { once: true, margin: "-60px" },
          transition: { duration: 0.85, ease: EASE, delay },
        };

  return (
    <>
      <Nav />
      <main>

        {/* ── Page intro ── */}
        <section className="px-6 md:px-12 lg:px-20 pt-40 pb-16">
          <div className="max-w-screen-xl mx-auto">
            <motion.div
              initial={reduce ? false : { scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={reduce ? { duration: 0 } : { duration: 0.9, ease: EASE, delay: 0.1 }}
              className="h-px w-16 bg-accent-violet mb-12"
              aria-hidden
            />
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduce ? { duration: 0 } : { duration: 0.85, ease: EASE, delay: 0.18 }}
              className="font-wordmark text-[clamp(3rem,9vw,6rem)] leading-[0.9] tracking-[-0.02em] text-ink"
            >
              Projects
            </motion.h1>
          </div>
        </section>

        {/* ── Ventures ── */}
        <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-faint/20">
          <div className="max-w-screen-xl mx-auto">
            <motion.p {...reveal(0)} className="font-display italic text-muted text-base mb-16">
              Ventures founded
            </motion.p>

            <div className="flex flex-col">
              {VENTURES.map((v, i) => (
                <motion.article
                  key={v.name}
                  {...reveal(i * 0.12)}
                  className="group flex flex-col lg:flex-row lg:items-end lg:gap-20 py-16 border-t border-faint/20 first:border-t-0"
                >
                  {/* Meta */}
                  <div className="flex flex-col gap-1 lg:w-40 shrink-0 mb-8 lg:mb-0">
                    <p className="font-sans text-[0.65rem] text-accent-violet tracking-[0.12em] uppercase">
                      {v.year}
                    </p>
                    <p className="font-sans text-[0.65rem] text-faint tracking-[0.1em] uppercase">
                      {v.status}
                    </p>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h2 className="font-display text-[clamp(2.5rem,5.5vw,5rem)] leading-[0.92] text-ink group-hover:text-accent-violet transition-colors duration-400 mb-4">
                      {v.name}
                    </h2>
                    <p className="font-sans text-sm text-muted mb-4">{v.type}</p>
                    {v.description ? (
                      <p className="font-sans text-sm text-ink/80 max-w-lg">{v.description}</p>
                    ) : (
                      <p className="font-sans text-sm text-faint italic">
                        Details to follow — founder to supply description and media.
                      </p>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Tech projects ── */}
        <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-faint/20">
          <div className="max-w-screen-xl mx-auto">
            <motion.p {...reveal(0)} className="font-display italic text-muted text-base mb-16">
              Technical projects
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-faint/10">
              {TECH_PROJECTS.map((proj, i) => (
                <motion.div
                  key={proj.title}
                  {...reveal(0.06 + i * 0.08)}
                  className="bg-bg p-10 flex flex-col gap-4 min-h-[280px]"
                >
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      {/* owner to replace with real title */}
                      <p className="font-sans text-[0.65rem] text-accent-violet tracking-[0.12em] uppercase mb-6">
                        To be added
                      </p>
                      <h3 className="font-display text-[clamp(1.25rem,2.2vw,1.75rem)] text-faint/40 leading-snug">
                        {proj.title.charAt(0).toUpperCase() + proj.title.slice(1)}
                      </h3>
                    </div>
                    <p className="font-sans text-xs text-faint italic mt-6">
                      Owner to supply project details, stack, and links.
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
