import { events } from "@/events/events";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { BaseState } from "@/libs/game/state-machine/BaseState";
import { DreamScene } from "..";
import { InputController } from "@/libs/inputs/InputController";
import { createInputController } from "@/libs/inputs/createInputController";

export class LessonIntroState extends BaseState {
  private isWaitingForContinue = false;
  private input?: InputController;

  constructor(
    scene: Phaser.Scene,
    private dreamScene: DreamScene,
  ) {
    super(scene);
    this.input = createInputController(this.scene);
  }

  enter(): void {
    const step = this.dreamScene.lessonController.getStepByType("introduction");
    runSteps(
      [
        stepBase(() => {
          this.dreamScene.tutor.enterTeaching();
          this.dreamScene.player.enterListening();
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
    if (!this.isWaitingForContinue) return;

    if (this.input?.justPressed("interact")) {
      this.isWaitingForContinue = false;
      events.lesson.sync.emit("hide-lesson-description");
      this.changeTo(DreamScene.STATES.LISTENING);
    }
  }

  exit(): void {
    this.isWaitingForContinue = false;
  }

  update(): void {}
}
