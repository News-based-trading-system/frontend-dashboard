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
    <article className="group rounded-[30px] border border-white/10 bg-slate-900/70 p-6 shadow-[0_30px_90px_-50px_rgba(8,145,178,0.65)] transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-2xl font-semibold tracking-tight text-slate-50">
              {asset.asset_name}
            </p>
            <AssetDirectionBadge direction={asset.direction} />
          </div>
          <p className="text-sm uppercase tracking-[0.18em] text-slate-400">{asset.asset_type}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Asset score</p>
          <p className="text-3xl font-semibold text-cyan-200">{formatNumber(asset.asset_score)}</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-300">{getSignalNarrative(asset)}</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <SignalMeter label="Confidence" tone="emerald" value={asset.confidence} />
        <SignalMeter label="Disagreement" tone="amber" value={asset.disagreement} />
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5 text-sm text-slate-300">
        <div className="flex flex-wrap gap-4">
          <span>Activity {formatCompactNumber(asset.abs_sum)}</span>
          <span>Events {asset.event_count}</span>
          <span>Updated {formatTimestamp(asset.updated_at)}</span>
        </div>
        <Link
          href={`/assets/${encodeURIComponent(asset.asset_name)}`}
          className="font-medium text-cyan-200 transition group-hover:text-cyan-100"
        >
          View asset
        </Link>
      </div>
    </article>
  );
}
