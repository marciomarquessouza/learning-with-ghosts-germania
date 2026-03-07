import { GameScenes, GameWorlds } from "@/types";
import { events } from "@/events/events";

export interface SetGameWorld {
  targetWorld: GameWorlds;
  targetScene: GameScenes;
}

export function setGameWorld({
  targetWorld,
  targetScene,
}: SetGameWorld): Promise<void> {
  return new Promise((resolve) => {
    events.game.sync.emit("change-world", {
      targetWorld,
      targetScene,
    });
    resolve();
  });
}
