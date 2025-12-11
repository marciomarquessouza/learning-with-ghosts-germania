import { SCENE_NAME as CELL_SCENE } from "@/game/scenes/cell_scene";
import { SCENE_NAME as DREAM_SCENE } from "@/game/scenes/ghost_dream_scene";
import { SCENE_NAME as TRAIN_SCENE } from "@/game/scenes/train_scene";

export function getSceneName(name: string) {
  switch (name) {
    case "cell":
    case "CellScene":
    case CELL_SCENE:
      return CELL_SCENE;
    case "dream":
    case "dreamScene":
    case "GhostDreamScene":
    case DREAM_SCENE:
      return DREAM_SCENE;
    case "train":
    case "trainScene":
    case TRAIN_SCENE:
      return TRAIN_SCENE;
    default:
      return CELL_SCENE;
  }
}
