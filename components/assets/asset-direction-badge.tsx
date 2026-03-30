import { normalizeDirection } from "../../utils/assets";

type AssetDirectionBadgeProps = {
  direction: string;
};

const toneClasses = {
  bullish: "border-emerald-400/30 bg-emerald-400/12 text-emerald-200",
  bearish: "border-rose-400/30 bg-rose-400/12 text-rose-200",
  neutral: "border-slate-400/20 bg-slate-400/10 text-slate-200",
};

export function AssetDirectionBadge({ direction }: AssetDirectionBadgeProps) {
  const normalized = normalizeDirection(direction);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${toneClasses[normalized]}`}
    >
      {normalized}
    </span>
  );
}
