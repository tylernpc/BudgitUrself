import type { Metadata } from "next";
import { requireCurrentUser } from "@/lib/auth/dal";
import { EditNameForm } from "./components/edit-name-form";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireCurrentUser();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Settings</h1>
      <dl className="mt-8 divide-y rounded-lg border">
        <EditNameForm firstName={user.firstName} lastName={user.lastName} />
        <div className="flex items-center justify-between px-4 py-3">
          <dt className="text-sm text-muted-foreground">Email</dt>
          <dd className="text-sm">{user.email}</dd>
        </div>
      </dl>
      <a href="/auth/logout" className="mt-8 inline-block text-sm underline underline-offset-4">
        Sign out
      </a>
    </main>
  );
}
