import { Button } from "@/components/Button";
import { Phases } from ".";
import { useCallback, useMemo } from "react";

type BtnDetails = { label: string; color?: string; labelIcon?: string };

export interface BoardControlsProps {
  phase: Phases;
  onClickPrevious: () => void;
  onClickRetry: () => void;
  onClickNext: () => void;
  onClickTip: () => void;
}

export function BoardControls({
  phase,
  onClickNext,
  onClickRetry,
  onClickPrevious,
  onClickTip,
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
      case "result:fail":
        return {
          back: {
            label: "BACK",
            labelIcon: "◄",
          },
          clear: {
            label: "RETRY",
            labelIcon: "↻ ",
          },
          next: {
            label: "SKIP",
            labelIcon: "⏭",
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
            label: "TIP",
          },
          next: {
            label: "SKIP",
            labelIcon: "⏭",
          },
        };
    }
  }, [phase]);

  const handleOnClickMiddleButton = useCallback(() => {
    switch (phase) {
      case "result:fail":
      case "result:correct":
        onClickRetry();
        break;
      case "writing":
        onClickTip();
        break;
    }
  }, [phase, onClickRetry, onClickTip]);

  return (
    <div className="w-full flex justify-between gap-2 my-2">
      <Button
        {...btnDetails.back}
        onClick={onClickPrevious}
        iconPosition="start"
      />
      <Button {...btnDetails.clear} onClick={handleOnClickMiddleButton} />
      <Button {...btnDetails.next} onClick={onClickNext} />
    </div>
  );
}
