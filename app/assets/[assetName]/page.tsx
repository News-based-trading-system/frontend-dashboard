import Link from "next/link";
import { notFound } from "next/navigation";
import { AssetCard } from "../../../components/assets/asset-card";
import { AssetDirectionBadge } from "../../../components/assets/asset-direction-badge";
import { AssetExplainabilityTable } from "../../../components/assets/asset-explainability-table";
import { SectionHeading } from "../../../components/section-heading";
import {
  formatScorePercentage,
  formatTimestampIst,
  getConvictionLabel,
  getAssetByName,
  getAssetExplainability,
  getAssets,
  getSignalNarrative,
} from "../../../utils/assets";

type AssetDetailPageProps = {
  params: Promise<{ assetName: string }>;
};

export default async function AssetDetailPage({ params }: AssetDetailPageProps) {
  const { assetName } = await params;
  const decodedName = decodeURIComponent(assetName);
  const asset = await getAssetByName(decodedName);

  if (!asset) {
    notFound();
  }

  const relatedAssets = (await getAssets({ sort: "activity", limit: 8 }))
    .filter(
      (candidate) =>
        candidate.asset_name !== asset.asset_name && candidate.asset_type === asset.asset_type,
    )
    .slice(0, 3);
  const explainabilityRows = await getAssetExplainability(asset.asset_name, {
    includeInactive: true,
    limit: 40,
  });
  const isBullish = asset.direction === "bullish";
  const isBearish = asset.direction === "bearish";

  return (
    <div className="space-y-10 pb-12">
      {/* Hero */}
      <div className="hero-glow relative overflow-hidden rounded-3xl glass-card-static p-8 md:p-10">
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(var(--accent-primary),0.4)] to-transparent" />

        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-4">
            <Link href="/dashboard" className="group inline-flex items-center gap-2 text-sm text-[rgb(var(--accent-primary))] transition-colors duration-300 hover:text-[rgb(var(--accent-tertiary))]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to dashboard
            </Link>
            <div className="flex flex-wrap items-center gap-4">
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-3xl font-black uppercase tracking-[0.2em] md:text-4xl ${
                  isBullish
                    ? "border-[rgba(124,210,165,0.4)] bg-[rgba(124,210,165,0.1)] text-[rgb(var(--bullish))]"
                    : isBearish
                      ? "border-[rgba(255,120,156,0.4)] bg-[rgba(255,120,156,0.1)] text-[rgb(var(--bearish))]"
                      : "border-[rgba(115,158,201,0.35)] bg-[rgba(115,158,201,0.08)] text-white"
                }`}
              >
                <span>{asset.asset_name}</span>
              </span>
              <span
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full border ${
                  isBullish
                    ? "border-[rgba(124,210,165,0.4)] text-[rgb(var(--bullish))]"
                    : isBearish
                      ? "border-[rgba(255,120,156,0.4)] text-[rgb(var(--bearish))]"
                      : "border-[rgba(115,158,201,0.35)] text-[rgb(var(--accent-secondary))]"
                }`}
                aria-hidden="true"
              >
                {isBearish ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M6 13l6 6 6-6" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19V5M6 11l6-6 6 6" />
                  </svg>
                )}
              </span>
              <AssetDirectionBadge direction={asset.direction} />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-tertiary))]">{asset.asset_type}</p>
          </div>
          <div className="glass-card-static rounded-2xl px-6 py-5 text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[rgb(var(--text-tertiary))]">Asset score</p>
            <p className={`mt-2 text-4xl font-extrabold ${asset.direction === 'bullish' ? 'text-[rgb(var(--bullish))] drop-shadow-[0_0_12px_rgba(var(--bullish),0.4)]' : asset.direction === 'bearish' ? 'text-[rgb(var(--bearish))] drop-shadow-[0_0_12px_rgba(var(--bearish),0.4)]' : 'gradient-text-static'}`}>{formatScorePercentage(asset.asset_score)}</p>
          </div>
        </div>
        <p className="relative mt-8 max-w-3xl text-base leading-8 text-[rgb(var(--text-tertiary))]">{getSignalNarrative(asset)}</p>
      </div>

      {/* Metric cards */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="glass-card rounded-2xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[rgb(var(--text-tertiary))]">Conviction</p>
          <p className="mt-3 text-3xl font-bold text-[rgb(var(--text-primary))]">{getConvictionLabel(asset.confidence)}</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[rgb(var(--text-tertiary))]">Updated</p>
          <p className="mt-3 text-lg font-bold text-[rgb(var(--text-primary))]">{formatTimestampIst(asset.updated_at)}</p>
        </div>
      </section>

      {/* Explainability */}
      <section>
        <div className="glass-card-static rounded-2xl p-6">
          <SectionHeading
            eyebrow="Signal explainability"
            title="Timeline context"
            description="Each row keeps the event headline and time only, for a cleaner narrative view."
          />
          <AssetExplainabilityTable rows={explainabilityRows} />
        </div>
      </section>

      {/* Related assets */}
      {relatedAssets.length > 0 ? (
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Related assets"
            title={`More ${asset.asset_type} names worth comparing`}
            description="Nearby opportunities from the same asset family, sorted by activity."
          />
          <div className="grid gap-6 xl:grid-cols-3">
            {relatedAssets.map((related) => (
              <AssetCard key={related.asset_name} asset={related} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
