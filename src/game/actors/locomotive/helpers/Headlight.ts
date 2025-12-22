import { LOCOMOTIVE_HEADLIGHT_IMG } from "@/constants/images";

const HEADLIGHT = "headlight";

class Headlight {
  preload(scene: Phaser.Scene) {
    scene.load.image(HEADLIGHT, LOCOMOTIVE_HEADLIGHT_IMG);
  }

  create(scene: Phaser.Scene, startX: number, startY: number) {
    const container = scene.add.container(startX, startY);
    const beam = scene.add.image(0, 0, HEADLIGHT);
    beam.setBlendMode(Phaser.BlendModes.ADD);
    beam.setAlpha(0.6);

    container.add(beam);

    scene.tweens.add({
      targets: beam,
      alpha: { from: 0.45, to: 0.75 },
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    scene.tweens.add({
      targets: beam,
      x: "+=3",
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    return container;
  }
}

export const headlight = new Headlight();
