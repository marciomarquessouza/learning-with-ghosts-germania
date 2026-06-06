import { Flow } from "@/libs/game/game-flow/Flow";
import { SceneStateNames } from "../../constants/states";
import { DreamScene } from "../..";
import { FlowResult } from "@/libs/game/game-flow/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { LessonListeningFlow } from "./LessonListening.flow";

export class LessonIntroductionFlow extends Flow<SceneStateNames, DreamScene> {
  public flowName = "LessonIntroductionFlow";

  private step = this.gameScene.lessonManager.getStepByType("introduction");

  async run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    await runSteps([
      stepBase(() => {
        this.gameScene.tutor.enterTeaching();
        return this.gameScene.lessonManager.writeLessonDescription({
          dialogueTitle: "Introduction",
          description: `Follow the Masked Nun instructions`,
          hidePressContinue: true,
        });
      }),
      stepBase(() => {
        return this.gameScene.dialogueManager.showDialogue(
          "dream.lesson_begin",
        );
      }),
    ]);

    return {
      nextState: DreamScene.STATES.PERFORMING_LESSON,
      nextFlow: LessonListeningFlow,
    };
  }

  destroy(): void {}
}
