import { Button } from "@/components/Button";
import { LessonEntryStep } from "@/types";
import { getCTADetailsByStepType } from "../helpers/getCTADetailsByStepType";

export interface DialogueCTAProps {
  step: LessonEntryStep;
  hasChallengeFinished?: boolean;
  onClick: () => void;
}

export function LessonCTA({
  step,
  hasChallengeFinished = false,
  onClick,
}: DialogueCTAProps) {
  return (
    <div className="absolute right-4 -bottom-6">
      <div className="flex flex-row gap-4">
        {getCTADetailsByStepType(step.type).map(
          ({ label, icon, color }, index) => (
            <Button
              key={`${index}`}
              label={label}
              labelIcon={icon}
              color={color}
              onClick={onClick}
            />
          )
        )}
      </div>
    </div>
  );
}
