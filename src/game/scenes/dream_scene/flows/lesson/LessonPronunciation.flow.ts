import { Flow } from "@/libs/game/game-flow/Flow";
import { SceneStateNames } from "../../constants/states";
import { DreamScene } from "../..";
import { FlowResult } from "@/libs/game/game-flow/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { events } from "@/events/events";
import { useAudioStore } from "@/store/audioStore";
import { LessonWritingFlow } from "./LessonWriting.flow";
import { DREAM_SCENE_FLOWS } from "../../constants/flows";
import { ClearEvent } from "@/libs/events/types";

export class LessonPronunciationFlow extends Flow<SceneStateNames, DreamScene> {
  public flowName = DREAM_SCENE_FLOWS.LESSON_PRONUNCIATION;

  private target = this.gameScene.lessonManager.getEntryTarget();
  private step = this.gameScene.lessonManager.getStepByType("pronunciation");
  private lessonEntry = this.gameScene.lessonManager.getCurrentLessonEntry();

  private isAudioSamplePlaying = false;

  private removePlayTargetAudioEvent = () => {};
  private removePlayRecordedAudioEvent: ClearEvent = { remove: () => {} };
  private removeRepeatChallengeEvent = () => {};
  private removeActionNextEvent = () => {};

  private registerRecordedAudioEvent(recordId: string): void {
    this.removePlayRecordedAudioEvent.remove();

    this.removePlayRecordedAudioEvent = events.lesson.async.on(
      "action-button:reproduce-audio",
      async (_, done) => {
        await this.gameScene.lessonManager.playPronunciationRecord(recordId);
        done();
      },
    );
  }

  private registerChallengeActions(): void {
    this.removeRepeatChallengeEvent();
    this.removeActionNextEvent();

    this.removeRepeatChallengeEvent = events.lesson.sync.on(
      "action-button:repeat",
      () => {
        events.interactions.sync.emit("interaction/repeat", {
          id: this.flowName,
        });
      },
    );

    this.removeActionNextEvent = events.lesson.sync.on(
      "action-button:next",
      () => {
        events.interactions.sync.emit("interaction/accept", {
          id: this.flowName,
        });
      },
    );
  }

  private registerTargetAudioEvent(): void {
    this.removePlayTargetAudioEvent();

    this.removePlayTargetAudioEvent = events.audio.sync.on(
      "audio:play-sample",
      async () => {
        if (this.isAudioSamplePlaying) return;

        this.isAudioSamplePlaying = true;

        try {
          await this.gameScene.lessonManager.playTargetAudio();
        } finally {
          this.isAudioSamplePlaying = false;
        }
      },
    );
  }

  private async pronunciationChallenge(): Promise<void> {
    const { setIsRecording, setCurrentVoiceRecordingVolume } =
      useAudioStore.getState();

    const recordButton = this.gameScene.player.audioRecordButton;

    recordButton.setVisible(true);
    recordButton.showLoadingUntilVoiceIndicatorAppears();

    this.gameScene.player.enterPronunciation();

    const result = await this.gameScene.lessonManager.pronunciationChallenge({
      onRecording: (isRecording) => {
        setIsRecording(isRecording);

        if (!isRecording) {
          recordButton.setVisible(false);
        }
      },
      onVolumeChange: setCurrentVoiceRecordingVolume,
    });

    this.gameScene.player.enterIdle();
    recordButton.setVisible(false);

    this.registerRecordedAudioEvent(result.recordId);

    this.gameScene.lessonManager.showPronunciationScore(result);
  }

  private async startPronunciationChallenge(): Promise<void> {
    await this.pronunciationChallenge();

    this.registerChallengeActions();

    await this.waitInteractionEvent({
      repeat: {
        callback: async () => {
          await this.delay(500);
          await this.pronunciationChallenge();
        },
      },
    });
  }

  async run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    const hasLearningNode = this.gameScene.learningNode.floor.hasActorAttached;

    await runSteps([
      stepBase(
        () => {
          this.gameScene.createLearningNode();

          // TODO: add Knowledge Troop
          this.gameScene.player.enterInclined();

          return this.gameScene.learningNode.resumeSproutToPumpkin({
            sequence: this.lessonEntry.sequence + 1,
            target: this.target,
            offsetY: -125,
          });
        },
        {
          when: () => !hasLearningNode,
        },
      ),

      stepBase(() => {
        this.registerTargetAudioEvent();
      }),

      stepBase(() => {
        this.gameScene.player.enterListening();
        this.gameScene.learningNode.enterPumpkinIdleState();

        return this.gameScene.lessonManager.writeLessonDescription({
          dialogueTitle: "Step 2: Pronunciation",
          description: "Follow the Masked Nun instructions",
        });
      }),

      stepBase(() => {
        this.gameScene.tutor.enterTeaching();

        return this.gameScene.tutor.dialogue([
          "Very good, let's now move on to pronunciation.",
        ]);
      }),

      stepBase(() => {
        this.gameScene.tutor.enterIdle();

        this.gameScene.lessonManager.writeLessonDescription({
          dialogueTitle: "Step 2: Pronunciation",
          description: this.step.instruction,
        });

        this.gameScene.player.attachRecordButton({
          skipNativeLoading: true,

          onStartRecord: () => {
            events.interactions.sync.emit("interaction/accept", {
              id: this.flowName,
            });
          },

          onStopRecord: () => {
            this.gameScene.lessonManager.stopPronunciationChallenge();
          },
        });
      }),

      stepBase(() => this.waitInteractionEvent()),

      stepBase(() => this.startPronunciationChallenge()),

      stepBase(() => this.gameScene.learningNode.increasePumpkinGrowth(0.25)),

      stepBase(async () => {
        this.gameScene.lessonManager.writeLessonDescription({
          dialogueTitle: "Step 2: Pronunciation",
          description: "",
        });

        await this.delay(500);

        return this.gameScene.tutor.dialogue([
          "Very well, your new knowledge is almost ready to be harvested.",
          "Let's move on to the next phase.",
        ]);
      }),
    ]);

    return {
      nextState: DreamScene.STATES.PERFORMING_LESSON,
      nextFlow: LessonWritingFlow,
    };
  }

  destroy(): void {
    this.removePlayRecordedAudioEvent.remove();
    this.removePlayTargetAudioEvent();
    this.removeRepeatChallengeEvent();
    this.removeActionNextEvent();
  }
}
