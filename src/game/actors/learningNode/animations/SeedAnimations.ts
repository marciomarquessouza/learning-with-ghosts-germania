import { Vector2 } from "@/utils/vectors";

export interface SeedPosition {
  x: number;
  startY: number;
  groundY: number;
}

export class SeedAnimations {
  constructor(
    private scene: Phaser.Scene,
    private seePosition: SeedPosition,
  ) {
    this.create(scene);
  }

  private create(scene: Phaser.Scene) {
    if (scene.textures.exists("seed")) return;
    const graphics = scene.make.graphics({ x: 0, y: 0 }, false);

    graphics.fillStyle(0x0d0d0d, 1);
    graphics.fillEllipse(6, 6, 6, 4);

    graphics.fillStyle(0x2a7a2a, 0.4);
    graphics.fillEllipse(6, 6, 4, 2);

    graphics.generateTexture("seed", 12, 12);
    graphics.destroy();
  }

  private impactParticles(scene: Phaser.Scene, position: Vector2) {
    const particles = scene.add.particles(position.x, position.y, "seed", {
      speed: { min: 20, max: 60 },
      angle: { min: 200, max: 340 },
      scale: { start: 0.25, end: 0 },
      alpha: { start: 0.8, end: 0 },
      lifespan: 250,
      gravityY: 300,
    });

    particles.explode(8, position.x, position.y);

    scene.time.delayedCall(300, () => {
      particles.destroy();
    });
  }

  dropSeed(): Promise<void> {
    return new Promise((resolve) => {
      const { x, startY, groundY } = this.seePosition;
      const seed = this.scene.add.image(x, startY, "seed");
      seed.setOrigin(0.5);
      seed.setScale(1.4);
      seed.setDepth(10);

      this.scene.tweens.add({
        targets: seed,
        y: groundY,
        angle: "+=180",
        duration: 600,
        ease: "Cubic.easeIn",
        onComplete: () => {
          seed.destroy();
          this.impactParticles(this.scene, { x, y: groundY });
          resolve();
        },
      });
    });
  }
}
