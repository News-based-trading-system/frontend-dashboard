import Link from "next/link";
import { formatTimestamp } from "../../utils/assets";
import { formatArticleStatusLabel, formatMinutes } from "../../utils/articles";
import type { ArticleOpsRecord } from "../../utils/articles";

type ArticlesOpsTableProps = {
  rows: ArticleOpsRecord[];
};

export function ArticlesOpsTable({ rows }: ArticlesOpsTableProps) {
  return (
    <div className="overflow-hidden rounded-[30px] border border-white/10 bg-slate-900/60 shadow-[0_30px_100px_-60px_rgba(14,165,233,0.8)]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-left">
          <thead className="bg-white/5 text-xs uppercase tracking-[0.2em] text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Article</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Attempts</th>
              <th className="px-6 py-4 font-medium">Queue wait</th>
              <th className="px-6 py-4 font-medium">Processing age</th>
              <th className="px-6 py-4 font-medium">Next retry</th>
              <th className="px-6 py-4 font-medium">Dead lettered</th>
              <th className="px-6 py-4 font-medium">Last error</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm text-slate-200">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-white/5">
                <td className="px-6 py-5">
                  <div className="space-y-1">
                    <p className="font-semibold text-white">{row.headline}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span>Published {formatTimestamp(row.published_at)}</span>
                      <span>Ingested {formatTimestamp(row.ingested_at)}</span>
                      {row.url ? (
                        <Link
                          href={row.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-cyan-200 transition hover:text-cyan-100"
                        >
                          Open source
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-slate-300">
                  {formatArticleStatusLabel(row.extraction_status)}
                </td>
                <td className="px-6 py-5 text-slate-300">{row.extraction_attempts}</td>
                <td className="px-6 py-5 text-slate-300">{formatMinutes(row.queue_wait_minutes)}</td>
                <td className="px-6 py-5 text-slate-300">{formatMinutes(row.processing_age_minutes)}</td>
                <td className="px-6 py-5 text-slate-300">
                  {row.next_retry_at ? `${formatTimestamp(row.next_retry_at)} (${formatMinutes(row.retry_in_minutes)})` : "-"}
                </td>
                <td className="px-6 py-5 text-slate-300">
                  {row.is_dead_lettered ? formatTimestamp(row.dead_lettered_at) : "-"}
                </td>
                <td className="px-6 py-5 text-slate-300">
                  {row.last_error ? row.last_error.slice(0, 120) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
