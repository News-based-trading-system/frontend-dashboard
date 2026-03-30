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
    <div className="rounded-[30px] border border-dashed border-white/15 bg-white/5 px-6 py-12 text-center">
      <div className="mx-auto max-w-xl space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          No matching assets
        </p>
        <h3 className="text-2xl font-semibold text-slate-50">{title}</h3>
        <p className="text-sm leading-7 text-slate-300">{description}</p>
        <Link
          href={href}
          className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/20"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
