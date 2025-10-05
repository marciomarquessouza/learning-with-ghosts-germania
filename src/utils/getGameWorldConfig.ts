import { createConfig } from "@/game/phaser/createConfig";
import { cellScene } from "@/game/scenes/cell_scene";
import { ghostDreamScene } from "@/game/scenes/ghost_dream_scene";
import { GAME_WORLDS } from "@/types";

export function getGameWorldConfig(
  world: GAME_WORLDS
): Phaser.Types.Core.GameConfig {
  switch (world) {
    case GAME_WORLDS.DREAM:
      return createConfig([ghostDreamScene], {
        scale: {
          mode: Phaser.Scale.EXPAND,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      });
    case GAME_WORLDS.REAL:
    default:
      return createConfig([cellScene]);
  }
}
