import { formatPercent } from "../../utils/assets";

type SignalMeterProps = {
  value: number;
  label: string;
  tone?: "blue" | "warm" | "emerald" | "rose" | "amber" | "cyan";
};

const toneMap: Record<string, { bar: string; glow: string }> = {
  blue:    { bar: "from-[#5682B1] to-[#739EC9]", glow: "rgba(86,130,177,0.45)" },
  warm:    { bar: "from-[#FFE8DB] to-[#e8c5ac]", glow: "rgba(255,232,219,0.4)" },
  cyan:    { bar: "from-[rgb(var(--accent-primary))] to-[rgb(var(--accent-secondary))]", glow: "rgba(var(--accent-primary),0.4)" },
  emerald: { bar: "from-emerald-400 to-teal-400",     glow: "rgba(52,211,153,0.4)" },
  rose:    { bar: "from-rose-400 to-pink-400",         glow: "rgba(251,113,133,0.4)" },
  amber:   { bar: "from-amber-300 to-orange-400",      glow: "rgba(251,191,36,0.4)" },
};

export function SignalMeter({ value, label, tone = "blue" }: SignalMeterProps) {
  const clamped = Math.max(0, Math.min(value, 1));
  const { bar, glow } = toneMap[tone] ?? toneMap.blue;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[rgb(var(--text-tertiary))]">
          {label}
        </span>
        <span className="mono-num text-[11px] font-semibold text-[rgb(var(--text-secondary))]">
          {formatPercent(clamped)}
        </span>
      </div>
      {/* Track */}
      <div className="relative h-1 overflow-hidden rounded-full bg-[rgba(255,255,255,0.04)]">
        {/* Fill */}
        <div
          className={`h-full rounded-full bg-gradient-to-r ${bar} transition-all duration-700 ease-out`}
          style={{
            width: `${clamped * 100}%`,
            boxShadow: `0 0 10px ${glow}`,
          }}
        />
      </div>
    </div>
  );
}
