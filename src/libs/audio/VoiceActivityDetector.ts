interface VoiceActivityDetectorOptions {
  threshold?: number;
  silenceThreshold?: number;
  onSpeakingStart?: () => void;
  onSpeakingEnd?: () => void;
  onVolumeChange?: (volume: number) => void;
}

export class VoiceActivityDetector {
  public isSpeaking = false;

  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array<ArrayBuffer> | null = null;
  private speakingThreshold: number;
  private silenceDuration = 0;
  private silenceThreshold: number;
  private bufferLength: number = 0;
  private lastSpeakingTime = 0;

  private onSpeakingStart: () => void;
  private onSpeakingEnd: () => void;
  private onVolumeChange: (volume: number) => void;

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

    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.8;

    const source = this.audioContext.createMediaStreamSource(stream);
    source.connect(this.analyser);

    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);

    this.detectSpeaking();
  }

  detectSpeaking() {
    if (!this.dataArray) return;

    this.analyser?.getByteFrequencyData(this.dataArray);

    let sum = 0;
    for (let i = 0; i < this.bufferLength; i++) {
      sum += this.dataArray[i];
    }
    const averageVolume = sum / this.bufferLength / 255;

    this.onVolumeChange(averageVolume);

    const currentlySpeaking = averageVolume > this.speakingThreshold;
    const now = Date.now();

    if (currentlySpeaking) {
      this.lastSpeakingTime = now;
      if (!this.isSpeaking) {
        this.isSpeaking = true;
        this.onSpeakingStart();
      }
    } else {
      if (
        this.isSpeaking &&
        now - this.lastSpeakingTime > this.silenceThreshold
      ) {
        this.isSpeaking = false;
        this.onSpeakingEnd();
      }
    }

    requestAnimationFrame(() => this.detectSpeaking());
  }

  getVolume() {
    if (!this.dataArray) return;

    this.analyser?.getByteFrequencyData(this.dataArray);

    let sum = 0;
    for (let i = 0; i < this.bufferLength; i++) {
      sum += this.dataArray[i];
    }
    return sum / this.bufferLength / 255;
  }

  destroy() {
    this.audioContext?.close();
  }
}
