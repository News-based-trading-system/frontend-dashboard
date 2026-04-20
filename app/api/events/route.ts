import { NextResponse } from "next/server";
import { getEvents, parseEventRouteFilters } from "../../../utils/events";

export async function GET(request: Request) {
  try {
    const filters = parseEventRouteFilters(new URL(request.url).searchParams, {
      sort: "latest",
      active: true,
      limit: 100,
    });

    const items = await getEvents(filters);

    return NextResponse.json({
      items,
      count: items.length,
      filters,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load events.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
