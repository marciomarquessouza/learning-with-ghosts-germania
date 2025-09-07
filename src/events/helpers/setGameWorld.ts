import { GAME_WORLDS, gameEvents } from "../gameEvents";

export interface GameWorld {
  targetWorld: GAME_WORLDS;
}

export function setGameWorld({ targetWorld }: GameWorld): Promise<void> {
  return new Promise((resolve) => {
    gameEvents.emit("change-world", {
      targetWorld,
    });
    resolve();
  });
}
