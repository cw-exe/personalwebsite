/* ─────────────────────────────────────────────────────────────
   site content — edit this file to update copy across the site.

   Everything here is plain data — no JSX, no styling. Change a
   string, save, and the site rebuilds with your new copy.

   Colour tokens: use one of "accent" | "peach" | "butter" | "mint"
   | "coral". They resolve to the CSS variables in globals.css.
   ───────────────────────────────────────────────────────────── */

export type Tint = "accent" | "peach" | "butter" | "mint" | "coral";

/* ── Browser tab title + description ─────────────────────────── */
export const siteMeta = {
  title: "cw's desktop",
  description:
    "Leader, Builder, Founder. Student at Universiti Kebangsaan Malaysia — TEDxUKM lead organiser, startup founder, and multi-domain leader.",
};

/* ── Hero panel (polaroid + name on the wallpaper) ───────────── */
export const hero = {
  greeting: "hi, i'm",
  greetingEmoji: "👋",
  name: "Chin Wei",
  /* Three highlighted words in the tagline. Add or remove entries freely. */
  taglineWords: [
    { text: "Leader",  tint: "butter" as Tint },
    { text: "Builder", tint: "peach"  as Tint },
    { text: "Founder", tint: "mint"   as Tint },
  ],
  bio: "student at Universiti Kebangsaan Malaysia. TEDx lead organiser. founder of a photobooth business & an edtech startup. i lead, build, and occasionally break things.",
  ctaHint: "click an app in the dock to explore",
  polaroidCaption: "chin wei ling · 05",
  portraitSrc: "/HeroPic.png",
};

/* ── Desktop shortcut icons (scattered on the wallpaper) ─────── */
export const desktopShortcuts = [
  { target: "about",   label: "readme.txt",  emoji: "📄", x: "5%", y: "18%", rotate: -4 },
  { target: "resume",  label: "resume.pdf",  emoji: "📃", x: "5%", y: "44%", rotate:  3 },
  { target: "writing", label: "drafts",      emoji: "📁", x: "5%", y: "70%", rotate: -2 },
] as const;

/* ── Titles that appear in each window's title bar ───────────── */
export const appTitles = {
  finder:     "Finder — Welcome",
  about:      "About Me.rtf",
  experience: "Experience.app",
  ventures:   "Ventures.app",
  writing:    "Writing — Notes",
  contact:    "Contact Card",
};

/* ── Finder / welcome dialog copy ────────────────────────────── */
export const finder = {
  greeting: "hi, welcome to my desktop.",
  intro:
    "i'm Chin Wei Ling — student at UKM, TEDx lead organiser, and founder of a couple of small ventures. pop open the apps in the dock below to see what i've been up to.",
  tourItems: [
    { app: "About",      desc: "who i am, in words" },
    { app: "Experience", desc: "leadership timeline & awards" },
    { app: "Ventures",   desc: "startups & projects i build" },
    { app: "Writing",    desc: "occasional notes & essays" },
    { app: "Contact",    desc: "where to find me" },
  ],
  tips: [
    "press esc to close a window",
    "click the red 🔴 button to close too",
    "hover the dock icons for their names",
    "the desktop doesn't scroll — windows do",
  ],
};

/* ── About window ────────────────────────────────────────────── */
export const about = {
  name: "Chin Wei Ling",
  subtitle: "student · leader · builder · founder",
  bio: "compassionate undergraduate with a strong background in leadership and STEM. i grew up in boarding school, learned to lead early, and have been building & organising ever since — from robotics teams to Model UN councils to two ventures of my own.",
  education: [
    {
      school: "Universiti Kebangsaan Malaysia",
      period: "Oct 2024 — present",
      detail: "Current CGPA 3.99",
      cardTint: "#EEF4FF",
    },
    {
      school: "Pusat PERMATA@Pintar Negara, UKM",
      period: "graduated Feb 2024",
      detail: "SPM 9As · HSD pointer 3.80",
      cardTint: "#FFF3E0",
    },
  ],
  skills: [
    { name: "Leadership",              tint: "mint"   as Tint },
    { name: "Full Stack Dev",          tint: "accent" as Tint },
    { name: "Communication",           tint: "peach"  as Tint },
    { name: "Conference Organisation", tint: "butter" as Tint },
    { name: "Entrepreneurship",        tint: "mint"   as Tint },
  ],
  languages: ["Malay", "English", "Mandarin", "Cantonese"],
};

/* ── Experience window ───────────────────────────────────────── */
export const experience = {
  heading: "roles & recognition",
  subheading: "a working timeline. the full list is longer — this is the reel.",
  /* Timeline blocks — one per year (or year range). Order matters. */
  timeline: [
    {
      year: "2025 – 2026",
      roles: [
        "Lead Organizer, TEDxUKM",
        "Head of Secretariat, Faculty Student Association (FTSM)",
        "Vice President, Kasiswa Foodbank Organisation",
        "Vice President, ARVIS Robotics Club",
        "Chair, ASEAN Council — Sunway Model UN",
        "Founder, Polarvoid",
        "Founder, Aceterus",
      ],
    },
    {
      year: "2024",
      roles: [
        "Head of Secretariat, FTSM Student Association",
        "Under Secretary-General, Ipoh Model UN",
        "Co-Lead, TEDxUKM Production",
        "Co-Chair, UNHRC — Malaysia National Model UN",
        "Senior Executive, AIESEC PM Team",
      ],
    },
    {
      year: "2023",
      roles: [
        "Acting President, Student Council",
        "VP IV (Protocol & Events), Student Council",
        "President, Robotics Club",
        "Leader, National Robotics Competition 2023",
        "Treasurer, Malaysian Red Crescent",
      ],
    },
  ],
  /* Highlight-reel cards. Each gets a coloured tint. */
  highlights: [
    { year: "2026", tint: "butter" as Tint, text: "IMiNE — Overall Champion + Best Prototype + National Entrepreneurship Award" },
    { year: "2026", tint: "accent" as Tint, text: "EDVentures Hong Kong Start-Up — 2nd Runner-Up, Global" },
    { year: "2025", tint: "mint"   as Tint, text: "SharkTank UKM — Champion" },
    { year: "2025", tint: "peach"  as Tint, text: "Faculty Outstanding Student, Batch 24/25" },
    { year: "2025", tint: "accent" as Tint, text: "Sponsored study trip — NUS Entrepreneurship Program" },
    { year: "2024", tint: "butter" as Tint, text: "HatchQuest — Champion (University), Top 12 (National)" },
    { year: "2024", tint: "peach"  as Tint, text: "Young Educators Challenge (UNICEF MY) — 2nd Runner-Up, National" },
    { year: "2023", tint: "mint"   as Tint, text: "Taylor's Lakeside MUN — Most Outstanding Delegate" },
  ],
  footnote: "and ~30 more competition wins across 2020–2025.",
};

/* ── Ventures window ─────────────────────────────────────────── */
export const ventures = {
  heading: "ventures & projects",
  subheading: "the things i build outside of class.",
  founded: [
    {
      name: "Polarvoid",
      kind: "photobooth business",
      year: "2025",
      tint: "mint" as Tint,
      cardBg: "#EAF6EF",
      note: "— founder's note coming soon.",
    },
    {
      name: "Aceterus",
      kind: "edtech startup",
      year: "2025",
      tint: "accent" as Tint,
      cardBg: "#EEF4FF",
      note: "— founder's note coming soon.",
    },
  ],
  /* Tech projects — placeholders until you fill them in. */
  techProjects: [
    { title: "project 1", status: "coming soon", note: "stack & write-up in progress." },
    { title: "project 2", status: "coming soon", note: "stack & write-up in progress." },
    { title: "project 3", status: "coming soon", note: "stack & write-up in progress." },
  ],
};

/* ── Writing window ──────────────────────────────────────────── */
export const writing = {
  heading: "writing",
  subheading: "notes on leadership, building, and being 20 in a hurry.",
  empty: {
    title: "no posts yet — but soon.",
    body: "i'm wiring up a small editor so i can publish thoughts here without touching the code. first drafts land after finals.",
  },
  drafts: [
    { tag: "draft", tint: "accent" as Tint, title: "on organising a TEDx",         teaser: "what i learned running the sponsorship arm before taking the lead chair." },
    { tag: "draft", tint: "mint"   as Tint, title: "building Aceterus in university", teaser: "the case for solving your own problem before scoping the market." },
  ],
};

/* ── Contact window ──────────────────────────────────────────── */
export const contact = {
  heading: "let's talk",
  subheading: "i reply to every email — usually within a day.",
  linkedin: "https://www.linkedin.com/in/chin-wei/",
  email: "lingchinwei0306@gmail.com",
  phone: {
    label: "+6019-579 6233",
    tel: "+60195796233",
    whatsapp: "https://wa.me/60195796233",
  },
  instagram: {
    handle: "@chinwei.exe",
    url: "https://instagram.com/chinwei.exe",
  },
  location: {
    label: "Kuala Lumpur· Malaysia",
    note: "🇲🇾 studying in Selangor at UKM, open to meetups in Ipoh, Perak",
  },
  openTo: [
    "collabs on student ventures",
    "speaking / MC gigs",
    "internships & mentorship",
  ],
  footer: "or catch me on any of these — i reply everywhere.",
};

/* ─── tint helpers (consumers use these; don't edit here) ─────── */
export const TINT_VAR: Record<Tint, string> = {
  accent: "var(--accent)",
  peach:  "var(--accent-peach)",
  butter: "var(--accent-butter)",
  mint:   "var(--accent-mint)",
  coral:  "var(--accent-coral)",
};

/* Tailwind class for the tagline squiggle highlights. */
export const TINT_HIGHLIGHT_CLASS: Record<Tint, string> = {
  accent: "bg-accent/70",
  peach:  "bg-accent-peach/70",
  butter: "bg-accent-butter/70",
  mint:   "bg-accent-mint/80",
  coral:  "bg-accent-coral/70",
};
