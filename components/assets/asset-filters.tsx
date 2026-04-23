"use client";

import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { AssetDirection, AssetSortKey, AssetTypeRoute } from "../../utils/assets";

type AssetFiltersProps = {
  typeOptions?: AssetTypeRoute[];
  allowDirection?: boolean;
  allowType?: boolean;
};

export function AssetFilters({
  typeOptions = ["stocks", "commodities"],
  allowDirection = true,
  allowType = true,
}: AssetFiltersProps) {
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
    key: "direction" | "sort" | "type",
    value: AssetDirection | AssetSortKey | AssetTypeRoute | "",
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
    <div className="glass-card-static grid gap-4 rounded-2xl p-5 md:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))]">
      <label className="space-y-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-tertiary))]">
          Search assets
        </span>
        <div className="relative">
          <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--text-tertiary))]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by asset name"
            className="form-input pl-10"
          />
        </div>
      </label>
      {allowType ? (
        <label className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-tertiary))]">
            Asset type
          </span>
          <select
            value={params.get("type") ?? ""}
            onChange={(event) => updateParam("type", event.target.value as AssetTypeRoute | "")}
            className="form-select"
          >
            <option value="">All types</option>
            {typeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {allowDirection ? (
        <label className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-tertiary))]">
            Direction
          </span>
          <select
            value={params.get("direction") ?? ""}
            onChange={(event) => updateParam("direction", event.target.value as AssetDirection | "")}
            className="form-select"
          >
            <option value="">All signals</option>
            <option value="bullish">bullish</option>
            <option value="bearish">bearish</option>
            <option value="neutral">neutral</option>
          </select>
        </label>
      ) : null}
      <label className="space-y-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-tertiary))]">
          Sort by
        </span>
        <select
          value={params.get("sort") ?? "score"}
          onChange={(event) => updateParam("sort", event.target.value as AssetSortKey)}
          className="form-select"
        >
          <option value="score">score</option>
          <option value="confidence">confidence</option>
          <option value="latest">latest</option>
          <option value="activity">activity</option>
          <option value="disagreement">disagreement</option>
        </select>
      </label>
    </div>
  );
}
