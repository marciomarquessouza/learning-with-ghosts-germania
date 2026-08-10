import { Flow } from "@/libs/game/game-flow/Flow";
import { SceneStateNames } from "../../../constants/states";
import { DreamScene } from "../../..";
import { FlowResult } from "@/libs/game/game-flow/types";
import { DREAM_SCENE_FLOWS } from "../../../constants/flows";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";

export class LessonFailureFlow extends Flow<SceneStateNames, DreamScene> {
  flowName: string = DREAM_SCENE_FLOWS.LESSON_FAILURE;

  private lessonEntry = this.gameScene.lessonManager.getCurrentLessonEntry();
  private target = this.gameScene.lessonManager.getEntryTarget();

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
        return this.gameScene.scenario.setDanger();
      }),
    ]);

    return {};
  }
  destroy(): void {}
}
