import { Noise } from "./helper/noise/Noise";
import { noiseBed } from "./helper/noise/noiseBed";
import { noiseDefault } from "./helper/noise/noiseDefault";
import { noiseDesk } from "./helper/noise/noiseDesk";
import { gameEvents } from "@/game/events";

class NoiseEffect {
  private currentNoise: Noise | null = null;

  preload(scene: Phaser.Scene): void {
    noiseDefault.preload(scene);
    noiseDesk.preload(scene);
    noiseBed.preload(scene);
  }

  create(scene: Phaser.Scene) {
    this.update(scene, noiseDefault);
    gameEvents.on("noise-effect", (noiseType) => {
      switch (noiseType) {
        case "desk":
          this.update(scene, noiseDesk);
          break;
        case "bed":
          this.update(scene, noiseBed);
          break;
        case "default":
        default:
          this.update(scene, noiseDefault);
          break;
      }
    });
  }

  update(scene: Phaser.Scene, noise: Noise) {
    if (this.currentNoise) {
      this.currentNoise.destroy();
      this.currentNoise = null;
    }
    this.currentNoise = noise;
    this.currentNoise.create(scene);
  }
}

export const noiseEffect = new NoiseEffect();
