import { events } from "@/events/events";
import { LessonActions } from "../../LessonActions";
import { runSteps, stepBase } from "@/libs/game/runSteps";
import { BaseState } from "@/libs/game/state-machine/BaseState";
import { LESSON_STATES } from "../lessonStates";

export class EntryIntroductionState extends BaseState {
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
        // TODO: State: Eliza teaching
        stepBase(() => events.actors.eliza.async.emitAsync("sowing")),
        stepBase(() =>
          events.actors.pumpkinKid.async.emitAsync("plant-pumpkin"),
        ),
      ],
      {},
    )
      .then(() => {
        this.changeTo(LESSON_STATES.LISTENING);
      })
      .catch((error) => {
        this.stateMachine.log(error, "error");
      });
  }

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
