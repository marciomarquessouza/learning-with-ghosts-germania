import { Flow } from "@/libs/game/game-flow/Flow";
import { SceneStateNames } from "../../constants/states";
import { DreamScene } from "../..";
import { FlowResult } from "@/libs/game/game-flow/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { ACTORS } from "@/constants/game";

export class LessonPronunciationFlow extends Flow<SceneStateNames, DreamScene> {
  public flowName = "LessonPronunciationFlow";

  private step = this.gameScene.lessonManager.getStepByType("pronunciation");
  private recordId = "";

  async run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    await runSteps([
      stepBase(() => {
        this.gameScene.lessonManager.writeLessonDescription({
          dialogueTitle: "Step 2: Pronunciation",
          description: "Siga as instruções da Masked Nun",
        });
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
        this.gameScene.player.attachRecordButton({
          onStartRecord: async () => {
            await this.gameScene.lessonManager.hideLessonDescription();
            const { recordId } =
              await this.gameScene.lessonManager.pronunciationChallenge();
            this.recordId = recordId;
          },
          onStopRecord: () => {
            this.gameScene.lessonManager.hideVoiceIndicator();
            this.gameScene.lessonManager.stopPronunciationChallenge();
          },
        });
        this.gameScene.lessonManager.writeLessonDescription({
          description: "Clique no botão Record ou Space",
          hidePressContinue: true,
        });
      }),
      stepBase(() => {
        return this.waitInteractionEvent(async () => {
          const { recordId } =
            await this.gameScene.lessonManager.pronunciationChallenge();
          this.recordId = recordId;
        });
      }),
    ]);

    return {};
  }

  destroy(): void {}
}
