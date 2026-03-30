export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-72 rounded-[36px] border border-white/10 bg-white/5" />
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 rounded-[28px] border border-white/10 bg-white/5" />
        ))}
      </div>
    </div>
  );
}
