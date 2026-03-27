import { CellScene } from "..";
import { SceneStateNames } from "../constants/states";

export abstract class SceneElement {
  abstract action(
    scene: Phaser.Scene,
    cellScene: CellScene,
  ): Promise<SceneStateNames>;
}
