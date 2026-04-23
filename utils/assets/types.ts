export type AssetDirection = "bullish" | "bearish" | "neutral";

export type AssetSortKey =
  | "score"
  | "confidence"
  | "latest"
  | "activity"
  | "disagreement";

export type AssetTypeRoute = "stocks" | "commodities";

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
  direction: string;
  confidence: number;
  disagreement: number;
  display_flag: boolean;
  updated_at: string;
};

export type AssetContributionRecord = {
  event_id: string;
  asset_key: string;
  asset_name: string;
  asset_type: string;
  event_time: string | null;
  arrival_time: string;
  initial_contribution: number;
  current_contribution: number;
  is_active: boolean;
  updated_at: string;
  duplicate_group_key: string | null;
};

export type EventSummaryRecord = {
  id: string;
  article_id: string;
  event_type: string;
  certainty: string;
  event_severity: number;
  event_time: string;
  extracted_at: string;
  updated_at: string;
  event_headline: string | null;
  region_of_effect: string;
  event_confidence: number;
  asset_impacts: unknown;
  is_active: boolean;
  inactive_at: string | null;
};

export type ArticleSummaryRecord = {
  id: string;
  headline: string;
  url: string;
  summary: string | null;
  published_at: string | null;
  ingested_at: string | null;
  extraction_status: string;
  extraction_attempts: number;
  queued_at: string | null;
  processing_started_at: string | null;
  dead_lettered_at: string | null;
  last_error: string | null;
  next_retry_at: string | null;
  processed: boolean;
};

export type AssetExplainabilityRow = {
  contribution: AssetContributionRecord;
  event: EventSummaryRecord | null;
  article: ArticleSummaryRecord | null;
};

export type AssetExplainabilityOptions = {
  includeInactive?: boolean;
  limit?: number;
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
  commodities: "Commodities",
};

export const SORT_LABELS: Record<AssetSortKey, string> = {
  score: "Score",
  confidence: "Confidence",
  latest: "Latest",
  activity: "Activity",
  disagreement: "Disagreement",
};
