import { BaseState } from "@/libs/game/state-machine/BaseState";
import { runSteps, stepBase } from "@/libs/game/runSteps";
import { LearningNode } from "../LearningNode";
import { SeedAnimations } from "../animations/SeedAnimations";
import { events } from "@/events/events";

export class SproutingState extends BaseState {
  private removeEventsListeners: (() => void)[] = [];

  constructor(
    scene: Phaser.Scene,
    private learningNode: LearningNode,
  ) {
    super(scene);
  }

  enter(): void {
    if (!this.learningNode.references) {
      console.error("The references have not been initialized.");
      return;
    }

    const { groundPositionY, handPositionX, handPositionY } =
      this.learningNode.references;

    const seed = new SeedAnimations(this.scene, {
      x: handPositionX,
      startY: handPositionY,
      groundY: groundPositionY,
    });

    runSteps(
      [
        stepBase(() => seed.dropSeed()),
        stepBase(() => this.learningNode.animations.playSproutTransition()),
      ],
      {},
    )
      .then(() => {
        this.learningNode.eventController.closeAsyncEvent(
          "sprouting:transition",
        );
        this.learningNode.animations.playSproutIdle();

        this.removeEventsListeners.push(
          events.actors.learningNode.sync.on("sprouting:idle", () => {
            this.learningNode.animations.playSproutIdle();
          }),
        );

        this.removeEventsListeners.push(
          events.actors.learningNode.sync.on("sprouting:speaking", () => {
            this.learningNode.animations.playSproutSpeaking();
          }),
        );
      })
      .catch((error) => {
        this.stateMachine.log(error, "error");
      });
  }

  exit(): void {
    this.removeEventsListeners.forEach((removeEvent) => removeEvent());
    this.removeEventsListeners = [];
  }

  handleInput(): void {}

  update(): void {}
}
