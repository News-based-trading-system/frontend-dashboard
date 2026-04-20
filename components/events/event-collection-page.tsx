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
      <div className="rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_45%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(12,20,36,0.88))] p-8 shadow-[0_50px_120px_-70px_rgba(34,211,238,0.55)] md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <SectionHeading
              eyebrow="Live events"
              title="Event stream grouped by type and region"
              description="This screen keeps active market events front and center with severity, confidence, and source context attached."
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <MetricCard
                label="Visible events"
                value={events.length.toString()}
                hint="Rows currently matching this event view."
              />
              <MetricCard
                label="Live events"
                value={activeCount.toString()}
                hint="Events still active in decay logic."
              />
              <MetricCard
                label="Avg severity"
                value={`${Math.round(avgSeverity * 100)}%`}
                hint="Average intensity of currently visible events."
              />
            </div>
          </div>
          <div className="rounded-[30px] border border-white/10 bg-black/20 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300/80">
              Snapshot
            </p>
            <div className="mt-4 space-y-4 text-sm text-slate-300">
              <p>
                Current filters: <span className="text-slate-100">{filters.sort ?? "latest"}</span>
                {filters.search ? `, search "${filters.search}"` : ""}
                {filters.eventType ? `, type ${filters.eventType}` : ""}
                {filters.region ? `, region ${filters.region}` : ""}
                {filters.certainty ? `, ${filters.certainty}` : ""}
              </p>
              <p>Average confidence: {Math.round(avgConfidence * 100)}%</p>
              <p>Unique regions: {regions.length}</p>
            </div>
          </div>
        </div>
      </div>

      <EventFilters regionOptions={regions} />

      {groupedEntries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-5 py-8 text-sm text-slate-300">
          No events match the current filters.
        </div>
      ) : (
        <div className="space-y-6">
          {groupedEntries.map(([groupLabel, groupEvents]) => (
            <section key={groupLabel} className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
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
