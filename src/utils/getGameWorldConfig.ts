import { createConfig } from "@/game/phaser/createConfig";
import { cellScene } from "@/game/scenes/cell_scene";
import { ghostDreamScene } from "@/game/scenes/ghost_dream_scene";
import { trainScene } from "@/game/scenes/train_scene";
import { GAME_WORLDS } from "@/types";
import { SCENE_NAME as CELL_SCENE } from "@/game/scenes/cell_scene";
import { SCENE_NAME as DREAM_SCENE } from "@/game/scenes/ghost_dream_scene";
import { SCENE_NAME as TRAIN_SCENE } from "@/game/scenes/train_scene";

const scenesMap = [
  { name: CELL_SCENE, world: GAME_WORLDS.REAL, phaserScene: cellScene },
  { name: DREAM_SCENE, world: GAME_WORLDS.DREAM, phaserScene: ghostDreamScene },
  { name: TRAIN_SCENE, world: GAME_WORLDS.DREAM, phaserScene: trainScene },
];

export function getGameWorldConfig(
  world: GAME_WORLDS,
  firstScene?: string
): Phaser.Types.Core.GameConfig {
  const worldScenes = scenesMap.filter((scene) => scene.world === world);
  if (firstScene) {
    const index = worldScenes.findIndex((s) => s.name === firstScene);

    if (index !== -1) {
      const [target] = worldScenes.splice(index, 1);
      worldScenes.unshift(target);
    }
  }

  const phaserScenes = worldScenes.map((scene) => scene.phaserScene);

  switch (world) {
    case GAME_WORLDS.DREAM:
      return createConfig(phaserScenes, {
        scale: {
          mode: Phaser.Scale.EXPAND,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      });
    case GAME_WORLDS.REAL:
    default:
      return createConfig(phaserScenes, {
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      });
  }
}
