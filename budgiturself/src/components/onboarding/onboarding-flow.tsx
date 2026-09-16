"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { OnboardingForm, type OnboardingSubmitResult } from "./onboarding-form";
import { OnboardingTour } from "./onboarding-tour";

export type OnboardingStep = "setup" | "tour";

interface OnboardingFlowProps {
  email: string;
  defaultFirstName?: string | null;
  existingAvatarUrl?: string | null;
  initialStep?: OnboardingStep;
  /** Saves the profile at the end of setup. Omitted in the local preview. */
  onSubmit?: (formData: FormData) => Promise<OnboardingSubmitResult>;
  /** Marks the tour as seen when it is finished or skipped. Omitted in the local preview. */
  onFinish?: () => Promise<OnboardingSubmitResult>;
  /** Where the user lands after the tour. */
  finishHref: string;
}

/** Setup (name + photo) first, then the walkthrough. */
export function OnboardingFlow({
  email,
  defaultFirstName,
  existingAvatarUrl,
  initialStep = "setup",
  onSubmit,
  onFinish,
  finishHref,
}: OnboardingFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>(initialStep);
  const [isFinishing, startFinish] = useTransition();

  const finish = () => {
    startFinish(async () => {
      await onFinish?.();
      router.push(finishHref);
    });
  };

  if (step === "setup") {
    return (
      <OnboardingForm
        email={email}
        defaultFirstName={defaultFirstName}
        existingAvatarUrl={existingAvatarUrl}
        onSubmit={onSubmit}
        onComplete={() => setStep("tour")}
      />
    );
  }

  return <OnboardingTour pending={isFinishing} onFinish={finish} />;
}
