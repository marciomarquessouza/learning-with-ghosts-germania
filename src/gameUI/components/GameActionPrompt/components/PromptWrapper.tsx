import React from "react";
import { PromptStates } from "../GameActionPrompt.boundary";

interface PromptWrapperProps extends React.PropsWithChildren {
  state: PromptStates;
  onExpand: () => void;
}

export function PromptWrapper({
  state,
  children,
  onExpand,
}: PromptWrapperProps) {
  if (state === "hidden") return null;

  const isMinimized = state === "minimized";

  return (
    <div
      className={[
        "relative w-[504px]",
        isMinimized ? "h-[80px] cursor-pointer" : "h-[135px]",
      ].join(" ")}
      onClick={isMinimized ? onExpand : undefined}
    >
      <div
        className={[
          "pointer-events-none absolute inset-0 z-0 w-full h-full",
          "bg-no-repeat bg-center",
          isMinimized
            ? "bg-[url('/ui/action_dialogue/action_dialogue_background_minimized.jpg')]"
            : "bg-[url('/ui/action_dialogue/action_dialogue_background.jpg')]",
        ].join(" ")}
      />

      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}
