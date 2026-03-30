import { NextResponse } from "next/server";
import { getAssets, parseRouteRequestFilters } from "../../../utils/assets";

export async function GET(request: Request) {
  try {
    const filters = parseRouteRequestFilters(new URL(request.url).searchParams, {
      sort: "score",
      limit: 50,
    });
    const items = await getAssets(filters);

    return NextResponse.json({
      items,
      count: items.length,
      filters,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load assets.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
