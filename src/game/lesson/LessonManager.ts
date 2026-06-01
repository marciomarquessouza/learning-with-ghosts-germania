import { events } from "@/events/events";
import {
  ShowLessonTitleEvent,
  WriteLessonDescriptionEvent,
} from "@/events/lesson/types";
import { AudioRecorder } from "@/libs/audio/AudioRecorder";
import { LessonController } from "@/libs/lesson/LessonController";
import { Lesson } from "@/libs/lesson/types";
import { useAudioStore } from "@/store/audioStore";

export class LessonManager extends LessonController {
  private audioRecorder = new AudioRecorder({
    voiceDetectionEnabled: true,
    autoStopOnSilence: true,
  });

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

  public async pronunciationChallenge(): Promise<{ recordId: string }> {
    const { setIsRecording, setCurrentVoiceRecordingVolume } =
      useAudioStore.getState();
    return new Promise((resolve) => {
      this.audioRecorder.startRecording({
        targetPhrase: this.getEntryTarget(),
        onStartRecord: async () => {
          setIsRecording(true);
          events.lesson.sync.emit("show-voice-indicator");
        },
        onVolumeChange: (volume) => {
          setCurrentVoiceRecordingVolume(volume);
        },
        onSpeakingEnd: (recordId) => {
          setIsRecording(false);
          events.lesson.sync.emit("hide-voice-indicator");
          resolve({ recordId });
        },
        onError: () => {
          setIsRecording(false);
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
