"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  about,
  appTitles,
  contact,
  experience,
  finder,
  TINT_VAR,
  ventures,
  writing,
  type Tint,
} from "../content/site";

export type AppId =
  | "finder"
  | "about"
  | "experience"
  | "ventures"
  | "writing"
  | "contact";

export const APP_TITLES: Record<AppId, string> = appTitles;

/* ── Shared UI bits ────────────────────────────────────────────────────── */

function SectionTitle({ children, color = "var(--accent)" }: { children: React.ReactNode; color?: string }) {
  return (
    <h2 className="flex items-center gap-2 font-display text-[1.35rem] md:text-[1.55rem] font-semibold text-ink leading-tight mb-3">
      <span className="w-2 h-2 rounded-full" style={{ background: color }} aria-hidden />
      {children}
    </h2>
  );
}

function Chip({ children, tint = "accent" }: { children: React.ReactNode; tint?: Tint }) {
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-[13px] font-medium text-ink border-2 border-ink/85"
      style={{ background: `${TINT_VAR[tint]}55` }}
    >
      {children}
    </span>
  );
}

function Card({
  tint = "#FFFFFF",
  rotate = 0,
  className = "",
  children,
}: {
  tint?: string;
  rotate?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`relative rounded-2xl border-[2.5px] border-ink/85 p-4 md:p-5 ${className}`}
      style={{
        background: tint,
        boxShadow: "0 6px 0 -1px rgba(26,37,64,0.85), 0 10px 20px -12px rgba(26,37,64,0.28)",
        transform: `rotate(${rotate}deg)`,
      }}
    >
      {children}
    </div>
  );
}

/* Container wrapper — same padding/animation for every app */
function AppShell({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.35, ease: "easeOut" }}
      className="px-5 md:px-8 py-6 md:py-8 space-y-8"
    >
      {children}
    </motion.div>
  );
}

/* ── Finder / Welcome ───────────────────────────────────────────────────── */
export function FinderApp() {
  return (
    <AppShell>
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-16 h-16 rounded-2xl bg-accent border-[2.5px] border-ink/85 flex items-center justify-center text-3xl">👋</div>
        <div>
          <p className="font-display text-2xl md:text-[1.75rem] font-semibold text-ink leading-tight">
            {finder.greeting}
          </p>
          <p className="text-muted mt-2 text-[15px] leading-relaxed max-w-xl">
            {finder.intro}
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card tint="#EEF4FF" rotate={-1}>
          <SectionTitle>quick tour</SectionTitle>
          <ul className="text-[14px] text-ink/85 space-y-2 list-none m-0 p-0">
            {finder.tourItems.map((item) => (
              <li key={item.app}>• <b>{item.app}</b> — {item.desc}</li>
            ))}
          </ul>
        </Card>
        <Card tint="#FFF6D9" rotate={1}>
          <SectionTitle color="var(--accent-butter)">tips</SectionTitle>
          <ul className="text-[14px] text-ink/85 space-y-2 list-none m-0 p-0">
            {finder.tips.map((tip) => (
              <li key={tip}>• {tip}</li>
            ))}
          </ul>
        </Card>
      </div>
    </AppShell>
  );
}

/* ── About ─────────────────────────────────────────────────────────────── */
export function AboutApp() {
  return (
    <AppShell>
      <div className="flex flex-col sm:flex-row gap-5">
        <div className="shrink-0 w-32 h-40 rounded-2xl overflow-hidden border-[2.5px] border-ink/85 bg-tinted relative">
          <Image
            src="/HeroPic.png"
            alt={about.name}
            fill
            sizes="128px"
            className="object-cover object-top"
          />
        </div>
        <div>
          <p className="font-display text-2xl md:text-[1.75rem] font-semibold leading-tight">
            {about.name}
          </p>
          <p className="text-muted text-[13px] uppercase tracking-wider mt-1">
            {about.subtitle}
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-ink/85 max-w-xl">
            {about.bio}
          </p>
        </div>
      </div>

      <div>
        <SectionTitle>education</SectionTitle>
        <div className="grid sm:grid-cols-2 gap-3">
          {about.education.map((edu) => (
            <Card key={edu.school} tint={edu.cardTint}>
              <p className="font-semibold text-[15px]">{edu.school}</p>
              <p className="text-muted text-[13px] mt-1">{edu.period}</p>
              <p className="text-[13px] mt-2">{edu.detail}</p>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle color="var(--accent-mint)">skills</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {about.skills.map((s) => (
            <Chip key={s.name} tint={s.tint}>{s.name}</Chip>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle color="var(--accent-peach)">languages</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {about.languages.map((lang) => (
            <Chip key={lang} tint="peach">{lang}</Chip>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

/* ── Experience ─────────────────────────────────────────────────────────── */
export function ExperienceApp() {
  return (
    <AppShell>
      <div>
        <p className="font-display text-2xl md:text-[1.75rem] font-semibold">{experience.heading}</p>
        <p className="text-muted text-[14px] mt-1">{experience.subheading}</p>
      </div>

      <div>
        <SectionTitle>leadership timeline</SectionTitle>
        <div className="space-y-4">
          {experience.timeline.map((block) => (
            <Card key={block.year} tint="#FFFFFF">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-accent-deep uppercase mb-2">{block.year}</p>
              <ul className="list-none m-0 p-0 space-y-1.5">
                {block.roles.map((r) => (
                  <li key={r} className="text-[14px] text-ink/85 flex gap-2">
                    <span className="text-accent" aria-hidden>◆</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle color="var(--accent-butter)">highlight reel</SectionTitle>
        <div className="grid sm:grid-cols-2 gap-3">
          {experience.highlights.map((h, i) => (
            <Card key={h.text} tint={TINT_VAR[h.tint] + "22"} rotate={i % 2 === 0 ? -0.7 : 0.7}>
              <p className="text-[10.5px] font-semibold tracking-[0.14em] text-ink/70 uppercase">{h.year}</p>
              <p className="text-[14px] font-medium text-ink mt-1 leading-snug">{h.text}</p>
            </Card>
          ))}
        </div>
        <p className="text-muted text-[13px] mt-4 italic">{experience.footnote}</p>
      </div>
    </AppShell>
  );
}

/* ── Ventures ───────────────────────────────────────────────────────────── */
export function VenturesApp() {
  return (
    <AppShell>
      <div>
        <p className="font-display text-2xl md:text-[1.75rem] font-semibold">{ventures.heading}</p>
        <p className="text-muted text-[14px] mt-1">{ventures.subheading}</p>
      </div>

      <div>
        <SectionTitle color="var(--accent-mint)">founded</SectionTitle>
        <div className="grid sm:grid-cols-2 gap-4">
          {ventures.founded.map((v, i) => (
            <Card key={v.name} tint={v.cardBg} rotate={i % 2 === 0 ? -1 : 1}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-xl font-semibold">{v.name}</p>
                  <p className="text-muted text-[12px] uppercase tracking-wider mt-0.5">{v.kind}</p>
                </div>
                <Chip tint={v.tint}>{v.year}</Chip>
              </div>
              <p className="text-[13px] text-muted italic mt-3">{v.note}</p>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle color="var(--accent-peach)">tech projects</SectionTitle>
        <div className="grid sm:grid-cols-3 gap-3">
          {ventures.techProjects.map((p) => (
            <Card key={p.title} tint="#FFF6EE">
              <p className="text-[11px] tracking-widest text-accent-peach uppercase font-semibold">{p.status}</p>
              <p className="font-display text-base font-semibold mt-2 text-ink/50">{p.title}</p>
              <p className="text-[12px] text-muted mt-2 italic leading-snug">{p.note}</p>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

/* ── Writing ────────────────────────────────────────────────────────────── */
export function WritingApp() {
  return (
    <AppShell>
      <div>
        <p className="font-display text-2xl md:text-[1.75rem] font-semibold">{writing.heading}</p>
        <p className="text-muted text-[14px] mt-1">{writing.subheading}</p>
      </div>

      <Card tint="#FFF9E8">
        <div className="flex items-start gap-3">
          <span className="text-2xl" aria-hidden>✍️</span>
          <div>
            <p className="font-display text-lg font-semibold">{writing.empty.title}</p>
            <p className="text-[14px] text-muted mt-1">{writing.empty.body}</p>
          </div>
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 gap-3">
        {writing.drafts.map((d) => (
          <Card key={d.title} tint={TINT_VAR[d.tint] + "18"}>
            <p className="text-[11px] tracking-widest uppercase font-semibold" style={{ color: TINT_VAR[d.tint] }}>{d.tag}</p>
            <p className="font-display text-base font-semibold mt-2">{d.title}</p>
            <p className="text-[12.5px] text-muted mt-2">{d.teaser}</p>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}

/* ── Contact ────────────────────────────────────────────────────────────── */
export function ContactApp() {
  const linkTransition = { type: "spring" as const, stiffness: 320, damping: 22 };

  return (
    <AppShell>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="font-display text-2xl md:text-[1.75rem] font-semibold">{contact.heading}</p>
          <p className="text-muted text-[14px] mt-1">{contact.subheading}</p>
        </div>
        <motion.a
          href={contact.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -2, scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={linkTransition}
          className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-ink bg-white/85 hover:bg-white px-4 py-2 rounded-full border-[1.75px] border-ink/85 shadow-[0_3px_0_-1px_rgba(26,37,64,0.85)] transition-colors"
        >
          <LinkedInGlyph size={16} />
          <span>view on linkedin</span>
          <span aria-hidden>↗</span>
        </motion.a>
      </div>

      {/* Email — entire card clickable */}
      <LinkCard href={`mailto:${contact.email}`} tint="#EEF4FF" rotate={-0.5}>
        <p className="text-[11px] tracking-widest text-accent-deep uppercase font-semibold">email</p>
        <p className="mt-2 font-display text-lg md:text-xl font-semibold text-ink break-all">
          {contact.email}
        </p>
      </LinkCard>

      {/* Phone — card lifts on hover; number + WhatsApp button are independent links */}
      <HoverCard tint="#E4F3EB" rotate={0.5}>
        <p className="text-[11px] tracking-widest uppercase font-semibold" style={{ color: TINT_VAR.mint }}>phone</p>
        <a
          href={`tel:${contact.phone.tel}`}
          className="block mt-2 font-display text-lg md:text-xl font-semibold text-ink hover:text-accent-deep transition-colors"
        >
          {contact.phone.label}
        </a>
        <motion.a
          href={contact.phone.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -2, scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={linkTransition}
          className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-xl bg-[#25D366] text-white font-semibold text-[13px] border-2 border-ink/85 hover:brightness-105 active:brightness-95 transition"
        >
          <WhatsAppGlyph />
          Chat on WhatsApp
        </motion.a>
      </HoverCard>

      {/* Instagram — entire card clickable */}
      <LinkCard href={contact.instagram.url} external tint="#FDE9E4" rotate={-0.3}>
        <p className="text-[11px] tracking-widest uppercase font-semibold" style={{ color: TINT_VAR.coral }}>instagram</p>
        <div className="inline-flex items-center gap-2 mt-2 font-display text-base md:text-lg font-semibold text-ink">
          <InstagramGlyph />
          {contact.instagram.handle}
          <span aria-hidden className="text-ink/50 text-sm">↗</span>
        </div>
      </LinkCard>

      <div className="grid sm:grid-cols-2 gap-3">
        <HoverCard tint="#FFF6EE">
          <p className="text-[11px] tracking-widest text-accent-peach uppercase font-semibold">based in</p>
          <p className="font-display text-base font-semibold mt-2">{contact.location.label}</p>
          <p className="text-[12.5px] text-muted mt-1">{contact.location.note}</p>
        </HoverCard>
        <HoverCard tint="#FFF9E8">
          <p className="text-[11px] tracking-widest text-accent-butter uppercase font-semibold">open to</p>
          <ul className="text-[13.5px] text-ink/85 mt-2 space-y-1 list-none m-0 p-0">
            {contact.openTo.map((line) => (
              <li key={line}>• {line}</li>
            ))}
          </ul>
        </HoverCard>
      </div>

      <p className="text-muted text-[13px] italic">{contact.footer}</p>
    </AppShell>
  );
}

/* ── Interactive card variants (used by ContactApp) ────────────────────── */

const CARD_CLASS =
  "relative rounded-2xl border-[2.5px] border-ink/85 p-4 md:p-5";
const CARD_SHADOW =
  "0 6px 0 -1px rgba(26,37,64,0.85), 0 10px 20px -12px rgba(26,37,64,0.28)";
const CARD_HOVER_SPRING = { type: "spring" as const, stiffness: 320, damping: 22 };

function LinkCard({
  href,
  external,
  tint = "#FFFFFF",
  rotate = 0,
  children,
}: {
  href: string;
  external?: boolean;
  tint?: string;
  rotate?: number;
  children: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      style={{ background: tint, boxShadow: CARD_SHADOW, rotate }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={CARD_HOVER_SPRING}
      className={`${CARD_CLASS} block no-underline text-inherit cursor-pointer`}
    >
      {children}
    </motion.a>
  );
}

function HoverCard({
  tint = "#FFFFFF",
  rotate = 0,
  children,
}: {
  tint?: string;
  rotate?: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      style={{ background: tint, boxShadow: CARD_SHADOW, rotate }}
      whileHover={{ y: -3 }}
      transition={CARD_HOVER_SPRING}
      className={CARD_CLASS}
    >
      {children}
    </motion.div>
  );
}

/* ── Social glyphs (small SVGs used inside the contact card) ───────────── */
function LinkedInGlyph({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.06c.53-1 1.83-2.05 3.77-2.05 4.04 0 4.79 2.66 4.79 6.12V21H18.6v-5.5c0-1.31-.02-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9V21H10V9Z" />
    </svg>
  );
}

function WhatsAppGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.5 3.5A11 11 0 0 0 3.7 17.3L2.4 22l4.85-1.27a11 11 0 0 0 5.26 1.34h.01A11 11 0 0 0 20.5 3.5ZM12.5 20.2h-.01a9.14 9.14 0 0 1-4.66-1.28l-.33-.2-2.88.76.77-2.81-.22-.35a9.14 9.14 0 1 1 7.33 3.88Zm5.02-6.85c-.28-.14-1.63-.8-1.88-.9-.25-.09-.44-.14-.62.14s-.71.9-.87 1.08c-.16.19-.32.21-.6.07-.28-.14-1.17-.43-2.22-1.37a8.39 8.39 0 0 1-1.55-1.93c-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.49.14-.16.19-.28.28-.46.09-.19.05-.35-.02-.49-.07-.14-.62-1.5-.85-2.06-.22-.54-.45-.47-.62-.48h-.53c-.19 0-.49.07-.75.35s-.98.96-.98 2.33 1 2.7 1.14 2.89c.14.19 1.97 3.01 4.77 4.22.67.29 1.19.46 1.6.59.67.21 1.28.18 1.76.11.54-.08 1.63-.66 1.86-1.31.23-.65.23-1.2.16-1.31-.07-.11-.26-.18-.54-.32Z" />
    </svg>
  );
}

function InstagramGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

/* ── Registry ──────────────────────────────────────────────────────────── */
export const APP_COMPONENTS: Record<AppId, React.FC> = {
  finder:     FinderApp,
  about:      AboutApp,
  experience: ExperienceApp,
  ventures:   VenturesApp,
  writing:    WritingApp,
  contact:    ContactApp,
};

export const APP_ACCENTS: Record<AppId, string> = {
  finder:     "var(--accent)",
  about:      "var(--accent-peach)",
  experience: "var(--accent-butter)",
  ventures:   "var(--accent-mint)",
  writing:    "var(--accent)",
  contact:    "var(--accent-coral)",
};

/* Per-app window background — a soft tint of the accent for each app.
   Edit these hex values to change the mood of each window. */
export const APP_WINDOW_BG: Record<AppId, string> = {
  finder:     "#E8F0FF", // pale sky blue
  about:      "#FEEFE8", // pale peach
  experience: "#FEF6DA", // pale butter
  ventures:   "#E4F3EB", // pale mint
  writing:    "#F1EDE4", // pale cream
  contact:    "#FDE9E4", // pale coral
};
