export type AssetDirection = "bullish" | "bearish" | "neutral";

export type AssetSortKey =
  | "score"
  | "confidence"
  | "latest"
  | "activity"
  | "disagreement";

export type AssetTypeRoute = "stocks" | "etfs" | "commodities";

export type AssetScoreRecord = {
  asset_name: string;
  asset_type: string;
  asset_score: number;
  bull_sum: number;
  bear_sum: number;
  abs_sum: number;
  event_count: number;
  latest_event_id: string | null;
  last_event_time: string | null;
  horizon_buckets: Record<string, number | string | boolean | null> | null;
  direction: string;
  confidence: number;
  disagreement: number;
  display_flag: boolean;
  updated_at: string;
};

export type AssetQueryOptions = {
  type?: AssetTypeRoute;
  direction?: AssetDirection;
  search?: string;
  sort?: AssetSortKey;
  limit?: number;
};

export type AssetOverviewMetric = {
  label: string;
  value: string;
  hint: string;
};

export const ASSET_ROUTE_LABELS: Record<AssetTypeRoute, string> = {
  stocks: "Stocks",
  etfs: "ETFs",
  commodities: "Commodities",
};

export const SORT_LABELS: Record<AssetSortKey, string> = {
  score: "Score",
  confidence: "Confidence",
  latest: "Latest",
  activity: "Activity",
  disagreement: "Disagreement",
};
