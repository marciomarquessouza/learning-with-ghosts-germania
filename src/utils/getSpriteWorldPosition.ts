import { Vector2 } from "./vectors";

export function getSpriteWorldPosition(
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
): Vector2 {
  const matrix = sprite.getWorldTransformMatrix();
  const position = new Phaser.Math.Vector2();

  matrix.transformPoint(0, 0, position);

  return { x: position.x, y: position.y };
}
