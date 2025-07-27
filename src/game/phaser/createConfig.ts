import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "@/constants/game";
import Phaser from "phaser";

export const createConfig = (
  scene: Phaser.Types.Scenes.SettingsConfig[] | Phaser.Scene[],
  overrideConfig: Phaser.Types.Core.GameConfig = {}
): Phaser.Types.Core.GameConfig => {
  return {
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    render: {
      pixelArt: false,
    },
    physics: {
      default: "arcade",
      arcade: {
        debug: false,
      },
    },
    scene,
    ...overrideConfig,
  };
};
