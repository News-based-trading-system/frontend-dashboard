import { getSupabaseServerClient } from "../supabase/index";
import type {
  AssetDirection,
  AssetOverviewMetric,
  AssetQueryOptions,
  AssetScoreRecord,
  AssetSortKey,
  AssetTypeRoute,
} from "./types";
import { ASSET_ROUTE_LABELS } from "./types";

const ASSET_SELECT =
  "asset_name, asset_type, asset_score, bull_sum, bear_sum, abs_sum, event_count, latest_event_id, last_event_time, horizon_buckets, direction, confidence, disagreement, display_flag, updated_at";

const ASSET_TYPE_PATTERNS: Record<AssetTypeRoute, string[]> = {
  stocks: ["stock", "stocks", "equity"],
  etfs: ["etf", "etfs", "fund"],
  commodities: ["commodity", "commodities", "macro"],
};

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

  return (data ?? []) as AssetScoreRecord[];
};

const createAssetListQuery = async (options: AssetQueryOptions) => {
  const supabase = await getSupabaseServerClient();
  let query = supabase.from("asset_score").select(ASSET_SELECT);

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
    .from("asset_score")
    .select(ASSET_SELECT)
    .eq("display_flag", true)
    .eq("asset_name", assetName)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? null) as AssetScoreRecord | null;
};

const countAssets = async (options: AssetQueryOptions = {}) => {
  const supabase = await getSupabaseServerClient();
  let query = supabase
    .from("asset_score")
    .select("*", { count: "exact", head: true });

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
