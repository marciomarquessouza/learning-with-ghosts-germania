import { BaseState } from "@/libs/game/state-machine/BaseState";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { LearningNode } from "../../LearningNode";
import { SeedAnimations } from "../../animations/SeedAnimations";
import { events } from "@/events/events";

export class SproutingState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private learningNode: LearningNode,
  ) {
    super(scene);
  }

  enter(): void {
    runSteps(
      [
        stepBase(() => this.learningNode.seed.dropSeed()),
        stepBase(() => this.learningNode.floor.playOpen()),
        stepBase(() => {
          const sprite = this.learningNode.sprite;
          this.learningNode.floor.attachActor(sprite, {
            x: 80,
            y: -92,
          });
          return this.learningNode.animations.playSproutTransition();
        }),
      ],
      {},
    )
      .then(() => {
        events.actors.learningNode.sync.emit("sprouting:end");
        this.learningNode.animations.playSproutIdle();
      })
      .catch((error) => {
        this.stateMachine.log(error, "error");
      });
  }

  exit(): void {}

  handleInput(): void {}

  update(): void {}
}
