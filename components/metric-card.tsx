import type { ReactNode } from "react";

type MetricCardProps = {
  label: string;
  value: string;
  hint: string;
  icon?: ReactNode;
};

export function MetricCard({ label, value, hint, icon }: MetricCardProps) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_24px_80px_-40px_rgba(56,189,248,0.4)] backdrop-blur-md">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            {label}
          </p>
          <p className="text-3xl font-semibold tracking-tight text-slate-50">{value}</p>
        </div>
        {icon ? <div className="text-cyan-200">{icon}</div> : null}
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">{hint}</p>
    </div>
  );
}
