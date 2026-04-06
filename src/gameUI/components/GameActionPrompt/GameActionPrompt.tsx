import {
  ACTION_DIALOGUE_ACCEPT_BTN,
  ACTION_DIALOGUE_BACKGROUND,
  ACTION_DIALOGUE_BACKGROUND_MIN,
  ACTION_DIALOGUE_CLOSE_BTN,
  ACTION_DIALOGUE_ICON,
  ACTION_DIALOGUE_STRIPE,
} from "@/constants/images";
import { usePreloadImages } from "@/gameUI/hooks/usePreloadImages";
import { AnimatePresence, motion } from "framer-motion";
import { PromptStates } from "./GameActionPrompt.boundary";
import { GameActionPromptEvent } from "@/events/game/types";
import { PromptHeader } from "./components/PromptHeader";
import { PromptDescription } from "./components/PromptDescription";
import { GermaniaIcon } from "@/components/Icons/GermaniaIcon";
import { SideButtons } from "./components/SideButtons";
import { Timer } from "./components/Timer";
import { PromptWrapper } from "./components/PromptWrapper";

interface GameActionPromptProps extends GameActionPromptEvent {
  state: PromptStates;
  onAction: () => void;
  onExpanded: () => void;
  onClosed: () => void;
}

export function GameActionPrompt({
  title,
  description,
  state,
  durationMs,
  onAction,
  onExpanded,
  onClosed,
}: GameActionPromptProps) {
  usePreloadImages([
    ACTION_DIALOGUE_BACKGROUND,
    ACTION_DIALOGUE_BACKGROUND_MIN,
    ACTION_DIALOGUE_ACCEPT_BTN,
    ACTION_DIALOGUE_CLOSE_BTN,
    ACTION_DIALOGUE_ICON,
    ACTION_DIALOGUE_STRIPE,
  ]);

  return (
    <div
      className={[
        "pointer-events-none",
        "absolute w-full left-0 top-0",
        "flex justify-center z-50",
      ].join(" ")}
    >
      <AnimatePresence>
        {state !== "hidden" && (
          <motion.div
            initial={{ y: -120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -120, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto"
          >
            <PromptWrapper state={state} onExpand={onExpanded}>
              <div className="relative px-10 py-6 flex flex-col items-center">
                <PromptHeader title={title} />
                <PromptDescription
                  description={description}
                  hide={state === "minimized"}
                />
              </div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-full">
                <SideButtons
                  onAction={onAction}
                  onClosed={onClosed}
                  hide={state === "minimized"}
                />
              </div>
              <div className="absolute -bottom-5 right-5 transform">
                {durationMs && (
                  <Timer
                    state={state}
                    durationMs={durationMs}
                    onFinish={onAction}
                  />
                )}
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <GermaniaIcon />
              </div>
            </PromptWrapper>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
