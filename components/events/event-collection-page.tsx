import { PageHero } from "../page-hero";
import { EventFilters } from "./event-filters";
import { EventTable } from "./event-table";
import type { EventListRecord } from "../../utils/events";
import { formatEventTypeLabel } from "../../utils/events";

type EventCollectionPageProps = {
  events: EventListRecord[];
};

export function EventCollectionPage({ events }: EventCollectionPageProps) {
  const activeCount = events.filter((event) => event.is_active).length;

  const grouped = new Map<string, EventListRecord[]>();

  events.forEach((event) => {
    const groupKey = event.event_type;
    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, []);
    }

    grouped.get(groupKey)?.push(event);
  });

  const groupedEntries = Array.from(grouped.entries()).sort(([left], [right]) =>
    left.localeCompare(right),
  );

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Live events"
        title="Event stream grouped by type"
        description="A focused India event feed with cleaner rows, clearer signals, and source context attached."
        metrics={
          <div className="grid grid-cols-1 gap-6 text-center sm:grid-cols-2 sm:divide-x sm:divide-white/[0.06]">
            <div className="sm:pr-6">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[rgb(var(--text-tertiary))]">
                Live events
              </p>
              <p className="mono-num mt-2 text-3xl font-light text-white md:text-4xl">
                {activeCount}
              </p>
            </div>
            <div className="sm:pl-6">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[rgb(var(--text-tertiary))]">
                Total events
              </p>
              <p className="mono-num mt-2 text-3xl font-light text-white md:text-4xl">
                {events.length}
              </p>
            </div>
          </div>
        }
      />

      <EventFilters />

      {groupedEntries.length === 0 ? (
        <div className="glass-card-static rounded-xl border-dashed px-5 py-10 text-center text-sm text-[rgb(var(--text-tertiary))]">
          No events match the current filters.
        </div>
      ) : (
        <div className="space-y-6">
          {groupedEntries.map(([groupLabel, groupEvents]) => (
            <section key={groupLabel} className="space-y-3">
              <h2 className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[rgb(var(--text-tertiary))]">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[rgba(115,158,201,0.35)] text-[rgb(var(--accent-secondary))]">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19V5M6 11l6-6 6 6" />
                  </svg>
                </span>
                {formatEventTypeLabel(groupLabel)} ({groupEvents.length})
              </h2>
              <EventTable events={groupEvents} />
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
