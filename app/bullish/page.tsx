import { AssetCollectionPage } from "../../components/assets/asset-collection-page";
import { getAssets, parseAssetFilters } from "../../utils/assets";

type BullishPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BullishPage({ searchParams }: BullishPageProps) {
  const parsed = parseAssetFilters(await searchParams, { sort: "confidence", limit: 18 });
  const filters = {
    ...parsed,
    direction: "bullish" as const,
    sort: parsed.sort ?? "confidence",
  };
  const assets = await getAssets(filters);

  return (
    <AssetCollectionPage
      eyebrow="Bullish conviction"
      title="Curated upside leaders with aligned signal strength"
      description="This segment prioritizes public-ready bullish assets where confidence and score reinforce one another."
      assets={assets}
      filters={filters}
      allowDirection={false}
      accent={
        <p className="text-sm leading-7 text-slate-300">
          Use this view when the priority is upside discovery with clearer directional conviction and faster triage.
        </p>
      }
    />
  );
}
