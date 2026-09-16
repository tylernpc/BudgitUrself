import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { requireCurrentUser } from "@/lib/auth/dal";
import { completeOnboardingAction, finishOnboardingAction } from "./lib/actions";

export const metadata: Metadata = { title: "Welcome" };

const DASHBOARD_PATH = "/app/dashboard";

/** `?replay=1` lets Settings show the tour again; it skips setup and does not re-stamp `onboardedAt`. */
export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ replay?: string }>;
}) {
  const [user, { replay }] = await Promise.all([requireCurrentUser(), searchParams]);

  if (user.onboardedAt && !replay) {
    redirect(DASHBOARD_PATH);
  }

  return (
    <OnboardingShell>
      <OnboardingFlow
        email={user.email}
        // Accounts that predate onboarding confirm what they already have.
        defaultFirstName={user.firstName}
        existingAvatarUrl={user.avatarUrl}
        initialStep={replay ? "tour" : "setup"}
        onSubmit={completeOnboardingAction}
        onFinish={replay ? undefined : finishOnboardingAction}
        finishHref={DASHBOARD_PATH}
      />
    </OnboardingShell>
  );
}
