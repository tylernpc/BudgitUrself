import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OnboardingFlow, type OnboardingStep } from "@/components/onboarding/onboarding-flow";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";

export const metadata: Metadata = { title: "Onboarding preview" };

/**
 * Local preview of the onboarding screens, so they can be iterated on without
 * creating a fresh account each time. No auth and nothing is saved: Continue
 * just advances. `?step=tour` skips straight to the walkthrough. Not found in
 * production.
 */
export default async function DevOnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>;
}) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const { step } = await searchParams;
  const initialStep: OnboardingStep = step === "tour" ? "tour" : "setup";

  return (
    <OnboardingShell>
      <OnboardingFlow
        key={initialStep}
        email="preview@example.com"
        initialStep={initialStep}
        finishHref="/dev/onboarding"
      />
    </OnboardingShell>
  );
}
