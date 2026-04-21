"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="glass-card-static relative overflow-hidden rounded-3xl px-6 py-16 text-center">
      {/* Top gradient line - rose tinted */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(var(--bearish),0.4)] to-transparent" />

      {/* Decorative glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(var(--bearish),0.06),transparent_60%)] blur-2xl" />

      <div className="relative mx-auto max-w-2xl space-y-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(var(--bearish),0.08)]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(var(--bearish))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[rgb(var(--bearish))]">
          Signal delivery issue
        </p>
        <h2 className="text-3xl font-bold text-[rgb(var(--text-primary))]">We hit a problem loading this view.</h2>
        <p className="text-sm leading-7 text-[rgb(var(--text-tertiary))]">
          {error.message || "Something went wrong while loading the curated asset experience."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="btn-primary inline-flex"
        >
          <span>Try again</span>
        </button>
      </div>
    </div>
  );
}
