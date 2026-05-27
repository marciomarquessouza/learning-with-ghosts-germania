interface AudioRecord {
  id: string;
  blob: Blob;
  url: string;
  duration: number;
  timestamp: Date;
}

interface RecordingOptions {
  onStartRecord?: () => void;
  onError?: (message?: string, error?: unknown) => void;
}

export class AudioRecorder {
  constructor(
    private mediaRecord: MediaRecorder | null = null,
    private audioChunks: Blob[] = [],
    private isRecording: boolean = false,
    private recordings = new Map<string, AudioRecord>(),
    private currentStream: MediaStream | null = null,
  ) {}

  async startRecording({ onStartRecord, onError }: RecordingOptions) {
    try {
      this.currentStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 44100,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

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
        this.processRecording();
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

  async processRecording() {
    const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
    const audioUrl = URL.createObjectURL(audioBlob);

    const recordingId = `recording_${Date.now()}`;
    const duration = await this.getAudioDuration(audioBlob);

    this.recordings.set(recordingId, {
      id: recordingId,
      blob: audioBlob,
      url: audioUrl,
      duration,
      timestamp: new Date(),
    });
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
}
