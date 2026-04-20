import { MetricCard } from "../metric-card";
import type { ArticleOpsRecord } from "../../utils/articles";

type OpsSummaryCardsProps = {
  rows: ArticleOpsRecord[];
};

const countWhere = (rows: ArticleOpsRecord[], predicate: (row: ArticleOpsRecord) => boolean) =>
  rows.filter(predicate).length;

export function OpsSummaryCards({ rows }: OpsSummaryCardsProps) {
  const processing = countWhere(rows, (row) => row.extraction_status === "processing");
  const failed = countWhere(rows, (row) => row.extraction_status === "failed");
  const deadLettered = countWhere(rows, (row) => row.is_dead_lettered);
  const retryDue = countWhere(rows, (row) => row.is_retry_due);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="Processing now"
        value={processing.toString()}
        hint="Articles currently being processed by extraction workers."
      />
      <MetricCard
        label="Failed"
        value={failed.toString()}
        hint="Rows in failed state waiting for retry or intervention."
      />
      <MetricCard
        label="Retry due"
        value={retryDue.toString()}
        hint="Rows where next retry time has already elapsed."
      />
      <MetricCard
        label="Dead lettered"
        value={deadLettered.toString()}
        hint="Rows that exceeded retry budget and were dead-lettered."
      />
    </div>
  );
}
