import { HUD_ACTIONS_IMG, HUD_WEIGHT_IMG_WIDTH } from "@/constants/images";

const HUD_ACTIONS_BACKGROUND = "hudActionsBackground";

class HUdActions {
  preload(scene: Phaser.Scene) {
    scene.load.image(HUD_ACTIONS_BACKGROUND, HUD_ACTIONS_IMG);
  }

  create(scene: Phaser.Scene): Phaser.GameObjects.Container {
    const positionX = HUD_WEIGHT_IMG_WIDTH / 2;
    const positionY = scene.cameras.main.centerY + 200;
    const container = scene.add.container(positionX, positionY);
    const background = scene.add.image(0, 0, HUD_ACTIONS_BACKGROUND);
    container.add(background);

    return container;
  }
}

export const hudActions = new HUdActions();
