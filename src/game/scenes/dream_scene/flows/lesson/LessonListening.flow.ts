import { events } from "@/events/events";
import { Flow } from "@/libs/game/game-flow/Flow";
import { FlowResult } from "@/libs/game/game-flow/types";
import { AUDIO_SPEED } from "@/libs/audio/GameAudio";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";

import { DreamScene } from "../..";
import { SceneStateNames } from "../../constants/states";
import { LessonPronunciationFlow } from "./LessonPronunciation.flow";
import { DREAM_SCENE_FLOWS } from "../../constants/flows";

const LISTENING_REPETITION = 3;

export class LessonListeningFlow extends Flow<SceneStateNames, DreamScene> {
  public flowName = DREAM_SCENE_FLOWS.LESSON_LISTENING;

  private step = this.gameScene.lessonManager.getStepByType("listening");
  private target = this.gameScene.lessonManager.getEntryTarget();
  private meanings =
    this.step.meanings && this.step.meanings.length ? this.step.meanings : [];

  async run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    await runSteps([
      stepBase(() => {
        this.gameScene.lessonManager.writeLessonDescription({
          dialogueTitle: "Step 1: Listening",
          description: `Follow the Masked Nun instructions`,
        });
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
        return this.gameScene.tutor.dialogue(
          `You need to ask his name ${LISTENING_REPETITION} times for her to grow.`,
        );
      }),
      stepBase(() => {
        this.gameScene.player.enterInclined();
      }),
      this.repeatSteps(LISTENING_REPETITION, (index) => [
        stepBase(
          () => {
            this.gameScene.lessonManager.writeLessonDescription({
              dialogueTitle: "Step 1: Listening",
              description:
                "Press the {{key|play}} button or press {{key|space}} to hear the little creature’s name and make it grow.",
            });
          },
          {
            when: () => index === 0,
          },
        ),
        stepBase(
          async () => {
            this.gameScene.learningNode.hidePlayerButton();
            await this.gameScene.tutor.dialogue(this.meanings);
            this.gameScene.learningNode.showPlayerButton();
          },
          {
            when: () => index === 1 && this.meanings.length > 0,
          },
        ),
        stepBase(
          () => {
            this.gameScene.lessonManager.writeLessonDescription({
              dialogueTitle: "Step 1: Listening",
              description:
                "Press the {{key|play}} button or press {{key|space}} one more time.",
            });
          },
          {
            when: () => index === 1,
          },
        ),
        stepBase(
          () => {
            this.gameScene.lessonManager.writeLessonDescription({
              dialogueTitle: "Step 1: Listening",
              description:
                "Now for the last time. Memorize the pronunciation well. Press the {{key|play}} button or press {{key|space}} one more time to hear the name again.",
            });
          },
          {
            when: () => index === 2,
          },
        ),
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
        return this.gameScene.learningNode.enterPumpkinTransitionState();
      }),
    ]);

    return {
      nextState: DreamScene.STATES.PERFORMING_LESSON,
      nextFlow: LessonPronunciationFlow,
    };
  }

  destroy(): void {}
}
