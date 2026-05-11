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
    this.learningNode.animations.playHeadTransition().then(() => {
      // this.changeTo(LearningNode.STATES.PUMPKIN_IDLE);
    });
  }

  exit(): void {}

  handleInput(): void {}

  update(): void {}
}
