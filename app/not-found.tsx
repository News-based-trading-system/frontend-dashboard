import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-[36px] border border-white/10 bg-white/5 px-6 py-16 text-center">
      <div className="mx-auto max-w-2xl space-y-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Asset not found
        </p>
        <h1 className="text-4xl font-semibold text-white">This signal is no longer in the public view.</h1>
        <p className="text-sm leading-7 text-slate-300">
          The asset may not meet the display criteria right now, or the link may be outdated.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/20"
          >
            Back to dashboard
          </Link>
          <Link
            href="/"
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
