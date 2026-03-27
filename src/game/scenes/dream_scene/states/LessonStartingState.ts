import { BaseState } from "@/libs/game/state-machine/BaseState";
import { events } from "@/events/events";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { DreamScene } from "..";
import { getDialogueLines } from "@/store/dialogueStore";

const CLOSE_TITLE_AFTER = 2_000;

export class LessonStartingState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private dreamScene: DreamScene,
  ) {
    super(scene);
  }

  enter(): void {
    const lessonPreparationDialogue = getDialogueLines(
      "dream.lesson_preparation",
    );

    runSteps([
      stepBase(() =>
        events.game.async.emitAsync("dialogue/show", {
          lines: lessonPreparationDialogue,
        }),
      ),
      stepBase(() => {
        this.dreamScene.player.enterListening();
        this.dreamScene.tutor.enterIdle();
        return events.lesson.async.emitAsync("show-header");
      }),
      stepBase(() =>
        events.lesson.async.emitAsync("show-lesson-title", {
          title: this.dreamScene.lessonController.lesson.title,
          day: this.dreamScene.lessonController.lesson.day,
          closeAfter: CLOSE_TITLE_AFTER,
        }),
      ),
    ])
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
