import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 text-sm text-slate-400 md:flex-row md:items-end md:justify-between md:px-8">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-200">
            Asset Harbor
          </p>
          <p className="max-w-xl leading-7">
            A curated public lens on momentum, conviction, disagreement, and asset activity.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-slate-300">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/bullish">Bullish</Link>
          <Link href="/bearish">Bearish</Link>
          <Link href="/stocks">Stocks</Link>
          <Link href="/etfs">ETFs</Link>
          <Link href="/commodities">Commodities</Link>
        </div>
      </div>
    </footer>
  );
}
