import { Flow } from "@/libs/game/game-flow/Flow";
import { SceneStateNames } from "../../../constants/states";
import { DreamScene } from "../../..";
import { FlowResult } from "@/libs/game/game-flow/types";
import { DREAM_SCENE_FLOWS } from "../../../constants/flows";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";

export class PostLessonFlow extends Flow<SceneStateNames, DreamScene> {
  public flowName: string = DREAM_SCENE_FLOWS.POST_LESSON;

  async run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    await runSteps([
      stepBase(() => {
        this.gameScene.player.enterIdle();
      }),
    ]);

    return {};
  }

  destroy(): void {}
}
