export default function Loading() {
  return (
    <div className="space-y-8">
      {/* Hero skeleton */}
      <div className="relative h-72 overflow-hidden rounded-3xl border border-[rgba(86,130,177,0.08)] bg-[rgba(6,8,12,0.95)]">
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,232,219,0.3)] to-transparent" />
        <div className="absolute inset-0 skeleton" />
        {/* Skeleton shimmer detail */}
        <div className="absolute left-8 top-8 h-4 w-32 rounded-full skeleton" style={{ background: 'rgba(86,130,177,0.08)' }} />
        <div className="absolute left-8 top-16 h-8 w-64 rounded-xl skeleton" style={{ background: 'rgba(86,130,177,0.06)' }} />
      </div>

      {/* Metric cards skeleton */}
      <div className="grid gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-2xl skeleton border border-[rgba(86,130,177,0.07)]"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>

      {/* Content cards skeleton */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="h-52 rounded-2xl skeleton border border-[rgba(86,130,177,0.07)]" />
        <div className="h-52 rounded-2xl skeleton border border-[rgba(86,130,177,0.07)]" />
      </div>

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-2xl border border-[rgba(86,130,177,0.08)] bg-[rgba(6,8,12,0.95)]">
        <div className="h-12 border-b border-[rgba(86,130,177,0.07)] skeleton" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-14 border-b border-[rgba(86,130,177,0.04)] skeleton"
            style={{ animationDelay: `${i * 0.08}s` }}
          />
        ))}
      </div>
    </div>
  );
}
