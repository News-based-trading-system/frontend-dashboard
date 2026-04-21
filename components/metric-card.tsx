import type { ReactNode } from "react";
import { AnimatedCounter } from "./animated-counter";

type MetricCardProps = {
  label: string;
  value: string;
  hint: string;
  icon?: ReactNode;
};

export function MetricCard({ label, value, hint, icon }: MetricCardProps) {
  return (
    <div className="premium-card group relative overflow-hidden rounded-2xl p-5">
      {/* Hover glow */}
      <div className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-[radial-gradient(circle,rgba(115,158,201,0.15),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[rgb(var(--text-tertiary))]">
              {label}
            </p>
            <p className="mono-num text-2xl font-black tracking-tight text-[rgb(var(--text-primary))] md:text-3xl">
              <AnimatedCounter value={value} />
            </p>
          </div>
          {icon ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(86,130,177,0.1)] text-[rgb(var(--accent-secondary))] ring-1 ring-[rgba(86,130,177,0.15)]">
              {icon}
            </div>
          ) : (
            /* Default decorative element */
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[rgba(86,130,177,0.15)] to-[rgba(255,232,219,0.06)] ring-1 ring-[rgba(86,130,177,0.12)]" />
          )}
        </div>
        <p className="relative mt-4 text-[12px] leading-6 text-[rgb(var(--text-tertiary))]">{hint}</p>
      </div>
    </div>
  );
}
