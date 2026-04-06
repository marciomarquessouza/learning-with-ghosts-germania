import { BaseState } from "@/libs/game/state-machine/BaseState";
import { CellScene } from "..";
import { PauseFlow } from "../flows/Pause.flow";

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
      this.cellScene.noiseEffect.resetNoiseArea();

      if (!this.cellScene.nextFlow) {
        throw new Error("Flow not found");
      }

      this.cellScene.flowController
        .run(this.cellScene.nextFlow)
        .then(({ nextFlow, nextState, cancelFlow }) => {
          this.cellScene.nextFlow = nextFlow;
          this.cellScene.cancelFlow = cancelFlow ?? PauseFlow;

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

  handleInput(): void {}

  exit(): void {
    this.cellScene.selectableAreasController.setAllDisabled(true);
    this.cellScene.noiseEffect.resetNoiseArea();
  }
}
