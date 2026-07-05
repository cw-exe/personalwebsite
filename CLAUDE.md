# CLAUDE.md — Chin Wei Ling Personal Portfolio Website

This file is the build spec for this repo. It exists so a Claude Code session (or any
developer) can implement the site without re-deriving requirements. Every decision below
was confirmed directly by the site owner (Chin Wei Ling) — nothing here is invented filler
except where explicitly marked **PLACEHOLDER**. Do not change confirmed decisions without
asking the owner first.

## 1. Project summary

A personal brand website for Chin Wei Ling — student at Universiti Kebangsaan Malaysia (UKM),
with a strong leadership, entrepreneurship, and STEM background. Purpose: showcase career,
leadership roles, ventures, and a personal blog, in a way that reads as professional, elegant,
and suitable for recruiters, partners, and collaborators. Secondary purpose: a place to write
and publish blog posts directly from the site.

## 2. Tech stack (confirmed)

- **Framework:** Next.js (App Router, TypeScript).
- **Styling:** Tailwind CSS.
- **Animation:** Framer Motion (scroll-in animations) + custom cursor implementation (vanilla
  or a small lib — implementer's choice) for hover effects.
- **Theming:** `next-themes` (or equivalent) for dark/light mode toggle, persisted across
  visits.
- **Blog backend:** Supabase (free-tier Postgres) — chosen because the owner wants to **write
  posts directly on the website**, not edit Markdown files locally. This requires:
  - A `posts` table (Postgres, via Supabase).
  - A private, password-protected `/admin` area (not public, not linked from nav) where the
    owner logs in and creates/edits/publishes/deletes posts.
  - Public `/blog` (listing) and `/blog/[slug]` (detail) pages reading only published posts.
- **Deployment target:** Not yet decided by owner — Vercel is the natural fit for
  Next.js + Supabase and should be assumed unless the owner says otherwise. Ask before
  assuming a different host.

### Suggested `posts` table schema
```sql
create table posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null,        -- markdown or rich text, implementer's choice
  cover_image text,             -- URL, optional
  published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### Admin auth (confirmed approach: password-protected editor + database)
- Simplest correct approach: a single admin password stored as an environment variable
  (hashed, e.g. `ADMIN_PASSWORD_HASH`), a login form at `/admin/login` that checks the
  password and sets an httpOnly signed session cookie, and middleware protecting all
  `/admin/*` routes except `/admin/login`.
- This is a single-owner site — no multi-user auth system (e.g. full NextAuth with OAuth)
  is needed unless the owner asks for it later.
- **Owner must supply:** the admin password and Supabase project credentials before this can
  go live (see Section 7, Open Items).

## 3. Design system (confirmed)

### Color palette
- **Accent color (both modes): `#78aaff`** — this is the owner's chosen "signature blue."
  Use it for links, buttons, highlights, active nav states, icons.
- **Dark mode:** near-black/dark background (e.g. `#0b0d12` – `#12141a` range), off-white
  text, `#78aaff` accent. Cinematic, moody — favor deep neutral darks over pure black so the
  blue accent pops without harshness.
- **Light mode:** **light blue-tinted background** (not pure white) — e.g. a very pale blue
  like `#f2f6ff` – `#eef3ff` range, dark navy/charcoal text, same `#78aaff` accent. This was
  an explicit choice over plain white, for cohesion with dark mode.
- Toggle must be a real dark/light switch (not just one cinematic dark theme) — the owner
  explicitly asked for both.

### Typography
- **Coolvetica** — bold, condensed sans-serif display font — for the owner's **name/logo
  mark only** (e.g. site header wordmark, hero name treatment). Not for section headings or
  body text. **Coolvetica is not a Google Font / not freely redistributable** — the owner
  needs to supply the font file (see Open Items). Until supplied, use a bold condensed
  fallback (e.g. `Anton` or system sans bold) and flag it clearly as a placeholder in code
  comments.
- **Elegant serif** for section headings (About, Projects, Roles & Experience, Blog titles,
  etc.) — default to **Fraunces** (Google Font). Playfair Display is the explicit fallback
  option if the owner prefers it after seeing Fraunces — surface this choice to the owner
  once the site is visually running, don't just lock it in silently.
- **Inter** (Google Font) for all body text — clean, neutral sans-serif.

### Motion / interactivity (confirmed)
- Smooth scroll-triggered animations (fade/slide-in as sections enter viewport).
- Custom cursor with hover effects (e.g. cursor grows/changes on interactive elements,
  magnetic button hover if feasible).
- Keep animations tasteful and performant — this is a "dark, moody, cinematic" elegant site,
  not a flashy one. Avoid anything that hurts load time or accessibility (respect
  `prefers-reduced-motion`).

## 4. Site structure (confirmed pages)

1. **Home / Landing** — hero section.
2. **About / Bio**
3. **Projects / Portfolio**
4. **Blog**
5. **Roles & Experience**

Admin (`/admin`, `/admin/login`) is a private utility area, not a nav-visible page.

## 5. Content (confirmed, sourced from owner's resume — do not invent beyond this)

### Hero (Home page)
- **Name:** Chin Wei Ling
- **Title:** Student at Universiti Kebangsaan Malaysia
- **Tagline (confirmed):** "Leader, Builder, Founder."
- **Photo:** placeholder for now — owner will supply a real headshot later. Build the
  layout to make swapping in a real image trivial (single image component/prop, no
  hardcoded placeholder text baked into design).

### About / Bio
Professional summary (owner's words, from resume):
> "A compassionate undergraduate with a strong background in leadership and STEM to assist
> others in facing various challenges. Studied in a Boarding School, I am someone who is
> passionate & active about what I do. I'm always ready to take on the responsibility of
> leading or work as a team. I am proficient in communication in different languages and
> easy to work in groups. I am motivated about my commitments and is always ready to take on
> challenges. Having experience of leading, I also prove to be a competent person. I have
> huge aspirations for what I may accomplish with hard work and dedication."

**Education:**
- High School Diploma in Science & SPM — Pusat PERMATA@Pintar Negara, UKM — Graduated Feb
  2024 — SPM: 9As, HSD Pointer: 3.80
- National University of Malaysia (UKM) — Enrolled Oct 2024 — Current CGPA: 3.98

**Skills:** Leadership, Full Stack Development & SE, Communication, Conference Organization,
Entrepreneurship Skills

**Languages:** Malay, English, Mandarin, Cantonese

**Certifications:**
- High School Diploma — Pusat PERMATA@Pintar Negara, UKM — Oct 2023
- Sijil Pelajaran Malaysia (SPM) — Pusat PERMATA@Pintar Negara, UKM — Feb 2024

**Contact info (from resume — confirm with owner before publishing publicly, phone numbers
especially):**
- Email: lingchinwei0306@gmail.com
- Phone: +6019-579 6233
- Location: Ipoh, Perak, Malaysia
> Flag to owner: publishing a personal phone number and home address on a public site is a
> privacy/safety consideration. Recommend using only email (or a contact form) publicly, and
> confirm with the owner before including phone/address verbatim.

### Roles & Experience
Present as a timeline, most recent first. From resume:

**2025/2026 leadership roles:**
- Lead Organizer of TEDxUKM
- Head of Secretariat, Faculty Student Association (FTSM)
- Vice President, Kasiswa Foodbank Organisation
- Vice President, ARVIS Robotics Club
- Chair, ASEAN Council, Sunway Model United Nations
- Founder, Polarvoid Photobooth Business
- Founder, Aceterus EdTech Startup

**2024:**
- Head of Secretariat, Faculty Student Association (FTSM)
- Under Secretary-General, Ipoh Model United Nations
- Co-Lead, TEDxUKM Production Team
- Co-Chair, UNHRC Council, Malaysia National Model United Nations
- Senior Executive, AIESEC Project Management Team

**2023:**
- Acting President, Student Council
- Vice President IV (Protocol & Events), Student Council
- President, Robotics Club
- President, CNY Celebration 2023
- Leader, National Robotics Competition 2023
- Treasurer, Malaysian Red Crescent

**2022:**
- Vice President, Robotics Club
- Treasurer, Malaysian Red Crescent
- President, Moral Camp 2022 (Penang)
- AJK Performance, Mid-Autumn Festival
- Leader, National Robotics Competition 2022

**Volunteering (undated list, can be its own subsection):**
- Organising Committee, ECHO Environmental Awareness Project (AIESEC UKM)
- Program Director, Faculty Leadership Camp
- Volunteer, "Loka Berkarya" Arts Awareness Event (Sekolah Menengah Sains Pokok Sena, Kedah)
- Food Bank event (Air Selangor & Yayasan Food Bank Malaysia, Puncak Alam)
- Sea Turtle Conservation Volunteer, Chagar Hutang, Redang Island
- Photographer, Special Education Event (Manjung, Perak)
- Community Volunteer for Children with Autism (Sentul)
- Disability support activities, Moral Camp (Melaka)
- Presentation at Jelajah Aspirasi Keluarga Malaysia, Dato Sagor Circuit
- Mid-Autumn Festival — Assistant Organizer, Performance

**Achievements / Competitions (owner may want this as a filterable/collapsible list given
its length — implementer's call, but don't truncate the content):**

- **2026:** INSPIRE (KPT) — 2nd Runner-Up National; EDVentures Hong Kong Start-Up
  Competition — 2nd Runner-Up Global; Program Usahawan Muda: Business Combat — Sagu Hati;
  IMiNE — Overall Champion, Category Champion, Best Prototype, National Entrepreneurship
  Award
- **2025:** SharkTank UKM: Startup Entrepreneurship Challenge — Champion; Faculty
  Outstanding Student, Batch 24/25; Chair recognition, ASEAN Council, Sunway Model UN; Chair
  recognition, UN Environmental Assembly, Ipoh Model UN; Sponsored study trip, NUS
  Entrepreneurship Program; National Micro Enterprise Pitching Competition — 2nd Place & Best
  Booth; Gerakniaga Siswa @ KARKON UKM — 3rd Place; Ekocipta Inovasi @ KARKON UKM (Idea) —
  Champion; Ekocipta Inovasi @ KARKON UKM (Product) — 2nd Place
- **2024:** Fall National Leadership Induction Camp (NILC) — Best Team Delegation (UKM);
  Young Educators Challenge by UNICEF Malaysia — 2nd Runner-Up Nationally; HatchQuest:
  Empowering Startup Talent — Champion (University), Top 12 (Nationally); Nuclear Science
  Quiz UKM — Champion (University); Nuclear Energy Awareness Video — 2nd Place (University)
- **2023:** National Robotics Competition — Silver Award & Best Team Award; International
  Research Exhibition (IREx) — Silver Medal; Nexus Model UN — Verbal Mention; Taylor's
  Lakeside Model UN — Most Outstanding Delegate; International Future Scientist Conference —
  Best Presentation Award, Gold Medal
- **2022:** Malaysia Technology Expo (MTE) — Silver Award (International); ITEX 2022 —
  Silver Award; National Science Challenge (NSC) — State Level Qualifier; World Invention
  Competition and Exhibition — Gold Medal & IYSA Award; National Robotics Competition —
  Silver Award
- **2021:** MTE — Gold Award & The Best Award (International); Malaysia Young Scientist
  Conference and Exhibition — Silver Award (International); IRIE — Silver Award
  (International); Robotics Innovation Challenge — International Stage Qualifier; ITEX 2021
  — Silver Award (International)
- **2020:** ASMO Mathematics Team Award — Champion (State); ASMO Mathematics — Bronze
  (National); ASMO Science Team Award — Champion (State); ASMO Science — Silver (State);
  SASMO — Bronze (National); Kangaroo Mathematics Competition (KMC) — Bronze (National);
  Online National Robotics Competition (Open) — 2nd Place (National); Virtual National
  Robotics Competition (Regular) — Participation (International)

### Projects / Portfolio (confirmed content plan)
Two content types, clearly separated:
1. **Ventures** (fully featured, from resume):
   - **Polarvoid Photobooth Business** — Founder. **PLACEHOLDER:** owner has not yet
     provided a description, dates, or media for this — implementer should add a clearly
     marked "add details" placeholder block, not invented copy.
   - **Aceterus EdTech Startup** — Founder. **PLACEHOLDER:** same as above — no description
     provided yet.
2. **Tech projects** — owner stated they have separate coding/technical projects to add that
   are not on the resume. **PLACEHOLDER:** none provided yet. Build 2–3 empty project-card
   slots in the same visual style as the ventures, clearly marked in code comments as
   "owner to fill in," so the page doesn't ship empty-looking but also doesn't ship with
   fabricated project descriptions.

## 6. Blog

- Public `/blog` — lists published posts (title, excerpt, date, cover image if present).
- Public `/blog/[slug]` — full post view.
- Private `/admin/login` — password gate.
- Private `/admin` — post management: create, edit, publish/unpublish, delete. A simple
  textarea or lightweight rich-text/markdown editor is fine; owner did not request WYSIWYG
  complexity, just "a place to write on the website."

## 7. Open items — do not guess, ask the owner

- [ ] Coolvetica font file (owner to supply; not freely redistributable).
- [ ] Real headshot photo + any background images (owner said placeholders for now).
- [ ] Fraunces vs Playfair Display — Fraunces is the default; show the owner both once
      running and confirm.
- [ ] Description/dates/media for Polarvoid Photobooth and Aceterus EdTech ventures.
- [ ] Tech project details (owner has these separately, not yet provided).
- [ ] Whether to publish phone number / home address publicly, or use email/contact form
      only — flagged as a privacy concern above, needs an explicit owner decision.
- [ ] Supabase project URL + anon/service keys (owner to create a free Supabase project and
      provide credentials, or ask the implementer for setup help).
- [ ] Admin login password (owner to choose; store only as a hash in env vars, never in
      source).
- [ ] Deployment target (assumed Vercel; confirm before setting up hosting-specific config).
- [ ] Social/contact links for footer (LinkedIn, GitHub, Instagram, etc. — none specified
      yet).

## 8. Explicit non-goals

- No multi-user auth system — single admin only.
- No CMS service (Sanity/Contentful) — owner chose the custom DB + private editor route.
- No invented project descriptions, quotes, or biographical details beyond what's in this
  file or the source resume. If content is missing, leave a clearly marked placeholder
  instead of writing filler.
