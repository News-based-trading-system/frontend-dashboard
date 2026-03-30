import { NextResponse } from "next/server";
import { getAssets } from "../../../utils/assets";

export async function GET() {
  try {
    const items = await getAssets({ type: "etfs", sort: "activity", limit: 50 });
    return NextResponse.json({ items, count: items.length, meta: { route: "getEtfs" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load ETFs.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
