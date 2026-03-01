import { Vector2 } from "@/utils/vectors";

interface DropSeedOptions {
  x: number;
  startY: number;
  groundY: number;
  onImpact: (position: Vector2) => void;
}

class Seed {
  create(scene: Phaser.Scene) {
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

  dropSeed(
    scene: Phaser.Scene,
    { x, startY, groundY, onImpact }: DropSeedOptions,
  ) {
    const seed = scene.add.image(x, startY, "seed");
    seed.setOrigin(0.5);
    seed.setScale(1.4);
    seed.setDepth(10);

    scene.tweens.add({
      targets: seed,
      y: groundY,
      angle: "+=180",
      duration: 600,
      ease: "Cubic.easeIn",
      onComplete: () => {
        seed.destroy();
        this.impactParticles(scene, { x, y: groundY });
        onImpact({ x, y: groundY });
      },
    });
  }
}

export const seed = new Seed();
