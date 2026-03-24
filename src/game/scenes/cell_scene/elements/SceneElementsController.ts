import { SceneElementKeys } from "../constants/scene";
import { Bed } from "./Bed";
import { Desk } from "./Desk";
import { Food } from "./Food";
import { Rat } from "./Rat";
import { SceneElement } from "./SceneElement";

export class SceneElementsController {
  private sceneElements: Record<SceneElementKeys, SceneElement>;

  constructor() {
    this.sceneElements = {
      bed: new Bed(),
      desk: new Desk(),
      food: new Food(),
      rat: new Rat(),
    };
  }

  get(key: SceneElementKeys): SceneElement {
    return this.sceneElements[key];
  }
}
