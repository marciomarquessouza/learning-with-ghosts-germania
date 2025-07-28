import { SISYPHUS_SIGNAL_IMG } from "@/constants/images";

const SISYPHUS_SIGNAL_KEY = "sisyphusSignal";

class SisyphusSignal {
  preload(scene: Phaser.Scene) {
    scene.load.image(SISYPHUS_SIGNAL_KEY, SISYPHUS_SIGNAL_IMG);
  }

  create(scene: Phaser.Scene) {
    const positionX = scene.scale.width / 2 + 75;
    const positionY = scene.cameras.main.centerY + 230;
    const container = scene.add.container(positionX, positionY);

    const signalImage = scene.add.image(0, 0, SISYPHUS_SIGNAL_KEY);
    signalImage.setOrigin(0.5, 0.5);
    signalImage.setAlpha(0.5);

    container.add(signalImage);

    return container;
  }
}

export const sisyphusSignal = new SisyphusSignal();
