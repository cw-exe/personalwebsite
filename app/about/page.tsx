"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Nav } from "../components/nav";
import { Footer } from "../components/footer";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const EDUCATION = [
  {
    institution: "Universiti Kebangsaan Malaysia (UKM)",
    period: "Oct 2024 — Present",
    detail: "Current CGPA: 3.98",
  },
  {
    institution: "Pusat PERMATA@Pintar Negara, UKM",
    period: "Graduated Feb 2024",
    detail: "SPM: 9As · High School Diploma Pointer: 3.80",
  },
];

const SKILLS = [
  "Leadership",
  "Full Stack Development & Software Engineering",
  "Communication",
  "Conference Organization",
  "Entrepreneurship",
];

const LANGUAGES = ["Malay", "English", "Mandarin", "Cantonese"];

const CERTIFICATIONS = [
  { title: "Sijil Pelajaran Malaysia (SPM)", issuer: "Pusat PERMATA@Pintar Negara, UKM", date: "Feb 2024" },
  { title: "High School Diploma in Science", issuer: "Pusat PERMATA@Pintar Negara, UKM", date: "Oct 2023" },
];

export default function AboutPage() {
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
              className="h-px w-16 bg-accent-warm mb-12"
              aria-hidden
            />
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduce ? { duration: 0 } : { duration: 0.85, ease: EASE, delay: 0.18 }}
              className="font-wordmark text-[clamp(3rem,9vw,6rem)] leading-[0.9] tracking-[-0.02em] text-ink"
            >
              About
            </motion.h1>
          </div>
        </section>

        {/* ── Bio ── */}
        <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-faint/20">
          <div className="max-w-screen-xl mx-auto">
            <div className="max-w-3xl">
              <motion.p
                {...reveal(0)}
                className="font-display text-[clamp(1.375rem,2.8vw,2rem)] leading-[1.55] text-ink"
                style={{ textWrap: "pretty" } as React.CSSProperties}
              >
                A compassionate undergraduate with a strong background in leadership and STEM —
                passionate, active, and always ready to lead or collaborate as part of a team.
              </motion.p>
              <motion.p
                {...reveal(0.1)}
                className="font-display text-[clamp(1.375rem,2.8vw,2rem)] leading-[1.55] text-ink mt-6"
                style={{ textWrap: "pretty" } as React.CSSProperties}
              >
                Proficient in communication across four languages. Motivated by commitment,
                driven by hard work, and fuelled by ambition for what can be accomplished
                with dedication.
              </motion.p>
            </div>
          </div>
        </section>

        {/* ── Education ── */}
        <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-faint/20">
          <div className="max-w-screen-xl mx-auto">
            <motion.p {...reveal(0)} className="font-display italic text-muted text-base mb-16">
              Education
            </motion.p>
            <div className="flex flex-col">
              {EDUCATION.map((edu, i) => (
                <motion.div
                  key={edu.institution}
                  {...reveal(i * 0.1)}
                  className="flex flex-col md:flex-row md:items-start md:gap-16 py-12 border-t border-faint/20 first:border-t-0"
                >
                  <p className="font-sans text-[0.65rem] text-faint tracking-[0.12em] uppercase mb-4 md:mb-0 md:w-52 shrink-0 pt-1.5">
                    {edu.period}
                  </p>
                  <div>
                    <h2 className="font-display text-[clamp(1.25rem,2.5vw,1.875rem)] text-ink leading-snug mb-2">
                      {edu.institution}
                    </h2>
                    <p className="font-sans text-sm text-accent-warm">{edu.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Skills & Languages ── */}
        <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-faint/20">
          <div className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-16 lg:gap-32">

            <div>
              <motion.p {...reveal(0)} className="font-display italic text-muted text-base mb-10">
                Skills
              </motion.p>
              <ul className="list-none m-0 p-0">
                {SKILLS.map((skill, i) => (
                  <motion.li
                    key={skill}
                    {...reveal(0.05 + i * 0.06)}
                    className="font-sans text-[0.9375rem] text-ink border-b border-faint/20 py-4 last:border-b-0"
                  >
                    {skill}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <motion.p {...reveal(0.06)} className="font-display italic text-muted text-base mb-10">
                Languages
              </motion.p>
              <ul className="list-none m-0 p-0">
                {LANGUAGES.map((lang, i) => (
                  <motion.li
                    key={lang}
                    {...reveal(0.1 + i * 0.07)}
                    className="font-sans text-[0.9375rem] text-ink border-b border-faint/20 py-4 last:border-b-0"
                  >
                    {lang}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Certifications ── */}
        <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-faint/20">
          <div className="max-w-screen-xl mx-auto">
            <motion.p {...reveal(0)} className="font-display italic text-muted text-base mb-16">
              Certifications
            </motion.p>
            <div className="flex flex-col">
              {CERTIFICATIONS.map((cert, i) => (
                <motion.div
                  key={cert.title}
                  {...reveal(i * 0.1)}
                  className="flex flex-col md:flex-row md:items-baseline md:gap-16 py-10 border-t border-faint/20 first:border-t-0"
                >
                  <p className="font-sans text-[0.65rem] text-faint tracking-[0.12em] uppercase mb-2 md:mb-0 md:w-24 shrink-0">
                    {cert.date}
                  </p>
                  <div>
                    <p className="font-sans text-[0.9375rem] text-ink mb-1">{cert.title}</p>
                    <p className="font-sans text-sm text-muted">{cert.issuer}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact ── */}
        <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-faint/20">
          <div className="max-w-screen-xl mx-auto">
            <motion.p {...reveal(0)} className="font-display italic text-muted text-base mb-8">
              Get in touch
            </motion.p>
            <motion.a
              {...reveal(0.08)}
              href="mailto:lingchinwei0306@gmail.com"
              className="font-display text-[clamp(1.5rem,3.5vw,2.75rem)] text-accent-warm hover:text-ink transition-colors duration-300 break-all"
            >
              lingchinwei0306@gmail.com
            </motion.a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
