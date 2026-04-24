import Link from "next/link";
import type { EventListRecord } from "../../utils/events";
import { getEventNarrative } from "../../utils/events";
import { formatPercent, formatTimestampIst } from "../../utils/assets";

type EventTableProps = {
  events: EventListRecord[];
};

export function EventTable({ events }: EventTableProps) {
  const getCertaintyTone = (certainty: string) => {
    const normalized = certainty.toLowerCase();

    if (normalized === "confirmed") {
      return {
        className:
          "border-[rgba(124,210,165,0.35)] bg-[rgba(124,210,165,0.08)] text-[rgb(var(--bullish))]",
        iconPath: "M20 6 9 17l-5-5",
      };
    }

    if (normalized === "rumour") {
      return {
        className:
          "border-[rgba(255,120,156,0.35)] bg-[rgba(255,120,156,0.08)] text-[rgb(var(--bearish))]",
        iconPath: "M12 5v8m0 6h.01",
      };
    }

    return {
      className:
        "border-[rgba(115,158,201,0.35)] bg-[rgba(115,158,201,0.08)] text-[rgb(var(--accent-secondary))]",
      iconPath: "M12 8v8M8 12h8",
    };
  };

  return (
    <div className="glass-card-static overflow-hidden rounded-2xl">
      <div className="overflow-x-auto">
        <table className="data-table min-w-full text-left">
          <thead>
            <tr>
              <th>Event</th>
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
                  {(() => {
                    const tone = getCertaintyTone(event.certainty);
                    return (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${tone.className}`}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d={tone.iconPath} />
                        </svg>
                        {event.certainty}
                      </span>
                    );
                  })()}
                </td>
                <td>{formatPercent(event.event_severity)}</td>
                <td>{formatPercent(event.event_confidence)}</td>
                <td>{event.impacted_assets_count}</td>
                <td>{formatTimestampIst(event.event_time)}</td>
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
