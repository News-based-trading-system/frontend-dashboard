import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  actions,
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl space-y-3">
        {eyebrow ? (
          <div className="flex items-center gap-3">
            {/* Warm accent line */}
            <span className="h-px w-5 bg-gradient-to-r from-[rgba(255,232,219,0.7)] to-[rgba(115,158,201,0.5)]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[rgb(var(--accent-secondary))]">
              {eyebrow}
            </p>
          </div>
        ) : null}
        <div className="space-y-2.5">
          <h2 className="text-2xl font-extrabold tracking-tight text-[rgb(var(--text-primary))] md:text-[28px]">
            {title}
          </h2>
          {description ? (
            <p className="text-[13px] leading-7 text-[rgb(var(--text-tertiary))] md:text-sm">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
