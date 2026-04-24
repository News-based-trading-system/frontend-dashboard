import Link from "next/link";
import { AssetCard } from "../components/assets/asset-card";
import { AssetTable } from "../components/assets/asset-table";
import { SectionHeading } from "../components/section-heading";
import { ScrollReveal } from "../components/scroll-reveal";
import { getLandingData } from "../utils/assets";

const platformPillars = [
  {
    title: "Curated Over Noisy",
    description: "Only public-ready rows make it through. Intentionally selective, never an undifferentiated screener.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  {
    title: "Directional Context",
    description: "Momentum, confidence, disagreement, and activity surfaced together. A move never appears without context.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    title: "Minimal Distraction",
    description: "Every section is optimized for scanability and pure signal extraction. Aesthetics meet utility.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
  },
];

export default async function Home() {
  const { featured, bullish, bearish, latest } = await getLandingData();

  return (
    <div className="space-y-32 pb-24 md:space-y-48">

      {/* ──────── ULTRA-MINIMAL HERO ──────── */}
      <section className="relative pt-20 pb-10 md:pt-32">
        <ScrollReveal animation="float-up" className="mx-auto max-w-4xl text-center">
          {/* Subtle Live Tag */}
          <div className="mb-8 flex items-center justify-center gap-3">
            <span className="signal-live" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[rgb(var(--accent-secondary))]">
              Live Intelligence
            </span>
            <span className="h-px w-12 bg-gradient-to-r from-[rgba(115,158,201,0.5)] to-transparent" />
          </div>

          {/* Artistic Typography Hero */}
          <h1 className="text-5xl font-light tracking-tight text-white md:text-7xl lg:text-[80px] lg:leading-[1.1]">
            <span className="block text-[rgb(var(--text-tertiary))]">Signal clarity over</span>
            <span className="bg-gradient-to-r from-[rgb(var(--accent-warm))] via-[rgb(var(--accent-secondary))] to-[rgb(var(--accent-primary))] bg-clip-text text-transparent font-normal">
              market noise.
            </span>
          </h1>

          <p className="mx-auto mt-10 max-w-2xl text-[15px] font-light leading-relaxed text-[rgb(var(--text-secondary))] md:text-lg">
            Asset Harbor distills raw analytics into a serene, trustworthy experience for spotting directional conviction across global markets.
          </p>

          <div className="mt-14 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Link href="/dashboard" className="btn-primary px-8 py-3.5 text-sm">
              <span>Enter Dashboard</span>
            </Link>
            <Link href="/dashboard?direction=bullish" className="group flex items-center gap-2 text-sm text-[rgb(var(--text-tertiary))] transition-colors hover:text-[rgb(var(--accent-warm))]">
              <span>View leaders in dashboard</span>
              <span className="h-px w-4 bg-[rgb(var(--text-tertiary))] transition-all group-hover:w-8 group-hover:bg-[rgb(var(--accent-warm))]" />
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* ──────── ELEGANT PILLARS ──────── */}
      <section className="relative mx-auto max-w-6xl">
        <div className="grid gap-16 md:grid-cols-3">
          {platformPillars.map((pillar, index) => (
            <ScrollReveal key={pillar.title} animation="float-up" delay={index * 0.15}>
              <div className="group relative border-l border-[rgba(115,158,201,0.15)] pl-6 transition-colors hover:border-[rgb(var(--accent-warm))]">
                <div className="mb-6 text-[rgb(var(--accent-secondary))] transition-colors group-hover:text-[rgb(var(--accent-warm))]">
                  {pillar.icon}
                </div>
                <h2 className="text-sm font-medium tracking-wide text-white">{pillar.title}</h2>
                <p className="mt-4 text-[13px] font-light leading-relaxed text-[rgb(var(--text-tertiary))]">
                  {pillar.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ──────── FEATURED ──────── */}
      <section className="space-y-10">
        <ScrollReveal animation="slide-left">
          <SectionHeading
            eyebrow="Featured"
            title="High-Activity Assets"
            description="Rising to the top through activity and signal alignment."
            actions={
              <Link href="/dashboard?sort=activity" className="group flex items-center gap-2 text-xs uppercase tracking-widest text-[rgb(var(--accent-secondary))] hover:text-[rgb(var(--accent-warm))]">
                <span>View All</span>
                <svg className="transition-transform group-hover:translate-x-1" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            }
          />
        </ScrollReveal>
        <div className="grid gap-6 xl:grid-cols-2">
          {featured.slice(0, 2).map((asset, i) => (
            <ScrollReveal key={asset.asset_name} animation="float-up" delay={i * 0.1}>
              <AssetCard asset={asset} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ──────── DUAL LISTS ──────── */}
      <section className="grid gap-16 xl:grid-cols-2 xl:gap-8">
        <div className="space-y-10">
          <ScrollReveal animation="slide-left">
            <SectionHeading eyebrow="Conviction" title="Bullish Leaders" />
          </ScrollReveal>
          <div className="grid gap-6">
            {bullish.slice(0, 3).map((asset, i) => (
              <ScrollReveal key={asset.asset_name} animation="float-up" delay={i * 0.1}>
                <AssetCard asset={asset} />
              </ScrollReveal>
            ))}
          </div>
        </div>

        <div className="space-y-10">
          <ScrollReveal animation="slide-right">
            <SectionHeading eyebrow="Pressure" title="Bearish Leaders" />
          </ScrollReveal>
          <div className="grid gap-6">
            {bearish.slice(0, 3).map((asset, i) => (
              <ScrollReveal key={asset.asset_name} animation="float-up" delay={i * 0.1}>
                <AssetCard asset={asset} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── LATEST TABLE ──────── */}
      <section className="space-y-10 pb-10">
        <ScrollReveal animation="float-up">
          <SectionHeading eyebrow="Timeline" title="Latest Intelligence" />
        </ScrollReveal>
        <ScrollReveal animation="blur-in">
          <AssetTable assets={latest} />
        </ScrollReveal>
      </section>

    </div>
  );
}
