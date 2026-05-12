import { Vector2 } from "@/utils/vectors";

export interface SeedPosition {
  x: number;
  startY: number;
  groundY: number;
}

export class SeedAnimations {
  private _scene?: Phaser.Scene;
  private _seedPosition?: SeedPosition;

  private static readonly SEED_TEXTURE_KEY = "magic-seed";
  private static readonly PARTICLE_TEXTURE_KEY = "magic-seed-particle";

  private get scene(): Phaser.Scene {
    if (!this._scene) {
      throw new Error("SeedAnimations: scene was not created");
    }

    return this._scene;
  }

  private get seedPosition(): SeedPosition {
    if (!this._seedPosition) {
      throw new Error("SeedAnimations: seedPosition was not created");
    }

    return this._seedPosition;
  }

  public create(scene: Phaser.Scene, seedPosition: SeedPosition) {
    this._seedPosition = seedPosition;
    this._scene = scene;

    this.spawnSeedTexture();
    this.spawnParticleTexture();
  }

  private spawnSeedTexture() {
    if (this.scene.textures.exists(SeedAnimations.SEED_TEXTURE_KEY)) return;

    const graphics = this.scene.make.graphics({ x: 0, y: 0 }, false);

    graphics.fillStyle(0xffb347, 0.35);
    graphics.fillEllipse(12, 12, 18, 14);

    graphics.fillStyle(0x4a2208, 1);
    graphics.fillEllipse(12, 12, 12, 9);

    graphics.fillStyle(0xff8c1a, 1);
    graphics.fillEllipse(12, 12, 9, 6);

    graphics.fillStyle(0xffe0a3, 0.9);
    graphics.fillEllipse(9, 10, 3, 2);

    graphics.fillStyle(0xffffff, 0.75);
    graphics.fillCircle(9, 10, 1);

    graphics.generateTexture(SeedAnimations.SEED_TEXTURE_KEY, 24, 24);
    graphics.destroy();
  }

  private spawnParticleTexture() {
    if (this.scene.textures.exists(SeedAnimations.PARTICLE_TEXTURE_KEY)) return;

    const graphics = this.scene.make.graphics({ x: 0, y: 0 }, false);

    graphics.fillStyle(0xffc266, 1);
    graphics.fillCircle(4, 4, 3);

    graphics.fillStyle(0xffffff, 0.8);
    graphics.fillCircle(3, 3, 1);

    graphics.generateTexture(SeedAnimations.PARTICLE_TEXTURE_KEY, 8, 8);
    graphics.destroy();
  }

  private impactParticles(scene: Phaser.Scene, position: Vector2) {
    const particles = scene.add.particles(
      position.x,
      position.y,
      SeedAnimations.PARTICLE_TEXTURE_KEY,
      {
        speed: { min: 30, max: 90 },
        angle: { min: 200, max: 340 },
        scale: { start: 0.8, end: 0 },
        alpha: { start: 1, end: 0 },
        lifespan: 450,
        gravityY: 260,
        blendMode: Phaser.BlendModes.ADD,
      },
    );

    particles.setDepth(20);
    particles.explode(14, position.x, position.y);

    scene.time.delayedCall(500, () => {
      particles.destroy();
    });
  }

  dropSeed(): Promise<void> {
    return new Promise((resolve) => {
      const { x, startY, groundY } = this.seedPosition;

      const seed = this.scene.add.image(
        x,
        startY,
        SeedAnimations.SEED_TEXTURE_KEY,
      );

      seed.setOrigin(0.5);
      seed.setScale(1.4);
      seed.setDepth(20);
      seed.setAlpha(1);

      seed.setBlendMode(Phaser.BlendModes.ADD);

      this.scene.tweens.add({
        targets: seed,
        scale: 1.75,
        alpha: 0.85,
        duration: 180,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

      this.scene.tweens.add({
        targets: seed,
        y: groundY,
        angle: "+=240",
        duration: 700,
        ease: "Cubic.easeIn",
        onComplete: () => {
          this.scene.tweens.killTweensOf(seed);

          seed.destroy();

          this.impactParticles(this.scene, {
            x,
            y: groundY,
          });

          resolve();
        },
      });
    });
  }
}
