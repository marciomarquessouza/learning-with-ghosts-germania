import { Flow } from "@/libs/game/game-flow/Flow";
import { SceneStateNames } from "../../constants/states";
import { DreamScene } from "../..";
import { FlowResult } from "@/libs/game/game-flow/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";

export class LessonWritingFlow extends Flow<SceneStateNames, DreamScene> {
  public flowName: string = "LessonWritingFlow";

  private step = this.gameScene.lessonManager.getStepByType("writing");

  async run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    const hasLearningNode = this.gameScene.learningNode.floor.hasActorAttached;
    await runSteps([
      stepBase(
        async () => {
          this.gameScene.player.enterInclined();
          await this.gameScene.learningNode.resumeSproutToPumpkin();
          return this.gameScene.learningNode.increasePumpkinGrowth(0.25);
        },
        { when: () => !hasLearningNode },
      ),
      stepBase(() => {
        this.gameScene.player.enterListening();
        this.gameScene.learningNode.enterPumpkinIdleState();
        return this.gameScene.lessonManager.writeLessonDescription({
          dialogueTitle: "Step 3: Writing",
          description: `Follow the Masked Nun instructions`,
          hidePressContinue: true,
        });
      }),
    ]);

    return {};
  }
  destroy(): void {}
}
