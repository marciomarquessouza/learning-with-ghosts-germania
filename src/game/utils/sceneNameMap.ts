import { GAME_SCENES } from "@/constants/game";
import { GameScenes } from "@/types";

export function getSceneName(name: string): GameScenes {
  switch (name) {
    case "cell":
    case "CellScene":
    case GAME_SCENES.CELL_SCENE:
      return GAME_SCENES.CELL_SCENE;
    case "dream":
    case "dreamScene":
    case "GhostDreamScene":
    case GAME_SCENES.DREAM_SCENE:
      return GAME_SCENES.DREAM_SCENE;
    case "train":
    case "trainScene":
    case GAME_SCENES.TRAIN_SCENE:
      return GAME_SCENES.TRAIN_SCENE;
    default:
      return GAME_SCENES.CELL_SCENE;
  }
}
