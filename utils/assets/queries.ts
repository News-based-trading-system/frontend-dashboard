import { getSupabaseServerClient } from "../supabase/index";
import { toUtcIsoString } from "../time/utc";
import type {
  ArticleSummaryRecord,
  AssetContributionRecord,
  AssetDirection,
  AssetExplainabilityOptions,
  AssetExplainabilityRow,
  AssetOverviewMetric,
  AssetQueryOptions,
  AssetScoreRecord,
  EventSummaryRecord,
  AssetSortKey,
  AssetTypeRoute,
} from "./types";
import { ASSET_ROUTE_LABELS } from "./types";

const ASSET_SELECT =
  "asset_name, asset_type, asset_score, bull_sum, bear_sum, abs_sum, event_count, latest_event_id, last_event_time, direction, confidence, disagreement, display_flag, updated_at";

const ASSET_CONTRIBUTION_SELECT =
  "event_id, asset_key, asset_name, asset_type, event_time, arrival_time, initial_contribution, current_contribution, is_active, updated_at, duplicate_group_key";

const EVENT_SELECT =
  "id, article_id, event_type, certainty, event_severity, event_time, extracted_at, updated_at, event_headline, region_of_effect, event_confidence, asset_impacts, is_active, inactive_at";

const ARTICLE_SELECT =
  "id, headline, url, summary, published_at, ingested_at, extraction_status, extraction_attempts, queued_at, processing_started_at, dead_lettered_at, last_error, next_retry_at, processed";

const ASSET_TABLE = "assets";

const ASSET_TYPE_PATTERNS: Record<AssetTypeRoute, string[]> = {
  stocks: ["stock", "stocks", "equity"],
  etfs: ["etf", "etfs", "fund"],
  commodities: ["commodity", "commodities", "macro"],
};

const normalizeAssetRecord = (record: AssetScoreRecord): AssetScoreRecord => ({
  ...record,
  last_event_time: toUtcIsoString(record.last_event_time),
  updated_at: toUtcIsoString(record.updated_at) ?? record.updated_at,
});

const normalizeContributionRecord = (
  record: AssetContributionRecord,
): AssetContributionRecord => ({
  ...record,
  event_time: toUtcIsoString(record.event_time),
  arrival_time: toUtcIsoString(record.arrival_time) ?? record.arrival_time,
  updated_at: toUtcIsoString(record.updated_at) ?? record.updated_at,
});

const normalizeEventRecord = (record: EventSummaryRecord): EventSummaryRecord => ({
  ...record,
  event_time: toUtcIsoString(record.event_time) ?? record.event_time,
  extracted_at: toUtcIsoString(record.extracted_at) ?? record.extracted_at,
  updated_at: toUtcIsoString(record.updated_at) ?? record.updated_at,
  inactive_at: toUtcIsoString(record.inactive_at),
});

const normalizeArticleRecord = (
  record: ArticleSummaryRecord,
): ArticleSummaryRecord => ({
  ...record,
  published_at: toUtcIsoString(record.published_at),
  ingested_at: toUtcIsoString(record.ingested_at),
  queued_at: toUtcIsoString(record.queued_at),
  processing_started_at: toUtcIsoString(record.processing_started_at),
  dead_lettered_at: toUtcIsoString(record.dead_lettered_at),
  next_retry_at: toUtcIsoString(record.next_retry_at),
});

const applyCommonFilters = (query: any, options: AssetQueryOptions) => {
  let nextQuery = query.eq("display_flag", true);

  if (options.search) {
    nextQuery = nextQuery.ilike("asset_name", `%${options.search}%`);
  }

  if (options.direction) {
    nextQuery = nextQuery.eq("direction", options.direction);
  }

  if (options.type) {
    const orClause = ASSET_TYPE_PATTERNS[options.type]
      .map((pattern) => `asset_type.ilike.*${pattern}*`)
      .join(",");
    nextQuery = nextQuery.or(orClause);
  }

  return nextQuery;
};

const applySorting = (
  query: any,
  sort: AssetSortKey,
  direction?: AssetDirection,
) => {
  switch (sort) {
    case "confidence":
      return query
        .order("confidence", { ascending: false })
        .order("asset_score", { ascending: false })
        .order("updated_at", { ascending: false });
    case "latest":
      return query
        .order("last_event_time", { ascending: false, nullsFirst: false })
        .order("updated_at", { ascending: false });
    case "activity":
      return query
        .order("abs_sum", { ascending: false })
        .order("event_count", { ascending: false })
        .order("updated_at", { ascending: false });
    case "disagreement":
      return query
        .order("disagreement", { ascending: false })
        .order("confidence", { ascending: false })
        .order("updated_at", { ascending: false });
    case "score":
    default:
      return query
        .order("asset_score", { ascending: direction === "bearish" })
        .order("confidence", { ascending: false })
        .order("updated_at", { ascending: false });
  }
};

const executeAssetQuery = async (query: any) => {
  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as AssetScoreRecord[]).map(normalizeAssetRecord);
};

const createAssetListQuery = async (options: AssetQueryOptions) => {
  const supabase = await getSupabaseServerClient();
  let query = supabase.from(ASSET_TABLE).select(ASSET_SELECT);

  query = applyCommonFilters(query, options);
  query = applySorting(query, options.sort ?? "score", options.direction);

  if (options.limit) {
    query = query.limit(options.limit);
  }

  return query;
};

export const getAssets = async (options: AssetQueryOptions = {}) =>
  executeAssetQuery(await createAssetListQuery(options));

export const getAssetByName = async (assetName: string) => {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from(ASSET_TABLE)
    .select(ASSET_SELECT)
    .eq("display_flag", true)
    .eq("asset_name", assetName)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return normalizeAssetRecord(data as AssetScoreRecord);
};

export const getAssetExplainability = async (
  assetName: string,
  options: AssetExplainabilityOptions = {},
) => {
  const supabase = await getSupabaseServerClient();
  let contributionsQuery = supabase
    .from("asset_score_contribution")
    .select(ASSET_CONTRIBUTION_SELECT)
    .eq("asset_name", assetName)
    .order("is_active", { ascending: false })
    .order("event_time", { ascending: false, nullsFirst: false })
    .order("arrival_time", { ascending: false })
    .order("updated_at", { ascending: false });

  if (!options.includeInactive) {
    contributionsQuery = contributionsQuery.eq("is_active", true);
  }

  if (options.limit) {
    contributionsQuery = contributionsQuery.limit(options.limit);
  }

  const { data: contributionRows, error: contributionError } =
    await contributionsQuery;

  if (contributionError) {
    throw new Error(contributionError.message);
  }

  const contributions = ((contributionRows ?? []) as AssetContributionRecord[]).map(
    normalizeContributionRecord,
  );

  if (contributions.length === 0) {
    return [] as AssetExplainabilityRow[];
  }

  const eventIds = [...new Set(contributions.map((item) => item.event_id))];
  const { data: eventRows, error: eventError } = await supabase
    .from("events")
    .select(EVENT_SELECT)
    .in("id", eventIds);

  if (eventError) {
    throw new Error(eventError.message);
  }

  const events = ((eventRows ?? []) as EventSummaryRecord[]).map(normalizeEventRecord);
  const eventsById = new Map(events.map((event) => [event.id, event]));

  const articleIds = [...new Set(events.map((event) => event.article_id))];
  let articlesById = new Map<string, ArticleSummaryRecord>();

  if (articleIds.length > 0) {
    const { data: articleRows, error: articleError } = await supabase
      .from("articles")
      .select(ARTICLE_SELECT)
      .in("id", articleIds);

    if (articleError) {
      throw new Error(articleError.message);
    }

    const articles = ((articleRows ?? []) as ArticleSummaryRecord[]).map(
      normalizeArticleRecord,
    );
    articlesById = new Map(articles.map((article) => [article.id, article]));
  }

  return contributions.map((contribution) => {
    const event = eventsById.get(contribution.event_id) ?? null;
    const article = event ? articlesById.get(event.article_id) ?? null : null;

    return {
      contribution,
      event,
      article,
    };
  });
};

const countAssets = async (options: AssetQueryOptions = {}) => {
  const supabase = await getSupabaseServerClient();
  let query = supabase.from(ASSET_TABLE).select("*", { count: "exact", head: true });

  query = applyCommonFilters(query, options);

  const { count, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
};

export const getLandingData = async () => {
  const [
    featured,
    bullish,
    bearish,
    latest,
    totalCount,
    bullishCount,
    bearishCount,
    stockCount,
    etfCount,
    commodityCount,
  ] = await Promise.all([
    getAssets({ sort: "activity", limit: 4 }),
    getAssets({ direction: "bullish", sort: "confidence", limit: 4 }),
    getAssets({ direction: "bearish", sort: "score", limit: 4 }),
    getAssets({ sort: "latest", limit: 6 }),
    countAssets(),
    countAssets({ direction: "bullish" }),
    countAssets({ direction: "bearish" }),
    countAssets({ type: "stocks" }),
    countAssets({ type: "etfs" }),
    countAssets({ type: "commodities" }),
  ]);

  const metrics: AssetOverviewMetric[] = [
    {
      label: "Curated assets",
      value: totalCount.toString(),
      hint: "Public-facing opportunities currently passing the display gate.",
    },
    {
      label: "Bullish leaders",
      value: bullishCount.toString(),
      hint: "Curated assets with positive directional momentum.",
    },
    {
      label: "Bearish leaders",
      value: bearishCount.toString(),
      hint: "Curated assets showing downside pressure worth watching.",
    },
    {
      label: "Coverage",
      value: `${stockCount + etfCount + commodityCount}`,
      hint: `${ASSET_ROUTE_LABELS.stocks}, ${ASSET_ROUTE_LABELS.etfs}, and ${ASSET_ROUTE_LABELS.commodities}.`,
    },
  ];

  return {
    featured,
    bullish,
    bearish,
    latest,
    metrics,
    assetTypeCounts: {
      stocks: stockCount,
      etfs: etfCount,
      commodities: commodityCount,
    },
  };
};
