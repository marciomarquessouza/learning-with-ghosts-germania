import { PUNISHER_LIGHT_IMG } from "@/constants/images";

const PUNISHER_LIGHT = "punisherLight";
const MAX_ALPHA = 0.8;
const MIN_ALPHA = 0.3;

export class PunisherLight {
  preload(scene: Phaser.Scene) {
    scene.load.image(PUNISHER_LIGHT, PUNISHER_LIGHT_IMG);
  }

  create(scene: Phaser.Scene, startX: number, startY: number) {
    const container = scene.add.container(startX, startY);
    const punisherLight = scene.add.image(0, 0, PUNISHER_LIGHT);

    punisherLight.setBlendMode(Phaser.BlendModes.HARD_LIGHT);
    punisherLight.setAlpha(MAX_ALPHA);

    scene.tweens.add({
      targets: punisherLight,
      alpha: { from: MIN_ALPHA, to: MAX_ALPHA },
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    container.add(punisherLight);

    return container;
  }
}
