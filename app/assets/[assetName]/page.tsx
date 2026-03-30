import Link from "next/link";
import { notFound } from "next/navigation";
import { AssetCard } from "../../../components/assets/asset-card";
import { AssetDirectionBadge } from "../../../components/assets/asset-direction-badge";
import { SectionHeading } from "../../../components/section-heading";
import {
  formatCompactNumber,
  formatNumber,
  formatPercent,
  formatSignedNumber,
  formatTimestamp,
  getAssetByName,
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
  const horizonEntries = Object.entries(asset.horizon_buckets ?? {}).filter(
    ([, value]) => value !== null && value !== "",
  );

  return (
    <div className="space-y-10 pb-12">
      <div className="rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.2),_transparent_34%),linear-gradient(135deg,rgba(8,15,28,0.96),rgba(15,23,42,0.92))] p-8 md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-4">
            <Link href="/dashboard" className="text-sm text-cyan-200 transition hover:text-cyan-100">
              Back to dashboard
            </Link>
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-50 md:text-5xl">
                {asset.asset_name}
              </h1>
              <AssetDirectionBadge direction={asset.direction} />
            </div>
            <p className="text-sm uppercase tracking-[0.18em] text-slate-400">{asset.asset_type}</p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-black/20 px-6 py-5 text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Asset score</p>
            <p className="mt-2 text-4xl font-semibold text-cyan-200">{formatNumber(asset.asset_score)}</p>
          </div>
        </div>
        <p className="mt-8 max-w-3xl text-base leading-8 text-slate-300">{getSignalNarrative(asset)}</p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Confidence</p>
          <p className="mt-3 text-3xl font-semibold text-slate-50">{formatPercent(asset.confidence)}</p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Disagreement</p>
          <p className="mt-3 text-3xl font-semibold text-slate-50">{formatPercent(asset.disagreement)}</p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Activity / events</p>
          <p className="mt-3 text-3xl font-semibold text-slate-50">
            {formatCompactNumber(asset.abs_sum)} / {asset.event_count}
          </p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Updated</p>
          <p className="mt-3 text-lg font-semibold text-slate-50">{formatTimestamp(asset.updated_at)}</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[30px] border border-white/10 bg-slate-900/60 p-6">
          <SectionHeading
            eyebrow="Why it stands out"
            title="Signal profile"
            description="A clean breakdown of the underlying public metrics behind this asset's visibility."
          />
          <dl className="mt-6 grid gap-4 text-sm text-slate-300">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              <dt>Bull sum</dt>
              <dd className="font-medium text-slate-100">{formatSignedNumber(asset.bull_sum)}</dd>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              <dt>Bear sum</dt>
              <dd className="font-medium text-slate-100">{formatSignedNumber(asset.bear_sum)}</dd>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              <dt>Average half-life</dt>
              <dd className="font-medium text-slate-100">{formatNumber(asset.avg_half_life_hours)}h</dd>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              <dt>Last event time</dt>
              <dd className="font-medium text-slate-100">{formatTimestamp(asset.last_event_time)}</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-[30px] border border-white/10 bg-slate-900/60 p-6">
          <SectionHeading
            eyebrow="Horizon buckets"
            title="Optional time-window context"
            description="Rendered only when the source row includes usable horizon bucket data."
          />
          {horizonEntries.length > 0 ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {horizonEntries.map(([key, value]) => (
                <div key={key} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{key}</p>
                  <p className="mt-2 text-xl font-semibold text-slate-50">{String(value)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/5 px-5 py-8 text-sm text-slate-300">
              No horizon bucket breakdown is currently exposed for this asset.
            </div>
          )}
        </div>
      </section>

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
