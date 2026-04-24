import type { EventListRecord } from "./types";

const titleCase = (value: string) =>
  value
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

export const formatEventTypeLabel = (value: string) => titleCase(value);

export const formatRegionLabel = (value: string) => value.toUpperCase();

export const getEventNarrative = (event: EventListRecord) => {
  const confidenceTier =
    event.event_confidence >= 0.75
      ? "high-confidence"
      : event.event_confidence >= 0.5
        ? "moderate-confidence"
        : "developing-confidence";

  return `${formatEventTypeLabel(event.event_type)} signal with ${confidenceTier} quality.`;
};
