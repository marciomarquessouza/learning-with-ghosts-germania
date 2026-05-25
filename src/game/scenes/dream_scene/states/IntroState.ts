import { BaseState } from "@/libs/game/state-machine/BaseState";
import { DreamScene } from "..";
import { IntroductionFlow } from "../flows/Introduction.flow";
import { DevelopmentFlow } from "../flows/development.flow";

export class IntroState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private dreamScene: DreamScene,
  ) {
    super(scene);
  }

  enter(): void {
    if (!this.dreamScene.flowController) {
      this.stateMachine.log("Scene flow was not created", "error");
      return;
    }

    this.dreamScene.flowController.clearNextFlow();

    this.dreamScene.flowController
      .run(IntroductionFlow)
      //.run(DevelopmentFlow)
      .then(({ nextState }) => {
        this.changeTo(nextState ?? DreamScene.STATES.IDLE);
      })
      .catch((error) => {
        this.stateMachine.log(error, "error");
        this.changeTo(DreamScene.STATES.IDLE);
      });
  }

  update(): void {}

  handleInput(): void {}

  exit(): void {}
}
