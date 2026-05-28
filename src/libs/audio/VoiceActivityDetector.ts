interface VoiceActivityDetectorOptions {
  threshold?: number;
  silenceThreshold?: number;
  onSpeakingStart?: () => void;
  onSpeakingEnd?: () => void;
  onVolumeChange?: () => void;
}

export class VoiceActivityDetector {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private isSpeaking = false;
  private speakingThreshold: number;
  private silenceDuration = 0;
  private silenceThreshold: number;

  private onSpeakingStart: () => void;
  private onSpeakingEnd: () => void;
  private onVolumeChange: () => void;

  constructor(stream: MediaStream, options: VoiceActivityDetectorOptions) {
    // TODO: Adjust after tests
    this.speakingThreshold = options.threshold || 0.1;
    // Default: 1 second of silence
    this.silenceThreshold = options.silenceThreshold || 1000;

    this.onSpeakingStart = options.onSpeakingStart || (() => {});
    this.onSpeakingEnd = options.onSpeakingEnd || (() => {});
    this.onVolumeChange = options.onVolumeChange || (() => {});

    this.initialize(stream);
  }

  initialize(stream: MediaStream) {
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
  }
}
