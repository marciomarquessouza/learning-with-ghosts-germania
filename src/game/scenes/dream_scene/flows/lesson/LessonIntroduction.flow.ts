import { Flow } from "@/libs/game/game-flow/Flow";
import { SceneStateNames } from "../../constants/states";
import { DreamScene } from "../..";
import { FlowResult } from "@/libs/game/game-flow/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { LessonListeningFlow } from "./LessonListening.flow";
import { getDialogueLines } from "@/store/dialogueStore";
import { DREAM_SCENE_FLOWS } from "../../constants/flows";

export class LessonIntroductionFlow extends Flow<SceneStateNames, DreamScene> {
  public flowName = DREAM_SCENE_FLOWS.LESSON_INTRODUCTION;

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
        const lines = getDialogueLines("dream.lesson_begin");
        return this.gameScene.dialogueManager.LessonDialogueFromLines(lines);
      }),
    ]);

    return {
      nextState: DreamScene.STATES.PERFORMING_LESSON,
      nextFlow: LessonListeningFlow,
    };
  }

  destroy(): void {}
}
