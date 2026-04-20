import type { ArticleQueryOptions, ArticleSortKey, ArticleStatus } from "./types";

const VALID_SORTS: ArticleSortKey[] = [
  "ingested",
  "published",
  "retry",
  "attempts",
  "status",
];

const VALID_STATUS: ArticleStatus[] = [
  "pending",
  "queued",
  "processing",
  "failed",
  "succeeded",
];

const readSingle = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

const toPositiveInteger = (value?: string) => {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return undefined;
  }

  return parsed;
};

const parseBooleanFilter = (value?: string): boolean | undefined => {
  if (!value || value === "all") {
    return undefined;
  }

  if (["true", "yes", "1"].includes(value)) {
    return true;
  }

  if (["false", "no", "0"].includes(value)) {
    return false;
  }

  return undefined;
};

export const parseArticleSortKey = (value?: string): ArticleSortKey =>
  VALID_SORTS.includes(value as ArticleSortKey)
    ? (value as ArticleSortKey)
    : "ingested";

export const parseArticleStatus = (value?: string): ArticleStatus | undefined =>
  VALID_STATUS.includes(value as ArticleStatus)
    ? (value as ArticleStatus)
    : undefined;

export const parseArticleFilters = (
  searchParams: Record<string, string | string[] | undefined>,
  defaults: Partial<ArticleQueryOptions> = {},
): ArticleQueryOptions => {
  const sort = parseArticleSortKey(
    readSingle(searchParams.sort) ?? defaults.sort ?? "ingested",
  );
  const status = parseArticleStatus(readSingle(searchParams.status)) ?? defaults.status;
  const retryDue = parseBooleanFilter(readSingle(searchParams.retryDue));
  const deadLettered = parseBooleanFilter(readSingle(searchParams.deadLettered));
  const search = readSingle(searchParams.search)?.trim() ?? defaults.search;
  const limit = toPositiveInteger(readSingle(searchParams.limit)) ?? defaults.limit;

  return {
    sort,
    status,
    retryDue: retryDue ?? defaults.retryDue,
    deadLettered: deadLettered ?? defaults.deadLettered,
    search: search ? search : undefined,
    limit,
  };
};

export const parseArticleRouteFilters = (
  params: URLSearchParams,
  defaults: Partial<ArticleQueryOptions> = {},
): ArticleQueryOptions => {
  const mapped = {
    sort: params.get("sort") ?? undefined,
    status: params.get("status") ?? undefined,
    retryDue: params.get("retryDue") ?? undefined,
    deadLettered: params.get("deadLettered") ?? undefined,
    search: params.get("search") ?? undefined,
    limit: params.get("limit") ?? undefined,
  };

  return parseArticleFilters(mapped, defaults);
};
