import { SectionHeading } from "../../components/section-heading";
import { ArticlesOpsTable } from "../../components/ops/articles-ops-table";
import { OpsFilters } from "../../components/ops/ops-filters";
import { OpsSummaryCards } from "../../components/ops/ops-summary-cards";
import { getArticles, parseArticleFilters } from "../../utils/articles";

type OpsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OpsPage({ searchParams }: OpsPageProps) {
  const filters = parseArticleFilters(await searchParams, {
    sort: "ingested",
    limit: 80,
  });
  const rows = await getArticles(filters);

  return (
    <div className="space-y-8">
      <div className="rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_45%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(12,20,36,0.88))] p-8 shadow-[0_50px_120px_-70px_rgba(34,211,238,0.55)] md:p-10">
        <SectionHeading
          eyebrow="Ops monitoring"
          title="Track extraction lifecycle health"
          description="Use this view to spot stuck rows, retries due, dead-lettered items, and worker pressure across the pipeline."
        />
      </div>

      <OpsSummaryCards rows={rows} />
      <OpsFilters />

      {rows.length > 0 ? (
        <ArticlesOpsTable rows={rows} />
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-5 py-8 text-sm text-slate-300">
          No article rows match the current ops filters.
        </div>
      )}
    </div>
  );
}
