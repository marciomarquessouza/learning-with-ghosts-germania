import { BaseState } from "@/libs/game/state-machine/BaseState";
import { CellScene } from "..";
import { PauseFlow } from "../flows/Pause.flow";
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
    try {
      this.cellScene.selectableAreasController.setAllDisabled(true);
      this.cellScene.noiseAnimations.resetNoiseArea();

      if (!this.cellScene.nextFlow) {
        throw new Error("Flow not found");
      }

      const flow = this.cellScene.nextFlow;
      this.cellScene.nextFlow = undefined;

      this.cellScene.flowController
        .run(flow)
        .then(({ nextFlow, nextState, cancelFlow }) => {
          this.cellScene.nextFlow = nextFlow;
          this.cellScene.cancelFlow = cancelFlow ?? PauseFlow;

          if (nextState) {
            this.changeTo(nextState);
          }
        })
        .catch((error) => {
          this.stateMachine.log(error, "error");
          this.changeTo(CellScene.STATES.IDLE);
        });
    } catch (error) {
      this.stateMachine.log(error, "error");
      this.cellScene.nextFlow = undefined;
      this.changeTo(CellScene.STATES.IDLE);
    }
  }

  update(): void {}

  handleInput(): void {
    if (this.input?.justPressed("interact")) {
      const currentFlow = this.cellScene.flowController.getCurrentFlow();
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
