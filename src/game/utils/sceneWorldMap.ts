import { GAME_WORLDS } from "@/types";
import { SCENE_NAME as CELL_SCENE } from "@/game/scenes/cell_scene";
import { SCENE_NAME as DREAM_SCENE } from "@/game/scenes/ghost_dream_scene";
import { SCENE_NAME as TRAIN_SCENE } from "@/game/scenes/train_scene";

export const sceneWorldMap: Record<string, string> = {
  [CELL_SCENE]: GAME_WORLDS.REAL,
  [DREAM_SCENE]: GAME_WORLDS.DREAM,
  [TRAIN_SCENE]: GAME_WORLDS.DREAM,
};
