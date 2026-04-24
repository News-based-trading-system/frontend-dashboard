import Link from "next/link";
import type { AssetExplainabilityRow } from "../../utils/assets";
import { formatEventId, formatTimestampIst } from "../../utils/assets";

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

const stateStyles: Record<string, string> = {
  active: "bg-[rgba(var(--bullish),0.08)] border-[rgba(var(--bullish),0.15)] text-[rgb(var(--bullish))]",
  inactive: "bg-white/[0.03] border-white/[0.06] text-[rgb(var(--text-tertiary))]",
  "event decayed": "bg-[rgba(var(--warning),0.06)] border-[rgba(var(--warning),0.12)] text-[rgb(var(--warning))]",
};

export function AssetExplainabilityTable({ rows }: AssetExplainabilityTableProps) {
  if (rows.length === 0) {
    return (
      <div className="mt-6 glass-card-static rounded-xl border-dashed px-5 py-10 text-center text-sm text-[rgb(var(--text-tertiary))]">
        No contribution-level rows are currently available for this asset.
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {rows.map((row) => {
        const state = formatContributionState(row);
        return (
          <article
            key={`${row.contribution.event_id}-${row.contribution.asset_key}`}
            className="glass-card rounded-xl p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[rgb(var(--text-primary))]">{formatEventLabel(row)}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgb(var(--text-tertiary))]">
                  Event timeline
                </p>
              </div>
              <p className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${stateStyles[state] || stateStyles.inactive}`}>
                {state}
              </p>
            </div>

            <div className="mt-4 rounded-lg border border-white/[0.04] bg-[rgba(var(--surface-0),0.5)] px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[rgb(var(--text-tertiary))]">Event time</p>
              <p className="mt-2 text-sm font-bold text-[rgb(var(--text-primary))]">
                {formatTimestampIst(row.contribution.event_time)}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[rgb(var(--text-tertiary))]">
              {row.contribution.duplicate_group_key ? (
                <span>Duplicate group {row.contribution.duplicate_group_key}</span>
              ) : null}
              {row.article?.url ? (
                <Link
                  href={row.article.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-[rgb(var(--accent-primary))] transition-colors duration-300 hover:text-[rgb(var(--accent-tertiary))]"
                >
                  Source article ↗
                </Link>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
