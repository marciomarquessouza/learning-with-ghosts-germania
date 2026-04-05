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
    if (this.cellScene.hasQueuedFlows()) {
      const queuedFlowPromise = this.cellScene.runQueuedFlow();
      if (queuedFlowPromise) {
        queuedFlowPromise
          .then(({ nextState, ...flowResult }) => {
            this.cellScene.applyFlowResult(flowResult);
            this.changeTo(nextState ?? CellScene.STATES.IDLE);
            return;
          })
          .catch((error) => {
            this.stateMachine.log(error, "error");
            this.changeTo(CellScene.STATES.IDLE);
          });
      }
      return;
    }

    this.cellScene.nextFlow = undefined;
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
