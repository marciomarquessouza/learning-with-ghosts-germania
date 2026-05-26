import { Flow } from "@/libs/game/game-flow/Flow";
import { SceneStateNames } from "../../constants/states";
import { DreamScene } from "../..";
import { FlowResult } from "@/libs/game/game-flow/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { ACTORS } from "@/constants/game";

export class LessonPronunciation extends Flow<SceneStateNames, DreamScene> {
  public flowName = "LessonPronunciation";

  private step = this.gameScene.lessonManager.getStepByType("pronunciation");

  async run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    await runSteps([
      stepBase(() => {
        this.gameScene.lessonManager.writeLessonDescription({
          dialogueTitle: "Step 2: Pronunciation",
          description: "Siga as instruções da Masked Nun",
        });
        this.gameScene.learningNode.enterPumpkinTransitionState();
      }),
      stepBase(() => {
        return this.waitInteractionEvent();
      }),
      stepBase(() => {
        this.gameScene.tutor.enterTeaching();
        return this.gameScene.dialogueManager.showDialogue({
          lines: [
            {
              type: "dialogue",
              text: "Muito bem, vamos agora para a pronúncia",
              character: ACTORS.TUTOR,
            },
            {
              type: "dialogue",
              text: `Clique no botão recod e diga (alto) "${this.step.text}".`,
              character: ACTORS.TUTOR,
            },
          ],
        });
      }),
      stepBase(() => {
        this.gameScene.tutor.enterIdle();
        this.gameScene.player.attachRecordButton(() => {
          this.gameScene.lessonManager.showVoiceIndicator();
        });
        this.gameScene.lessonManager.writeLessonDescription({
          description: "Clique no botão Record ou Space 3x",
          hidePressContinue: true,
        });
      }),
    ]);

    return {};
  }

  destroy(): void {}
}
