<!-- SEED: re-run /impeccable document once there's code to capture the actual tokens and components. -->

---
name: Chin Wei Ling
description: Composed. Purposeful. Formidable. — a cinematic portfolio for a young leader and founder.
colors:
  accent: "#78aaff"
  dark-bg-deep: "#0b0d12"
  dark-bg-surface: "#12141a"
  light-bg-base: "#f2f6ff"
  light-bg-surface: "#eef3ff"
---

# Design System: Chin Wei Ling

## 1. Overview

**Creative North Star: "The Director's Cut"**

The director's cut is the artist's version — not what the committee approved, but what the work was
always supposed to be. This site is Chin Wei Ling's version of herself: deliberately paced,
uncompromised, nothing left in because someone asked for it. Every section earns its place. Every
animation earns its motion. The portrait is complete not when there's nothing left to add, but when
there's nothing left to remove.

The visual language takes its cues from Apple Pro product pages and a film director's personal site:
deep blacks with room to breathe, one accent color spoken rarely and with purpose, serif headings
that command without shouting, and scroll reveals that feel earned rather than reflexive. Dark mode
is the primary identity — the cinematic state. Light mode is a genuine alternate, holding the same
typographic authority and accent restraint, not a washed-out copy.

This system explicitly rejects: the résumé website's list-dump (flat text, corporate blues, zero
personality), the SaaS landing page's metric-hero template (big numbers, testimonial grids, gradient
CTA buttons), and the social media bio's surface signaling (follower counts over substance). If a
design choice makes this look like any of those, it's wrong.

**Key Characteristics:**
- Deep near-black primary surfaces with a trace of blue undertone
- One signature accent (#78aaff), used once per major section — its rarity is the brand
- Commanding serif display type at generous scale, tight line-height
- Whitespace as a design material, not as padding filler
- Choreographed entrance motion on first load; earned scroll reveals section-by-section
- Flat tonal elevation — depth through lightness difference, not shadows

---

## 2. Colors

A committed strategy: near-black dominates, the signature blue speaks once per screen, off-white
barely whispers. The palette is a monochrome with one deliberate breach.

### Primary
- **Signature Blue** (`#78aaff`): The single accent. Links, active nav states, interactive moments,
  cursor accent. Never used as a fill color for large areas — appears as text, underlines, icons,
  and small highlights. In dark mode it glows; in light mode it anchors.

### Neutral — Dark Mode
- **Void** (`#0b0d12`): The primary background. The deepest layer. Near-black with the faintest
  cold blue undertone. Nothing fights for attention here.
- **Surface** (`#12141a`): Secondary background for elevated containers — nav, cards, drawers.
  Barely distinguishable from Void at a distance; the contrast is intentional and subtle.
- **Ink** (`[to be confirmed at implementation — off-white, e.g. #e8ecf4]`): Primary text on
  dark backgrounds. Slightly blue-shifted off-white, never pure #ffffff.
- **Muted** (`[to be confirmed — e.g. #7a8099]`): Secondary text, timestamps, metadata. Must
  hit ≥4.5:1 contrast against Void.

### Neutral — Light Mode
- **Pale Blue** (`#f2f6ff`): Primary background in light mode. Explicitly not white — a
  blue-tinted near-white that coheres with dark mode's identity.
- **Light Surface** (`#eef3ff`): Secondary surface in light mode. Cards, elevated containers.
- **Dark Ink** (`[to be confirmed — e.g. #141720]`): Primary text in light mode. Near-black,
  navy-tinted.

### Named Rules

**The Rarity Rule.** `#78aaff` appears once per major screen section — on one link, one active
state, one icon. If it appears on every element, it reads as a theme color, not a voice. Its power
is its rarity.

**The Non-Compromise Rule.** Light mode is not an afterthought. It shares the same accent
frequency, the same typographic scale, the same Named Rules. A "light mode" that whites out every
surface and loses the personality is a failure.

---

## 3. Typography

**Display Font:** Coolvetica — for the name wordmark only (`CHIN WEI LING`). Owner to supply font
file; Anton (Google Fonts, bold condensed) as placeholder until supplied.

**Heading Font:** Serif display — confirmed as Fraunces (Google Fonts, variable), with Playfair
Display as the owner's stated alternate. *Both are on the impeccable reflex-reject list; surface at
least one non-reflex alternative to the owner at first visual review before locking in.*
`[pairing to be confirmed at first visual review]`

**Body Font:** Sans-serif — confirmed as Inter (Google Fonts). *Also on the reflex-reject list;
surface an alternative at first review.*

**Character:** Scale and weight do the work that decoration can't. The heading font carries personal
voice — warm, literary, authoritative. The body font disappears into the content. The pairing works
on contrast: serif history against sans neutrality.

### Hierarchy

- **Wordmark** (Coolvetica or Anton placeholder, `clamp(2.5rem, 7vw, 5rem)`, weight 900,
  line-height 0.9, letter-spacing -0.02em): Name display in the hero. Used exactly once per site
  visit. Never in nav, never in sections.

- **Display / Headline** (heading serif, `clamp(2rem, 5vw, 4.5rem)`, weight 500–700,
  line-height 1.0, letter-spacing -0.02em): Section-opening statements, blog post titles, project
  names in hero position. `text-wrap: balance` applied.

- **Title** (heading serif, `clamp(1.25rem, 2.5vw, 2rem)`, weight 500, line-height 1.15): Role
  titles in the timeline, sub-section headings, card headings.

- **Body** (sans, 1rem–1.125rem, weight 400, line-height 1.7, max-width 68ch): Running prose —
  bio, blog content, project descriptions. On dark backgrounds: bump to line-height 1.75.
  `text-wrap: pretty` applied to reduce orphans.

- **Label** (sans, 0.75rem, weight 500, letter-spacing 0.06em, uppercase): Dates, role categories,
  tags in the timeline. Used sparingly — three or fewer labels per viewport.

### Named Rules

**The Wordmark Rule.** Coolvetica (or its placeholder) belongs to one thing: the name. It does not
appear in section headings, UI labels, or body text. Diluting it dilutes the identity.

**The Ceiling Rule.** Display headings max at `6rem` (96px). Above that the page is shouting, not
designing. The `clamp()` max never exceeds `6rem`.

**The Contrast Pairing Rule.** Heading serif and body sans work because they are different on every
axis. Do not introduce a third sans-serif family, a second serif, or a mono except for code content.
Pairs work on contrast; a third family is almost always competing, not complementing.

---

## 4. Elevation

This system is flat by default. Depth is expressed through tonal layering — the barely-visible
difference between `#0b0d12` (Void) and `#12141a` (Surface) creates hierarchy without lift. In
light mode, the same logic applies: `#f2f6ff` and `#eef3ff` establish layers through subtle tint
contrast.

Hover states introduce a glow: a soft radial spread of the accent color at low opacity, or an
opacity shift on the target element. Not a hard `box-shadow`. Never `box-shadow: 0 4px 6px rgba(0,0,0,0.5)` — that's a PowerPoint.

### Named Rules

**The Cinematic Flat Rule.** No drop shadows. A surface is below another surface because it's
darker (dark mode) or slightly more tinted (light mode), not because it has a shadow underneath it.
Shadows here would look like they were imported from a different aesthetic.

---

## 5. Components

*Omitted in seed mode. Re-run `/impeccable document` once the codebase has components to extract.*

---

## 6. Do's and Don'ts

### Do:

- **Do** use `#78aaff` exactly once per major section — on links, the active nav item, or one
  focal icon. Use it as emphasis, not fill.
- **Do** let whitespace carry weight. A section with generous vertical padding is doing design work;
  it is not waste.
- **Do** set display headings at commanding scale with `line-height ≤ 1.0` and
  `letter-spacing ≥ -0.02em`. The letters should feel close but not touching.
- **Do** apply `text-wrap: balance` on `h1`–`h3` and `text-wrap: pretty` on prose.
- **Do** use `prefers-reduced-motion` fallbacks for every animated element — crossfade or instant
  transition, never just removing the event.
- **Do** verify body text contrast in both modes: ≥4.5:1 against its background. Check Muted text
  too — muted gray on a slightly lighter gray is the most common failure.
- **Do** animate with `transform` and `opacity` only. No width, height, padding, or margin
  animation.
- **Do** stagger list entrance animations where the sequence adds meaning (the timeline, the
  achievement list). One identical fade applied to every section heading is the reflex to avoid.
- **Do** honor both dark and light modes with equal attention. Same accent frequency, same
  typographic conviction, same Named Rules.

### Don't:

- **Don't** replicate the résumé website: no flat achievement lists, no corporate-blue palette,
  no generic template layouts. This is a portrait, not a PDF export.
- **Don't** replicate the SaaS landing page: no metric-hero ("4× national champion" in a giant
  stat block), no testimonial grids, no gradient CTA buttons, no "Join X+ users" copy.
- **Don't** replicate the social media bio: no follower counts, no platform badge rows, no
  influencer-adjacent layout patterns.
- **Don't** use gradient text (`background-clip: text` + gradient). Emphasis lives in weight and
  size, not in rainbow decoration.
- **Don't** use `border-left` greater than 1px as a colored accent stripe on cards, timeline
  items, or callouts. Replace with a background tint, a leading icon, or nothing.
- **Don't** use `#78aaff` as a large fill color (buttons with solid blue backgrounds, section
  backgrounds, hero fills). It is an accent, not a brand color in the Committed sense.
- **Don't** use Coolvetica (or its placeholder) anywhere except the name wordmark. Its specificity
  is its power.
- **Don't** use uppercase tracked labels as a cadence above every section heading. One deliberate
  kicker is voice; an eyebrow on every section is AI scaffolding.
- **Don't** gate content visibility on a class-triggered animation. If JavaScript hasn't fired,
  content must be readable. Reveal animations enhance an already-visible default.
- **Don't** introduce a third font family. Two families (display serif + body sans) is the system.
  A third competes; it does not add.
