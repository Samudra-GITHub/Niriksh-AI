export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="col-span-12 h-[132px] rounded-2xl border border-border bg-muted-surface/60 sm:col-span-6 xl:col-span-3"
        />
      ))}

      <div className="col-span-12 h-[420px] rounded-2xl border border-border bg-muted-surface/60 xl:col-span-8" />
      <div className="col-span-12 h-[420px] rounded-2xl border border-border bg-muted-surface/60 lg:col-span-7 xl:col-span-4" />

      <div className="col-span-12 h-[320px] rounded-2xl border border-border bg-muted-surface/60 lg:col-span-5" />
      <div className="col-span-12 h-[320px] rounded-2xl border border-border bg-muted-surface/60 lg:col-span-7" />

      <div className="col-span-12 h-[280px] rounded-2xl border border-border bg-muted-surface/60" />
    </div>
  );
}
