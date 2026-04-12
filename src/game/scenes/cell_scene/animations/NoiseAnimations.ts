import { Noise } from "./noises/Noise";
import { NoiseSelectable } from "./noises/NoiseSelectable";
import { NoiseDefault } from "./noises/NoiseDefault";
import { Vector4 } from "@/utils/vectors";

export class NoiseAnimations {
  private currentNoise: Noise | null = null;
  private readonly noiseDefault: Noise = new NoiseDefault();
  private readonly noiseSelectable: Noise = new NoiseSelectable();
  private scene!: Phaser.Scene;

  preload(scene: Phaser.Scene): void {
    this.noiseDefault.preload(scene);
    this.noiseSelectable.preload(scene);
  }

  create(scene: Phaser.Scene): void {
    this.scene = scene;
    this.currentNoise = this.noiseDefault;
    this.currentNoise.create(scene);
  }

  private destroyCurrent(): void {
    if (!this.currentNoise) return;

    this.currentNoise.destroy();
    this.currentNoise = null;
  }

  setNoiseArea(bounds: Vector4): void {
    this.destroyCurrent();
    this.currentNoise = this.noiseSelectable;
    this.currentNoise.create(this.scene, bounds);
  }

  resetNoiseArea(): void {
    this.destroyCurrent();
    this.currentNoise = this.noiseDefault;
    this.currentNoise.create(this.scene);
  }

  clearCellNoise() {
    this.currentNoise?.destroy();
  }

  destroy(): void {
    this.destroyCurrent();
    this.noiseDefault.destroy();
    this.noiseSelectable.destroy();
    this.currentNoise = null;
  }
}
