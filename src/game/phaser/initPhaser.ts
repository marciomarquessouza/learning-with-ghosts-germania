import { events } from "@/events/events";
import type PhaserType from "phaser";

export function initPhaser(
  config: PhaserType.Types.Core.GameConfig,
): Promise<PhaserType.Game> {
  return import("phaser")
    .then(({ default: Phaser }) => {
      const game = new Phaser.Game(config);
      requestAnimationFrame(() => {
        events.game.sync.emit("canvas-ready", undefined);
      });
      return game;
    })
    .catch((err) => {
      console.error("Failed to initialize Phaser:", err);
      throw err;
    });
}
