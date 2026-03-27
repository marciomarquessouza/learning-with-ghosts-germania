import {
  ACTION_DIALOGUE_ACCEPT_BTN,
  ACTION_DIALOGUE_BACKGROUND,
  ACTION_DIALOGUE_CLOSE_BTN,
  ACTION_DIALOGUE_ICON,
  ACTION_DIALOGUE_STRIPE,
} from "@/constants/images";
import { events } from "@/events/events";
import { GameActionPromptEvent } from "@/events/game/types";
import { usePreloadImages } from "@/gameUI/hooks/usePreloadImages";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export type GameActionPromptData = GameActionPromptEvent | null;
export type PromptStates = "hidden" | "expanded" | "minimized";

export function GameActionPrompt() {
  const [state, setState] = useState<PromptStates>("expanded");
  const [data, setData] = useState<GameActionPromptData>(null);

  usePreloadImages([
    ACTION_DIALOGUE_BACKGROUND,
    ACTION_DIALOGUE_ACCEPT_BTN,
    ACTION_DIALOGUE_CLOSE_BTN,
    ACTION_DIALOGUE_ICON,
    ACTION_DIALOGUE_STRIPE,
  ]);

  useEffect(() => {
    const show = (payload: GameActionPromptEvent) => {
      setData(payload);
      setState("expanded");

      if (payload.duration) {
        setTimeout(() => {
          setState("minimized");
        }, payload.duration);
      }
    };

    const hide = () => setState("hidden");

    events.game.sync.on("game-action-prompt/show", show);
    events.game.sync.on("game-action-prompt/hide", hide);

    return () => {
      events.game.sync.off("game-action-prompt/show", show);
      events.game.sync.off("game-action-prompt/hide", hide);
    };
  }, []);

  if (!data) return null;

  return (
    <div
      className={[
        "pointer-events-none",
        "absolute w-full left-0 top-0",
        "flex justify-center z-50",
      ].join(" ")}
    >
      <AnimatePresence>
        {state === "expanded" && (
          <motion.div
            initial={{ y: -120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -120, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto"
          >
            <></>
          </motion.div>
        )}
      </AnimatePresence>
      {state === "minimized" && <></>}
    </div>
  );
}
