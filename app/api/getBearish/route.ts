import { NextResponse } from "next/server";
import { getAssets } from "../../../utils/assets";

export async function GET() {
  try {
    const items = await getAssets({ direction: "bearish", sort: "score", limit: 50 });
    return NextResponse.json({ items, count: items.length, meta: { route: "getBearish" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load bearish assets.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
