export function onAnimationComplete(
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  animationKey: string,
  action: () => void,
) {
  const handler = (animation: Phaser.Animations.Animation) => {
    if (animation.key !== animationKey) return;

    action();

    // remove after action
    sprite.off(Phaser.Animations.Events.ANIMATION_COMPLETE, handler);
  };

  sprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE, handler);
}
