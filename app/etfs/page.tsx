import { AssetCollectionPage } from "../../components/assets/asset-collection-page";
import { getAssets, parseAssetFilters } from "../../utils/assets";

type EtfsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EtfsPage({ searchParams }: EtfsPageProps) {
  const parsed = parseAssetFilters(await searchParams, { sort: "activity", limit: 18 });
  const filters = {
    ...parsed,
    type: "etfs" as const,
  };
  const assets = await getAssets(filters);

  return (
    <AssetCollectionPage
      eyebrow="ETFs"
      title="Thematic and basket exposure with curated signal overlays"
      description="Use this segment to compare ETF opportunities through the same directional, confidence, and activity framework."
      assets={assets}
      filters={filters}
      allowType={false}
    />
  );
}
