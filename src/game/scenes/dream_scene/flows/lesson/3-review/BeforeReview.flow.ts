import { Flow } from "@/libs/game/game-flow/Flow";
import { SceneStateNames } from "../../../constants/states";
import { DreamScene } from "../../..";
import { FlowResult } from "@/libs/game/game-flow/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { DREAM_SCENE_FLOWS } from "../../../constants/flows";
import { attachGuardian } from "../../../helpers/attachGuardian";
import { events } from "@/events/events";
import { getDialogueLines } from "@/store/dialogueStore";

export class BeforeReviewFlow extends Flow<SceneStateNames, DreamScene> {
  public flowName = DREAM_SCENE_FLOWS.BEFORE_REVIEW;

  async run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    await runSteps([
      stepBase(async () => {
        attachGuardian(this.gameScene);
        this.gameScene.player.lockInput();
        this.gameScene.player.enterListening();
        await this.gameScene.guardian.fadeIn();
        await this.gameScene.guardian.lean();
      }),
      stepBase(() => this.delay(600)),
      stepBase(() => {
        this.gameScene.guardian.enterSpeakingState();
        return events.game.async.emitAsync("dialogue/show", {
          lines: getDialogueLines("dream.review_intro"),
        });
      }),
      stepBase(() => this.delay(300)),
      stepBase(async () => {
        await this.gameScene.guardian.unlean();
        this.gameScene.guardian.enterIdleState();
      }),
    ]);

    return {
      nextState: DreamScene.STATES.PERFORMING_REVIEW,
    };
  }

  destroy(): void {}
}
