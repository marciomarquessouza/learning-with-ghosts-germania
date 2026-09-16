import { Flow } from "@/libs/game/game-flow/Flow";
import { SceneStateNames } from "../../../constants/states";
import { DreamScene } from "../../..";
import { FlowResult } from "@/libs/game/game-flow/types";
import { DREAM_SCENE_FLOWS } from "../../../constants/flows";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";

export class ReviewInitFlow extends Flow<SceneStateNames, DreamScene> {
  public flowName: string = DREAM_SCENE_FLOWS.REVIEW_INIT;

  async run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    await runSteps([
      stepBase(() => {
        const playerGlobalPositionX =
          this.gameScene.player.getWorldPosition().x;
        const guardianGlobalPositionX =
          this.gameScene.guardian.getWorldPosition().x;
        return this.gameScene.knowledgeTroop.moveToMemoryGuardian({
          playerGlobalPositionX,
          guardianGlobalPositionX,
        });
      }),
    ]);

    return {
      nextState: DreamScene.STATES.PERFORMING_REVIEW,
    };
  }

  destroy(): void {}
}
