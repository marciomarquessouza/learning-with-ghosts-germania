export function drawDebugOutline(
  scene: Phaser.Scene,
  gameObject: Phaser.GameObjects.GameObject
): void {
  const debug = scene.add.graphics();
  debug.setDepth(9999);

  const bounds = (
    gameObject as unknown as Phaser.GameObjects.Components.GetBounds
  ).getBounds?.();
  if (!bounds) return;

  debug.lineStyle(1, 0xff0000, 1);
  debug.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);

  debug.fillStyle(0x00ff00, 1);
  const { x, y } =
    gameObject as unknown as Phaser.GameObjects.Components.Transform;
  debug.fillCircle(x, y, 4);
}
