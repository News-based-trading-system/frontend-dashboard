import Link from "next/link";

const navigation = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/events", label: "Live Events" },
  { href: "/ops", label: "Ops" },
  { href: "/bullish", label: "Bullish" },
  { href: "/bearish", label: "Bearish" },
  { href: "/stocks", label: "Stocks" },
  { href: "/etfs", label: "ETFs" },
  { href: "/commodities", label: "Commodities" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-sm font-semibold text-cyan-200">
            AH
          </span>
          <div>
            <p className="text-sm font-semibold tracking-[0.22em] text-slate-100 uppercase">
              Asset Harbor
            </p>
            <p className="text-xs text-slate-400">Curated analytics for directional conviction</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-5 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-slate-300 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/dashboard"
          className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-200/50 hover:bg-cyan-300/20"
        >
          Open dashboard
        </Link>
      </div>
    </header>
  );
}
