import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  supporting?: ReactNode;
  metrics?: ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  description,
  supporting,
  metrics,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[24px] border border-white/[0.04] bg-[rgba(7,10,16,0.58)] px-6 py-9 sm:px-8 md:px-12 md:py-12">
      <div className="relative mx-auto max-w-4xl text-center">
        {eyebrow ? (
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-6 bg-[rgba(115,158,201,0.4)]" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[rgb(var(--text-tertiary))]">
              {eyebrow}
            </p>
            <span className="h-px w-6 bg-[rgba(115,158,201,0.4)]" />
          </div>
        ) : null}

        <div className="space-y-3.5">
          <h1 className="mx-auto max-w-3xl text-[32px] font-semibold tracking-tight text-[rgb(var(--text-primary))] sm:text-[40px] md:text-[48px] md:leading-[1.08]">
            {title}
          </h1>
          {description ? (
            <p className="mx-auto max-w-2xl text-[14px] leading-7 text-[rgb(var(--text-secondary))] md:text-[16px]">
              {description}
            </p>
          ) : null}
          {supporting ? (
            <div className="mx-auto max-w-2xl text-[13px] leading-7 text-[rgb(var(--text-tertiary))]">
              {supporting}
            </div>
          ) : null}
        </div>

        {metrics ? (
          <div className="mt-9 border-t border-white/[0.05] pt-7">
            {metrics}
          </div>
        ) : null}
      </div>
    </section>
  );
}
