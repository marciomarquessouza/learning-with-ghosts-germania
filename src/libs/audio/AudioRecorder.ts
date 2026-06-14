import { VoiceActivityDetector } from "./VoiceActivityDetector";

const DEFAULT_PHRASE_TIME_MULTIPLIER = 3;
const DEFAULT_MINIMUM_RECORD_TIME = 1_000;
const DEFAULT_MAXIMUM_RECORD_TIME = 6_000;

export interface AudioRecord {
  id: string;
  blob: Blob;
  url: string;
  timestamp: Date;
}

interface AudioRecorderOptions {
  voiceDetectionEnabled?: boolean;
  autoStopOnSilence?: boolean;
  silenceStopDuration?: number;
}

interface RecordingOptions {
  targetPhrase?: string; // The phrase user should say (e.g., "Guten Morgen")
  phraseTimeMultiplier?: number; // How many times longer than estimated)
  minimumRecordTime?: number; // Minimum recording time in ms
  maximumRecordTime?: number; // Hard maximum in ms (overrides phrase calculation)
  onStartRecord?: () => void;
  onSpeakingStart?: () => void;
  onSpeakingEnd?: (recordId: string, audioBlob: Blob) => void;
  onVolumeChange?: (volume: number) => void;
  onError?: (message?: string, error?: unknown) => void;
  onRecordTimeout?: (elapsed: number, maxTime: number) => void;
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

  // Auto-stop related
  private autoStopTimer: NodeJS.Timeout | null = null;
  private recordingStartTime: number = 0;
  private maxRecordingDuration: number = 0;
  private timeUpdateInterval: NodeJS.Timeout | null = null;

  constructor(options: AudioRecorderOptions = {}) {
    this.voiceDetectionEnabled = options.voiceDetectionEnabled !== false;
    this.autoStopOnSilence = options.autoStopOnSilence || false;
    this.silenceStopDuration = options.silenceStopDuration || 2000;
  }

  async startRecording(options: RecordingOptions) {
    const {
      targetPhrase = "",
      phraseTimeMultiplier = DEFAULT_PHRASE_TIME_MULTIPLIER,
      minimumRecordTime = DEFAULT_MINIMUM_RECORD_TIME,
      maximumRecordTime = DEFAULT_MAXIMUM_RECORD_TIME,
      onStartRecord,
      onSpeakingStart,
      onVolumeChange,
      onSpeakingEnd,
      onError,
    } = options;

    try {
      if (maximumRecordTime > 0) {
        this.maxRecordingDuration = maximumRecordTime;
      } else {
        this.maxRecordingDuration = this.estimatePhrasesDuration(
          targetPhrase,
          phraseTimeMultiplier,
        );
        // Ensure it meets minimum
        this.maxRecordingDuration = Math.max(
          this.maxRecordingDuration,
          minimumRecordTime,
        );
      }

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
            threshold: 0.8, // Adjust sensitivity => Lower = more sensitive
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
        const { id, blob } = this.processRecording();
        onSpeakingEnd?.(id, blob);
      };

      // Start Recording
      this.mediaRecord.start();
      this.isRecording = true;
      this.recordingStartTime = Date.now();
      this.setupAutoStop(options);

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

    this.currentRecord = {
      id: recordingId,
      blob: audioBlob,
      url: audioUrl,
      timestamp: new Date(),
    };

    return this.currentRecord;
  }

  playRecording({
    recordingId,
    onPlayRecord,
    onEndRecord,
    onError,
  }: PlayRecordingOptions) {
    if (!this.currentRecord || this.currentRecord.id !== recordingId) {
      console.error("Recording not found");
      return;
    }

    const audio = new Audio(this.currentRecord.url);

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

  private estimatePhrasesDuration(
    phrase: string,
    multiplier: number = DEFAULT_PHRASE_TIME_MULTIPLIER,
  ): number {
    if (!phrase || phrase.trim().length === 0) {
      return DEFAULT_MAXIMUM_RECORD_TIME;
    }

    const characterCount = phrase.trim().length;
    const wordCount = phrase.trim().split(/\s+/).length;

    const estimatedSecondsFromWords = wordCount / 2.5;
    const estimatedSecondsFromChars = characterCount / 12;

    const baseEstimate = Math.max(
      estimatedSecondsFromWords,
      estimatedSecondsFromChars,
    );

    return Math.max(baseEstimate * multiplier, 2) * 1000;
  }

  private setupAutoStop(options: RecordingOptions) {
    const { onRecordTimeout } = options;

    setTimeout(() => {
      if (this.isRecording) {
        onRecordTimeout?.(this.maxRecordingDuration, this.maxRecordingDuration);
      }
      this.stopRecording();
    }, this.maxRecordingDuration);
  }

  destroy() {
    if (this.isRecording) this.stopRecording();

    if (this.currentRecord) {
      URL.revokeObjectURL(this.currentRecord.url);
    }

    this.currentRecord = null;
  }
}
