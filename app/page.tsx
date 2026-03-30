import { getSupabaseServerClient } from "../utils/supabase/index";
import type { ReactElement } from "react";

type AssetScoreRow = {
  asset_name: string;
  asset_type: string;
  asset_score: number;
  direction: string;
  confidence: number;
  updated_at: string;
};

export default async function Page(): Promise<ReactElement> {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("asset_score")
    .select("asset_name, asset_type, asset_score, direction, confidence, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    return <p>Failed to load asset scores: {error.message}</p>;
  }

  const assets = (data ?? []) as AssetScoreRow[];

  return (
    <ul>
      {assets.map((asset) => (
        <li key={asset.asset_name}>
          {asset.asset_name} ({asset.asset_type}) score={asset.asset_score.toFixed(2)} direction=
          {asset.direction} confidence={asset.confidence.toFixed(2)}
        </li>
      ))}
    </ul>
  );
}
