import { InteractionTypes } from "@/events";
import { useMemo } from "react";

export interface DialogueCTAProps {
  isTypeWritingComplete: boolean;
  interactionType: InteractionTypes;
  isLastLine: boolean;
  onClick: () => void;
}

export function DialogueCTA({
  isTypeWritingComplete,
  interactionType,
  isLastLine,
  onClick,
}: DialogueCTAProps) {
  const ctaDetails: { text: string; icon: string } = useMemo(() => {
    if (interactionType === "alternatives") {
      return { text: "DECIDE", icon: "#" };
    }

    if (interactionType === "input") {
      return { text: "ANSWER", icon: "!" };
    }

    if (isLastLine) {
      return { text: "CLOSE", icon: "X" };
    }

    return { text: "CONTINUE", icon: "►" };
  }, [interactionType, isLastLine]);

  return (
    <>
      {isTypeWritingComplete && (
        <div className="absolute right-4 -bottom-4">
          <button
            className="shrink-0 h-[44px] px-5 bg-red-700 text-white 
                             font-primary font-semibold tracking-wide uppercase
                             flex items-center gap-2 shadow-md hover:bg-red-800 cursor-pointer"
            type="button"
            onClick={onClick}
          >
            {ctaDetails.text}
            <span aria-hidden> {ctaDetails.icon}</span>
          </button>
        </div>
      )}
    </>
  );
}
