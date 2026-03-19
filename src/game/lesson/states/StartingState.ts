import { BaseState } from "@/libs/game/state-machine/BaseState";
import { LessonController } from "../LessonController";
import { events } from "@/events/events";
import { runSteps, stepBase } from "@/libs/game/runSteps";

const CLOSE_TITLE_AFTER = 2_000;

export class StartingState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private lessonController: LessonController,
  ) {
    super(scene);
  }

  enter(): void {
    runSteps(
      [
        stepBase(() => {
          this.lessonController.setCurrentLessonEntry();
          events.actors.tutor.sync.emit("idle");
          events.actors.player.sync.emit("listening");
          // TODO: Punisher: state: idle
          // TODO: LearningNode Kid: state: destroyed
          return events.lesson.async.emitAsync("show-header");
        }),
        stepBase(() =>
          events.lesson.async.emitAsync("show-lesson-title", {
            title: this.lessonController.lesson.title,
            day: this.lessonController.lesson.day,
            closeAfter: CLOSE_TITLE_AFTER,
          }),
        ),
      ],
      {},
    )
      .then(() => {
        this.changeTo(LessonController.STATES.INTRO);
      })
      .catch((error) => {
        this.stateMachine.log(`LessonStartState failed ${error}`, "error");
      });
  }

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
