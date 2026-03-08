import { BaseState } from "@/libs/game/state-machine/BaseState";
import { LessonActions } from "../../LessonActions";
import { events } from "@/events/events";
import { LESSON_STATES } from "../lessonStates";
import { runSteps, stepBase } from "@/libs/game/runSteps";

const CLOSE_TITLE_AFTER = 2_000;

export class LessonStartState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private lessonActions: LessonActions,
  ) {
    super(scene);
  }

  enter(): void {
    runSteps(
      [
        stepBase(() => {
          this.lessonActions.setCurrentLessonEntry();
          events.actors.eliza.sync.emit("idle");
          // TODO: Josef: state: idle
          // TODO: Krampus: state: idle
          // TODO: Pumpkin Kid: state: destroyed
          return events.lesson.async.emitAsync("show-header");
        }),
        stepBase(() =>
          events.lesson.async.emitAsync("show-lesson-title", {
            title: this.lessonActions.lesson.title,
            day: this.lessonActions.lesson.day,
            closeAfter: CLOSE_TITLE_AFTER,
          }),
        ),
      ],
      {},
    )
      .then(() => {
        this.changeTo(LESSON_STATES.ENTRY_INTRODUCTION);
      })
      .catch((error) => {
        this.stateMachine.log(`LessonStartState failed ${error}`, "error");
      });
  }

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
