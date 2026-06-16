import { Flow } from "@/libs/game/game-flow/Flow";
import { SceneStateNames } from "../../constants/states";
import { DreamScene } from "../..";
import { FlowResult } from "@/libs/game/game-flow/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { events } from "@/events/events";

export class LessonPronunciationFlow extends Flow<SceneStateNames, DreamScene> {
  public flowName = "LessonPronunciationFlow";

  private target = this.gameScene.lessonManager.getEntryTarget();
  private step = this.gameScene.lessonManager.getStepByType("pronunciation");
  private isAudioSamplePlaying = false;
  private removePlayTargetAudioEvent: () => void = () => {};
  private removePlayRecordedAudioEvent: () => void = () => {};
  private removeRepeatChallengeEvent: () => void = () => {};

  private async pronunciationChallenge() {
    this.gameScene.player.audioRecordButton.setVisible(true);
    this.gameScene.player.audioRecordButton.showLoadingUntilVoiceIndicatorAppears();
    const pronunciationResult =
      await this.gameScene.lessonManager.pronunciationChallenge();
    this.removePlayRecordedAudioEvent();
    this.removePlayRecordedAudioEvent = events.lesson.sync.on(
      "action-button:reproduce-audio",
      () => {
        this.gameScene.lessonManager.playPronunciationRecord(
          pronunciationResult.recordId,
        );
      },
    );

    this.gameScene.player.audioRecordButton.setVisible(false);
    this.gameScene.lessonManager.showPronunciationScore(pronunciationResult);
  }

  private async startPronunciationChallenge(): Promise<void> {
    return new Promise(async (resolve) => {
      this.pronunciationChallenge();
      this.removeRepeatChallengeEvent = events.lesson.sync.on(
        "action-button:repeat",
        async () => {
          this.pronunciationChallenge();
        },
      );
      events.lesson.sync.once("action-button:next", () => {
        resolve();
      });
    });
  }

  async run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    const hasLearningNode = this.gameScene.learningNode.floor.hasActorAttached;
    await runSteps([
      stepBase(
        () => {
          this.gameScene.player.enterInclined();
          return this.gameScene.learningNode.resumeSproutToPumpkin();
        },
        { when: () => !hasLearningNode },
      ),
      stepBase(() => {
        this.removePlayTargetAudioEvent = events.audio.sync.on(
          "audio:play-sample",
          async () => {
            if (this.isAudioSamplePlaying) return;
            this.isAudioSamplePlaying = true;
            await this.gameScene.lessonManager.playTargetAudio();
            this.isAudioSamplePlaying = false;
          },
        );
      }),
      stepBase(() => {
        this.gameScene.player.enterListening();
        this.gameScene.learningNode.enterPumpkinIdleState();
        return this.gameScene.lessonManager.writeLessonDescription({
          dialogueTitle: "Step 2: Pronunciation",
          description: `Follow the Masked Nun instructions`,
          hidePressContinue: true,
        });
      }),
      stepBase(() => {
        this.gameScene.tutor.enterTeaching();
        return this.gameScene.tutor.dialogue([
          "Very good, let's now move on to pronunciation.",
          `Click the mic or click {{key|space}} and say: “{{target|${this.target}}}”.
          ${this.step.text}`,
        ]);
      }),
      stepBase(() => {
        this.gameScene.tutor.enterIdle();
        this.gameScene.lessonManager.writeLessonDescription({
          dialogueTitle: "Step 2: Pronunciation",
          description: this.step.instruction,
          hidePressContinue: true,
        });
        this.gameScene.player.attachRecordButton({
          skipNativeLoading: true,
          onStartRecord: async () => {
            events.interactions.sync.emit("interaction/accept", {
              id: this.flowName,
            });
          },
          onStopRecord: async () => {
            this.gameScene.lessonManager.stopPronunciationChallenge();
          },
        });
      }),
      stepBase(() => this.waitInteractionEvent()),
      stepBase(() => {
        return this.startPronunciationChallenge();
      }),
      stepBase(() => {
        return this.gameScene.learningNode.increasePumpkinGrowth();
      }),
      stepBase(() => {
        this.gameScene.lessonManager.writeLessonDescription({
          dialogueTitle: "Step 2: Pronunciation",
          description: `Congrats!`,
          hidePressContinue: true,
        });
        return;
      }),
    ]);

    return {};
  }

  destroy(): void {
    this.removePlayRecordedAudioEvent();
    this.removePlayTargetAudioEvent();
    this.removeRepeatChallengeEvent();
  }
}
