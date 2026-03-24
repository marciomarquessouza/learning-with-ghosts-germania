import { BaseState } from "@/libs/game/state-machine/BaseState";
import { CellScene } from "..";

export class IdleState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private cellScene: CellScene,
  ) {
    super(scene);
  }

  enter(): void {
    this.cellScene.selectableAreasController.destroyAll();
    this.cellScene.noiseEffect.resetNoiseArea();
    this.cellScene.createElementsSelectableArea();
  }

  update(): void {}

  handleInput(): void {}

  exit(): void {
    this.cellScene.selectableAreasController.setAllDisabled(true);
  }
}
