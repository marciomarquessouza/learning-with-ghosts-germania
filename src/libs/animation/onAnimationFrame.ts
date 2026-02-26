export function onAnimationFrame(
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  animationKey: string,
  frameIndex: number,
  action: () => void,
) {
  const handler = (
    animation: Phaser.Animations.Animation,
    frame: Phaser.Animations.AnimationFrame,
  ) => {
    if (animation.key !== animationKey) return;
    if (frame.index !== frameIndex) return;

    action();

    // remove after action
    sprite.off(Phaser.Animations.Events.ANIMATION_UPDATE, handler);
  };

  sprite.on(Phaser.Animations.Events.ANIMATION_UPDATE, handler);
}
