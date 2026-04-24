import type { ReactNode } from "react";
import { normalizeDirection } from "../../utils/assets";
import type { AssetQueryOptions, AssetScoreRecord } from "../../utils/assets";
import { AssetFilters } from "./asset-filters";
import { EmptyState } from "./empty-state";
import { AssetCard } from "./asset-card";
import { PageHero } from "../page-hero";

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
  const bullishCount = assets.filter(
    (asset) => normalizeDirection(asset.direction) === "bullish",
  ).length;
  const bearishCount = assets.filter(
    (asset) => normalizeDirection(asset.direction) === "bearish",
  ).length;

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        supporting={accent}
        metrics={
          <div className="grid grid-cols-1 gap-6 text-center sm:grid-cols-3 sm:divide-x sm:divide-white/[0.06]">
            <div className="sm:pr-6">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[rgb(var(--text-tertiary))]">
                Total assets
              </p>
              <p className="mono-num mt-2 text-3xl font-light text-white md:text-4xl">
                {assets.length}
              </p>
            </div>
            <div className="sm:px-6">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[rgb(var(--text-tertiary))]">
                Bearish shares
              </p>
              <p className="mono-num mt-2 text-3xl font-light text-white md:text-4xl">
                {bearishCount}
              </p>
            </div>
            <div className="sm:pl-6">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[rgb(var(--text-tertiary))]">
                Bullish shares
              </p>
              <p className="mono-num mt-2 text-3xl font-light text-white md:text-4xl">
                {bullishCount}
              </p>
            </div>
          </div>
        }
      />

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
