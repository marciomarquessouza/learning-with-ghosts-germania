import { Flow } from "@/libs/game/game-flow/Flow";
import { SceneStateNames } from "../../../constants/states";
import { DreamScene } from "../../..";
import { FlowResult } from "@/libs/game/game-flow/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { DREAM_SCENE_FLOWS } from "../../../constants/flows";
import { attachGuardian } from "../../../helpers/attachGuardian";

export class BeforeReviewFlow extends Flow<SceneStateNames, DreamScene> {
  public flowName = DREAM_SCENE_FLOWS.BEFORE_REVIEW;

  async run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    await runSteps([
      stepBase(async () => {
        attachGuardian(this.gameScene);
        await this.gameScene.guardian.fadeIn();
        await this.gameScene.guardian.lean();
      }),
    ]);

    return {
      nextState: DreamScene.STATES.PERFORMING_REVIEW,
    };
  }

  destroy(): void {}
}
