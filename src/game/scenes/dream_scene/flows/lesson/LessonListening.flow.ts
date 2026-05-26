import { events } from "@/events/events";
import { Flow } from "@/libs/game/game-flow/Flow";
import { FlowResult } from "@/libs/game/game-flow/types";
import { AUDIO_SPEED } from "@/libs/audio/game-audio/AudioManager";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";

import { DreamScene } from "../..";
import { SceneStateNames } from "../../constants/states";
import { LessonPronunciation } from "./LessonPronunciation.flow";
import { ACTORS } from "@/constants/game";

const LISTENING_REPETITION = 3;

export class LessonListeningFlow extends Flow<SceneStateNames, DreamScene> {
  public flowName = "LessonListeningFlow";

  private step = this.gameScene.lessonManager.getStepByType("listening");
  private target = this.gameScene.lessonManager.getEntryTarget();

  async run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    await runSteps([
      stepBase(() => {
        this.gameScene.player.enterScared();
        return this.gameScene.tutor.waitForSowing();
      }),
      stepBase(() => {
        this.gameScene.learningNode.enterSproutingState();
        return new Promise((resolve) => {
          events.actors.learningNode.sync.once("sprouting:end", () => {
            resolve();
          });
        });
      }),
      stepBase(() => {
        this.gameScene.player.enterListening();
        return this.gameScene.dialogueManager.showDialogue({
          lines: [
            {
              type: "dialogue",
              text: "Você precisa perguntar o nome dele por 3 vezes e veja o que vai acontecer.",
              character: ACTORS.TUTOR,
            },
          ],
        });
      }),
      stepBase(() => {
        this.gameScene.lessonManager.writeLessonDescription({
          dialogueTitle: "Step 1: Listening",
          description: `${this.step.text}`,
          hidePressContinue: true,
        });
        this.gameScene.player.enterInclined();
      }),
      this.repeatSteps(LISTENING_REPETITION, (index) => [
        stepBase(() => {
          this.gameScene.learningNode.attachPlayerButton(() => {
            events.interactions.sync.emit("interaction/accept", {
              id: this.flowName,
            });
          });
          return this.waitInteractionEvent();
        }),
        stepBase(async () => {
          this.gameScene.learningNode.enterSproutTalkingState();
          await this.delay(500);
        }),
        stepBase(async () => {
          return this.gameScene.lessonManager.playTargetAudio(
            AUDIO_SPEED.NORMAL,
          );
        }),
        stepBase(
          () => {
            this.gameScene.lessonManager.updateLessonDescription({
              description: `Muito bem, repita isso ${LISTENING_REPETITION - (index + 1)}x`,
            });
          },
          { when: () => LISTENING_REPETITION - (index + 1) > 0 },
        ),
        stepBase(async () => {
          this.gameScene.learningNode.lessonTargetLabel.setBadge(
            `${index + 1}x`,
          );
          this.gameScene.learningNode.enterIdleState();
          await this.delay(500);
        }),
        stepBase(
          () => {
            this.gameScene.learningNode.attachTargetLabel(this.target);
          },
          { when: () => index === 0 },
        ),
      ]),
      stepBase(() => {
        this.gameScene.learningNode.detachTargetLabel();
        this.gameScene.learningNode.detachPlayerButton();
        this.gameScene.player.enterIdle();
      }),
    ]);

    return {
      nextState: DreamScene.STATES.PERFORMING_LESSON,
      nextFlow: LessonPronunciation,
    };
  }

  destroy(): void {}
}
