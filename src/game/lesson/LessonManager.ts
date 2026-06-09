import { events } from "@/events/events";
import {
  ShowLessonTitleEvent,
  WriteLessonDescriptionEvent,
} from "@/events/lesson/types";
import { AudioRecorder } from "@/libs/audio/AudioRecorder";
import { AudioTranscription } from "@/libs/audio/AudioTranscription";
import { LessonController } from "@/libs/lesson/LessonController";
import { Lesson } from "@/libs/lesson/types";
import { useAudioStore } from "@/store/audioStore";

export class LessonManager extends LessonController {
  private audioRecorder = new AudioRecorder({
    voiceDetectionEnabled: true,
    autoStopOnSilence: true,
  });
  private audioTranscription = new AudioTranscription();

  constructor(lesson: Lesson) {
    super(lesson);
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

  public async showVoiceIndicator() {
    return events.lesson.sync.emit("show-voice-indicator");
  }

  public hideVoiceIndicator() {
    events.lesson.sync.emit("hide-voice-indicator");
  }

  public async pronunciationChallenge(options?: {
    onRecordTimeout?: (elapsed: number, maxTime: number) => void;
  }): Promise<{ recordId: string }> {
    const target = this.getEntryTarget();
    const { setIsRecording, setCurrentVoiceRecordingVolume } =
      useAudioStore.getState();
    const { recordId, audioBlob } = await this.startRecording({
      setIsRecording,
      setCurrentVoiceRecordingVolume,
      onRecordTimeout: options?.onRecordTimeout,
    });
    await this.audioTranscription.transcription(audioBlob, target);
    // TODO: add transcription analysis

    return {
      recordId,
    };
  }

  private async startRecording(options: {
    setIsRecording: (value: boolean) => void;
    setCurrentVoiceRecordingVolume: (volume: number) => void;
    onRecordTimeout?: (elapsed: number, maxTime: number) => void;
  }): Promise<{ recordId: string; audioBlob: Blob }> {
    return new Promise((resolve) => {
      this.audioRecorder.startRecording({
        targetPhrase: this.getEntryTarget(),
        onStartRecord: async () => {
          options.setIsRecording(true);
          events.lesson.sync.emit("show-voice-indicator");
        },
        onVolumeChange: (volume) => {
          options.setCurrentVoiceRecordingVolume(volume);
        },
        onSpeakingEnd: async (recordId, audioBlob) => {
          options.setIsRecording(false);
          events.lesson.sync.emit("hide-voice-indicator");
          resolve({ recordId, audioBlob });
        },
        onRecordTimeout: (elapsed, maxTime) => {
          options?.onRecordTimeout?.(elapsed, maxTime);
        },
        onError: () => {
          options.setIsRecording(false);
          console.error("Pronunciation Challenge Error");
        },
      });
    });
  }

  public stopPronunciationChallenge() {
    this.audioRecorder.stopRecording();
    events.lesson.sync.emit("hide-voice-indicator");
  }

  public playPronunciationRecord(id: string) {
    this.audioRecorder.playRecording({ recordingId: id });
  }

  destroy() {
    this.audioRecorder.destroy();
  }
}
