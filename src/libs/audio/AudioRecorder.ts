import { VoiceActivityDetector } from "./VoiceActivityDetector";

export interface AudioRecord {
  id: string;
  blob: Blob;
  url: string;
  duration: number;
  timestamp: Date;
}

interface AudioRecorderOptions {
  voiceDetectionEnabled?: boolean;
  autoStopOnSilence?: boolean;
  silenceStopDuration?: number;
}

interface RecordingOptions {
  onStartRecord?: () => void;
  onSpeakingStart?: () => void;
  onSpeakingEnd?: (recordId: string) => void;
  onVolumeChange?: (volume: number) => void;
  onError?: (message?: string, error?: unknown) => void;
}

interface PlayRecordingOptions {
  recordingId: string;
  onPlayRecord?: () => void;
  onEndRecord?: () => void;
  onError?: (message: string) => void;
}

export class AudioRecorder {
  private voiceDetectionEnabled: boolean;
  private mediaRecord: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording: boolean = false;
  private currentRecord: AudioRecord | null = null;
  private currentStream: MediaStream | null = null;
  private voiceActivityDetector: VoiceActivityDetector | null = null;
  private autoStopOnSilence: boolean;
  private silenceStopDuration: number;

  constructor(options: AudioRecorderOptions = {}) {
    this.voiceDetectionEnabled = options.voiceDetectionEnabled !== false;
    this.autoStopOnSilence = options.autoStopOnSilence || false;
    this.silenceStopDuration = options.silenceStopDuration || 2000;
  }

  async startRecording({
    onStartRecord,
    onSpeakingStart,
    onVolumeChange,
    onSpeakingEnd,
    onError,
  }: RecordingOptions) {
    try {
      this.currentStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 44100,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      if (this.voiceDetectionEnabled) {
        this.voiceActivityDetector = new VoiceActivityDetector(
          this.currentStream,
          {
            threshold: 0.2, // Adjust sensitivity
            silenceThreshold: 800, // 800ms of silence to consider stopped speaking
            onSpeakingStart: () => {
              console.log("User started speaking");
              onSpeakingStart?.();
            },
            onSpeakingEnd: () => {
              console.log("User stopped speaking");
              this.stopRecording();

              if (this.autoStopOnSilence && this.isRecording) {
                setTimeout(() => {
                  if (
                    this.voiceActivityDetector &&
                    !this.voiceActivityDetector.isSpeaking
                  ) {
                    this.stopRecording();
                  }
                }, this.silenceStopDuration);
              }
            },
            onVolumeChange: (volume) => {
              onVolumeChange?.(volume);
            },
          },
        );
      }

      this.mediaRecord = new MediaRecorder(this.currentStream, {
        mimeType: this.getSupportedMimeType(),
      });

      this.audioChunks = [];

      this.mediaRecord.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecord.onstop = () => {
        const { id } = this.processRecording();
        onSpeakingEnd?.(id);
      };

      // Start Recording
      this.mediaRecord.start();
      this.isRecording = true;

      onStartRecord?.();
    } catch (err: unknown) {
      const error = err as { name?: string };
      console.error("Error accessing microphone:", error);

      if (error && error?.name) {
        if (error.name === "NotAllowedError") {
          onError?.("NotAllowedError");
          return;
        } else if (error.name === "NotFoundError") {
          onError?.("NotFoundError");
          return;
        }
      }
      onError?.("unknown error", err);
    }
  }

  stopRecording() {
    if (this.mediaRecord && this.isRecording) {
      this.mediaRecord.stop();
      this.isRecording = false;

      if (this.voiceActivityDetector) {
        this.voiceActivityDetector.destroy();
        this.voiceActivityDetector = null;
      }

      if (this.currentStream) {
        this.currentStream.getTracks().forEach((track) => track.stop());
      }
    }
  }

  getSupportedMimeType() {
    // Check for supported MIME types in order of preference
    const types = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/mp4",
      "audio/wav",
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return "audio/webm"; // Fallback
  }

  processRecording(): AudioRecord {
    const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
    const audioUrl = URL.createObjectURL(audioBlob);

    const recordingId = `recording_${Date.now()}`;
    // const duration = await this.getAudioDuration(audioBlob);
    const duration = 0;

    this.currentRecord = {
      id: recordingId,
      blob: audioBlob,
      url: audioUrl,
      duration,
      timestamp: new Date(),
    };

    return this.currentRecord;
  }

  async getAudioDuration(blob: Blob): Promise<number> {
    return new Promise((resolve) => {
      const audio = new Audio(URL.createObjectURL(blob));
      audio.addEventListener("loadedmetadata", () => {
        resolve(audio.duration);
      });
      audio.addEventListener("error", () => {
        resolve(0);
      });
    });
  }

  playRecording({
    recordingId,
    onPlayRecord,
    onEndRecord,
    onError,
  }: PlayRecordingOptions) {
    const recording = this.currentRecord;

    console.log("#HERE recording ", recording);
    console.log("#HERE recordingId ", recordingId);

    if (!recording || recording.id !== recordingId) {
      console.error("Recording not found");
      return;
    }

    const audio = new Audio(recording.url);

    audio.onplay = () => {
      onPlayRecord?.();
    };

    audio.onended = () => {
      onEndRecord?.();
    };

    audio.onerror = (error) => {
      console.error("Playback error:", error);
      onError?.("Failed to play audio");
    };

    audio.play().catch((error) => {
      console.error("Failed to play audio:", error);
      onError?.("Failed to play audio");
    });
  }

  deleteRecord() {
    if (this.currentRecord) {
      URL.revokeObjectURL(this.currentRecord.url);
      this.currentRecord = null;
    }
  }

  getRecord(id: string): AudioRecord | undefined {
    if (this.currentRecord && this.currentRecord.id === id) {
      return this.currentRecord;
    }
  }

  destroy() {
    if (this.isRecording) this.stopRecording();

    if (this.currentRecord) {
      URL.revokeObjectURL(this.currentRecord.url);
    }

    this.currentRecord = null;
  }
}
