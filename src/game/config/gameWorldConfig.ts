import { GAME_SCENES, GAME_WORLDS } from "@/constants/game";
import { createConfig } from "@/game/phaser/createConfig";
import { cellScene } from "@/game/scenes/cell_scene";
import { ghostDreamScene } from "@/game/scenes/ghost_dream_scene";
import { trainScene } from "@/game/scenes/train_scene";
import { GameWorlds } from "@/types";

const scenesMap = [
  {
    name: GAME_SCENES.CELL_SCENE,
    world: GAME_WORLDS.REAL,
    phaserScene: cellScene,
  },
  {
    name: GAME_SCENES.DREAM_SCENE,
    world: GAME_WORLDS.DREAM,
    phaserScene: ghostDreamScene,
  },
  {
    name: GAME_SCENES.TRAIN_SCENE,
    world: GAME_WORLDS.DREAM,
    phaserScene: trainScene,
  },
];

export function gameWorldConfig(
  world: GameWorlds,
  firstScene?: string,
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
