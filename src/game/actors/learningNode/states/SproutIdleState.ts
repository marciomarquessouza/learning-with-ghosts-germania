import { BaseState } from "@/libs/game/state-machine/BaseState";
import { LearningNode } from "../LearningNode";

export class SproutIdleState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private learningNode: LearningNode,
  ) {
    super(scene);
  }
  enter(): void {
    this.learningNode.animations.playSproutIdle();
  }

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
