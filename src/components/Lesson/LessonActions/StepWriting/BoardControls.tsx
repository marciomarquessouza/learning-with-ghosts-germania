import { Button } from "@/components/Button";
import { Phases } from ".";
import { useMemo } from "react";

type BtnDetails = { label: string; color?: string; labelIcon?: string };

export interface BoardControlsProps {
  phase: Phases;
  onClickPrevious: () => void;
  onClickClear: () => void;
  onClickRetry: () => void;
  onClickNext: () => void;
}

export function BoardControls({
  phase,
  onClickNext,
  onClickClear,
  onClickRetry,
  onClickPrevious,
}: BoardControlsProps) {
  const btnDetails = useMemo((): {
    back: BtnDetails;
    clear: BtnDetails;
    next: BtnDetails;
  } => {
    switch (phase) {
      case "result:correct":
        return {
          back: {
            label: "BACK",
            labelIcon: "◄",
          },
          clear: {
            label: "RETRY",
          },
          next: {
            label: "NEXT",
            labelIcon: "►",
            color: "bg-[#00A86B] hover:bg-[#009D46]",
          },
        };
      case "writing":
      default:
        return {
          back: {
            label: "BACK",
            labelIcon: "◄",
          },
          clear: {
            label: "CLEAR",
          },
          next: {
            label: "SKIP",
            color: "bg-[#976ED4] hover:bg-[#6700FF]",
            labelIcon: "⏭",
          },
        };
    }
  }, [phase]);

  return (
    <div className="w-full flex justify-between gap-2 my-2">
      <Button {...btnDetails.back} onClick={onClickPrevious} />
      <Button
        {...btnDetails.clear}
        onClick={phase === "result:correct" ? onClickRetry : onClickClear}
      />
      <Button {...btnDetails.next} onClick={onClickNext} />
    </div>
  );
}
