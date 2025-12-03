import Image from "next/image";
import { Button } from "@/components/Button";
import { Phases } from ".";

export interface BoardControlsProps {
  phase: Phases;
  tipsDisabled: boolean;
  onClickPrevious: () => void;
  onClickRetry: () => void;
  onClickNext: () => void;
  onClickTip: () => void;
}

export function StepControls({
  phase,
  tipsDisabled = false,
  onClickNext,
  onClickRetry,
  onClickPrevious,
  onClickTip,
}: BoardControlsProps) {
  return (
    <div className="w-full flex justify-between gap-2 my-2">
      <Button
        label="BACK"
        labelIcon="◄"
        onClick={onClickPrevious}
        iconPosition="start"
      />
      {phase === "writing" ? (
        <button
          className={[
            "relative group  shrink-0 h-[44px] px-5 bg-[#B40F00] hover:bg-[#941729]",
            "text-white w-40 justify-center font-primary font-semibold tracking-wide uppercase",
            "flex items-center gap-2 shadow-md cursor-pointer overflow-hidden",
            "disabled:bg-red-900",
          ].join(" ")}
          type="button"
          onClick={onClickTip}
          disabled={tipsDisabled}
        >
          <Image
            src={
              tipsDisabled
                ? "/ui/lesson/rune_eye_closed.png"
                : "/ui/lesson/rune_eye_tip.png"
            }
            width={52}
            height={52}
            alt="Tip Icon"
            priority
            className="transition-opacity duration-150 group-hover:opacity-0"
          />
          <span
            className={[
              "absolute inset-0 flex items-center justify-center",
              "opacity-0 group-hover:opacity-100",
              "transition-opacity duration-150",
            ].join(" ")}
          >
            {tipsDisabled ? "NO TIPS" : "TIP"}
          </span>
        </button>
      ) : (
        <Button label="RETRY" labelIcon="↻ " onClick={onClickRetry} />
      )}
      <Button
        label={phase === "result:correct" ? "NEXT" : "SKIP"}
        labelIcon={phase === "result:correct" ? "►" : "⏭"}
        color={
          phase === "result:correct"
            ? "bg-[#00A86B] hover:bg-[#009D46]"
            : undefined
        }
        onClick={onClickNext}
      />
    </div>
  );
}
