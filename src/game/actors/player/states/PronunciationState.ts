import { BaseState } from "@/libs/game/state-machine/BaseState";
import { Player } from "../Player";
import { useAudioStore } from "@/store/audioStore";

const MEDIUM_THRESHOLD = 50;
const MIN_VOLUME = 0.01;
const MAX_VOLUME = 0.18;

export class PronunciationState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private player: Player,
  ) {
    super(scene);
  }

  enter(): void {
    this.player.animations.playIdle();
  }

  exit(): void {}

  private normalizeAudioRecorder(volume: number): number {
    if (volume <= MIN_VOLUME) {
      return 0;
    }

    const normalized = Math.min(
      1,
      (volume - MIN_VOLUME) / (MAX_VOLUME - MIN_VOLUME),
    );

    return Math.pow(normalized, 1.05) * 100;
  }

  update(): void {
    const { currentVoiceRecordingVolume } = useAudioStore.getState();
    const normalizeVolume = this.normalizeAudioRecorder(
      currentVoiceRecordingVolume,
    );

    if (normalizeVolume >= MEDIUM_THRESHOLD) {
      this.player.animations.playTalking();
    } else {
      this.player.animations.playIdle();
    }
  }

  handleInput(): void {}
}
