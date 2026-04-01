import { BaseState } from "@/libs/game/state-machine/BaseState";
import { CellScene } from "..";
import { IntroductionFlow } from "../flows/Introduction.flow";
import { PauseFlow } from "../flows/Pause.flow";

export class IntroState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private cellScene: CellScene,
  ) {
    super(scene);
  }

  enter(): void {
    this.cellScene.nextFlow = undefined;
    this.cellScene.selectableAreasController.setAllDisabled(true);
    this.cellScene.noiseEffect.resetNoiseArea();

    this.cellScene.flowController
      .run(IntroductionFlow)
      .then(({ nextState, nextFlow, cancelFlow }) => {
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
  }

  update(): void {}

  handleInput(): void {}

  exit(): void {}
}
