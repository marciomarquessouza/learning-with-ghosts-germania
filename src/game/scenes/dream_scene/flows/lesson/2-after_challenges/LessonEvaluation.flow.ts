import { Flow } from "@/libs/game/game-flow/Flow";
import { SceneStateNames } from "../../../constants/states";
import { DreamScene } from "../../..";
import { FlowResult } from "@/libs/game/game-flow/types";
import { DREAM_SCENE_FLOWS } from "../../../constants/flows";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { LessonSuccessFlow } from "./LessonSuccess.flow";
import { LessonFailureFlow } from "./LessonFailure.flow";

export class LessonEvaluationFlow extends Flow<SceneStateNames, DreamScene> {
  public flowName: string = DREAM_SCENE_FLOWS.LESSON_EVALUATION;

  private lessonEntry = this.gameScene.lessonManager.getCurrentLessonEntry();
  private target = this.gameScene.lessonManager.getEntryTarget();

  private hasWon(): boolean {
    const score = this.gameScene.lessonManager.getEntryScore();
    return (
      score > this.gameScene.lessonManager.getEntryMinimumSuccessPercentage()
    );
  }

  async run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    const hasLearningNode = this.gameScene.learningNode.floor.hasActorAttached;
    await runSteps([
      stepBase(
        async () => {
          this.gameScene.createLearningNode();
          // TODO: add Knowledge Troop
          this.gameScene.player.enterInclined();
          const sequence = this.lessonEntry.sequence + 1;
          await this.gameScene.learningNode.resumeSproutToPumpkin({
            sequence,
            target: this.target,
            offsetY: -100,
          });
          await this.gameScene.learningNode.increasePumpkinGrowth(1);
          return this.delay(800);
        },
        { when: () => !hasLearningNode },
      ),
      stepBase(() => {
        this.gameScene.lessonManager.writeLessonDescription({
          dialogueTitle: `"${this.target}" was created`,
          description: `Your score is...`,
        });
        return this.gameScene.tutor.dialogue([
          "Very well. Your little knowledge is ready.",
          "Let's see if it likes you.",
        ]);
      }),
    ]);

    return this.hasWon()
      ? {
          nextState: DreamScene.STATES.PERFORMING_LESSON,
          nextFlow: LessonSuccessFlow,
        }
      : {
          nextState: DreamScene.STATES.PERFORMING_LESSON,
          nextFlow: LessonFailureFlow,
        };
  }

  destroy(): void {}
}
