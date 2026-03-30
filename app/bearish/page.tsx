import { AssetCollectionPage } from "../../components/assets/asset-collection-page";
import { getAssets, parseAssetFilters } from "../../utils/assets";

type BearishPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BearishPage({ searchParams }: BearishPageProps) {
  const parsed = parseAssetFilters(await searchParams, { sort: "score", limit: 18 });
  const filters = {
    ...parsed,
    direction: "bearish" as const,
    sort: parsed.sort ?? "score",
  };
  const assets = await getAssets(filters);

  return (
    <AssetCollectionPage
      eyebrow="Bearish pressure"
      title="Curated downside setups with public-facing urgency"
      description="This view surfaces bearish assets where the negative directional edge remains strong enough to matter."
      assets={assets}
      filters={filters}
      allowDirection={false}
      accent={
        <p className="text-sm leading-7 text-slate-300">
          Strong bearish names are ordered to bring the deepest negative score profiles to the top first.
        </p>
      }
    />
  );
}
