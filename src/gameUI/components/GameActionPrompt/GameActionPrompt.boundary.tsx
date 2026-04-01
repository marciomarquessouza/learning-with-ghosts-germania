import { events } from "@/events/events";
import { GameActionPromptEvent } from "@/events/game/types";
import { useEffect, useRef, useState } from "react";
import { GameActionPrompt } from "./GameActionPrompt";

export type GameActionPromptData = GameActionPromptEvent | null;
export type PromptStates = "hidden" | "minimized" | "expanded";

export function GameActionPromptBoundary() {
  const [state, setState] = useState<PromptStates>("hidden");
  const [data, setData] = useState<GameActionPromptData>(null);
  const closeEvent = useRef<() => void | undefined>(undefined);

  useEffect(() => {
    const show = (payload: GameActionPromptEvent, done: () => void) => {
      setData(payload);
      setState("expanded");
      closeEvent.current = done;
    };

    const hide = () => {
      setState("hidden");
      if (closeEvent.current) {
        closeEvent.current();
      }
    };

    events.game.async.on("game-action-prompt/show", show);
    events.game.sync.on("game-action-prompt/hide", hide);

    return () => {
      events.game.async.off("game-action-prompt/show", show);
      events.game.sync.off("game-action-prompt/hide", hide);
    };
  }, []);

  const closePrompt = () => {
    setState("hidden");
    closeEvent.current?.();
    closeEvent.current = undefined;
  };

  const handleAction = () => {
    data?.onAction?.();
    closePrompt();
  };

  const handleExpanded = () => {
    setState("expanded");
  };

  const handleClosePrompt = () => {
    if (data?.fixed) {
      setState("minimized");
      return;
    }
    closePrompt();
  };

  if (!data) return null;

  return (
    <GameActionPrompt
      state={state}
      onAction={handleAction}
      onClosed={handleClosePrompt}
      onExpanded={handleExpanded}
      {...data}
    />
  );
}
