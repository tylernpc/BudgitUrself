function Shimmer({ className }: { className: string }) {
  return (
    <div
      className={`sheen rounded-3xl border border-hairline bg-[linear-gradient(100deg,var(--dash-quiet),var(--dash-chip),var(--dash-quiet))] ${className}`}
    />
  );
}

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="aurora-base absolute inset-0" />
      <div className="relative mx-auto max-w-7xl space-y-6 px-4 pt-24 sm:px-6 lg:px-8">
        <Shimmer className="h-9 w-56 rounded-xl" />
        <Shimmer className="h-[380px]" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Shimmer className="h-[520px]" />
          <Shimmer className="h-[520px]" />
        </div>
      </div>
    </div>
  );
}
