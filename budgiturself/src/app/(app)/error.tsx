"use client";

import { useEffect } from "react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-app px-6 font-ui text-fg">
      <div className="app-card w-full max-w-sm px-6 py-7">
        <h1 className="text-[15px] font-semibold tracking-tight">Something went wrong</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-fg-muted">
          We could not load this page. Try again, and if it keeps happening the issue is on our
          side.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 inline-flex h-9 items-center justify-center rounded-lg bg-fg px-3.5 text-[13px] font-medium text-app transition-opacity outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-brand/40"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
