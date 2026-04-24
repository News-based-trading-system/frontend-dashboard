import { AssetCollectionPage } from "../../components/assets/asset-collection-page";
import { parseAssetFilters, getAssets } from "../../utils/assets";

type DashboardPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const filters = parseAssetFilters(await searchParams, { sort: "score", limit: 18 });
  const assets = await getAssets(filters);

  return (
    <AssetCollectionPage
      eyebrow="Market dashboard"
      title="Scan curated opportunities across every public segment"
      description="Search by name and quickly pivot between conviction, recency, and activity."
      assets={assets}
      filters={filters}
    />
  );
}
