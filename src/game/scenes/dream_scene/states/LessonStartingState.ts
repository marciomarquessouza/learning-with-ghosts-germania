import { BaseState } from "@/libs/game/state-machine/BaseState";
import { events } from "@/events/events";
import { runSteps, stepBase } from "@/libs/game/runSteps";
import { DreamScene } from "..";

const CLOSE_TITLE_AFTER = 2_000;

export class LessonStartingState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private dreamScene: DreamScene,
  ) {
    super(scene);
  }

  enter(): void {
    runSteps(
      [
        stepBase(() => {
          this.dreamScene.lessonController.setCurrentLessonEntry();
          events.actors.tutor.sync.emit("idle");
          events.actors.player.sync.emit("listening");
          // TODO: Punisher: state: idle
          // TODO: LearningNode Kid: state: destroyed
          return events.lesson.async.emitAsync("show-header");
        }),
        stepBase(() =>
          events.lesson.async.emitAsync("show-lesson-title", {
            title: this.dreamScene.lessonController.lesson.title,
            day: this.dreamScene.lessonController.lesson.day,
            closeAfter: CLOSE_TITLE_AFTER,
          }),
        ),
      ],
      {},
    )
      .then(() => {
        this.changeTo(DreamScene.STATES.LESSON_INTRO);
      })
      .catch((error) => {
        this.stateMachine.log(`LessonStartState failed ${error}`, "error");
      });
  }

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
