import Link from "next/link";
import type { AssetExplainabilityRow } from "../../utils/assets";
import {
  formatEventId,
  formatPercent,
  formatSignedNumber,
  formatTimestamp,
} from "../../utils/assets";

type AssetExplainabilityTableProps = {
  rows: AssetExplainabilityRow[];
};

const formatEventLabel = (row: AssetExplainabilityRow) => {
  if (row.event?.event_headline) {
    return row.event.event_headline;
  }

  if (row.article?.headline) {
    return row.article.headline;
  }

  return `Event ${formatEventId(row.contribution.event_id)}`;
};

const formatContributionState = (row: AssetExplainabilityRow) => {
  if (!row.contribution.is_active) {
    return "inactive";
  }

  if (!row.event?.is_active) {
    return "event decayed";
  }

  return "active";
};

export function AssetExplainabilityTable({ rows }: AssetExplainabilityTableProps) {
  if (rows.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/5 px-5 py-8 text-sm text-slate-300">
        No contribution-level rows are currently available for this asset.
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {rows.map((row) => (
        <article
          key={`${row.contribution.event_id}-${row.contribution.asset_key}`}
          className="rounded-2xl border border-white/10 bg-white/5 p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-100">{formatEventLabel(row)}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                {row.event?.event_type ?? "unknown type"} - {row.event?.certainty ?? "unknown certainty"}
              </p>
            </div>
            <p className="rounded-full border border-white/15 bg-slate-950/60 px-3 py-1 text-xs uppercase tracking-[0.14em] text-slate-300">
              {formatContributionState(row)}
            </p>
          </div>

          <dl className="mt-4 grid gap-3 text-xs text-slate-300 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-3">
              <dt className="uppercase tracking-[0.14em] text-slate-500">Current impact</dt>
              <dd className="mt-2 text-sm font-semibold text-slate-100">
                {formatSignedNumber(row.contribution.current_contribution)}
              </dd>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-3">
              <dt className="uppercase tracking-[0.14em] text-slate-500">Original impact</dt>
              <dd className="mt-2 text-sm font-semibold text-slate-100">
                {formatSignedNumber(row.contribution.initial_contribution)}
              </dd>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-3">
              <dt className="uppercase tracking-[0.14em] text-slate-500">Severity / confidence</dt>
              <dd className="mt-2 text-sm font-semibold text-slate-100">
                {row.event ? `${formatPercent(row.event.event_severity)} / ${formatPercent(row.event.event_confidence)}` : "Unavailable"}
              </dd>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-3">
              <dt className="uppercase tracking-[0.14em] text-slate-500">Event time</dt>
              <dd className="mt-2 text-sm font-semibold text-slate-100">
                {formatTimestamp(row.contribution.event_time)}
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-300">
            <span>Region {row.event?.region_of_effect ?? "unknown"}</span>
            <span>Arrival {formatTimestamp(row.contribution.arrival_time)}</span>
            <span>Updated {formatTimestamp(row.contribution.updated_at)}</span>
            {row.contribution.duplicate_group_key ? (
              <span>Duplicate group {row.contribution.duplicate_group_key}</span>
            ) : null}
            {row.article?.url ? (
              <Link
                href={row.article.url}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-cyan-200 transition hover:text-cyan-100"
              >
                Source article
              </Link>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
