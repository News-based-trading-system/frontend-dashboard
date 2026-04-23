"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navigation = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/events",    label: "Live Events" },
  { href: "/bullish",   label: "Bullish" },
  { href: "/bearish",   label: "Bearish" },
  { href: "/stocks",    label: "Stocks" },
  { href: "/commodities", label: "Commodities" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-[rgba(86,130,177,0.1)] bg-[rgba(0,0,0,0.88)] shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
          : "bg-transparent"
      }`}
    >
      {/* Bottom hairline gradient */}
      {scrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(115,158,201,0.3)] to-transparent" />
      )}

      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-5 py-4 md:px-8">

        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3 flex-shrink-0">
          <div className="relative flex h-10 w-10 items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[rgb(var(--accent-secondary))] transition-all duration-[1.5s] ease-in-out group-hover:rotate-90 group-hover:scale-105">
              <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" />
              <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="3 3" />
              <path d="M20 4V12M20 28V36M4 20H12M28 20H36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="opacity-80" />
              <path d="M10 10L14 14M30 30L26 26M10 30L14 26M30 10L26 14" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeLinecap="round" />
              <circle cx="20" cy="20" r="3" fill="rgb(var(--accent-warm))" className="drop-shadow-[0_0_8px_rgba(255,232,219,0.8)]" />
            </svg>
          </div>

          <div className="leading-none">
            <p className="text-[13px] font-semibold tracking-[0.15em] text-[rgb(var(--text-primary))] uppercase">
              Asset Harbor
            </p>
            <p className="mt-0.5 text-[10px] tracking-wide text-[rgb(var(--text-tertiary))]">
              Signal intelligence
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-300 ${
                  isActive
                    ? "text-[rgb(var(--accent-secondary))]"
                    : "text-[rgb(var(--text-tertiary))] hover:text-[rgb(var(--text-secondary))] hover:bg-[rgba(86,130,177,0.05)]"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-0.5 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-gradient-to-r from-[rgb(var(--accent-primary))] to-[rgb(var(--accent-secondary))]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="hidden items-center gap-2 sm:flex">
            <span className="signal-live" />
            <span className="text-[11px] font-medium text-[rgb(var(--text-tertiary))]">Live</span>
          </div>



          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[rgba(86,130,177,0.14)] bg-[rgba(86,130,177,0.04)] text-[rgb(var(--text-secondary))] transition hover:bg-[rgba(86,130,177,0.1)] hover:border-[rgba(86,130,177,0.25)] lg:hidden"
            aria-label="Toggle navigation"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? (
                <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
              ) : (
                <><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="animate-float-down border-t border-[rgba(86,130,177,0.1)] bg-[rgba(0,0,0,0.96)] px-5 pb-6 pt-4 backdrop-blur-2xl lg:hidden">
          <nav className="grid gap-0.5">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-[rgba(86,130,177,0.1)] text-[rgb(var(--accent-secondary))] border border-[rgba(86,130,177,0.18)]"
                      : "text-[rgb(var(--text-secondary))] hover:bg-[rgba(86,130,177,0.05)] hover:text-[rgb(var(--text-primary))]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
