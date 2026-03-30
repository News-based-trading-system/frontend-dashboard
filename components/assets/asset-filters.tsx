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
  typeOptions = ["stocks", "etfs", "commodities"],
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
    <div className="grid gap-4 rounded-[30px] border border-white/10 bg-slate-900/60 p-5 md:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))]">
      <label className="space-y-2 text-sm text-slate-300">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Search assets
        </span>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by asset name"
          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-cyan-300/40"
        />
      </label>
      {allowType ? (
        <label className="space-y-2 text-sm text-slate-300">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Asset type
          </span>
          <select
            value={params.get("type") ?? ""}
            onChange={(event) => updateParam("type", event.target.value as AssetTypeRoute | "")}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-300/40"
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
        <label className="space-y-2 text-sm text-slate-300">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Direction
          </span>
          <select
            value={params.get("direction") ?? ""}
            onChange={(event) => updateParam("direction", event.target.value as AssetDirection | "")}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-300/40"
          >
            <option value="">All signals</option>
            <option value="bullish">bullish</option>
            <option value="bearish">bearish</option>
            <option value="neutral">neutral</option>
          </select>
        </label>
      ) : null}
      <label className="space-y-2 text-sm text-slate-300">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Sort by
        </span>
        <select
          value={params.get("sort") ?? "score"}
          onChange={(event) => updateParam("sort", event.target.value as AssetSortKey)}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-300/40"
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
