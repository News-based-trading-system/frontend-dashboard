import { NextResponse } from "next/server";
import { getArticles, parseArticleRouteFilters } from "../../../utils/articles";

export async function GET(request: Request) {
  try {
    const filters = parseArticleRouteFilters(new URL(request.url).searchParams, {
      sort: "ingested",
      limit: 100,
    });

    const items = await getArticles(filters);

    return NextResponse.json({
      items,
      count: items.length,
      filters,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load article ops data.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
