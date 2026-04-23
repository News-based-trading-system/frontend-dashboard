import type { ReactNode } from "react";
import { formatPercent, formatTimestamp, normalizeDirection } from "../../utils/assets";
import type { AssetQueryOptions, AssetScoreRecord } from "../../utils/assets";
import { AssetFilters } from "./asset-filters";
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
      {/* Minimal Hero Section */}
      <div className="relative pb-10 pt-8">
        <div className="relative">
          <div className="space-y-10">
            <SectionHeading eyebrow={eyebrow} title={title} description={description} />
            
            {/* Minimal Stats Row */}
            <div className="grid grid-cols-3 gap-6 divide-x divide-white/[0.04]">
              <div className="pl-0">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[rgb(var(--text-tertiary))]">Visible assets</p>
                <p className="mono-num mt-2 text-2xl font-light text-white">{assets.length}</p>
              </div>
              <div className="pl-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[rgb(var(--text-tertiary))]">Avg confidence</p>
                <p className="mono-num mt-2 text-2xl font-light text-white">{formatPercent(averageConfidence)}</p>
              </div>
              <div className="pl-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[rgb(var(--text-tertiary))]">Bullish share</p>
                <p className="mono-num mt-2 text-2xl font-light text-white">{bullishCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AssetFilters allowDirection={allowDirection} allowType={allowType} />

      {assets.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {assets.map((asset) => (
            <AssetCard key={asset.asset_name} asset={asset} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No curated assets match this view yet"
          description="Try broadening the search or switch to a different segment to see the strongest curated opportunities."
        />
      )}
    </div>
  );
}
