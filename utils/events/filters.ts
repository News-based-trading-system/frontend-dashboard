import type { EventCertainty, EventQueryOptions, EventSortKey } from "./types";

const VALID_SORTS: EventSortKey[] = ["latest", "severity", "confidence"];
const VALID_CERTAINTY: EventCertainty[] = ["confirmed", "low", "rumour"];

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

export const parseEventSortKey = (value?: string): EventSortKey =>
  VALID_SORTS.includes(value as EventSortKey) ? (value as EventSortKey) : "latest";

export const parseEventCertainty = (value?: string): EventCertainty | undefined =>
  VALID_CERTAINTY.includes(value as EventCertainty)
    ? (value as EventCertainty)
    : undefined;

export const parseEventActive = (value?: string): boolean | undefined => {
  if (!value || value === "all") {
    return undefined;
  }

  if (["true", "live", "active"].includes(value)) {
    return true;
  }

  if (["false", "inactive"].includes(value)) {
    return false;
  }

  return undefined;
};

export const parseEventFilters = (
  searchParams: Record<string, string | string[] | undefined>,
  defaults: Partial<EventQueryOptions> = {},
): EventQueryOptions => {
  const sort = parseEventSortKey(readSingle(searchParams.sort) ?? defaults.sort ?? "latest");
  const certainty =
    parseEventCertainty(readSingle(searchParams.certainty)) ?? defaults.certainty;
  const active = parseEventActive(readSingle(searchParams.active));
  const search = readSingle(searchParams.search)?.trim() ?? defaults.search;
  const eventType = readSingle(searchParams.eventType)?.trim() ?? defaults.eventType;
  const region = readSingle(searchParams.region)?.trim() ?? defaults.region;
  const limit = toPositiveInteger(readSingle(searchParams.limit)) ?? defaults.limit;

  return {
    sort,
    certainty,
    active: active ?? defaults.active,
    search: search ? search : undefined,
    eventType: eventType ? eventType : undefined,
    region: region ? region : undefined,
    limit,
  };
};

export const parseEventRouteFilters = (
  params: URLSearchParams,
  defaults: Partial<EventQueryOptions> = {},
): EventQueryOptions => {
  const mapped = {
    sort: params.get("sort") ?? undefined,
    certainty: params.get("certainty") ?? undefined,
    active: params.get("active") ?? undefined,
    search: params.get("search") ?? undefined,
    eventType: params.get("eventType") ?? undefined,
    region: params.get("region") ?? undefined,
    limit: params.get("limit") ?? undefined,
  };

  return parseEventFilters(mapped, defaults);
};

export const buildEventQueryString = (filters: EventQueryOptions) => {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.eventType) {
    params.set("eventType", filters.eventType);
  }

  if (filters.region) {
    params.set("region", filters.region);
  }

  if (filters.certainty) {
    params.set("certainty", filters.certainty);
  }

  if (typeof filters.active === "boolean") {
    params.set("active", String(filters.active));
  }

  if (filters.sort) {
    params.set("sort", filters.sort);
  }

  return params.toString();
};
