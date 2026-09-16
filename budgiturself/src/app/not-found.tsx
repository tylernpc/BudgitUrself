import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm font-medium text-ink-faint">404</p>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Page not found</h1>
      <p className="text-sm text-ink-faint">
        The page you are looking for does not exist or has moved.
      </p>
      <Button asChild>
        <Link href="/">Back home</Link>
      </Button>
    </main>
  );
}
