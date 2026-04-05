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
    this.cellScene.nextFlow = undefined;
    this.cellScene.selectableAreasController.setAllDisabled(true);
    this.cellScene.noiseEffect.resetNoiseArea();

    this.cellScene.flowController
      .run(IntroductionFlow)
      .then(({ nextState, ...flowResult }) => {
        this.cellScene.applyFlowResult(flowResult);
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
