type MusicPlayOptions = {
  volume?: number;
  loop?: boolean;
  fadeInMs?: number;
};

type StopMusicOptions = {
  fadeOutMs?: number;
};

export class AudioManager {
  private currentMusic?: Phaser.Sound.BaseSound;

  private isUnlocked = false;
  private isMuted = false;

  private masterVolume = 1;
  private musicVolume = 0.6;
  private sfxVolume = 1;
  private voiceVolume = 1;

  constructor(private scene: Phaser.Scene) {}

  public unlock() {
    this.isUnlocked = true;
  }

  public mute() {
    this.isMuted = true;
    this.scene.sound.mute = true;
  }

  public setMasterVolume(volume: number) {
    this.masterVolume = Phaser.Math.Clamp(volume, 0, 1);
    this.scene.sound.setVolume(this.masterVolume);
  }

  public setMusicVolume(volume: number) {
    this.musicVolume = Phaser.Math.Clamp(volume, 0, 1);
  }

  public setVoiceVolume(volume: number) {
    this.voiceVolume = Phaser.Math.Clamp(volume, 0, 1);
  }

  public setSfxVolume(volume: number) {
    this.sfxVolume = Phaser.Math.Clamp(volume, 0, 1);
  }

  public unmute() {
    this.isMuted = false;
    this.scene.sound.mute = false;
  }

  public playVoice(key: string, config?: Phaser.Types.Sound.SoundConfig) {
    if (this.isMuted || !this.isUnlocked) return;

    const sound = this.scene.sound.add(key, {
      ...config,
      volume: (config?.volume ?? 1) * this.voiceVolume,
    });

    sound.play();

    return sound;
  }

  public playSfx(key: string, config?: Phaser.Types.Sound.SoundConfig) {
    if (this.isMuted || !this.isUnlocked) return;

    return this.scene.sound.play(key, {
      ...config,
      volume: (config?.volume ?? 1) * this.sfxVolume,
    });
  }

  public playMusic(key: string, musicPlayOptions: MusicPlayOptions = {}) {
    if (this.isMuted || !this.isUnlocked) return;

    const {
      volume = this.musicVolume,
      loop = true,
      fadeInMs = 0,
    } = musicPlayOptions;

    if (this.currentMusic?.key === key && this.currentMusic?.isPlaying) {
      return;
    }

    this.stopMusic();

    const music = this.scene.sound.add(key, {
      loop,
      volume: fadeInMs > 0 ? 0 : volume,
    });

    music.play();

    this.currentMusic = music;

    if (fadeInMs > 0) {
      this.scene.tweens.add({
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
      this.scene.tweens.add({
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

  public getSnapshot() {
    return {
      isUnlocked: this.isUnlocked,
      isMuted: this.isMuted,
      masterVolume: this.masterVolume,
      musicVolume: this.musicVolume,
      sfxVolume: this.sfxVolume,
      voiceVolume: this.voiceVolume,
    };
  }
}
