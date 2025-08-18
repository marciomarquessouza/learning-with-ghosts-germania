import {
  HUD_THERMOMETER_IMG,
  HUD_THERMOMETER_IMG_WIDTH,
  HUD_WEIGHT_POINTER_HEIGHT,
} from "@/constants/images";

const HUD_THERMOMETER_BACKGROUND = "hudThermometerBackground";

/**
 * 0.01: INITIAL
 * 0.01 - 0.46: UNFAMILIAR
 * 0.46 - 0.76: GOOD
 * 0.76 - 1: MASTER
 */

class HudStamps {
  preload(scene: Phaser.Scene): void {
    scene.load.image(HUD_THERMOMETER_BACKGROUND, HUD_THERMOMETER_IMG);
  }

  create(scene: Phaser.Scene): Phaser.GameObjects.Container {
    const positionX = scene.scale.width - HUD_THERMOMETER_IMG_WIDTH / 2;
    const positionY = scene.cameras.main.centerY;
    const container = scene.add.container(positionX, positionY);

    const background = scene.add.image(0, 0, HUD_THERMOMETER_BACKGROUND);

    container.add(background);

    const indicator = scene.add.graphics();
    container.add(indicator);

    const baseX = -10;
    const baseY = HUD_WEIGHT_POINTER_HEIGHT + 76;
    indicator.setPosition(baseX, baseY);

    function updateThermometer(level: number) {
      const maxHeight = 485;
      const targetHeight = maxHeight * level;
      indicator.clear();
      indicator.fillStyle(0xd0021b);

      indicator.fillRect(0, -targetHeight, 20, targetHeight);
    }

    updateThermometer(0);

    scene.tweens.add({
      targets: { value: 0 },
      value: 0.8,
      duration: 1500,
      ease: "Sine.easeInOut",
      onUpdate: (tween) => {
        const value = tween.getValue() || 0;
        updateThermometer(value);
      },
    });

    document.fonts.ready.then(() => {
      const countText = scene.add.text(
        0,
        HUD_WEIGHT_POINTER_HEIGHT + 320,
        "THIS LESSON",
        {
          fontFamily: "SpecialElite",
          fontSize: "25px",
          color: "#FFFFFF",
        }
      );
      countText.setOrigin(0.5, 1);
      container.add(countText);
    });

    return container;
  }
}

export const hudStamps = new HudStamps();
