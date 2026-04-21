import { MetricCard } from "../metric-card";
import { SectionHeading } from "../section-heading";
import { EventFilters } from "./event-filters";
import { EventTable } from "./event-table";
import type { EventListRecord, EventQueryOptions } from "../../utils/events";

type EventCollectionPageProps = {
  events: EventListRecord[];
  filters: EventQueryOptions;
};

const average = (values: number[]) => {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

export function EventCollectionPage({ events, filters }: EventCollectionPageProps) {
  const regions = [...new Set(events.map((event) => event.region_of_effect))].sort();
  const activeCount = events.filter((event) => event.is_active).length;
  const avgConfidence = average(events.map((event) => event.event_confidence));
  const avgSeverity = average(events.map((event) => event.event_severity));

  const grouped = new Map<string, EventListRecord[]>();

  events.forEach((event) => {
    const groupKey = `${event.event_type} :: ${event.region_of_effect}`;
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
      {/* Minimal Hero Section */}
      <div className="relative pb-10 pt-8">
        <div className="relative grid gap-16 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-10">
            <SectionHeading
              eyebrow="Live events"
              title="Event stream grouped by type and region"
              description="This screen keeps active market events front and center with severity, confidence, and source context attached."
            />
            
            {/* Minimal Stats Row */}
            <div className="grid grid-cols-3 gap-6 divide-x divide-white/[0.04]">
              <div className="pl-0">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[rgb(var(--text-tertiary))]">Visible events</p>
                <p className="mono-num mt-2 text-2xl font-light text-white">{events.length}</p>
              </div>
              <div className="pl-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[rgb(var(--text-tertiary))]">Live events</p>
                <p className="mono-num mt-2 text-2xl font-light text-white">{activeCount}</p>
              </div>
              <div className="pl-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[rgb(var(--text-tertiary))]">Avg severity</p>
                <p className="mono-num mt-2 text-2xl font-light text-white">{Math.round(avgSeverity * 100)}%</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-[rgb(var(--accent-secondary))]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[rgb(var(--accent-secondary))]">
                View Snapshot
              </p>
            </div>
            <div className="space-y-6 text-[13px] font-light text-[rgb(var(--text-tertiary))]">
              <p>
                Sort: <span className="font-medium text-white">{filters.sort ?? "latest"}</span>
                {filters.search ? <> · search <span className="font-medium text-white">"{filters.search}"</span></> : ""}
                {filters.eventType ? <> · type <span className="font-medium text-white">{filters.eventType}</span></> : ""}
                {filters.region ? <> · region <span className="font-medium text-white">{filters.region}</span></> : ""}
                {filters.certainty ? <> · <span className="font-medium text-white">{filters.certainty}</span></> : ""}
                <br/>
                <span className="mt-1 block">Avg confidence: {Math.round(avgConfidence * 100)}%</span>
                <span className="mt-1 block">Unique regions: {regions.length}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <EventFilters regionOptions={regions} />

      {groupedEntries.length === 0 ? (
        <div className="glass-card-static rounded-xl border-dashed px-5 py-10 text-center text-sm text-[rgb(var(--text-tertiary))]">
          No events match the current filters.
        </div>
      ) : (
        <div className="space-y-6">
          {groupedEntries.map(([groupLabel, groupEvents]) => (
            <section key={groupLabel} className="space-y-3">
              <h2 className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[rgb(var(--text-tertiary))]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[rgb(var(--accent-primary))]" />
                {groupLabel} ({groupEvents.length})
              </h2>
              <EventTable events={groupEvents} />
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
