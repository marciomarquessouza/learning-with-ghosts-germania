import { AudioKeys, AudioMeta, AUDIOS } from "@/constants/audios";
import { AudioManager } from "@/libs/audio/game-audio/AudioManager";

export const CELL_SCENE_AUDIOS: Record<AudioKeys, AudioMeta> = {
  knockOnTheDoor: AUDIOS.knockOnTheDoor,
};

export class AudioController {
  private audioManager = new AudioManager();

  preloadAll(scene: Phaser.Scene) {
    Object.values(CELL_SCENE_AUDIOS).forEach(({ key, path }) =>
      this.audioManager.preload(scene, key, path),
    );
  }

  create(scene: Phaser.Scene) {
    this.audioManager.create(scene);
  }

  playKnockOnTheDoor(
    hitCount: number,
    maxHitsForMaxVolume = 3,
    minVolume = 0.5,
    maxVolume = 1,
  ) {
    const progress = Phaser.Math.Clamp(hitCount / maxHitsForMaxVolume, 0, 1);
    const volume = Phaser.Math.Linear(minVolume, maxVolume, progress);
    this.audioManager.playSfx(CELL_SCENE_AUDIOS.knockOnTheDoor.key, { volume });
  }

  destroy() {
    this.audioManager.destroy();
  }
}
