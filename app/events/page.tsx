import { EventCollectionPage } from "../../components/events/event-collection-page";
import { getEvents, parseEventFilters } from "../../utils/events";

type EventsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const filters = parseEventFilters(await searchParams, {
    sort: "latest",
    active: true,
    limit: 60,
  });
  const events = await getEvents(filters);

  return <EventCollectionPage events={events} filters={filters} />;
}
