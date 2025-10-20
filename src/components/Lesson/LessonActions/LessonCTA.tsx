import { Button } from "@/components/Button";
import { LessonEntryStep, LessonStepType } from "@/types";
import { useMemo } from "react";

export interface DialogueCTAProps {
  step: LessonEntryStep;
  onClick: () => void;
}

function getCTADetailsByStepType(stepType: LessonStepType): {
  label: string;
  icon: string;
} {
  switch (stepType) {
    case "introduction":
      return {
        label: "NEXT",
        icon: "►",
      };
    case "listening":
      return {
        label: "NEXT",
        icon: "►",
      };
    default:
      return {
        label: "CLOSE",
        icon: "X",
      };
  }
}

export function LessonCTA({ step, onClick }: DialogueCTAProps) {
  const { label, icon } = useMemo(
    () => getCTADetailsByStepType(step.type),
    [step.type]
  );

  return (
    <div className="absolute right-4 -bottom-9">
      <Button label={label} labelIcon={icon} onClick={onClick} />
    </div>
  );
}
