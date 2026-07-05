"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Nav } from "../components/nav";
import { Footer } from "../components/footer";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const TIMELINE = [
  {
    year: "2025 – 2026",
    roles: [
      { title: "Lead Organizer",          org: "TEDxUKM" },
      { title: "Head of Secretariat",     org: "Faculty Student Association (FTSM)" },
      { title: "Vice President",          org: "Kasiswa Foodbank Organisation" },
      { title: "Vice President",          org: "ARVIS Robotics Club" },
      { title: "Chair, ASEAN Council",    org: "Sunway Model United Nations" },
      { title: "Founder",                 org: "Polarvoid Photobooth Business" },
      { title: "Founder",                 org: "Aceterus EdTech Startup" },
    ],
  },
  {
    year: "2024",
    roles: [
      { title: "Head of Secretariat",     org: "Faculty Student Association (FTSM)" },
      { title: "Under Secretary-General", org: "Ipoh Model United Nations" },
      { title: "Co-Lead",                 org: "TEDxUKM Production Team" },
      { title: "Co-Chair, UNHRC Council", org: "Malaysia National Model United Nations" },
      { title: "Senior Executive",        org: "AIESEC Project Management Team" },
    ],
  },
  {
    year: "2023",
    roles: [
      { title: "Acting President",                      org: "Student Council" },
      { title: "Vice President IV (Protocol & Events)", org: "Student Council" },
      { title: "President",                             org: "Robotics Club" },
      { title: "President",                             org: "CNY Celebration 2023" },
      { title: "Leader",                                org: "National Robotics Competition 2023" },
      { title: "Treasurer",                             org: "Malaysian Red Crescent" },
    ],
  },
  {
    year: "2022",
    roles: [
      { title: "Vice President",   org: "Robotics Club" },
      { title: "Treasurer",        org: "Malaysian Red Crescent" },
      { title: "President",        org: "Moral Camp 2022 (Penang)" },
      { title: "AJK Performance",  org: "Mid-Autumn Festival" },
      { title: "Leader",           org: "National Robotics Competition 2022" },
    ],
  },
];

const VOLUNTEERING = [
  "Organising Committee — ECHO Environmental Awareness Project (AIESEC UKM)",
  "Program Director — Faculty Leadership Camp",
  "Volunteer — \"Loka Berkarya\" Arts Awareness Event (SMSP Kedah)",
  "Food Bank Event — Air Selangor & Yayasan Food Bank Malaysia, Puncak Alam",
  "Sea Turtle Conservation Volunteer — Chagar Hutang, Redang Island",
  "Photographer — Special Education Event (Manjung, Perak)",
  "Community Volunteer for Children with Autism (Sentul)",
  "Disability Support Activities — Moral Camp (Melaka)",
  "Presentation at Jelajah Aspirasi Keluarga Malaysia, Dato Sagor Circuit",
  "Assistant Organizer & Performer — Mid-Autumn Festival",
];

const ACHIEVEMENTS = [
  {
    year: "2026",
    items: [
      "INSPIRE (KPT) — 2nd Runner-Up, National",
      "EDVentures Hong Kong Start-Up Competition — 2nd Runner-Up, Global",
      "Program Usahawan Muda: Business Combat — Sagu Hati",
      "IMiNE — Overall Champion · Category Champion · Best Prototype · National Entrepreneurship Award",
    ],
  },
  {
    year: "2025",
    items: [
      "SharkTank UKM: Startup Entrepreneurship Challenge — Champion",
      "Faculty Outstanding Student, Batch 24/25",
      "Chair recognition, ASEAN Council, Sunway Model United Nations",
      "Chair recognition, UN Environmental Assembly, Ipoh Model United Nations",
      "Sponsored Study Trip — NUS Entrepreneurship Program",
      "National Micro Enterprise Pitching Competition — 2nd Place & Best Booth",
      "Gerakniaga Siswa @ KARKON UKM — 3rd Place",
      "Ekocipta Inovasi @ KARKON UKM (Idea) — Champion",
      "Ekocipta Inovasi @ KARKON UKM (Product) — 2nd Place",
    ],
  },
  {
    year: "2024",
    items: [
      "Fall National Leadership Induction Camp (NILC) — Best Team Delegation (UKM)",
      "Young Educators Challenge by UNICEF Malaysia — 2nd Runner-Up, National",
      "HatchQuest: Empowering Startup Talent — Champion (University) · Top 12 (National)",
      "Nuclear Science Quiz UKM — Champion (University)",
      "Nuclear Energy Awareness Video — 2nd Place (University)",
    ],
  },
  {
    year: "2023",
    items: [
      "National Robotics Competition — Silver Award & Best Team Award",
      "International Research Exhibition (IREx) — Silver Medal",
      "Nexus Model United Nations — Verbal Mention",
      "Taylor's Lakeside Model United Nations — Most Outstanding Delegate",
      "International Future Scientist Conference — Best Presentation Award · Gold Medal",
    ],
  },
  {
    year: "2022",
    items: [
      "Malaysia Technology Expo (MTE) — Silver Award (International)",
      "ITEX 2022 — Silver Award",
      "National Science Challenge (NSC) — State Level Qualifier",
      "World Invention Competition and Exhibition — Gold Medal & IYSA Award",
      "National Robotics Competition — Silver Award",
    ],
  },
  {
    year: "2021",
    items: [
      "Malaysia Technology Expo (MTE) — Gold Award & The Best Award (International)",
      "Malaysia Young Scientist Conference and Exhibition — Silver Award (International)",
      "IRIE — Silver Award (International)",
      "Robotics Innovation Challenge — International Stage Qualifier",
      "ITEX 2021 — Silver Award (International)",
    ],
  },
  {
    year: "2020",
    items: [
      "ASMO Mathematics Team Award — Champion (State)",
      "ASMO Mathematics — Bronze (National)",
      "ASMO Science Team Award — Champion (State)",
      "ASMO Science — Silver (State)",
      "SASMO — Bronze (National)",
      "Kangaroo Mathematics Competition (KMC) — Bronze (National)",
      "Online National Robotics Competition (Open) — 2nd Place (National)",
      "Virtual National Robotics Competition (Regular) — Participation (International)",
    ],
  },
];

export default function ExperiencePage() {
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
              className="h-px w-16 bg-accent-teal mb-12"
              aria-hidden
            />
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduce ? { duration: 0 } : { duration: 0.85, ease: EASE, delay: 0.18 }}
              className="font-wordmark text-[clamp(2.5rem,8vw,6rem)] leading-[0.9] tracking-[-0.02em] text-ink"
            >
              Experience
            </motion.h1>
          </div>
        </section>

        {/* ── Timeline ── */}
        <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-faint/20">
          <div className="max-w-screen-xl mx-auto">
            <motion.p {...reveal(0)} className="font-display italic text-muted text-base mb-16">
              Leadership timeline
            </motion.p>

            <div className="flex flex-col">
              {TIMELINE.map((block, bi) => (
                <motion.div
                  key={block.year}
                  {...reveal(bi * 0.05)}
                  className="flex flex-col lg:flex-row lg:gap-20 border-t border-faint/20 py-12 first:border-t-0"
                >
                  {/* Year */}
                  <div className="lg:w-40 shrink-0 mb-8 lg:mb-0">
                    <p className="font-sans text-[0.65rem] text-accent-teal tracking-[0.14em] uppercase sticky top-24">
                      {block.year}
                    </p>
                  </div>

                  {/* Roles */}
                  <div className="flex-1 flex flex-col gap-0">
                    {block.roles.map((role, ri) => (
                      <motion.div
                        key={`${role.title}-${role.org}`}
                        {...reveal(bi * 0.05 + ri * 0.06)}
                        className="flex flex-col sm:flex-row sm:items-baseline sm:gap-6 py-5 border-b border-faint/15 last:border-b-0"
                      >
                        <h3 className="font-display text-[clamp(1.1rem,1.8vw,1.375rem)] text-ink leading-snug shrink-0">
                          {role.title}
                        </h3>
                        <span className="hidden sm:block text-faint/40 select-none" aria-hidden>—</span>
                        <p className="font-sans text-sm text-muted">{role.org}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Volunteering ── */}
        <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-faint/20">
          <div className="max-w-screen-xl mx-auto">
            <motion.p {...reveal(0)} className="font-display italic text-muted text-base mb-16">
              Volunteering & community
            </motion.p>
            <ul className="list-none m-0 p-0 max-w-3xl">
              {VOLUNTEERING.map((item, i) => (
                <motion.li
                  key={item}
                  {...reveal(0.04 + i * 0.04)}
                  className="font-sans text-[0.9375rem] text-ink border-b border-faint/20 py-5 last:border-b-0 leading-snug"
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Achievements ── */}
        <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-faint/20">
          <div className="max-w-screen-xl mx-auto">
            <motion.p {...reveal(0)} className="font-display italic text-muted text-base mb-16">
              Awards & recognition
            </motion.p>

            <div className="flex flex-col">
              {ACHIEVEMENTS.map((block, bi) => (
                <motion.div
                  key={block.year}
                  {...reveal(bi * 0.04)}
                  className="flex flex-col lg:flex-row lg:gap-20 border-t border-faint/20 py-10 first:border-t-0"
                >
                  {/* Year */}
                  <p className="font-sans text-[0.65rem] text-accent-teal tracking-[0.14em] uppercase lg:w-40 shrink-0 mb-6 lg:mb-0 pt-0.5">
                    {block.year}
                  </p>

                  {/* Items */}
                  <ul className="flex-1 list-none m-0 p-0">
                    {block.items.map((item, ii) => (
                      <motion.li
                        key={item}
                        {...reveal(bi * 0.04 + ii * 0.04)}
                        className="font-sans text-sm text-ink border-b border-faint/15 py-4 last:border-b-0 leading-snug"
                      >
                        {item}
                      </motion.li>
                    ))}
                  </ul>
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
