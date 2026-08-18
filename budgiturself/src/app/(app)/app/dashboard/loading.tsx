export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-12">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-slate-800" />
        <div className="h-48 animate-pulse rounded-xl bg-slate-900" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-96 animate-pulse rounded-xl bg-slate-900" />
          <div className="h-96 animate-pulse rounded-xl bg-slate-900" />
        </div>
      </div>
    </div>
  );
}
