import { AudioKeys, AudioMeta, AUDIOS } from "@/constants/audios";
import { GameAudio } from "@/libs/audio/game-audio/GameAudio";

export const CELL_SCENE_AUDIOS: Record<AudioKeys, AudioMeta> = {
  knockOnTheDoor: AUDIOS.knockOnTheDoor,
};

export class AudioController {
  private gameAudio = new GameAudio();

  preloadAll(scene: Phaser.Scene) {
    Object.values(CELL_SCENE_AUDIOS).forEach(({ key, path }) =>
      this.gameAudio.preload(scene, key, path),
    );
  }

  create(scene: Phaser.Scene) {
    this.gameAudio.create(scene);
  }

  playKnockOnTheDoor(
    hitCount: number,
    maxHitsForMaxVolume = 3,
    minVolume = 0.5,
    maxVolume = 1,
  ) {
    const progress = Phaser.Math.Clamp(hitCount / maxHitsForMaxVolume, 0, 1);
    const volume = Phaser.Math.Linear(minVolume, maxVolume, progress);
    this.gameAudio.playSfx(CELL_SCENE_AUDIOS.knockOnTheDoor.key, { volume });
  }

  destroy() {
    this.gameAudio.destroy();
  }
}
