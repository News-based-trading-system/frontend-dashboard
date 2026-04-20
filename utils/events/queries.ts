import { getSupabaseServerClient } from "../supabase";
import { toUtcIsoString } from "../time/utc";
import type { EventArticleSummary, EventListRecord, EventQueryOptions, EventSortKey } from "./types";

const EVENT_SELECT =
  "id, article_id, event_type, certainty, event_severity, event_time, extracted_at, updated_at, event_headline, region_of_effect, event_confidence, asset_impacts, is_active, inactive_at";

const ARTICLE_SELECT = "id, headline, url, published_at";

const countImpactedAssets = (assetImpacts: unknown) =>
  Array.isArray(assetImpacts) ? assetImpacts.length : 0;

const normalizeArticleRecord = (record: EventArticleSummary): EventArticleSummary => ({
  ...record,
  published_at: toUtcIsoString(record.published_at),
});

const normalizeEventRecord = (record: EventListRecord): EventListRecord => ({
  ...record,
  event_time: toUtcIsoString(record.event_time) ?? record.event_time,
  extracted_at: toUtcIsoString(record.extracted_at) ?? record.extracted_at,
  updated_at: toUtcIsoString(record.updated_at) ?? record.updated_at,
  inactive_at: toUtcIsoString(record.inactive_at),
  impacted_assets_count: countImpactedAssets(record.asset_impacts),
});

const applyEventFilters = (query: any, options: EventQueryOptions) => {
  let nextQuery = query;

  if (typeof options.active === "boolean") {
    nextQuery = nextQuery.eq("is_active", options.active);
  }

  if (options.certainty) {
    nextQuery = nextQuery.eq("certainty", options.certainty);
  }

  if (options.eventType) {
    nextQuery = nextQuery.eq("event_type", options.eventType);
  }

  if (options.region) {
    nextQuery = nextQuery.eq("region_of_effect", options.region);
  }

  if (options.search) {
    nextQuery = nextQuery.or(
      `event_headline.ilike.*${options.search}*,event_type.ilike.*${options.search}*,region_of_effect.ilike.*${options.search}*`,
    );
  }

  return nextQuery;
};

const applyEventSorting = (query: any, sort: EventSortKey) => {
  switch (sort) {
    case "severity":
      return query
        .order("event_severity", { ascending: false })
        .order("event_confidence", { ascending: false })
        .order("event_time", { ascending: false });
    case "confidence":
      return query
        .order("event_confidence", { ascending: false })
        .order("event_severity", { ascending: false })
        .order("event_time", { ascending: false });
    case "latest":
    default:
      return query
        .order("event_time", { ascending: false })
        .order("extracted_at", { ascending: false });
  }
};

export const getEvents = async (options: EventQueryOptions = {}) => {
  const supabase = await getSupabaseServerClient();
  let query = supabase.from("events").select(EVENT_SELECT);

  query = applyEventFilters(query, options);
  query = applyEventSorting(query, options.sort ?? "latest");

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const events = ((data ?? []) as EventListRecord[]).map(normalizeEventRecord);
  if (events.length === 0) {
    return [] as EventListRecord[];
  }

  const articleIds = [...new Set(events.map((event) => event.article_id))];
  const { data: articleRows, error: articleError } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .in("id", articleIds);

  if (articleError) {
    throw new Error(articleError.message);
  }

  const articlesById = new Map(
    ((articleRows ?? []) as EventArticleSummary[])
      .map(normalizeArticleRecord)
      .map((article) => [article.id, article]),
  );

  return events.map((event) => ({
    ...event,
    article: articlesById.get(event.article_id) ?? null,
  }));
};
