import { GAME_WORLDS, GameScenes } from "@/types";
import { gameEvents } from "../gameEvents";

export interface GameWorld {
  targetWorld: GAME_WORLDS;
  targetScene: GameScenes;
}

export function setGameWorld({
  targetWorld,
  targetScene,
}: GameWorld): Promise<void> {
  return new Promise((resolve) => {
    gameEvents.emit("change-world", {
      targetWorld,
      targetScene,
    });
    resolve();
  });
}
