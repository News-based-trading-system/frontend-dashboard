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
      description="Search by name, shift the sort order, and quickly pivot between conviction, recency, and activity without losing the premium overview."
      assets={assets}
      filters={filters}
      accent={
        <p className="text-sm leading-7 text-slate-300">
          This is the master public view. It keeps the strongest curated rows visible while letting users refine by type, direction, and score posture.
        </p>
      }
    />
  );
}
