import type { AssetDirection, AssetScoreRecord } from "./types";

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export const formatNumber = (value: number) => numberFormatter.format(value);

export const formatCompactNumber = (value: number) => compactFormatter.format(value);

export const formatSignedNumber = (value: number) =>
  `${value > 0 ? "+" : ""}${numberFormatter.format(value)}`;

export const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

export const formatTimestamp = (value: string | null) => {
  if (!value) {
    return "No recent update";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "No recent update";
  }

  return dateFormatter.format(parsed);
};

export const formatEventId = (value: string | null) => {
  if (!value) {
    return "Unavailable";
  }

  if (value.length <= 14) {
    return value;
  }

  return `${value.slice(0, 8)}...${value.slice(-4)}`;
};

export const normalizeDirection = (direction: string): AssetDirection => {
  if (direction === "bullish" || direction === "bearish") {
    return direction;
  }

  return "neutral";
};

export const getSignalNarrative = (asset: AssetScoreRecord) => {
  const direction = normalizeDirection(asset.direction);
  const confidenceTier =
    asset.confidence >= 0.75
      ? "high conviction"
      : asset.confidence >= 0.5
        ? "solid conviction"
        : "developing conviction";
  const disagreementTier =
    asset.disagreement >= 0.6
      ? "with elevated disagreement"
      : asset.disagreement >= 0.35
        ? "with mixed signals"
        : "with aligned signals";

  if (direction === "bullish") {
    return `${asset.asset_name} is showing ${confidenceTier} bullish momentum ${disagreementTier}.`;
  }

  if (direction === "bearish") {
    return `${asset.asset_name} is showing ${confidenceTier} bearish pressure ${disagreementTier}.`;
  }

  return `${asset.asset_name} is currently balanced, with ${confidenceTier} but no dominant directional edge.`;
};
