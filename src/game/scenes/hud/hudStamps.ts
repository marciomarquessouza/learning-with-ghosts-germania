import {
  HUD_STAMPS_IMG,
  HUD_STAMPS_IMG_WIDTH,
  HUD_STAMPS_IMG_HEIGHT,
} from "@/constants/images";

const HUD_STAMPS_BACKGROUND = "hudStampsBackground";

class HudStamps {
  preload(scene: Phaser.Scene): void {
    scene.load.image(HUD_STAMPS_BACKGROUND, HUD_STAMPS_IMG);
  }

  create(scene: Phaser.Scene): Phaser.GameObjects.Container {
    const positionX = scene.scale.width - HUD_STAMPS_IMG_WIDTH / 2;
    const positionY = scene.cameras.main.centerY;
    const container = scene.add.container(positionX, positionY);

    const background = scene.add.image(0, 0, HUD_STAMPS_BACKGROUND);

    container.add(background);

    const countText = scene.add.text(
      -HUD_STAMPS_IMG_WIDTH / 2 + 36,
      HUD_STAMPS_IMG_HEIGHT / 2 - 45,
      "Total: 0/4",
      {
        fontFamily: "SpecialElite",
        fontSize: "25px",
        color: "#000000",
      }
    );

    container.add(countText);

    return container;
  }

  update() {
    // Update HUD elements based on game state
  }
}

export const hudStamps = new HudStamps();
