import { AssetCollectionPage } from "../../components/assets/asset-collection-page";
import { getAssets, parseAssetFilters } from "../../utils/assets";

type CommoditiesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CommoditiesPage({ searchParams }: CommoditiesPageProps) {
  const parsed = parseAssetFilters(await searchParams, { sort: "activity", limit: 18 });
  const filters = {
    ...parsed,
    type: "commodities" as const,
  };
  const assets = await getAssets(filters);

  return (
    <AssetCollectionPage
      eyebrow="Commodities"
      title="Macro-sensitive commodity signals with curated urgency"
      description="Track commodity opportunities with a cleaner view into activity, disagreement, and signal half-life."
      assets={assets}
      filters={filters}
      allowType={false}
    />
  );
}
