import { getSupabaseServerClient } from "../supabase";
import { toUtcIsoString } from "../time/utc";
import type { ArticleOpsRecord, ArticleQueryOptions, ArticleSortKey } from "./types";

const ARTICLE_SELECT =
  "id, headline, url, summary, published_at, ingested_at, extraction_status, extraction_attempts, queued_at, processing_started_at, dead_lettered_at, last_error, next_retry_at, processed";

const diffMinutes = (from: Date, to: Date) => (to.getTime() - from.getTime()) / 60000;

const normalizeArticle = (record: ArticleOpsRecord, now: Date): ArticleOpsRecord => {
  const publishedAt = toUtcIsoString(record.published_at);
  const ingestedAt = toUtcIsoString(record.ingested_at);
  const queuedAt = toUtcIsoString(record.queued_at);
  const processingStartedAt = toUtcIsoString(record.processing_started_at);
  const deadLetteredAt = toUtcIsoString(record.dead_lettered_at);
  const nextRetryAt = toUtcIsoString(record.next_retry_at);

  const queueWaitMinutes =
    queuedAt && processingStartedAt
      ? diffMinutes(new Date(queuedAt), new Date(processingStartedAt))
      : null;

  const processingAgeMinutes =
    processingStartedAt && record.extraction_status === "processing"
      ? diffMinutes(new Date(processingStartedAt), now)
      : null;

  const retryInMinutes = nextRetryAt ? diffMinutes(now, new Date(nextRetryAt)) : null;

  return {
    ...record,
    published_at: publishedAt,
    ingested_at: ingestedAt,
    queued_at: queuedAt,
    processing_started_at: processingStartedAt,
    dead_lettered_at: deadLetteredAt,
    next_retry_at: nextRetryAt,
    queue_wait_minutes: queueWaitMinutes,
    processing_age_minutes: processingAgeMinutes,
    retry_in_minutes: retryInMinutes,
    is_retry_due: typeof retryInMinutes === "number" && retryInMinutes <= 0,
    is_dead_lettered: Boolean(deadLetteredAt),
  };
};

const applyArticleFilters = (query: any, options: ArticleQueryOptions) => {
  let nextQuery = query;

  if (options.status) {
    nextQuery = nextQuery.eq("extraction_status", options.status);
  }

  if (typeof options.deadLettered === "boolean") {
    nextQuery = options.deadLettered
      ? nextQuery.not("dead_lettered_at", "is", null)
      : nextQuery.is("dead_lettered_at", null);
  }

  if (typeof options.retryDue === "boolean") {
    const nowIso = new Date().toISOString();

    nextQuery = options.retryDue
      ? nextQuery.not("next_retry_at", "is", null).lte("next_retry_at", nowIso)
      : nextQuery.or(`next_retry_at.is.null,next_retry_at.gt.${nowIso}`);
  }

  if (options.search) {
    nextQuery = nextQuery.or(`headline.ilike.*${options.search}*`);
  }

  return nextQuery;
};

const applyArticleSorting = (query: any, sort: ArticleSortKey) => {
  switch (sort) {
    case "published":
      return query.order("published_at", { ascending: false, nullsFirst: false });
    case "retry":
      return query
        .order("next_retry_at", { ascending: true, nullsFirst: false })
        .order("extraction_attempts", { ascending: false });
    case "attempts":
      return query
        .order("extraction_attempts", { ascending: false })
        .order("next_retry_at", { ascending: true, nullsFirst: false });
    case "status":
      return query
        .order("extraction_status", { ascending: true })
        .order("ingested_at", { ascending: false });
    case "ingested":
    default:
      return query.order("ingested_at", { ascending: false });
  }
};

export const getArticles = async (options: ArticleQueryOptions = {}) => {
  const supabase = await getSupabaseServerClient();
  let query = supabase.from("articles").select(ARTICLE_SELECT);

  query = applyArticleFilters(query, options);
  query = applyArticleSorting(query, options.sort ?? "ingested");

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const now = new Date();
  return ((data ?? []) as ArticleOpsRecord[]).map((row) => normalizeArticle(row, now));
};
