import Link from "next/link";
import { AssetCard } from "../components/assets/asset-card";
import { AssetTable } from "../components/assets/asset-table";
import { MetricCard } from "../components/metric-card";
import { SectionHeading } from "../components/section-heading";
import { getLandingData } from "../utils/assets";

const platformPillars = [
  {
    title: "Curated over noisy",
    description:
      "Only public-ready rows make it through. The experience is intentionally selective, not an undifferentiated screener.",
  },
  {
    title: "Directional context",
    description:
      "Momentum, confidence, disagreement, and activity are surfaced together so a move never appears without context.",
  },
  {
    title: "Built for fast reading",
    description:
      "Every section is optimized for scanability, with quick segmentation by direction, recency, and asset type.",
  },
];

export default async function Home() {
  const { featured, bullish, bearish, latest, metrics, assetTypeCounts } =
    await getLandingData();

  return (
    <div className="space-y-20 pb-12">
      <section className="rounded-[40px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.22),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(15,118,110,0.16),_transparent_32%),linear-gradient(135deg,rgba(8,15,28,0.96),rgba(12,20,36,0.86))] px-6 py-16 shadow-[0_60px_130px_-80px_rgba(34,211,238,0.65)] md:px-10 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="space-y-8">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/80">
                Curated asset intelligence
              </p>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-6xl md:leading-[1.05]">
                Discover the strongest asset moves with premium signal clarity.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
                Asset Harbor turns raw asset analytics into a calm, trustworthy public experience for spotting directional conviction across stocks, ETFs, and commodities.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-medium text-cyan-100 transition hover:border-cyan-200/50 hover:bg-cyan-300/20"
              >
                Explore dashboard
              </Link>
              <Link
                href="/bullish"
                className="rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/5"
              >
                View bullish leaders
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              {metrics.map((metric) => (
                <MetricCard
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                  hint={metric.hint}
                />
              ))}
            </div>
          </div>
          <div className="rounded-[34px] border border-white/10 bg-black/20 p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300/80">
              Coverage snapshot
            </p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200">
                <span>Stocks</span>
                <span>{assetTypeCounts.stocks}</span>
              </div>
              <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200">
                <span>ETFs</span>
                <span>{assetTypeCounts.etfs}</span>
              </div>
              <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200">
                <span>Commodities</span>
                <span>{assetTypeCounts.commodities}</span>
              </div>
            </div>
            <p className="mt-6 text-sm leading-7 text-slate-300">
              Every public segment is filtered through the same display gate so what users see stays focused, credible, and easy to interpret.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {platformPillars.map((pillar) => (
          <div
            key={pillar.title}
            className="rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur"
          >
            <h2 className="text-xl font-semibold text-slate-50">{pillar.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">{pillar.description}</p>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Featured opportunities"
          title="High-activity assets with the strongest public visibility"
          description="These names are rising to the top because their activity and signal alignment stand out right now."
          actions={
            <Link
              href="/dashboard?sort=activity"
              className="text-sm font-medium text-cyan-200 transition hover:text-cyan-100"
            >
              See full activity view
            </Link>
          }
        />
        <div className="grid gap-6 xl:grid-cols-2">
          {featured.slice(0, 2).map((asset) => (
            <AssetCard key={asset.asset_name} asset={asset} />
          ))}
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-2">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Bullish watchlist"
            title="Positive conviction with public-ready confidence"
            description="A curated slice of the strongest bullish setups visible right now."
          />
          <div className="grid gap-6">
            {bullish.slice(0, 3).map((asset) => (
              <AssetCard key={asset.asset_name} asset={asset} />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Bearish watchlist"
            title="Downside pressure worth understanding early"
            description="Curated bearish assets where confidence, activity, and urgency combine in useful ways."
          />
          <div className="grid gap-6">
            {bearish.slice(0, 3).map((asset) => (
              <AssetCard key={asset.asset_name} asset={asset} />
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Latest refresh"
          title="Most recently updated curated signals"
          description="Use this view to track which assets have been refreshed most recently by the analytics layer."
        />
        <AssetTable assets={latest} />
      </section>
    </div>
  );
}
