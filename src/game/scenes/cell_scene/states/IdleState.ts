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
    this.isWaitingForContinue = true;
  }

  update(): void {}

  handleInput(): void {
    if (!this.isWaitingForContinue) return;

    if (this.input?.justPressed("cancel")) {
      this.cellScene.flowController.run(this.cellScene.cancelFlow);
    }
  }

  exit(): void {
    console.log("Leaving IdleState");
    this.isWaitingForContinue = false;
    this.cellScene.selectableAreasController.setAllDisabled(true);
  }
}
