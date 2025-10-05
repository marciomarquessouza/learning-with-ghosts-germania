import { useMemo } from "react";
import { Button } from "../Button";
import { InteractionTypes } from "@/types";

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
    if (!isTypeWritingComplete) {
      return { text: "RESUME", icon: "↫" };
    }

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
  }, [isTypeWritingComplete, interactionType, isLastLine]);

  return (
    <div className="absolute right-4 -bottom-4">
      <Button
        label={ctaDetails.text}
        labelIcon={ctaDetails.icon}
        onClick={onClick}
      />
    </div>
  );
}
