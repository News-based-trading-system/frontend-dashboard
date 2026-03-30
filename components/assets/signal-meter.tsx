import { formatPercent } from "../../utils/assets";

type SignalMeterProps = {
  value: number;
  label: string;
  tone?: "cyan" | "emerald" | "rose" | "amber";
};

const toneMap = {
  cyan: "from-cyan-300 to-sky-500",
  emerald: "from-emerald-300 to-emerald-500",
  rose: "from-rose-300 to-rose-500",
  amber: "from-amber-200 to-amber-500",
};

export function SignalMeter({ value, label, tone = "cyan" }: SignalMeterProps) {
  const clamped = Math.max(0, Math.min(value, 1));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-400">
        <span>{label}</span>
        <span>{formatPercent(clamped)}</span>
      </div>
      <div className="h-2 rounded-full bg-white/10">
        <div
          className={`h-2 rounded-full bg-gradient-to-r ${toneMap[tone]}`}
          style={{ width: `${clamped * 100}%` }}
        />
      </div>
    </div>
  );
}
