"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-[36px] border border-rose-400/20 bg-rose-400/10 px-6 py-14 text-center">
      <div className="mx-auto max-w-2xl space-y-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-200/80">
          Signal delivery issue
        </p>
        <h2 className="text-3xl font-semibold text-white">We hit a problem loading this view.</h2>
        <p className="text-sm leading-7 text-rose-50/80">
          {error.message || "Something went wrong while loading the curated asset experience."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-rose-200/30 bg-rose-200/10 px-5 py-3 text-sm font-medium text-rose-50 transition hover:bg-rose-200/20"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
