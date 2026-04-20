const HAS_TIMEZONE_PATTERN = /(Z|[+\-]\d{2}:?\d{2})$/i;

const normalizeTimestampInput = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const withIsoDateTime = trimmed.includes("T")
    ? trimmed
    : trimmed.replace(/^([0-9]{4}-[0-9]{2}-[0-9]{2})\s+/, "$1T");

  return HAS_TIMEZONE_PATTERN.test(withIsoDateTime)
    ? withIsoDateTime
    : `${withIsoDateTime}Z`;
};

export const toUtcIsoString = (value: string | null | undefined) => {
  if (!value) {
    return null;
  }

  const normalized = normalizeTimestampInput(value);
  if (!normalized) {
    return null;
  }

  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
};
