import { KRAMPUS_LIGHT_IMG } from "@/constants/images";

const KRAMPUS_LIGHT = "krampusLight";
const MAX_ALPHA = 0.8;
const MIN_ALPHA = 0.3;

class KrampusLight {
  preload(scene: Phaser.Scene) {
    scene.load.image(KRAMPUS_LIGHT, KRAMPUS_LIGHT_IMG);
  }

  create(scene: Phaser.Scene, startX: number, startY: number) {
    const container = scene.add.container(startX, startY);
    const krampusLight = scene.add.image(0, 0, KRAMPUS_LIGHT);

    krampusLight.setBlendMode(Phaser.BlendModes.HARD_LIGHT);
    krampusLight.setAlpha(MAX_ALPHA);

    scene.tweens.add({
      targets: krampusLight,
      alpha: { from: MIN_ALPHA, to: MAX_ALPHA },
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    container.add(krampusLight);

    return container;
  }
}

export const krampusLight = new KrampusLight();
