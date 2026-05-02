import { Flow } from "@/libs/game/game-flow/Flow";
import { SceneStateNames } from "../../constants/states";
import { DreamScene } from "../..";
import { FlowResult } from "@/libs/game/game-flow/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { events } from "@/events/events";
import { LessonListeningFlow } from "./LessonListening.flow";

const CLOSE_TITLE_AFTER = 2_000;

export class LessonIntroductionFlow extends Flow<SceneStateNames, DreamScene> {
  public flowName = "LessonIntroductionFlow";

  private step = this.gameScene.lessonController.getStepByType("introduction");

  async run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    await runSteps([
      stepBase(() => {
        return events.lesson.async.emitAsync("show-header");
      }),
      stepBase(() => {
        return events.lesson.async.emitAsync("show-lesson-title", {
          title: this.gameScene.lessonController.lesson.title,
          day: this.gameScene.lessonController.lesson.day,
          closeAfter: CLOSE_TITLE_AFTER,
        });
      }),
      stepBase(() => {
        return events.lesson.async.emitAsync("write-lesson-description", {
          description: this.step.text,
        });
      }),
      stepBase(() => {
        return this.waitInteractionEvent(() => {
          events.lesson.sync.emit("hide-lesson-description");
        });
      }),
    ]);

    return {
      nextState: DreamScene.STATES.PERFORMING_LESSON,
      nextFlow: LessonListeningFlow,
    };
  }

  destroy(): void {}
}
