import { gameEvents } from "../gameEvents";
import { TransitionOptions } from "../cellEvents";
import { GameScenes } from "@/types";

export interface ChangeScene {
  targetScene: GameScenes;
  fade?: boolean;
  options?: TransitionOptions;
}

export function changeScene({
  targetScene,
  fade,
  options,
}: ChangeScene): Promise<void> {
  return new Promise((resolve) => {
    gameEvents.emit("change-scene", {
      targetScene,
      fade,
      options,
    });
    resolve();
  });
}
