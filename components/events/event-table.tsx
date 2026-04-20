import Link from "next/link";
import type { EventListRecord } from "../../utils/events";
import {
  formatEventTypeLabel,
  formatRegionLabel,
  getEventNarrative,
} from "../../utils/events";
import { formatPercent, formatTimestamp } from "../../utils/assets";

type EventTableProps = {
  events: EventListRecord[];
};

export function EventTable({ events }: EventTableProps) {
  return (
    <div className="overflow-hidden rounded-[30px] border border-white/10 bg-slate-900/60 shadow-[0_30px_100px_-60px_rgba(14,165,233,0.8)]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-left">
          <thead className="bg-white/5 text-xs uppercase tracking-[0.2em] text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Event</th>
              <th className="px-6 py-4 font-medium">Type / region</th>
              <th className="px-6 py-4 font-medium">Certainty</th>
              <th className="px-6 py-4 font-medium">Severity</th>
              <th className="px-6 py-4 font-medium">Confidence</th>
              <th className="px-6 py-4 font-medium">Impacted assets</th>
              <th className="px-6 py-4 font-medium">Event time</th>
              <th className="px-6 py-4 font-medium">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm text-slate-200">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-white/5">
                <td className="px-6 py-5">
                  <div className="space-y-1">
                    <p className="font-semibold text-white">
                      {event.event_headline ?? event.article?.headline ?? "Untitled event"}
                    </p>
                    <p className="text-xs text-slate-400">{getEventNarrative(event)}</p>
                  </div>
                </td>
                <td className="px-6 py-5 text-slate-300">
                  {formatEventTypeLabel(event.event_type)} / {formatRegionLabel(event.region_of_effect)}
                </td>
                <td className="px-6 py-5 text-slate-300">{event.certainty}</td>
                <td className="px-6 py-5 text-slate-300">{formatPercent(event.event_severity)}</td>
                <td className="px-6 py-5 text-slate-300">{formatPercent(event.event_confidence)}</td>
                <td className="px-6 py-5 text-slate-300">{event.impacted_assets_count}</td>
                <td className="px-6 py-5 text-slate-300">{formatTimestamp(event.event_time)}</td>
                <td className="px-6 py-5 text-slate-300">
                  {event.article?.url ? (
                    <Link
                      href={event.article.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-cyan-200 transition hover:text-cyan-100"
                    >
                      Open article
                    </Link>
                  ) : (
                    "Unavailable"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
