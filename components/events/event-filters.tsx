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
    <div className="grid gap-4 rounded-[30px] border border-white/10 bg-slate-900/60 p-5 md:grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,1fr))]">
      <label className="space-y-2 text-sm text-slate-300">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Search events
        </span>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search headline or event type"
          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-cyan-300/40"
        />
      </label>

      <label className="space-y-2 text-sm text-slate-300">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Event type
        </span>
        <select
          value={params.get("eventType") ?? ""}
          onChange={(event) => updateParam("eventType", event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-300/40"
        >
          <option value="">All types</option>
          {EVENT_TYPE_OPTIONS.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2 text-sm text-slate-300">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Region
        </span>
        <select
          value={params.get("region") ?? ""}
          onChange={(event) => updateParam("region", event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-300/40"
        >
          <option value="">All regions</option>
          {regionOptions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2 text-sm text-slate-300">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Certainty
        </span>
        <select
          value={params.get("certainty") ?? ""}
          onChange={(event) => updateParam("certainty", event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-300/40"
        >
          <option value="">All certainty</option>
          <option value="confirmed">confirmed</option>
          <option value="low">low</option>
          <option value="rumour">rumour</option>
        </select>
      </label>

      <label className="space-y-2 text-sm text-slate-300">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          State
        </span>
        <select
          value={params.get("active") ?? "true"}
          onChange={(event) => updateParam("active", event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-300/40"
        >
          <option value="true">live</option>
          <option value="false">inactive</option>
          <option value="all">all</option>
        </select>
      </label>

      <label className="space-y-2 text-sm text-slate-300">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Sort by
        </span>
        <select
          value={params.get("sort") ?? "latest"}
          onChange={(event) => updateParam("sort", event.target.value as EventSortKey)}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-300/40"
        >
          <option value="latest">latest</option>
          <option value="severity">severity</option>
          <option value="confidence">confidence</option>
        </select>
      </label>
    </div>
  );
}
