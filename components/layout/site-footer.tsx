import Link from "next/link";

const footerLinks = [
  { href: "/dashboard",   label: "Dashboard" },
  { href: "/stocks",      label: "Stocks" },
  { href: "/commodities", label: "Commodities" },
  { href: "/events",      label: "Events" },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-20 border-t border-[rgba(86,130,177,0.1)]">
      {/* Top gradient line */}
      <div className="section-divider absolute -top-px left-0 right-0" />

      <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-8">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr]">

          {/* Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="relative flex h-8 w-8 items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[rgb(var(--accent-secondary))] transition-all duration-[1.5s] ease-in-out group-hover:rotate-90 group-hover:scale-105">
                  <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" />
                  <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="3 3" />
                  <path d="M20 4V12M20 28V36M4 20H12M28 20H36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="opacity-80" />
                  <path d="M10 10L14 14M30 30L26 26M10 30L14 26M30 10L26 14" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeLinecap="round" />
                  <circle cx="20" cy="20" r="3" fill="rgb(var(--accent-warm))" className="drop-shadow-[0_0_8px_rgba(255,232,219,0.8)]" />
                </svg>
              </div>
              <p className="text-sm font-semibold tracking-[0.16em] text-[rgb(var(--text-primary))] uppercase">
                Asset Harbor
              </p>
            </div>

            <p className="max-w-sm text-sm leading-7 text-[rgb(var(--text-tertiary))]">
              A curated public lens on momentum, conviction, disagreement, and asset activity.
              Built for analysts who value signal clarity over noise.
            </p>

            {/* Color palette accent bar */}
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-8 rounded-full bg-[#5682B1] opacity-70" />
              <div className="h-1.5 w-5 rounded-full bg-[#739EC9] opacity-70" />
              <div className="h-1.5 w-3 rounded-full bg-[#FFE8DB] opacity-70" />
            </div>

            <p className="text-[11px] text-[rgb(var(--text-tertiary))] opacity-40">
              © 2026 Asset Harbor. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-[rgb(var(--text-tertiary))]">
              Navigate
            </p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2.5">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-2 text-sm text-[rgb(var(--text-secondary))] transition-all duration-300 hover:text-[rgb(var(--accent-secondary))]"
                >
                  <span className="h-px w-0 bg-[rgb(var(--accent-secondary))] transition-all duration-300 group-hover:w-3" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
