// src/game/actors/audio/AudioActor.ts
import {
  AudioAsyncEvents,
  AudioEvents,
  AudioSyncEvents,
} from "@/events/audio/events";
import { AudioManager } from "@/libs/audio/game-audio/AudioManager";
import { AsyncHandler } from "@/libs/events/types";

export class AudioActor {
  private audioManager: AudioManager;
  private unbinds: Array<() => void> = [];

  constructor(
    private scene: Phaser.Scene,
    private audioEventBus: AudioEvents,
  ) {
    this.audioManager = new AudioManager(scene);
  }

  private onSync<K extends keyof AudioSyncEvents>(
    type: K,
    handler: (event: AudioSyncEvents[K]) => void,
  ) {
    this.audioEventBus.sync.on(type, handler);
    this.unbinds.push(() => this.audioEventBus.sync.off(type, handler));
  }

  private onAsync<K extends keyof AudioAsyncEvents>(
    type: K,
    handler: AsyncHandler<AudioAsyncEvents[K]>,
  ) {
    this.audioEventBus.async.on(type, handler);
    this.unbinds.push(() => this.audioEventBus.async.off(type, handler));
  }

  public create() {
    this.onSync("audio:unlock", () => {
      this.audioManager.unlock();
    });

    this.onSync("audio:mute", () => {
      this.audioManager.mute();
    });

    this.onSync("audio:unmute", () => {
      this.audioManager.unmute();
    });

    this.onSync("audio:sfx:play", ({ key, config }) => {
      this.audioManager.playSfx(key, config);
    });

    this.onAsync("audio:voice:play", ({ key, config }, done) => {
      const sound = this.audioManager.playVoice(key, config);

      if (!sound) {
        done();
        return;
      }

      sound.once("complete", () => {
        sound.destroy();
        done();
      });

      sound.once("stop", () => {
        sound.destroy();
        done();
      });
    });

    this.onSync("audio:music:play", ({ key, options }) => {
      this.audioManager.playMusic(key, options);
    });

    this.onSync("audio:music:stop", (options) => {
      this.audioManager.stopMusic(options);
    });
  }

  private unbindAll() {
    this.unbinds.forEach((unbind) => unbind());
    this.unbinds = [];
  }

  public destroy() {
    this.unbindAll();
    this.audioManager.destroy();
  }
}
