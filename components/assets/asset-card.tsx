import Link from "next/link";
import { formatCompactNumber, formatNumber, formatTimestamp, getSignalNarrative } from "../../utils/assets";
import type { AssetScoreRecord } from "../../utils/assets";
import { AssetDirectionBadge } from "./asset-direction-badge";
import { SignalMeter } from "./signal-meter";

type AssetCardProps = {
  asset: AssetScoreRecord;
};

export function AssetCard({ asset }: AssetCardProps) {
  return (
    <article className="premium-card group relative overflow-hidden rounded-2xl p-6">
      {/* Animated corner glow — top right */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(115,158,201,0.12),transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      {/* Bottom left warm accent */}
      <div className="pointer-events-none absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-[radial-gradient(circle,rgba(255,232,219,0.06),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Ticker chip */}
              <span className="ticker-chip">{asset.asset_name}</span>
              <AssetDirectionBadge direction={asset.direction} />
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--text-tertiary))]">
              {asset.asset_type}
            </p>
          </div>

          {/* Score */}
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[rgb(var(--text-tertiary))]">
              Score
            </p>
            <p className="mono-num mt-1 text-2xl font-black gradient-text-static">
              {formatNumber(asset.asset_score)}
            </p>
          </div>
        </div>

        {/* Narrative */}
        <p className="mt-4 text-[13px] leading-[1.8] text-[rgb(var(--text-tertiary))]">
          {getSignalNarrative(asset)}
        </p>

        {/* Signal meters */}
        <div className="mt-5 grid gap-3.5 md:grid-cols-2">
          <SignalMeter label="Confidence" tone="blue" value={asset.confidence} />
          <SignalMeter label="Disagreement" tone="amber" value={asset.disagreement} />
        </div>

        {/* Footer row */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(86,130,177,0.08)] pt-5">
          <div className="flex flex-wrap gap-4 text-[12px] text-[rgb(var(--text-tertiary))]">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--accent-secondary))] opacity-70" />
              <span>Activity {formatCompactNumber(asset.abs_sum)}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[rgba(255,232,219,0.5)]" />
              <span>Events {asset.event_count}</span>
            </span>
            <span className="text-[rgb(var(--text-tertiary))] opacity-70">
              {formatTimestamp(asset.updated_at)}
            </span>
          </div>
          <Link
            href={`/assets/${encodeURIComponent(asset.asset_name)}`}
            className="group/link flex items-center gap-1.5 text-[13px] font-semibold text-[rgb(var(--accent-secondary))] transition-all duration-300 hover:text-[rgba(255,232,219,0.9)]"
          >
            <span>View asset</span>
            <svg
              className="transition-transform duration-300 group-hover/link:translate-x-1"
              width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
