import type PhaserType from "phaser";

export function initPhaser(
  config: PhaserType.Types.Core.GameConfig
): Promise<PhaserType.Game> {
  return import("phaser")
    .then(({ default: Phaser }) => {
      return new Phaser.Game(config);
    })
    .catch((err) => {
      console.error("Failed to initialize Phaser:", err);
      throw err;
    });
}
