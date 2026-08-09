import { Flow } from "@/libs/game/game-flow/Flow";
import { SceneStateNames } from "../../../constants/states";
import { DreamScene } from "../../..";
import { DREAM_SCENE_FLOWS } from "../../../constants/flows";
import { FlowResult } from "@/libs/game/game-flow/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { LessonListeningFlow } from "../1-challenges/LessonListening.flow";

export class LessonNextEntryFlow extends Flow<SceneStateNames, DreamScene> {
  public flowName = DREAM_SCENE_FLOWS.LESSON_NEXT_ENTRY;
  private lessonEntry = this.gameScene.lessonManager.getCurrentLessonEntry();
  private target = this.gameScene.lessonManager.getEntryTarget();

  async run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    await runSteps([
      stepBase(() => {
        this.gameScene.tutor.enterTeaching();
        return this.gameScene.lessonManager.writeLessonDescription({
          dialogueTitle: `${this.lessonEntry.sequence + 1} - ${this.target}`,
          description: `Follow the Masked Nun instructions`,
        });
      }),
      stepBase(() => {
        return this.gameScene.tutor.dialogue([
          "Very well, now let's move on to your next piece of knowledge",
          `Now let's study ${this.target}`,
        ]);
      }),
    ]);

    return {
      nextState: DreamScene.STATES.PERFORMING_LESSON,
      nextFlow: LessonListeningFlow,
    };
  }

  destroy(): void {}
}
