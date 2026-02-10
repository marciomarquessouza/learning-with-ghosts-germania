import { GameScenes, GameWorlds } from "@/types";
import { gameEvents } from "../gameEvents";

export interface SetGameWorld {
  targetWorld: GameWorlds;
  targetScene: GameScenes;
}

export function setGameWorld({
  targetWorld,
  targetScene,
}: SetGameWorld): Promise<void> {
  return new Promise((resolve) => {
    gameEvents.emit("change-world", {
      targetWorld,
      targetScene,
    });
    resolve();
  });
}
