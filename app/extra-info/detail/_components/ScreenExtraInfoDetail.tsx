import React from "react";
import ProgressStepBar from "@/components/ui/ProgressStepBar";
import { BackButton } from "@/components/ui/BackButton";

const ScreenExtraInfoDetail = () => {
  return (
    <main className="flex min-h-dvh flex-col px-4">
      <ProgressStepBar currentStep={3} totalSteps={3} />
    </main>
  );
};

export default ScreenExtraInfoDetail;
