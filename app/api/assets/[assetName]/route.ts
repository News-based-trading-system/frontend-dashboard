import { NextResponse } from "next/server";
import { getAssetByName } from "../../../../utils/assets";

type AssetRouteContext = {
  params: Promise<{ assetName: string }>;
};

export async function GET(_request: Request, context: AssetRouteContext) {
  try {
    const { assetName } = await context.params;
    const item = await getAssetByName(decodeURIComponent(assetName));

    if (!item) {
      return NextResponse.json({ error: "Asset not found." }, { status: 404 });
    }

    return NextResponse.json({ item });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load asset.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
