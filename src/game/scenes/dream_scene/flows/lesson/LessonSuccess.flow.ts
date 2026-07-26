import { Flow } from "@/libs/game/game-flow/Flow";
import { SceneStateNames } from "../../constants/states";
import { DreamScene } from "../..";
import { DREAM_SCENE_FLOWS } from "../../constants/flows";
import { FlowResult } from "@/libs/game/game-flow/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";

export class LessonSuccessFlow extends Flow<SceneStateNames, DreamScene> {
  public flowName: string = DREAM_SCENE_FLOWS.LESSON_SUCCESS;

  async run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    const hasLearningNode = this.gameScene.learningNode.floor.hasActorAttached;
    await runSteps([
      stepBase(
        async () => {
          this.gameScene.player.enterInclined();
          await this.gameScene.learningNode.resumeSproutToPumpkin();
          await this.gameScene.learningNode.increasePumpkinGrowth(0.25);
          await this.gameScene.learningNode.growPumpkinTo(1);
          return this.delay(800);
        },
        { when: () => !hasLearningNode },
      ),
      stepBase(() => {
        this.gameScene.player.enterInclined();
        return this.gameScene.learningNode.enterFullSuccess();
      }),
      stepBase(() => {
        this.delay(400, () => {
          this.gameScene.learningNode.floor.playClose();
        });
        return this.gameScene.learningNode.walkTo({ distance: 1_500 });
      }),
      stepBase(() => {
        this.gameScene.player.enterIdle();
        this.gameScene.learningNode.destroy();
      }),
    ]);

    return {};
  }

  destroy(): void {}
}
