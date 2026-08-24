function Block({ className }: { className: string }) {
  return <div className={`app-card animate-pulse bg-surface-2 ${className}`} />;
}

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-app">
      <div className="h-[57px] border-b border-line bg-surface" />
      <div className="mx-auto w-full max-w-[74rem] space-y-5 px-4 pt-8 sm:px-6 lg:px-8">
        <div className="h-8 w-64 animate-pulse rounded-md bg-surface-2" />
        <Block className="h-[260px]" />
        <div className="grid gap-5 lg:grid-cols-2">
          <Block className="h-[440px]" />
          <Block className="h-[440px]" />
        </div>
      </div>
    </div>
  );
}
