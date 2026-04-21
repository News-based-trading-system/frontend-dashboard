import Link from "next/link";
import { notFound } from "next/navigation";
import { AssetCard } from "../../../components/assets/asset-card";
import { AssetDirectionBadge } from "../../../components/assets/asset-direction-badge";
import { AssetExplainabilityTable } from "../../../components/assets/asset-explainability-table";
import { SectionHeading } from "../../../components/section-heading";
import {
  formatCompactNumber,
  formatEventId,
  formatNumber,
  formatPercent,
  formatSignedNumber,
  formatTimestamp,
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
              <h1 className="text-4xl font-extrabold tracking-tight text-[rgb(var(--text-primary))] md:text-5xl">
                {asset.asset_name}
              </h1>
              <AssetDirectionBadge direction={asset.direction} />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-tertiary))]">{asset.asset_type}</p>
          </div>
          <div className="glass-card-static rounded-2xl px-6 py-5 text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[rgb(var(--text-tertiary))]">Asset score</p>
            <p className="mt-2 text-4xl font-extrabold gradient-text-static">{formatNumber(asset.asset_score)}</p>
          </div>
        </div>
        <p className="relative mt-8 max-w-3xl text-base leading-8 text-[rgb(var(--text-tertiary))]">{getSignalNarrative(asset)}</p>
      </div>

      {/* Metric cards */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="glass-card rounded-2xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[rgb(var(--text-tertiary))]">Confidence</p>
          <p className="mt-3 text-3xl font-bold text-[rgb(var(--text-primary))]">{formatPercent(asset.confidence)}</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[rgb(var(--text-tertiary))]">Disagreement</p>
          <p className="mt-3 text-3xl font-bold text-[rgb(var(--text-primary))]">{formatPercent(asset.disagreement)}</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[rgb(var(--text-tertiary))]">Activity / events</p>
          <p className="mt-3 text-3xl font-bold text-[rgb(var(--text-primary))]">
            {formatCompactNumber(asset.abs_sum)} / {asset.event_count}
          </p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[rgb(var(--text-tertiary))]">Updated</p>
          <p className="mt-3 text-lg font-bold text-[rgb(var(--text-primary))]">{formatTimestamp(asset.updated_at)}</p>
        </div>
      </section>

      {/* Signal profile + Explainability */}
      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-card-static rounded-2xl p-6">
          <SectionHeading
            eyebrow="Why it stands out"
            title="Signal profile"
            description="A clean breakdown of the underlying public metrics behind this asset's visibility."
          />
          <dl className="mt-6 grid gap-3 text-sm text-[rgb(var(--text-tertiary))]">
            {[
              { label: "Bull sum", value: formatSignedNumber(asset.bull_sum) },
              { label: "Bear sum", value: formatSignedNumber(asset.bear_sum) },
              { label: "Latest event ID", value: formatEventId(asset.latest_event_id), mono: true },
              { label: "Last event time", value: formatTimestamp(asset.last_event_time) },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-[rgba(var(--surface-0),0.4)] px-4 py-4 transition-all duration-300 hover:border-[rgba(var(--accent-primary),0.1)]">
                <dt>{item.label}</dt>
                <dd className={`font-semibold text-[rgb(var(--text-primary))] ${item.mono ? "font-mono text-xs" : ""}`}>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="glass-card-static rounded-2xl p-6">
          <SectionHeading
            eyebrow="Signal explainability"
            title="How each event contributes"
            description="Contribution rows include current versus original impact, event certainty/severity, and source article context."
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
