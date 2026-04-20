const titleCase = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export const formatArticleStatusLabel = (value: string) => titleCase(value);

export const formatMinutes = (value: number | null) => {
  if (value === null || Number.isNaN(value)) {
    return "-";
  }

  if (value < 1) {
    return "<1m";
  }

  if (value < 60) {
    return `${Math.round(value)}m`;
  }

  return `${(value / 60).toFixed(1)}h`;
};
