import { Button } from "@/components/Button";
import { Phases } from ".";

export interface BoardControlsProps {
  phase: Phases;
  onClickPrevious: () => void;
  onClickClear: () => void;
  onClickNext: () => void;
}

export function BoardControls({
  phase,
  onClickNext,
  onClickClear,
  onClickPrevious,
}: BoardControlsProps) {
  return (
    <div className="w-full flex justify-between gap-2 my-2">
      <Button
        label="BACK"
        labelIcon="◄"
        iconPosition="start"
        onClick={onClickPrevious}
      />
      <Button
        label={phase === "result:correct" ? "RETRY" : "CLEAR"}
        onClick={onClickClear}
      />
      <Button
        label={phase === "writing" ? "SKIP" : "NEXT"}
        labelIcon={phase === "writing" ? "⏭" : "►"}
        color={
          phase === "result:correct"
            ? "bg-[#00A86B] hover:bg-[#00A86B]"
            : "bg-[#B40F00] hover:bg-[#941729]"
        }
        onClick={onClickNext}
      />
    </div>
  );
}
