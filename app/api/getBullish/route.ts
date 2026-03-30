import { NextResponse } from "next/server";
import { getAssets } from "../../../utils/assets";

export async function GET() {
  try {
    const items = await getAssets({ direction: "bullish", sort: "confidence", limit: 50 });
    return NextResponse.json({ items, count: items.length, meta: { route: "getBullish" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load bullish assets.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
