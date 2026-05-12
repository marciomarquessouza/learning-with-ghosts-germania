import { BaseState } from "@/libs/game/state-machine/BaseState";
import { LearningNode } from "../../LearningNode";

export class PumpkinTransition extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private learningNode: LearningNode,
  ) {
    super(scene);
  }

  enter(): void {
    this.learningNode.animations.playPumpkinTransition().then(() => {
      this.learningNode.preparePumpkinGrowth();
      this.learningNode.enterPumpkinIdleState();
    });
  }

  exit(): void {}

  handleInput(): void {}

  update(): void {}
}
