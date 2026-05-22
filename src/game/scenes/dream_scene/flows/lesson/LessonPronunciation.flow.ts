import { Flow } from "@/libs/game/game-flow/Flow";
import { SceneStateNames } from "../../constants/states";
import { DreamScene } from "../..";
import { FlowResult } from "@/libs/game/game-flow/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";

export class LessonPronunciation extends Flow<SceneStateNames, DreamScene> {
  public flowName = "LessonPronunciation";

  private step = this.gameScene.lessonManager.getStepByType("pronunciation");

  async run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    await runSteps([
      stepBase(() => {
        this.gameScene.learningNode.enterPumpkinTransitionState();
      }),
      stepBase(async () => {
        return this.gameScene.lessonManager.writeLessonDescription({
          description: this.step.instruction,
        });
      }),
    ]);

    return {};
  }

  destroy(): void {}
}
