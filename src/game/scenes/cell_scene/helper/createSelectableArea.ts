import { gameEvents, NoiseKeys } from "@/game/events";
import { useCellStore } from "@/store/cellStore";
import { useUiStore } from "@/store/uiStore";

export function createSelectableArea(
  scene: Phaser.Scene,
  position: { x: number; y: number },
  size: { width: number; height: number },
  key: NoiseKeys,
  onClick: () => void
) {
  const debugMode = useCellStore.getState().debugMode;
  const area = scene.add
    .rectangle(0, 0, size.width, size.height, 0x00ff00)
    .setOrigin(0.5, 0.5)
    .setAlpha(0.5)
    .setVisible(debugMode);
  const positionX = position.x;
  const positionY = position.y;
  const container = scene.add.container(
    positionX + area.width / 2,
    positionY + area.height / 2,
    area
  );
  container.setSize(area.width, area.height);
  container.setInteractive({ useHandCursor: true });

  container.on("pointerover", () => {
    if (useUiStore.getState().isInteractionDialogueOpen) return;
    gameEvents.emit("noise-effect", { key, position, size });
  });

  container.on("pointerout", () => {
    if (useUiStore.getState().isInteractionDialogueOpen) return;
    gameEvents.emit("noise-effect", { key: "default" });
    const hud = scene.children.getByName("hud") as Phaser.GameObjects.Container;

    scene.children.bringToTop(hud);
  });

  container.on("pointerdown", () => {
    if (useUiStore.getState().isInteractionDialogueOpen) return;
    onClick();
  });
}
