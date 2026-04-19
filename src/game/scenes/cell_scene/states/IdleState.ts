import { BaseState } from "@/libs/game/state-machine/BaseState";
import { CellScene } from "..";
import { InputController } from "@/libs/inputs/InputController";
import { createInputController } from "@/libs/inputs/createInputController";

export class IdleState extends BaseState {
  private input?: InputController;
  private isWaitingForContinue = false;

  constructor(
    scene: Phaser.Scene,
    private cellScene: CellScene,
  ) {
    super(scene);
    this.input = createInputController(this.scene);
  }

  enter(): void {
    if (!this.cellScene.flowController) {
      this.stateMachine.log("Scene flow was not created", "error");
      return;
    }

    if (this.cellScene.flowController.hasQueuedFlows()) {
      const queuedFlowPromise = this.cellScene.flowController.runQueuedFlow();
      if (queuedFlowPromise) {
        queuedFlowPromise
          .then(({ nextState }) => {
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

    this.cellScene.flowController.clearNextFlow();
    this.cellScene.selectableAreasController.destroyAll();
    this.cellScene.noiseAnimations.resetNoiseArea();
    this.cellScene.createElementsSelectableArea();
    this.isWaitingForContinue = true;
  }

  update(): void {}

  handleInput(): void {
    if (!this.isWaitingForContinue) return;

    if (this.input?.justPressed("cancel")) {
      this.cellScene.flowController?.runCancelFlow();
    }
  }

  exit(): void {
    this.isWaitingForContinue = false;
    this.cellScene.selectableAreasController.setAllDisabled(true);
  }
}
