import {
  ACTION_DIALOGUE_ACCEPT_BTN,
  ACTION_DIALOGUE_BACKGROUND,
  ACTION_DIALOGUE_CLOSE_BTN,
  ACTION_DIALOGUE_ICON,
  ACTION_DIALOGUE_STRIPE,
} from "@/constants/images";
import { usePreloadImages } from "@/gameUI/hooks/usePreloadImages";
import { AnimatePresence, motion } from "framer-motion";
import { PromptStates } from "./GameActionPrompt.boundary";
import { GameActionPromptEvent } from "@/events/game/types";
import { GameActionPromptHeader as Header } from "./components/GameActionPromptHeader";
import { GameActionPromptDescription as Description } from "./components/GameActionPromptDescription";
import { GermaniaIcon } from "@/components/Icons/GermaniaIcon";
import { GameActionPromptButtons as SideButtons } from "./components/GameActionPromptButtons";
import { GameActionPromptTimer as Timer } from "./components/GameActionPromptTimer";

interface GameActionPromptProps extends GameActionPromptEvent {
  state: PromptStates;
  onAction: () => void;
  changeState: (newState: PromptStates) => void;
}

export function GameActionPrompt({
  title,
  description,
  state,
  duration,
  onAction,
  changeState,
}: GameActionPromptProps) {
  usePreloadImages([
    ACTION_DIALOGUE_BACKGROUND,
    ACTION_DIALOGUE_ACCEPT_BTN,
    ACTION_DIALOGUE_CLOSE_BTN,
    ACTION_DIALOGUE_ICON,
    ACTION_DIALOGUE_STRIPE,
  ]);

  const handleAction = () => {
    onAction();
    changeState("hidden");
  };

  const handleClose = () => {
    changeState("hidden");
  };

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
            <div className="relative w-[504px] h-[135px]">
              <div
                className={[
                  "object-contain pointer-events-none",
                  "absolute inset-0 w-full h-full",
                  "bg-[url('/ui/action_dialogue/action_dialogue_background.jpg')]",
                  "bg-no-repeat bg-center",
                ].join(" ")}
              />
              <div className="relative px-10 py-6 flex flex-col items-center">
                <Header title={title} />
                <Description description={description} show />
              </div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-full">
                <SideButtons onAction={handleAction} onClose={handleClose} />
              </div>
              <div className="absolute -bottom-5 right-5 transform">
                {duration && (
                  <Timer
                    state={state}
                    duration={duration}
                    onFinish={handleAction}
                  />
                )}
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <GermaniaIcon />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
