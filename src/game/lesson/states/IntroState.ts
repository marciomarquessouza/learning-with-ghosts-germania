import { events } from "@/events/events";
import { LessonController } from "../LessonController";
import { runSteps, stepBase } from "@/libs/game/runSteps";
import { BaseState } from "@/libs/game/state-machine/BaseState";
import { createKeyMap, KEY_CODES, KeyMap } from "@/utils/createKeyMap";

export class IntroState extends BaseState {
  private isWaitingForContinue = false;
  private keyMap: KeyMap;

  constructor(
    scene: Phaser.Scene,
    private lessonController: LessonController,
  ) {
    super(scene);
    this.keyMap = createKeyMap(scene, [KEY_CODES.SPACE, KEY_CODES.ENTER]);
  }

  enter(): void {
    const step = this.lessonController.getStepByType("introduction");
    runSteps(
      [
        stepBase(() => {
          events.actors.tutor.sync.emit("teaching");
          events.actors.player.sync.emit("listening");
          return events.lesson.async.emitAsync("write-lesson-description", {
            description: step.text,
          });
        }),
      ],
      {},
    )
      .then(() => {
        this.isWaitingForContinue = true;
      })
      .catch((error) => {
        this.stateMachine.log(error, "error");
      });
  }

  handleInput(): void {
    if (
      !this.isWaitingForContinue ||
      !this.keyMap?.SPACE ||
      !this.keyMap?.ENTER
    ) {
      return;
    }

    if (
      this.isWaitingForContinue &&
      (Phaser.Input.Keyboard.JustDown(this.keyMap.SPACE) ||
        Phaser.Input.Keyboard.JustDown(this.keyMap.ENTER))
    ) {
      this.isWaitingForContinue = false;
      events.lesson.sync.emit("hide-lesson-description");
      this.changeTo(LessonController.STATES.LISTENING);
    }
  }

  exit(): void {
    this.isWaitingForContinue = false;
  }

  update(): void {}
}
