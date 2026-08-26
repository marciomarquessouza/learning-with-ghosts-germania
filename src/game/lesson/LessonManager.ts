import { events } from "@/events/events";
import {
  PronunciationResultEvent,
  ShowLessonTitleEvent,
  WriteLessonDescriptionEvent,
  WritingLimits,
  WritingResult,
} from "@/events/lesson/types";
import { AudioRecorder } from "@/libs/audio/AudioRecorder";
import { PronunciationAPI } from "@/libs/lesson/PronunciationAPI";
import { LessonController } from "@/libs/lesson/LessonController";
import { Lesson } from "@/libs/lesson/types";
import { LessonScore } from "@/libs/lesson/LessonScore";

const LOADING_MESSAGES = {
  MIC_SETUP: "Mic Setuuup...",
  CHECKING_AUDIO: "Checking Auuudio...",
} as const;

export class LessonManager extends LessonController {
  private readonly audioRecorder = new AudioRecorder({
    voiceDetectionEnabled: true,
    autoStopOnSilence: true,
  });

  private readonly pronunciationAPI = new PronunciationAPI();

  constructor(lesson: Lesson) {
    super(lesson);
  }

  public async showLessonTitle(
    lessonTitleContent: ShowLessonTitleEvent,
  ): Promise<void> {
    await events.lesson.async.emitAsync(
      "show-lesson-header",
      lessonTitleContent,
    );
  }

  public async hideLessonTitle(): Promise<void> {
    await events.lesson.async.emitAsync("hide-lesson-header");
  }

  public async writeLessonDescription(
    lessonDescription: WriteLessonDescriptionEvent,
  ): Promise<void> {
    await events.lesson.async.emitAsync(
      "write-lesson-description",
      lessonDescription,
    );
  }

  public showLessonDescription(): void {
    events.lesson.sync.emit("show-description");
  }

  public async hideLessonDescription(): Promise<void> {
    await events.lesson.async.emitAsync("hide-lesson-description");
  }

  public showVoiceIndicator(): void {
    const target = this.getEntryTarget();
    events.lesson.sync.emit("show-voice-indicator", { target });
  }

  public hideVoiceIndicator(): void {
    events.lesson.sync.emit("hide-voice-indicator");
  }

  public async pronunciationChallenge(options?: {
    onRecording?: (isRecording: boolean) => void;
    onVolumeChange?: (volume: number) => void;
    onRecordTimeout?: (elapsed: number, maxTime: number) => void;
  }): Promise<PronunciationResultEvent> {
    events.lesson.sync.emit("show-loading", {
      text: LOADING_MESSAGES.MIC_SETUP,
    });

    const target = this.getEntryTarget();
    const { recordId, audioBlob } = await this.startRecording(options);

    const { score, feedback } =
      await this.pronunciationAPI.calculatePronunciationScore(
        audioBlob,
        target,
      );

    this.lessonScore.addPronunciationScore(this.currentLessonEntry.id, score);

    return { recordId, score, feedback };
  }

  private startRecording(options?: {
    onRecording?: (isRecording: boolean) => void;
    onVolumeChange?: (volume: number) => void;
    onRecordTimeout?: (elapsed: number, maxTime: number) => void;
  }): Promise<{ recordId: string; audioBlob: Blob }> {
    return new Promise((resolve, reject) => {
      this.audioRecorder.startRecording({
        targetPhrase: this.getEntryTarget(),

        onStartRecord: () => {
          options?.onRecording?.(true);
          this.showVoiceIndicator();
        },

        onVolumeChange: (volume) => {
          options?.onVolumeChange?.(volume);
        },

        onSpeakingEnd: (recordId, audioBlob) => {
          options?.onRecording?.(false);
          this.hideVoiceIndicator();

          events.lesson.sync.emit("show-loading", {
            text: LOADING_MESSAGES.CHECKING_AUDIO,
          });

          resolve({ recordId, audioBlob });
        },

        onRecordTimeout: (elapsed, maxTime) => {
          this.hideVoiceIndicator();
          options?.onRecordTimeout?.(elapsed, maxTime);
        },

        onError: (error) => {
          this.hideVoiceIndicator();
          options?.onRecording?.(false);

          console.error("Pronunciation Challenge Error:", error);
          reject(error ?? new Error("Failed to record audio"));
        },
      });
    });
  }

  public showPronunciationScore(value: PronunciationResultEvent): void {
    events.lesson.sync.emit("show-pronunciation-score", value);
  }

  public stopPronunciationChallenge(): void {
    this.audioRecorder.stopRecording();
    this.hideVoiceIndicator();
  }

  public async playPronunciationRecord(id: string): Promise<void> {
    await this.audioRecorder.playRecording({ recordingId: id });
  }

  public async startWritingChallenge(payload: {
    limits: WritingLimits;
    onClickNext?: (result: WritingResult) => void;
    onClickCancel?: () => void;
  }): Promise<void> {
    return new Promise((resolve) => {
      events.lesson.sync.emit("show-writing-board", {
        target: this.getEntryTarget(),
        limits: payload.limits,

        onClickNext: (result) => {
          this.lessonScore.addWritingScore(this.currentLessonEntry.id, result);
          payload.onClickNext?.(result);
          resolve();
        },

        onClickCancel: () => {
          payload.onClickCancel?.();
          resolve();
        },
      });
    });
  }

  public getEntryScore(): number {
    const entryScore = this.lessonScore.getEntryScore(
      this.currentLessonEntry.id,
    );

    if (!entryScore) return 0;

    return this.lessonScore.calculateFinalScore(entryScore);
  }

  public destroy(): void {
    this.audioRecorder.destroy();
  }
}
