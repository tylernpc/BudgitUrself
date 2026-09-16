function Skeleton({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded-xl border border-hairline bg-quiet ${className}`} />
  );
}

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="h-14 border-b border-hairline bg-panel" />
      <div className="mx-auto max-w-7xl space-y-6 px-4 pt-10 sm:px-6 sm:pt-12 lg:px-8">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-[320px]" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[520px]" />
          <Skeleton className="h-[520px]" />
        </div>
      </div>
    </div>
  );
}
