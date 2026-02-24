import React from "react";

interface ProgressStepBarProps {
  currentStep: number; // 1, 2, 3
  totalSteps?: number; // 기본값 3
}

export default function ProgressStepBar({
  currentStep,
  totalSteps = 3,
}: ProgressStepBarProps) {
  return (
    <div className="mx-auto mt-3 flex w-60 items-center">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;
        const isLastStep = stepNumber === totalSteps;

        return (
          <React.Fragment key={stepNumber}>
            {/* 원 */}
            <div
              className={`h-3 w-3 shrink-0 rounded-full ${
                isActive ? "bg-gray-900" : "bg-gray-100"
              }`}
            />

            {/* 직선 (마지막 원 뒤에는 없음) */}
            {!isLastStep && (
              <div
                className={`mx-2 h-0.5 w-full rounded ${
                  stepNumber < currentStep ? "bg-gray-900" : "bg-gray-100"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
