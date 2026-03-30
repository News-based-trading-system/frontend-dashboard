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
    <div className="overflow-hidden rounded-[30px] border border-white/10 bg-slate-900/60 shadow-[0_30px_100px_-60px_rgba(14,165,233,0.8)]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-left">
          <thead className="bg-white/5 text-xs uppercase tracking-[0.2em] text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Asset</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Signal</th>
              <th className="px-6 py-4 font-medium">Confidence</th>
              <th className="px-6 py-4 font-medium">Activity</th>
              <th className="px-6 py-4 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm text-slate-200">
            {assets.map((asset) => (
              <tr key={asset.asset_name} className="hover:bg-white/5">
                <td className="px-6 py-5">
                  <div className="space-y-1">
                    <Link
                      href={`/assets/${encodeURIComponent(asset.asset_name)}`}
                      className="font-semibold text-white transition hover:text-cyan-200"
                    >
                      {asset.asset_name}
                    </Link>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      Score {formatNumber(asset.asset_score)}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-5 text-slate-300">{asset.asset_type}</td>
                <td className="px-6 py-5">
                  <AssetDirectionBadge direction={asset.direction} />
                </td>
                <td className="px-6 py-5 text-slate-200">{formatPercent(asset.confidence)}</td>
                <td className="px-6 py-5 text-slate-300">
                  {formatCompactNumber(asset.abs_sum)} / {asset.event_count} events
                </td>
                <td className="px-6 py-5 text-slate-300">{formatTimestamp(asset.updated_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
