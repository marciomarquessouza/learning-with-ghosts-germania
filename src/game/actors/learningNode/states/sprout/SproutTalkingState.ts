import { BaseState } from "@/libs/game/state-machine/BaseState";
import { LearningNode } from "../../LearningNode";

export class SproutTalkingState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private learningNode: LearningNode,
  ) {
    super(scene);
  }

  enter(): void {
    this.learningNode.animations.playSproutTalking();
    this.learningNode.audioPlayButton.play();
  }

  exit(): void {
    this.learningNode.audioPlayButton.stop();
  }

  handleInput(): void {}

  update(): void {}
}
