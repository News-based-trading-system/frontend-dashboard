export type EventSortKey = "latest" | "severity" | "confidence";

export type EventCertainty = "confirmed" | "low" | "rumour";

export type EventArticleSummary = {
  id: string;
  headline: string;
  url: string;
  published_at: string | null;
};

export type EventListRecord = {
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
  impacted_assets_count: number;
  is_active: boolean;
  inactive_at: string | null;
  article: EventArticleSummary | null;
};

export type EventQueryOptions = {
  eventType?: string;
  region?: string;
  certainty?: EventCertainty;
  active?: boolean;
  search?: string;
  sort?: EventSortKey;
  limit?: number;
};

export const EVENT_TYPE_OPTIONS = [
  "earnings",
  "macro",
  "geopolitics",
  "policy",
  "corporate",
  "supply_chain",
  "other",
] as const;

export const EVENT_SORT_LABELS: Record<EventSortKey, string> = {
  latest: "Latest",
  severity: "Severity",
  confidence: "Confidence",
};
