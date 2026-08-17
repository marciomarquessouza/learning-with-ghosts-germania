import { Flow } from "@/libs/game/game-flow/Flow";
import { SceneStateNames } from "../../../constants/states";
import { DreamScene } from "../../..";
import { FlowResult } from "@/libs/game/game-flow/types";
import { DREAM_SCENE_FLOWS } from "../../../constants/flows";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { events } from "@/events/events";
import { getDialogueLines } from "@/store/dialogueStore";

export class LessonConclusionFlow extends Flow<SceneStateNames, DreamScene> {
  public flowName: string = DREAM_SCENE_FLOWS.LESSON_CONCLUSION;

  async run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    await runSteps([
      stepBase(() => {
        this.gameScene.tutor.enterTeaching();
        this.gameScene.player.enterListening();
        return events.game.async.emitAsync("dialogue/show", {
          lines: getDialogueLines("dream.lesson_finish"),
        });
      }),
    ]);

    return {};
  }

  destroy(): void {}
}
