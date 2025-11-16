import { Button } from "@/components/Button";
import { Phases } from ".";

export interface BoardControlsProps {
  phase: Phases;
  onClickNext: () => void;
  onClickPrevious: () => void;
}

export function BoardControls({
  phase,
  onClickNext,
  onClickPrevious,
}: BoardControlsProps) {
  return (
    <div className="w-full flex justify-between my-2">
      <Button
        label="BACK"
        labelIcon="◄"
        iconPosition="start"
        onClick={onClickPrevious}
      />
      <Button
        label={phase === "writing" ? "SKIP" : "NEXT"}
        labelIcon={phase === "writing" ? "⏭" : "►"}
        color={
          phase === "writing"
            ? "bg-[#B40F00] hover:bg-[#941729]"
            : "bg-[#B40F00] hover:bg-[#941729]"
        }
        onClick={onClickNext}
      />
    </div>
  );
}
