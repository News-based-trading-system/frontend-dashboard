import { AssetCollectionPage } from "../../components/assets/asset-collection-page";
import { getAssets, parseAssetFilters } from "../../utils/assets";

type StocksPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function StocksPage({ searchParams }: StocksPageProps) {
  const parsed = parseAssetFilters(await searchParams, { sort: "score", limit: 18 });
  const filters = {
    ...parsed,
    type: "stocks" as const,
  };
  const assets = await getAssets(filters);

  return (
    <AssetCollectionPage
      eyebrow="Stocks"
      title="Curated equity signals with directional context"
      description="Browse the public stock opportunity set with confidence, recency, and activity surfaced together."
      assets={assets}
      filters={filters}
      allowType={false}
    />
  );
}
