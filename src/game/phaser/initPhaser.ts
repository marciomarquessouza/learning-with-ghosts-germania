import { gameEvents } from "@/events/gameEvents";
import type PhaserType from "phaser";

export function initPhaser(
  config: PhaserType.Types.Core.GameConfig
): Promise<PhaserType.Game> {
  return import("phaser")
    .then(({ default: Phaser }) => {
      const game = new Phaser.Game(config);
      requestAnimationFrame(() => {
        gameEvents.emit("canvas-ready");
      });
      return game;
    })
    .catch((err) => {
      console.error("Failed to initialize Phaser:", err);
      throw err;
    });
}
