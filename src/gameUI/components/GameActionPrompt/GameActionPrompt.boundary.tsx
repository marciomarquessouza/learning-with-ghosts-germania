import { events } from "@/events/events";
import { GameActionPromptEvent } from "@/events/game/types";
import { useEffect, useState } from "react";
import { GameActionPrompt } from "./GameActionPrompt";

export type GameActionPromptData = GameActionPromptEvent | null;
export type PromptStates = "hidden" | "minimized" | "expanded";

export function GameActionPromptBoundary() {
  const [state, setState] = useState<PromptStates>("hidden");
  const [data, setData] = useState<GameActionPromptData>(null);

  useEffect(() => {
    const show = (payload: GameActionPromptEvent) => {
      setData(payload);
      setState("expanded");
    };

    const hide = () => setState("hidden");

    events.game.sync.on("game-action-prompt/show", show);
    events.game.sync.on("game-action-prompt/hide", hide);

    return () => {
      events.game.sync.off("game-action-prompt/show", show);
      events.game.sync.off("game-action-prompt/hide", hide);
    };
  }, []);

  const handleAction = () => {
    events.game.sync.emit("game-action-prompt/action");
  };

  const handleChangeState = (newState: PromptStates) => {
    setState(newState);
  };

  if (!data) return null;

  return (
    <GameActionPrompt
      state={state}
      onAction={handleAction}
      changeState={handleChangeState}
      {...data}
    />
  );
}
