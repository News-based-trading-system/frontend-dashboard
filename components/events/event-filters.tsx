"use client";

import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import type { EventSortKey } from "../../utils/events/types";
import { EVENT_TYPE_OPTIONS } from "../../utils/events/types";

export function EventFilters() {
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
    key: "eventType" | "certainty" | "sort" | "active",
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
    <div className="glass-card-static grid gap-4 rounded-2xl p-5 md:grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,1fr))] md:items-end">
      <label className="space-y-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-tertiary))]">
          Search events
        </span>
        <div className="flex h-11 w-full items-center gap-3 rounded-[var(--radius-md)] border border-[rgba(var(--accent-primary),0.1)] bg-black/70 px-4 text-[rgb(var(--text-primary))] transition-all duration-300 focus-within:border-[rgba(var(--accent-secondary),0.45)] focus-within:shadow-[0_0_0_3px_rgba(var(--accent-primary),0.08),0_0_20px_rgba(var(--accent-primary),0.06)]">
          <Search
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-[rgb(var(--text-tertiary))]"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search headline or event type"
            className="min-w-0 flex-1 bg-transparent text-sm font-[family-name:var(--font-body)] outline-none placeholder:text-[rgb(var(--text-tertiary))]"
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
          className="form-select h-11"
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
          Certainty
        </span>
        <select
          value={params.get("certainty") ?? ""}
          onChange={(event) => updateParam("certainty", event.target.value)}
          className="form-select h-11"
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
          className="form-select h-11"
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
          className="form-select h-11"
        >
          <option value="latest">latest</option>
          <option value="severity">severity</option>
          <option value="confidence">confidence</option>
        </select>
      </label>
    </div>
  );
}
