import { Button } from "@/components/Button";
import { Phases } from ".";

export interface StepControlsProps {
  phase: Phases;
  onClickPrevious: () => void;
  onClickNext: () => void;
  onClickRetry: () => void;
}

export function StepControls({
  phase,
  onClickPrevious,
  onClickNext,
  onClickRetry,
}: StepControlsProps) {
  return (
    <>
      <div className="absolute left-4 -bottom-6">
        <Button
          iconPosition="start"
          label="BACK"
          labelIcon="◄"
          color="bg-[#B40F00] hover:bg-[#941729]"
          onClick={onClickPrevious}
        />
      </div>
      <div className="absolute right-4 -bottom-6">
        <div className="flex flex-row gap-4">
          {phase === "result" && (
            <Button label="TRY AGAIN" labelIcon="↻" onClick={onClickRetry} />
          )}
          <Button
            label={phase === "pronunciation" ? "SKIP" : "NEXT"}
            labelIcon={phase === "pronunciation" ? "⏭" : "►"}
            color={
              phase === "pronunciation"
                ? "bg-[#976ED4] hover:bg-[#6700FF]"
                : "bg-[#B40F00] hover:bg-[#941729]"
            }
            onClick={onClickNext}
          />
        </div>
      </div>
    </>
  );
}
