import { BaseState } from "@/libs/game/state-machine/BaseState";
import { CellScene } from "..";
import { SceneElementKeys } from "../constants/scene";

export class PerformingActionState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private cellScene: CellScene,
  ) {
    super(scene);
  }

  enter(): void {
    try {
      this.cellScene.selectableAreasController.setAllDisabled(true);

      const selectedElementKey = this.getSelectedElementKey();
      const elementBounds = this.cellScene.getElementBounds(selectedElementKey);
      const sceneElement = this.cellScene.sceneElements.get(selectedElementKey);

      if (!sceneElement) {
        throw new Error(`Scene element "${selectedElementKey}" was not found`);
      }

      this.cellScene.noiseEffect.setNoiseArea(elementBounds);

      sceneElement
        .action(this.scene, this.cellScene)
        .then((nextState) => {
          this.changeTo(nextState);
        })
        .catch((error) => {
          this.stateMachine.log(error, "error");
          this.changeTo(CellScene.STATES.IDLE);
        });
    } catch (error) {
      this.stateMachine.log(error, "error");
      this.changeTo(CellScene.STATES.IDLE);
    }
  }

  private getSelectedElementKey(): SceneElementKeys {
    const selectedElement = this.cellScene.selectedElement;
    if (!selectedElement) {
      throw new Error("THe element was not selected");
    }
    return selectedElement;
  }

  update(): void {}

  handleInput(): void {}

  exit(): void {
    this.cellScene.selectableAreasController.setAllDisabled(false);
    this.cellScene.noiseEffect.resetNoiseArea();
  }
}
