import { getAudioActions, getAudioStates } from "@/store/audioStore";

export type MusicPlayOptions = {
  volume?: number;
  loop?: boolean;
  fadeInMs?: number;
};

export type StopMusicOptions = {
  fadeOutMs?: number;
};

export const AUDIO_SPEED = {
  NORMAL: 1,
  SLOW: 0.75,
  SLOWEST: 0.5,
} as const;

export class AudioManager {
  private currentMusic?: Phaser.Sound.BaseSound;
  private scene?: Phaser.Scene;

  public preload(scene: Phaser.Scene, key: string, file: string) {
    scene.load.audio(key, file);
  }

  create(scene: Phaser.Scene) {
    this.scene = scene;
    const { masterVolume, isMuted } = getAudioStates();

    scene.sound.setVolume(masterVolume);
    scene.sound.mute = isMuted;
  }

  private getScene(): Phaser.Scene {
    if (!this.scene) {
      throw new Error("Scene not available");
    }
    return this.scene;
  }

  public unlock() {
    getAudioActions().unlock();
  }

  public mute() {
    getAudioActions().mute();
    this.getScene().sound.mute = true;
  }

  public setMasterVolume(volume: number) {
    const masterVolume = Phaser.Math.Clamp(volume, 0, 1);
    getAudioActions().setMasterVolume(masterVolume);
    this.getScene().sound.setVolume(masterVolume);
  }

  public setMusicVolume(volume: number) {
    const musicVolume = Phaser.Math.Clamp(volume, 0, 1);
    getAudioActions().setMusicVolume(musicVolume);
  }

  public setVoiceVolume(volume: number) {
    const voiceVolume = Phaser.Math.Clamp(volume, 0, 1);
    getAudioActions().setVoiceVolume(voiceVolume);
  }

  public setSfxVolume(volume: number) {
    const sfxVolume = Phaser.Math.Clamp(volume, 0, 1);
    getAudioActions().setSfxVolume(sfxVolume);
  }

  public unmute() {
    getAudioActions().unmute();
    this.getScene().sound.mute = false;
  }

  public async playVoice(
    key: string,
    config?: Phaser.Types.Sound.SoundConfig,
  ): Promise<Phaser.Sound.BaseSound | null> {
    const { isMuted, isUnlocked, voiceVolume } = getAudioStates();

    if (isMuted || !isUnlocked) {
      return Promise.resolve(null);
    }

    const sound = this.getScene().sound.add(key, {
      ...config,
      volume: (config?.volume ?? 1) * voiceVolume,
    });

    return new Promise((resolve) => {
      const cleanup = () => {
        sound.off("complete", cleanup);
        sound.off("stop", cleanup);

        this.getScene().sound.remove(sound);

        resolve(sound);
      };

      sound.once("complete", cleanup);
      sound.once("stop", cleanup);

      sound.play();
    });
  }

  public playSfx(key: string, config?: Phaser.Types.Sound.SoundConfig) {
    const { isMuted, isUnlocked, sfxVolume } = getAudioStates();

    if (isMuted || !isUnlocked) return;

    return this.getScene().sound.play(key, {
      ...config,
      loop: false,
      volume: (config?.volume ?? 1) * sfxVolume,
    });
  }

  public playMusic(key: string, musicPlayOptions: MusicPlayOptions = {}) {
    const { isMuted, isUnlocked, musicVolume } = getAudioStates();
    if (isMuted || !isUnlocked) return;

    const {
      volume = musicVolume,
      loop = true,
      fadeInMs = 0,
    } = musicPlayOptions;

    if (this.currentMusic?.key === key && this.currentMusic?.isPlaying) {
      return;
    }

    this.stopMusic();

    const music = this.getScene().sound.add(key, {
      loop,
      volume: fadeInMs > 0 ? 0 : volume,
    });

    music.play();

    this.currentMusic = music;

    if (fadeInMs > 0) {
      this.getScene().tweens.add({
        targets: music,
        volume,
        duration: fadeInMs,
      });
    }
  }

  public stopMusic(stopMusicOptions: StopMusicOptions = {}) {
    if (!this.currentMusic) return;

    const { fadeOutMs = 0 } = stopMusicOptions;
    const music = this.currentMusic;

    this.currentMusic = undefined;

    if (fadeOutMs > 0) {
      this.getScene().tweens.add({
        targets: music,
        volume: 0,
        duration: fadeOutMs,
        onComplete: () => {
          music.stop();
          music.destroy();
        },
      });
      return;
    }

    music.stop();
    music.destroy();
  }

  public destroy() {
    this.stopMusic();
  }
}
