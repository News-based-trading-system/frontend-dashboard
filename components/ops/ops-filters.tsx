"use client";

import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ARTICLE_STATUS_OPTIONS } from "../../utils/articles/types";
import type { ArticleSortKey } from "../../utils/articles/types";

export function OpsFilters() {
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
    key: "status" | "retryDue" | "deadLettered" | "sort",
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
    <div className="grid gap-4 rounded-[30px] border border-white/10 bg-slate-900/60 p-5 md:grid-cols-[minmax(0,1.8fr)_repeat(4,minmax(0,1fr))]">
      <label className="space-y-2 text-sm text-slate-300">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Search articles
        </span>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search headline"
          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-cyan-300/40"
        />
      </label>

      <label className="space-y-2 text-sm text-slate-300">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Status
        </span>
        <select
          value={params.get("status") ?? ""}
          onChange={(event) => updateParam("status", event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-300/40"
        >
          <option value="">All status</option>
          {ARTICLE_STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2 text-sm text-slate-300">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Retry due
        </span>
        <select
          value={params.get("retryDue") ?? "all"}
          onChange={(event) => updateParam("retryDue", event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-300/40"
        >
          <option value="all">all</option>
          <option value="true">due now</option>
          <option value="false">not due</option>
        </select>
      </label>

      <label className="space-y-2 text-sm text-slate-300">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Dead lettered
        </span>
        <select
          value={params.get("deadLettered") ?? "all"}
          onChange={(event) => updateParam("deadLettered", event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-300/40"
        >
          <option value="all">all</option>
          <option value="true">dead lettered</option>
          <option value="false">active queue</option>
        </select>
      </label>

      <label className="space-y-2 text-sm text-slate-300">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Sort by
        </span>
        <select
          value={params.get("sort") ?? "ingested"}
          onChange={(event) => updateParam("sort", event.target.value as ArticleSortKey)}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-300/40"
        >
          <option value="ingested">ingested</option>
          <option value="published">published</option>
          <option value="retry">retry</option>
          <option value="attempts">attempts</option>
          <option value="status">status</option>
        </select>
      </label>
    </div>
  );
}
