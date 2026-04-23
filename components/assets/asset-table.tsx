import Link from "next/link";
import type { AssetScoreRecord } from "../../utils/assets";
import {
  formatNumber,
  formatTimestamp,
  formatCompactNumber,
  formatPercent,
} from "../../utils/assets";
import { AssetDirectionBadge } from "./asset-direction-badge";

type AssetTableProps = {
  assets: AssetScoreRecord[];
};

export function AssetTable({ assets }: AssetTableProps) {
  return (
    <div className="glass-card-static overflow-hidden rounded-2xl border border-[rgba(86,130,177,0.1)]">
      {/* Table header top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(255,232,219,0.4)] to-transparent" />
      <div className="overflow-x-auto">
        <table className="data-table min-w-full text-left">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Type</th>
              <th>Signal</th>
              <th>Confidence</th>
              <th>Activity</th>
              <th>Last event</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, i) => (
              <tr key={asset.asset_name} style={{ animationDelay: `${i * 0.04}s` }}>
                <td>
                  <div className="space-y-0.5">
                    <Link
                      href={`/assets/${encodeURIComponent(asset.asset_name)}`}
                      className="ticker-chip transition-all duration-300 hover:border-[rgba(115,158,201,0.4)] hover:bg-[rgba(86,130,177,0.14)]"
                    >
                      {asset.asset_name}
                    </Link>
                    <p className={`mt-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${asset.direction === 'bullish' ? 'text-[rgb(var(--bullish))]' : asset.direction === 'bearish' ? 'text-[rgb(var(--bearish))]' : 'text-[rgb(var(--text-tertiary))]'}`}>
                      Score {formatNumber(asset.asset_score)}
                    </p>
                  </div>
                </td>
                <td className="text-[rgb(var(--text-tertiary))] text-xs uppercase tracking-wider">{asset.asset_type}</td>
                <td>
                  <AssetDirectionBadge direction={asset.direction} />
                </td>
                <td className="mono-num">{formatPercent(asset.confidence)}</td>
                <td className="mono-num text-[rgb(var(--text-secondary))]">
                  {formatCompactNumber(asset.abs_sum)} / {asset.event_count} ev
                </td>
                <td className="text-[rgb(var(--text-tertiary))]">{formatTimestamp(asset.last_event_time)}</td>
                <td className="text-[rgb(var(--text-tertiary))]">{formatTimestamp(asset.updated_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
