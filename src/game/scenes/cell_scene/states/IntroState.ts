import { BaseState } from "@/libs/game/state-machine/BaseState";
import { CellScene } from "..";
import { IntroductionFlow } from "../flows/Introduction.flow";

export class IntroState extends BaseState {
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

    this.cellScene.flowController.clearNextFlow();
    this.cellScene.selectableAreasController.setAllDisabled(true);
    this.cellScene.noiseAnimations.resetNoiseArea();

    this.cellScene.flowController
      .run(IntroductionFlow)
      .then(({ nextState }) => {
        this.changeTo(nextState ?? CellScene.STATES.IDLE);
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
