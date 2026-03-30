import type {
  AssetDirection,
  AssetQueryOptions,
  AssetSortKey,
  AssetTypeRoute,
} from "./types";

const VALID_SORTS: AssetSortKey[] = [
  "score",
  "confidence",
  "latest",
  "activity",
  "disagreement",
];

const VALID_DIRECTIONS: AssetDirection[] = ["bullish", "bearish", "neutral"];
const VALID_TYPES: AssetTypeRoute[] = ["stocks", "etfs", "commodities"];

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

export const parseSortKey = (value?: string): AssetSortKey =>
  VALID_SORTS.includes(value as AssetSortKey) ? (value as AssetSortKey) : "score";

export const parseDirection = (value?: string): AssetDirection | undefined =>
  VALID_DIRECTIONS.includes(value as AssetDirection)
    ? (value as AssetDirection)
    : undefined;

export const parseTypeRoute = (value?: string): AssetTypeRoute | undefined =>
  VALID_TYPES.includes(value as AssetTypeRoute) ? (value as AssetTypeRoute) : undefined;

export const parseAssetFilters = (
  searchParams: Record<string, string | string[] | undefined>,
  defaults: Partial<AssetQueryOptions> = {},
): AssetQueryOptions => {
  const type = parseTypeRoute(readSingle(searchParams.type)) ?? defaults.type;
  const direction =
    parseDirection(readSingle(searchParams.direction)) ?? defaults.direction;
  const sort = parseSortKey(readSingle(searchParams.sort) ?? defaults.sort ?? "score");
  const search = readSingle(searchParams.search)?.trim() ?? defaults.search;
  const limit = toPositiveInteger(readSingle(searchParams.limit)) ?? defaults.limit;

  return {
    type,
    direction,
    sort,
    search: search ? search : undefined,
    limit,
  };
};

export const parseRouteRequestFilters = (
  params: URLSearchParams,
  defaults: Partial<AssetQueryOptions> = {},
): AssetQueryOptions => {
  const mapped = {
    type: params.get("type") ?? undefined,
    direction: params.get("direction") ?? undefined,
    sort: params.get("sort") ?? undefined,
    search: params.get("search") ?? undefined,
    limit: params.get("limit") ?? undefined,
  };

  return parseAssetFilters(mapped, defaults);
};

export const buildQueryString = (filters: AssetQueryOptions) => {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.type) {
    params.set("type", filters.type);
  }

  if (filters.direction) {
    params.set("direction", filters.direction);
  }

  if (filters.sort) {
    params.set("sort", filters.sort);
  }

  return params.toString();
};
