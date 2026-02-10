import { GAME_WORLDS, sceneWorldMap } from "@/constants/game";
import { GameScenes } from "@/types";

export function getWorldsFlags(scene: Phaser.Scene) {
  const world = sceneWorldMap[scene.scene.key as GameScenes];
  const isRealWorld = world === GAME_WORLDS.REAL;
  return {
    isRealWorld,
    isDreamWorld: !isRealWorld,
  };
}
