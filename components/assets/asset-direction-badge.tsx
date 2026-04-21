import { normalizeDirection } from "../../utils/assets";

type AssetDirectionBadgeProps = {
  direction: string;
};

const toneMap = {
  bullish: {
    classes: "badge-bullish",
    dot: "bg-[rgb(var(--bullish))]",
  },
  bearish: {
    classes: "badge-bearish",
    dot: "bg-[rgb(var(--bearish))]",
  },
  neutral: {
    classes: "badge-neutral",
    dot: "bg-[rgb(var(--text-tertiary))]",
  },
};

const icons = {
  bullish: (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m18 15-6-6-6 6" />
    </svg>
  ),
  bearish: (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
  neutral: (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
};

export function AssetDirectionBadge({ direction }: AssetDirectionBadgeProps) {
  const normalized = normalizeDirection(direction);
  const { classes } = toneMap[normalized];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em] ${classes}`}
    >
      {icons[normalized]}
      {normalized}
    </span>
  );
}
