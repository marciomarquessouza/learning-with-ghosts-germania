import { Flow } from "@/libs/game/game-flow/Flow";
import { SceneStateNames } from "../../constants/states";
import { DreamScene } from "../..";
import { DREAM_SCENE_FLOWS } from "../../constants/flows";
import { FlowResult } from "@/libs/game/game-flow/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { LessonNextEntryFlow } from "./LessonNextEntry.flow";

export class LessonSuccessFlow extends Flow<SceneStateNames, DreamScene> {
  public flowName: string = DREAM_SCENE_FLOWS.LESSON_SUCCESS;
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
        if (hasLearningNode) {
          this.gameScene.player.enterInclined();
        }
        return this.gameScene.learningNode.enterFullSuccess();
      }),
      stepBase(() => {
        this.delay(400, () => {
          this.gameScene.learningNode.floor.playClose();
        });
        const entrySequence = this.lessonEntry.sequence;
        const learningNodePosition = 360 + 120 * entrySequence;
        return this.gameScene.learningNode.walkTo({
          distance: learningNodePosition,
        });
      }),
      stepBase(() => {
        this.gameScene.player.enterIdle();
      }),
    ]);

    if (this.gameScene.lessonManager.callNextEntry()) {
      return {
        nextState: DreamScene.STATES.PERFORMING_LESSON,
        nextFlow: LessonNextEntryFlow,
      };
    }

    return {};
  }

  destroy(): void {}
}
