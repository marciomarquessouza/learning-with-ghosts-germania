import { events } from "@/events/events";
import { LessonActions } from "../../LessonActions";
import { runSteps, stepBase } from "@/libs/game/runSteps";
import { BaseState } from "@/libs/game/state-machine/BaseState";

export class LessonIntroductionState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private lessonActions: LessonActions,
  ) {
    super(scene);
  }

  enter(): void {
    const introductionStep = this.lessonActions.getStepByType("introduction");
    runSteps(
      [
        stepBase(() =>
          events.lesson.async.emitAsync("write-lesson-description", {
            description: introductionStep.text,
          }),
        ),
        stepBase(() => events.actors.eliza.async.emitAsync("sowing")),
      ],
      {},
    );
  }

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
