"use client";

import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { EventSortKey } from "../../utils/events/types";
import { EVENT_TYPE_OPTIONS } from "../../utils/events/types";

type EventFiltersProps = {
  regionOptions: string[];
};

export function EventFilters({ regionOptions }: EventFiltersProps) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get("search") ?? "");
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    setSearch(params.get("search") ?? "");
  }, [params]);

  useEffect(() => {
    const nextParams = new URLSearchParams(params.toString());

    if (deferredSearch.trim()) {
      nextParams.set("search", deferredSearch.trim());
    } else {
      nextParams.delete("search");
    }

    const next = nextParams.toString();
    const current = params.toString();

    if (next === current) {
      return;
    }

    startTransition(() => {
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    });
  }, [deferredSearch, pathname, router, params]);

  const updateParam = (
    key: "eventType" | "region" | "certainty" | "sort" | "active",
    value: string,
  ) => {
    const nextParams = new URLSearchParams(params.toString());

    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }

    const next = nextParams.toString();

    startTransition(() => {
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    });
  };

  return (
    <div className="glass-card-static grid gap-4 rounded-2xl p-5 md:grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,1fr))]">
      <label className="space-y-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-tertiary))]">
          Search events
        </span>
        <div className="relative">
          <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--text-tertiary))]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search headline or event type"
            className="form-input pl-10"
          />
        </div>
      </label>

      <label className="space-y-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-tertiary))]">
          Event type
        </span>
        <select
          value={params.get("eventType") ?? ""}
          onChange={(event) => updateParam("eventType", event.target.value)}
          className="form-select"
        >
          <option value="">All types</option>
          {EVENT_TYPE_OPTIONS.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-tertiary))]">
          Region
        </span>
        <select
          value={params.get("region") ?? ""}
          onChange={(event) => updateParam("region", event.target.value)}
          className="form-select"
        >
          <option value="">All regions</option>
          {regionOptions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-tertiary))]">
          Certainty
        </span>
        <select
          value={params.get("certainty") ?? ""}
          onChange={(event) => updateParam("certainty", event.target.value)}
          className="form-select"
        >
          <option value="">All certainty</option>
          <option value="confirmed">confirmed</option>
          <option value="low">low</option>
          <option value="rumour">rumour</option>
        </select>
      </label>

      <label className="space-y-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-tertiary))]">
          State
        </span>
        <select
          value={params.get("active") ?? "true"}
          onChange={(event) => updateParam("active", event.target.value)}
          className="form-select"
        >
          <option value="true">live</option>
          <option value="false">inactive</option>
          <option value="all">all</option>
        </select>
      </label>

      <label className="space-y-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-tertiary))]">
          Sort by
        </span>
        <select
          value={params.get("sort") ?? "latest"}
          onChange={(event) => updateParam("sort", event.target.value as EventSortKey)}
          className="form-select"
        >
          <option value="latest">latest</option>
          <option value="severity">severity</option>
          <option value="confidence">confidence</option>
        </select>
      </label>
    </div>
  );
}
