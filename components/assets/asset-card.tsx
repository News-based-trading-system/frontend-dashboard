import Link from "next/link";
import {
  formatScorePercentage,
  formatTimestampIst,
  getConvictionLabel,
  getSignalNarrative,
} from "../../utils/assets";
import type { AssetScoreRecord } from "../../utils/assets";
import { AssetDirectionBadge } from "./asset-direction-badge";

type AssetCardProps = {
  asset: AssetScoreRecord;
};

export function AssetCard({ asset }: AssetCardProps) {
  const isBullish = asset.direction === "bullish";
  const isBearish = asset.direction === "bearish";

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
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-base font-bold uppercase tracking-[0.2em] ${
                  isBullish
                    ? "border-[rgba(124,210,165,0.4)] bg-[rgba(124,210,165,0.1)] text-[rgb(var(--bullish))]"
                    : isBearish
                      ? "border-[rgba(255,120,156,0.4)] bg-[rgba(255,120,156,0.1)] text-[rgb(var(--bearish))]"
                      : "border-[rgba(115,158,201,0.35)] bg-[rgba(115,158,201,0.08)] text-white"
                }`}
              >
                <span>{asset.asset_name}</span>
              </span>
              <span
                className={`inline-flex h-7 w-7 items-center justify-center rounded-full border ${
                  isBullish
                    ? "border-[rgba(124,210,165,0.4)] text-[rgb(var(--bullish))]"
                    : isBearish
                      ? "border-[rgba(255,120,156,0.4)] text-[rgb(var(--bearish))]"
                      : "border-[rgba(115,158,201,0.35)] text-[rgb(var(--accent-secondary))]"
                }`}
                aria-hidden="true"
              >
                {isBearish ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M6 13l6 6 6-6" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19V5M6 11l6-6 6 6" />
                  </svg>
                )}
              </span>
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
            <p className={`mono-num mt-1 text-2xl font-black ${asset.direction === 'bullish' ? 'text-[rgb(var(--bullish))] drop-shadow-[0_0_10px_rgba(var(--bullish),0.4)]' : asset.direction === 'bearish' ? 'text-[rgb(var(--bearish))] drop-shadow-[0_0_10px_rgba(var(--bearish),0.4)]' : 'gradient-text-static'}`}>
              {formatScorePercentage(asset.asset_score)}
            </p>
          </div>
        </div>

        {/* Narrative */}
        <p className="mt-4 text-[13px] leading-[1.8] text-[rgb(var(--text-tertiary))]">
          {getSignalNarrative(asset)}
        </p>

        <div className="mt-5 rounded-xl border border-[rgba(86,130,177,0.14)] bg-[rgba(9,14,28,0.35)] px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--text-tertiary))]">
            Conviction
          </p>
          <p className="mt-1 text-[13px] font-semibold text-white">
            {getConvictionLabel(asset.confidence)}
          </p>
        </div>

        {/* Footer row */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(86,130,177,0.08)] pt-5">
          <div className="flex flex-wrap gap-4 text-[12px] text-[rgb(var(--text-tertiary))]">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[rgba(255,232,219,0.5)]" />
              <span>Events {asset.event_count}</span>
            </span>
            <span className="text-[rgb(var(--text-tertiary))] opacity-70">
              {formatTimestampIst(asset.updated_at)}
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
