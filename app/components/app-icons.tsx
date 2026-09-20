"use client";

/* Cartoon app icons — 64x64 rounded tiles with thick navy outline and a
   colored fill. Reused by the dock and by desktop shortcuts. */

const NAVY = "#1A2540";

type IconProps = { size?: number };

/* Shared tile wrapper */
function Tile({
  bg,
  children,
  size = 64,
}: {
  bg: string;
  children: React.ReactNode;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className="block"
      aria-hidden
    >
      <defs>
        <linearGradient id={`tileBg-${bg}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={bg} stopOpacity="1" />
          <stop offset="100%" stopColor={bg} stopOpacity="0.72" />
        </linearGradient>
      </defs>
      <rect
        x="3.5" y="3.5" width="57" height="57" rx="15"
        fill={`url(#tileBg-${bg})`}
        stroke={NAVY} strokeWidth="3.2"
      />
      {children}
    </svg>
  );
}

/* About — smiling person head */
export function IconAbout({ size }: IconProps) {
  return (
    <Tile bg="#FFB4A2" size={size}>
      <circle cx="32" cy="26" r="10" fill="#FFF" stroke={NAVY} strokeWidth="3" />
      <path d="M28 24.5c0-1 .8-1.6 1.6-1.6M34.5 24.5c0-1 .8-1.6 1.6-1.6" stroke={NAVY} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M28 30q4 3 8 0" stroke={NAVY} strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <path d="M18 51q4-11 14-11t14 11" stroke={NAVY} strokeWidth="3" strokeLinecap="round" fill="#FFF" />
    </Tile>
  );
}

/* Experience — trophy */
export function IconExperience({ size }: IconProps) {
  return (
    <Tile bg="#FFDF80" size={size}>
      <path d="M22 14h20v10a10 10 0 0 1-20 0V14Z" fill="#FFF" stroke={NAVY} strokeWidth="3" strokeLinejoin="round" />
      <path d="M22 17.5h-5.5c0 5 3.5 8 6.5 8M42 17.5h5.5c0 5-3.5 8-6.5 8" stroke={NAVY} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M32 34v8" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
      <rect x="24" y="42" width="16" height="6" rx="1.5" fill="#FFF" stroke={NAVY} strokeWidth="3" />
      <path d="M28 20q2 2 4 0q2 2 4 0" stroke={NAVY} strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </Tile>
  );
}

/* Ventures — rocket */
export function IconVentures({ size }: IconProps) {
  return (
    <Tile bg="#A8E0C7" size={size}>
      <path d="M32 10q10 8 10 22t-10 22q-10-8-10-22t10-22Z" fill="#FFF" stroke={NAVY} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="32" cy="26" r="4.2" fill="#78AAFF" stroke={NAVY} strokeWidth="2.6" />
      <path d="M22 40l-6 8q6 0 10-4M42 40l6 8q-6 0-10-4" fill="#FFB4A2" stroke={NAVY} strokeWidth="2.8" strokeLinejoin="round" />
      <path d="M28 50q2 4 4 6q2-2 4-6" stroke={NAVY} strokeWidth="2.6" strokeLinecap="round" fill="#FFDF80" />
    </Tile>
  );
}

/* Writing — notebook with pencil */
export function IconWriting({ size }: IconProps) {
  return (
    <Tile bg="#B9DAFF" size={size}>
      <rect x="14" y="12" width="30" height="40" rx="3" fill="#FFF" stroke={NAVY} strokeWidth="3" />
      <path d="M14 20h30M14 30h20M14 40h16" stroke={NAVY} strokeWidth="2.2" strokeLinecap="round" />
      {/* spiral binding */}
      <g stroke={NAVY} strokeWidth="2.4" strokeLinecap="round">
        <path d="M14 16v3M20 16v3M26 16v3M32 16v3M38 16v3" />
      </g>
      {/* pencil across corner */}
      <g transform="rotate(35 44 44)">
        <rect x="38" y="42" width="18" height="5" rx="1" fill="#FFDF80" stroke={NAVY} strokeWidth="2.4" />
        <path d="M56 44.5l3.5-.5-2 2Z" fill="#FFB4A2" stroke={NAVY} strokeWidth="2" strokeLinejoin="round" />
      </g>
    </Tile>
  );
}

/* Contact — envelope with heart flap */
export function IconContact({ size }: IconProps) {
  return (
    <Tile bg="#FF7B6B" size={size}>
      <rect x="10" y="18" width="44" height="30" rx="3" fill="#FFF" stroke={NAVY} strokeWidth="3" />
      <path d="M10 20l22 16 22-16" fill="none" stroke={NAVY} strokeWidth="3" strokeLinejoin="round" />
      <path d="M32 32q-4-6 0-8q4 2 0 8" fill="#FF7B6B" stroke={NAVY} strokeWidth="2.4" strokeLinejoin="round" transform="translate(0 -2)" />
    </Tile>
  );
}

/* Finder — happy face (kicks off the About app; alias) */
export function IconFinder({ size }: IconProps) {
  return (
    <Tile bg="#78AAFF" size={size}>
      <path d="M32 8c14 0 22 10 22 24S46 56 32 56 10 46 10 32 18 8 32 8Z" fill="#FFF" stroke={NAVY} strokeWidth="3" />
      <path d="M22 26q0-4 3-4 M42 26q0-4-3-4" stroke={NAVY} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M22 38q6 6 20 0" stroke={NAVY} strokeWidth="3" strokeLinecap="round" fill="none" />
    </Tile>
  );
}

/* Trash — for flavor */
export function IconTrash({ size }: IconProps) {
  return (
    <Tile bg="#E8F2FF" size={size}>
      <path d="M18 22h28M22 22v24a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V22" stroke={NAVY} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="#FFF" />
      <path d="M26 18a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4" stroke={NAVY} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M28 28v14M32 28v14M36 28v14" stroke={NAVY} strokeWidth="2.4" strokeLinecap="round" />
    </Tile>
  );
}

export const APP_ICON_MAP = {
  about: IconAbout,
  experience: IconExperience,
  ventures: IconVentures,
  writing: IconWriting,
  contact: IconContact,
  finder: IconFinder,
  trash: IconTrash,
} as const;

export type AppIconKey = keyof typeof APP_ICON_MAP;
