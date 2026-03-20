export interface AudioSfxPlayEvent {
  key: string;
  config?: Phaser.Types.Sound.SoundConfig;
}

export interface AudioVoicePlayEvent {
  key: string;
  config?: Phaser.Types.Sound.SoundConfig;
}

export interface AudioMusicPlayEvent {
  key: string;
  options?: {
    volume?: number;
    loop?: boolean;
    fadeInMs?: number;
  };
}

export interface AudioMusicStopEvent {
  fadeOutMs?: number;
}

export interface AudioMusicSetVolumeEvent {
  volume: number;
}

export interface AudioSfxSetVolumeEvent {
  volume: number;
}
