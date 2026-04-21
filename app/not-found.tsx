import Link from "next/link";

export default function NotFound() {
  return (
    <div className="glass-card-static relative overflow-hidden rounded-3xl px-6 py-20 text-center">
      {/* Top gradient line */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(var(--accent-primary),0.3)] to-transparent" />

      {/* Decorative rings */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-64 w-64 rounded-full border border-white/[0.02]" />
        <div className="absolute inset-8 rounded-full border border-white/[0.03]" />
        <div className="absolute inset-16 rounded-full border border-white/[0.04]" />
        <div className="absolute inset-24 rounded-full border border-white/[0.03]" />
      </div>

      <div className="relative mx-auto max-w-2xl space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgba(var(--accent-primary),0.06)]">
          <span className="gradient-text text-3xl font-black">404</span>
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[rgb(var(--text-tertiary))]">
          Asset not found
        </p>
        <h1 className="text-3xl font-bold text-[rgb(var(--text-primary))] md:text-4xl">
          This signal is no longer in the public view.
        </h1>
        <p className="text-sm leading-7 text-[rgb(var(--text-tertiary))]">
          The asset may not meet the display criteria right now, or the link may be outdated.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/dashboard" className="btn-primary">
            <span>Back to dashboard</span>
          </Link>
          <Link href="/" className="btn-ghost">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
