import { Noise } from "./helper/noise/Noise";
import { noiseDefault } from "./helper/noise/noiseDefault";
import { noiseSelectable } from "./helper/noise/noiseSelectable";
import { gameEvents } from "@/game/events";

class NoiseEffect {
  private currentNoise: Noise | null = null;

  preload(scene: Phaser.Scene): void {
    noiseDefault.preload(scene);
    noiseSelectable.preload(scene);
  }

  create(scene: Phaser.Scene) {
    gameEvents.on("noise-effect", (payload) => {
      if (this.currentNoise) {
        this.currentNoise.destroy();
        this.currentNoise = null;
      }

      if (payload.key === "selectable") {
        this.currentNoise = noiseSelectable;
        this.currentNoise.create(scene, payload.position, payload.size);
      } else {
        this.currentNoise = noiseDefault;
        this.currentNoise.create(scene);
      }
    });
  }
}

export const noiseEffect = new NoiseEffect();
