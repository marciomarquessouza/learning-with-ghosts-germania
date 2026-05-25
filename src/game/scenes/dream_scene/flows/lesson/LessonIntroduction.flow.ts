import { Flow } from "@/libs/game/game-flow/Flow";
import { SceneStateNames } from "../../constants/states";
import { DreamScene } from "../..";
import { FlowResult } from "@/libs/game/game-flow/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { LessonListeningFlow } from "./LessonListening.flow";

const CLOSE_TITLE_AFTER = 2_500;

export class LessonIntroductionFlow extends Flow<SceneStateNames, DreamScene> {
  public flowName = "LessonIntroductionFlow";

  private step = this.gameScene.lessonManager.getStepByType("introduction");

  async run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    await runSteps([
      stepBase(() => {
        return this.gameScene.lessonManager.showLessonTitle({
          title: this.gameScene.lessonManager.lesson.title,
          day: this.gameScene.lessonManager.lesson.day,
          closeAfter: CLOSE_TITLE_AFTER,
        });
      }),
      stepBase(() => {
        this.gameScene.tutor.enterTeaching();
        return this.gameScene.dialogueManager.showDialogue(
          "dream.lesson_begin",
        );
      }),
      stepBase(() => {
        this.gameScene.tutor.enterIdle();
        return this.gameScene.lessonManager.writeLessonDescription({
          dialogueTitle: "Introduction",
          description: `Follow the Masked Nun instructions`,
          skipPressContinue: false,
        });
      }),
      stepBase(() => {
        return this.waitInteractionEvent();
      }),
    ]);

    return {
      nextState: DreamScene.STATES.PERFORMING_LESSON,
      nextFlow: LessonListeningFlow,
    };
  }

  destroy(): void {}
}
