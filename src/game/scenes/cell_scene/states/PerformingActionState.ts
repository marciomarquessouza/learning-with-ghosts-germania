import { BaseState } from "@/libs/game/state-machine/BaseState";
import { CellScene } from "..";
import { InputController } from "@/libs/inputs/InputController";
import { createInputController } from "@/libs/inputs/createInputController";
import { events } from "@/events/events";

export class PerformingActionState extends BaseState {
  private input?: InputController;

  constructor(
    scene: Phaser.Scene,
    private cellScene: CellScene,
  ) {
    super(scene);
    this.input = createInputController(this.scene);
  }

  enter(): void {
    events.game.sync.emit("game-action-prompt/hide");
    events.game.sync.emit("dialogue/hide");

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

      this.cellScene.flowController.run(flow).then(({ nextState }) => {
        if (nextState) {
          this.changeTo(nextState);
        }
      });
    } catch (error) {
      this.stateMachine.log(error, "error");
      this.cellScene.flowController.clearNextFlow();
      this.changeTo(CellScene.STATES.IDLE);
    }
  }

  update(): void {}

  handleInput(): void {
    if (this.input?.justPressed("interact")) {
      const currentFlow = this.cellScene.flowController?.getCurrentFlow();
      if (currentFlow) {
        events.interactions.sync.emit("interaction/accept", {
          id: currentFlow.flowName,
        });
      }
    }
  }

  exit(): void {
    this.cellScene.selectableAreasController.setAllDisabled(true);
    this.cellScene.noiseAnimations.resetNoiseArea();
  }
}
