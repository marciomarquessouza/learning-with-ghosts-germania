import Image from "next/image";
import { Button } from "@/components/Button";
import { StepPhases } from "@/libs/lesson/types";

export interface BoardControlsProps {
  phase: StepPhases;
  isLast: boolean;
  tipsDisabled: boolean;
  onClickRetry: () => void;
  onClickNext: () => void;
  onClickTip: () => void;
}

export function StepControls({
  phase,
  isLast,
  tipsDisabled = false,
  onClickNext,
  onClickRetry,
  onClickTip,
}: BoardControlsProps) {
  const isTipEnabled = !tipsDisabled && phase === "writing";

  return (
    <div className="w-full flex justify-between gap-2 my-2">
      <Button
        label="RESET"
        labelIcon="↻"
        onClick={onClickRetry}
        iconPosition="start"
      />

      <button
        className={[
          "relative shrink-0 h-[44px] px-5 bg-[#B40F00]",
          isTipEnabled && "group hover:bg-[#941729] cursor-pointer",
          !isTipEnabled && "bg-red-900 cursor-not-allowed",
          "text-white w-40 justify-center font-primary font-semibold tracking-wide uppercase",
          "flex items-center gap-2 shadow-md overflow-hidden",
        ]
          .filter(Boolean)
          .join(" ")}
        type="button"
        onClick={onClickTip}
        disabled={!isTipEnabled}
      >
        <Image
          src={
            isTipEnabled
              ? "/ui/lesson/rune_eye_tip.png"
              : "/ui/lesson/rune_eye_closed.png"
          }
          width={52}
          height={52}
          alt="Tip Icon"
          priority
          className={[
            "transition-opacity duration-150",
            isTipEnabled && "group-hover:opacity-0",
          ]
            .filter(Boolean)
            .join(" ")}
        />

        <span
          className={[
            "absolute inset-0 flex items-center justify-center",
            "opacity-0 transition-opacity duration-150",
            isTipEnabled && "group-hover:opacity-100",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {tipsDisabled ? "NO TIPS" : "TIP"}
        </span>
      </button>
      <Button
        label={
          isLast
            ? "FINISH"
            : phase === "writing"
              ? "SKIP"
              : phase === "result:correct"
                ? "NEXT"
                : "SKIP"
        }
        labelIcon={isLast ? undefined : phase === "result:correct" ? "►" : "⏭"}
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
