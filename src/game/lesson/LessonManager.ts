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
import { LessonScore } from "./LessonScore";

const WRITING_SCORE_WEIGHT = 0.5;
const PRONUNCIATION_SCORE_WEIGHT = 0.5;

export class LessonManager extends LessonController {
  private lessonScore: LessonScore;
  private audioRecorder = new AudioRecorder({
    voiceDetectionEnabled: true,
    autoStopOnSilence: true,
  });
  private pronunciationAPI = new PronunciationAPI();

  constructor(lesson: Lesson) {
    super(lesson);
    this.lessonScore = new LessonScore(lesson);
  }

  public async showLessonTitle(
    lessonTitleContent: ShowLessonTitleEvent,
  ): Promise<void> {
    return events.lesson.async.emitAsync(
      "show-lesson-header",
      lessonTitleContent,
    );
  }

  public async hideLessonTitle(): Promise<void> {
    return events.lesson.async.emitAsync("hide-lesson-header");
  }

  public async writeLessonDescription(
    lessonDescription: WriteLessonDescriptionEvent,
  ): Promise<void> {
    return events.lesson.async.emitAsync(
      "write-lesson-description",
      lessonDescription,
    );
  }

  public showLessonDescription() {
    events.lesson.sync.emit("show-description");
  }

  public async hideLessonDescription(): Promise<void> {
    return events.lesson.async.emitAsync("hide-lesson-description");
  }

  public showVoiceIndicator() {
    const target = this.getEntryTarget();
    return events.lesson.sync.emit("show-voice-indicator", { target });
  }

  public hideVoiceIndicator() {
    events.lesson.sync.emit("hide-voice-indicator");
  }

  public async pronunciationChallenge(options?: {
    onRecording?: (isRecording: boolean) => void;
    onVolumeChange?: (volume: number) => void;
    onRecordTimeout?: (elapsed: number, maxTime: number) => void;
  }): Promise<PronunciationResultEvent> {
    try {
      events.lesson.sync.emit("show-loading", { text: "Mic Setuuup..." });
      const target = this.getEntryTarget();
      const { recordId, audioBlob } = await this.startRecording({
        onRecording: options?.onRecording,
        onVolumeChange: options?.onVolumeChange,
        onRecordTimeout: options?.onRecordTimeout,
      });
      const { score, feedback } =
        await this.pronunciationAPI.calculatePronunciationScore(
          audioBlob,
          target,
        );

      this.lessonScore.addPronunciationScore(this.currentLessonEntry.id, score);

      return {
        recordId,
        score,
        feedback,
      };
    } catch (error) {
      throw error;
    }
  }

  private async startRecording(options: {
    onRecording?: (value: boolean) => void;
    onVolumeChange?: (volume: number) => void;
    onRecordTimeout?: (elapsed: number, maxTime: number) => void;
  }): Promise<{ recordId: string; audioBlob: Blob }> {
    return new Promise((resolve) => {
      this.audioRecorder.startRecording({
        targetPhrase: this.getEntryTarget(),
        onStartRecord: async () => {
          options.onRecording?.(true);
          this.showVoiceIndicator();
        },
        onVolumeChange: (volume) => {
          options?.onVolumeChange?.(volume);
        },
        onSpeakingEnd: async (recordId, audioBlob) => {
          options.onRecording?.(false);
          events.lesson.sync.emit("show-loading", {
            text: "Checking Auuudio...",
          });
          resolve({ recordId, audioBlob });
        },
        onRecordTimeout: (elapsed, maxTime) => {
          this.hideVoiceIndicator();
          options?.onRecordTimeout?.(elapsed, maxTime);
        },
        onError: () => {
          this.hideVoiceIndicator();
          options.onRecording?.(false);
          console.error("Pronunciation Challenge Error");
        },
      });
    });
  }

  public showPronunciationScore(value: PronunciationResultEvent) {
    events.lesson.sync.emit("show-pronunciation-score", value);
  }

  public stopPronunciationChallenge() {
    this.audioRecorder.stopRecording();
    events.lesson.sync.emit("hide-voice-indicator");
  }

  public async playPronunciationRecord(id: string): Promise<void> {
    return this.audioRecorder.playRecording({ recordingId: id });
  }

  public async startWritingChallenge(payload: {
    limits: WritingLimits;
    onClickNext: (result: WritingResult) => void;
    onClickCancel?: () => void;
  }): Promise<void> {
    return new Promise((resolve) => {
      events.lesson.sync.emit("show-writing-board", {
        target: this.getEntryTarget(),
        limits: payload.limits,
        onClickNext: (result) => {
          this.lessonScore.addWritingScore(this.currentLessonEntry.id, result);
          payload.onClickNext(result);
          resolve();
        },
        onClickCancel: () => {
          payload?.onClickCancel?.();
          resolve();
        },
      });
    });
  }

  public getEntryScore(): number {
    const entryScore = this.lessonScore.getEntryScore(
      this.currentLessonEntry.id,
    );
    const pronunciationScore = entryScore?.pronunciation ?? 0;
    const writingScore = entryScore?.writing ?? 0;
    const finalScore = Math.max(
      0,
      pronunciationScore * PRONUNCIATION_SCORE_WEIGHT +
        writingScore * WRITING_SCORE_WEIGHT,
    );

    return Number(finalScore.toFixed(2));
  }

  destroy() {
    this.audioRecorder.destroy();
  }
}
