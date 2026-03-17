import { runSteps, stepBase } from "@/libs/game/runSteps";
import { LessonActions } from "../LessonActions";
import { BaseState } from "@/libs/game/state-machine/BaseState";
import { events } from "@/events/events";

export class ListeningState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private lessonActions: LessonActions,
  ) {
    super(scene);
  }

  enter(): void {
    const step = this.lessonActions.getStepByType("listening");
    runSteps(
      [
        stepBase(() => {
          events.actors.josef.sync.emit("scared");
          return events.actors.eliza.async.emitAsync("sowing");
        }),
        stepBase(() => {
          return events.actors.pumpkinKid.async.emitAsync("plant-pumpkin");
        }),
        stepBase(() => {
          events.actors.josef.sync.emit("listening");
          return events.lesson.async.emitAsync("write-lesson-description", {
            description: step.text,
            skipPressContinue: true,
          });
        }),
      ],
      {},
    );
  }

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
