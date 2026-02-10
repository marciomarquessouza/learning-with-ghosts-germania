import { GAME_SCENES, GAME_WORLDS } from "@/constants/game";

export const sceneWorldMap: Record<string, string> = {
  [GAME_SCENES.CELL_SCENE]: GAME_WORLDS.REAL,
  [GAME_SCENES.DREAM_SCENE]: GAME_WORLDS.DREAM,
  [GAME_SCENES.TRAIN_SCENE]: GAME_WORLDS.DREAM,
};
