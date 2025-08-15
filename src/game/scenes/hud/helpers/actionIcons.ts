import {
  HUD_ACTION_BARS_IMG,
  HUD_ACTION_CHALLENGE_IMG,
  HUD_ACTION_SOLITARY_IMG,
  HUD_ACTION_EXIT_IMG,
} from "@/constants/images";
import { attachBadgeToIcon } from "./attachBadgeIcon";

const ICON_HEIGHT = 110;
const LIST_GAP = 5;
const HOVER_SCALE = 1.08;
const DOWN_SCALE = 0.94;
const TWEEN_MS = 120;

export enum ACTIONS_ICONS {
  BARS = "BARS",
  SOLITARY = "SOLITARY",
  CHALLENGE = "CHALLENGE",
  EXIT = "EXIT",
}

export interface ActionIconMap {
  name: ACTIONS_ICONS;
  action: () => void;
}

class ActionIcons {
  private badgeActions: {
    [key: string]: { setCount: (qnt: number) => void };
  } = {};

  preload(scene: Phaser.Scene): void {
    scene.load.image(ACTIONS_ICONS.BARS, HUD_ACTION_BARS_IMG);
    scene.load.image(ACTIONS_ICONS.SOLITARY, HUD_ACTION_SOLITARY_IMG);
    scene.load.image(ACTIONS_ICONS.CHALLENGE, HUD_ACTION_CHALLENGE_IMG);
    scene.load.image(ACTIONS_ICONS.EXIT, HUD_ACTION_EXIT_IMG);
  }

  create(scene: Phaser.Scene, iconsMap: ActionIconMap[]) {
    const actionItemsContainer = scene.add.container(0, -180);

    let positionY = 0;
    iconsMap.forEach((actionIcon) => {
      const iconImage = scene.add.image(0, positionY, actionIcon.name);
      iconImage.setInteractive({ useHandCursor: true });

      iconImage.on("pointerover", () => {
        scene.tweens.add({
          targets: iconImage,
          scale: HOVER_SCALE,
          duration: TWEEN_MS,
          ease: "Quad.easeOut",
        });
      });

      iconImage.on("pointerout", () => {
        scene.tweens.add({
          targets: iconImage,
          scale: 1,
          duration: TWEEN_MS,
          ease: "Quad.easeOut",
        });
      });

      iconImage.on("pointerdown", () => {
        scene.tweens.add({
          targets: iconImage,
          scale: DOWN_SCALE,
          duration: TWEEN_MS,
          ease: "Quad.easeOut",
          yoyo: true,
          hold: 30,
          onComplete: () => {
            actionIcon.action();
          },
        });
      });

      actionItemsContainer.add(iconImage);

      const { setCount } = attachBadgeToIcon(scene, iconImage, 3, {
        offsetX: 0,
        offsetY: 30,
        backgroundColor: 0xb30a0a,
        strokeWidth: 1.2,
      });

      setCount(0);
      this.badgeActions[actionIcon.name] = { setCount };

      positionY += ICON_HEIGHT + LIST_GAP;
    });

    return actionItemsContainer;
  }

  setBadgeCount(icon: ACTIONS_ICONS, qnt: number) {
    this.badgeActions[icon]?.setCount(qnt);
  }
}

export const actionIcons = new ActionIcons();
