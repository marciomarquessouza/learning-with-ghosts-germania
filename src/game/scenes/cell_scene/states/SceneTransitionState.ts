import { BaseState } from "@/libs/game/state-machine/BaseState";
import { CellScene } from "..";

export class SceneTransitionState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private cellScene: CellScene,
  ) {
    super(scene);
  }

  enter(): void {
    if (!this.cellScene.flowController) {
      this.stateMachine.log("Scene flow was not created", "error");
      return;
    }

    try {
      this.cellScene.selectableAreasController.setAllDisabled(true);
      this.cellScene.noiseAnimations.resetNoiseArea();
      const flow = this.cellScene.flowController.getNextFlow();

      if (!flow) {
        throw new Error("Flow not found");
      }

      this.cellScene.flowController.clearNextFlow();

      this.cellScene.flowController.run(flow);
    } catch (error) {
      this.stateMachine.log(error, "error");
      this.cellScene.flowController.clearNextFlow();
      this.changeTo(CellScene.STATES.IDLE);
    }
  }

  update(): void {}

  handleInput(): void {}

  exit(): void {
    this.cellScene.selectableAreasController.setAllDisabled(true);
    this.cellScene.noiseAnimations.resetNoiseArea();
  }
}
