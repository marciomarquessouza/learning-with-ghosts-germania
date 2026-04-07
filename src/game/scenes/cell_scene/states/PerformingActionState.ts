import { BaseState } from "@/libs/game/state-machine/BaseState";
import { CellScene } from "..";
import { PauseFlow } from "../flows/Pause.flow";
import { InputController } from "@/libs/inputs/InputController";
import { createInputController } from "@/libs/inputs/createInputController";
import { events } from "@/events/events";
import { SceneStateNames } from "../constants/states";

export class PerformingActionState extends BaseState {
  private nextStateAfterInteract?: SceneStateNames;
  private inputLocked = true;
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
      this.cellScene.noiseEffect.resetNoiseArea();

      if (!this.cellScene.nextFlow) {
        throw new Error("Flow not found");
      }

      const flow = this.cellScene.nextFlow;
      this.cellScene.nextFlow = undefined;

      this.cellScene.flowController
        .run(flow)
        .then(({ nextFlow, nextState, cancelFlow, waitInputToContinue }) => {
          this.cellScene.nextFlow = nextFlow;
          this.cellScene.cancelFlow = cancelFlow ?? PauseFlow;

          if (waitInputToContinue) {
            this.nextStateAfterInteract = nextState;
            this.inputLocked = false;
            return;
          }

          this.changeTo(nextState ?? CellScene.STATES.IDLE);
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
    if (this.inputLocked) return;

    if (this.input?.justPressed("interact")) {
      this.changeTo(this.nextStateAfterInteract ?? CellScene.STATES.IDLE);
    }
  }

  exit(): void {
    this.inputLocked = true;
    this.nextStateAfterInteract = undefined;
    this.cellScene.selectableAreasController.setAllDisabled(true);
    this.cellScene.noiseEffect.resetNoiseArea();
    events.game.sync.emit("close-all-ui-interactions");
  }
}
