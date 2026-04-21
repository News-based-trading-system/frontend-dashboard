import Link from "next/link";

type EmptyStateProps = {
  title: string;
  description: string;
  href?: string;
  ctaLabel?: string;
};

export function EmptyState({
  title,
  description,
  href = "/dashboard",
  ctaLabel = "Reset filters",
}: EmptyStateProps) {
  return (
    <div className="premium-card relative overflow-hidden rounded-2xl px-6 py-20 text-center">
      {/* Decorative rings */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-44 w-44 rounded-full border border-[rgba(86,130,177,0.06)]" />
        <div className="absolute inset-5 rounded-full border border-[rgba(115,158,201,0.08)]" />
        <div className="absolute inset-10 rounded-full border border-[rgba(255,232,219,0.06)]" />
      </div>

      <div className="relative mx-auto max-w-xl space-y-5">
        {/* Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(86,130,177,0.08)] text-[rgb(var(--accent-secondary))] ring-1 ring-[rgba(86,130,177,0.14)]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
        </div>

        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[rgb(var(--text-tertiary))]">
          No matching assets
        </p>
        <h3 className="text-xl font-extrabold text-[rgb(var(--text-primary))]">{title}</h3>
        <p className="text-sm leading-7 text-[rgb(var(--text-tertiary))]">{description}</p>

        <Link href={href} className="btn-primary inline-flex">
          <span>{ctaLabel}</span>
        </Link>
      </div>
    </div>
  );
}
