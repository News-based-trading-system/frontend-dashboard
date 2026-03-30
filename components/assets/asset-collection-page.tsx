import type { ReactNode } from "react";
import { formatPercent, formatTimestamp, normalizeDirection } from "../../utils/assets";
import type { AssetQueryOptions, AssetScoreRecord } from "../../utils/assets";
import { AssetFilters } from "./asset-filters";
import { AssetTable } from "./asset-table";
import { EmptyState } from "./empty-state";
import { AssetCard } from "./asset-card";
import { MetricCard } from "../metric-card";
import { SectionHeading } from "../section-heading";

type AssetCollectionPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  assets: AssetScoreRecord[];
  filters: AssetQueryOptions;
  allowType?: boolean;
  allowDirection?: boolean;
  accent?: ReactNode;
};

export function AssetCollectionPage({
  eyebrow,
  title,
  description,
  assets,
  filters,
  allowType = true,
  allowDirection = true,
  accent,
}: AssetCollectionPageProps) {
  const leadAsset = assets[0];
  const averageConfidence =
    assets.length > 0
      ? assets.reduce((sum, asset) => sum + asset.confidence, 0) / assets.length
      : 0;
  const freshest = assets[0]?.updated_at ?? null;
  const bullishCount = assets.filter(
    (asset) => normalizeDirection(asset.direction) === "bullish",
  ).length;

  return (
    <div className="space-y-8">
      <div className="rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_45%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(12,20,36,0.88))] p-8 shadow-[0_50px_120px_-70px_rgba(34,211,238,0.55)] md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <SectionHeading eyebrow={eyebrow} title={title} description={description} />
            <div className="grid gap-4 sm:grid-cols-3">
              <MetricCard
                label="Visible assets"
                value={assets.length.toString()}
                hint="Rows currently matching this view and the public display gate."
              />
              <MetricCard
                label="Avg confidence"
                value={formatPercent(averageConfidence)}
                hint="Average conviction across the visible opportunity set."
              />
              <MetricCard
                label="Bullish share"
                value={`${bullishCount}`}
                hint="Assets in this slice currently leaning bullish."
              />
            </div>
          </div>
          <div className="rounded-[30px] border border-white/10 bg-black/20 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300/80">
              Snapshot
            </p>
            <div className="mt-4 space-y-4 text-sm text-slate-300">
              <p>
                Current filters: <span className="text-slate-100">{filters.sort ?? "score"}</span>
                {filters.search ? `, search "${filters.search}"` : ""}
                {filters.direction ? `, ${filters.direction}` : ""}
                {filters.type ? `, ${filters.type}` : ""}
              </p>
              <p>Last refreshed signal: {formatTimestamp(freshest)}</p>
              {leadAsset ? (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Lead asset</p>
                  <p className="mt-2 text-xl font-semibold text-slate-50">{leadAsset.asset_name}</p>
                  <p className="mt-1 text-slate-300">{leadAsset.asset_type}</p>
                </div>
              ) : null}
              {accent}
            </div>
          </div>
        </div>
      </div>
      <AssetFilters allowDirection={allowDirection} allowType={allowType} />
      {leadAsset ? (
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <AssetCard asset={leadAsset} />
          <AssetTable assets={assets.slice(0, 10)} />
        </div>
      ) : (
        <EmptyState
          title="No curated assets match this view yet"
          description="Try broadening the search or switch to a different segment to see the strongest curated opportunities."
        />
      )}
      {assets.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {assets.slice(1, 7).map((asset) => (
            <AssetCard key={asset.asset_name} asset={asset} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
