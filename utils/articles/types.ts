export type ArticleSortKey =
  | "ingested"
  | "published"
  | "retry"
  | "attempts"
  | "status";

export type ArticleStatus =
  | "pending"
  | "queued"
  | "processing"
  | "failed"
  | "succeeded";

export type ArticleOpsRecord = {
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
  queue_wait_minutes: number | null;
  processing_age_minutes: number | null;
  retry_in_minutes: number | null;
  is_retry_due: boolean;
  is_dead_lettered: boolean;
};

export type ArticleQueryOptions = {
  status?: ArticleStatus;
  retryDue?: boolean;
  deadLettered?: boolean;
  search?: string;
  sort?: ArticleSortKey;
  limit?: number;
};

export const ARTICLE_STATUS_OPTIONS: ArticleStatus[] = [
  "pending",
  "queued",
  "processing",
  "failed",
  "succeeded",
];

export const ARTICLE_SORT_LABELS: Record<ArticleSortKey, string> = {
  ingested: "Ingested",
  published: "Published",
  retry: "Retry",
  attempts: "Attempts",
  status: "Status",
};
