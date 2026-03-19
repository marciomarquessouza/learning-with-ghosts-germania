import { runSteps, stepBase } from "@/libs/game/runSteps";
import { LessonController } from "../LessonController";
import { BaseState } from "@/libs/game/state-machine/BaseState";
import { events } from "@/events/events";

export class ListeningState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private lessonController: LessonController,
  ) {
    super(scene);
  }

  enter(): void {
    const step = this.lessonController.getStepByType("listening");
    runSteps(
      [
        stepBase(() => {
          events.actors.player.sync.emit("scared");
          return events.actors.tutor.async.emitAsync("sowing");
        }),
        stepBase(() => {
          return events.actors.learningNode.async.emitAsync("plant");
        }),
        stepBase(() => {
          events.actors.player.sync.emit("listening");
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
