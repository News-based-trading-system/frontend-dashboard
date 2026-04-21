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
    <div className="glass-card-static overflow-hidden rounded-2xl">
      <div className="overflow-x-auto">
        <table className="data-table min-w-full text-left">
          <thead>
            <tr>
              <th>Event</th>
              <th>Type / region</th>
              <th>Certainty</th>
              <th>Severity</th>
              <th>Confidence</th>
              <th>Impacted assets</th>
              <th>Event time</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>
                  <div className="space-y-1">
                    <p className="font-semibold text-[rgb(var(--text-primary))]">
                      {event.event_headline ?? event.article?.headline ?? "Untitled event"}
                    </p>
                    <p className="text-xs text-[rgb(var(--text-tertiary))]">{getEventNarrative(event)}</p>
                  </div>
                </td>
                <td>
                  {formatEventTypeLabel(event.event_type)} / {formatRegionLabel(event.region_of_effect)}
                </td>
                <td>{event.certainty}</td>
                <td>{formatPercent(event.event_severity)}</td>
                <td>{formatPercent(event.event_confidence)}</td>
                <td>{event.impacted_assets_count}</td>
                <td>{formatTimestamp(event.event_time)}</td>
                <td>
                  {event.article?.url ? (
                    <Link
                      href={event.article.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-[rgb(var(--accent-primary))] transition-colors duration-300 hover:text-[rgb(var(--accent-tertiary))]"
                    >
                      Open ↗
                    </Link>
                  ) : (
                    <span className="text-[rgb(var(--text-tertiary))]">—</span>
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
