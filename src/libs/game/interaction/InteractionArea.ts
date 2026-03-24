interface Options {
  player: Phaser.Types.Physics.Arcade.ArcadeColliderType;
  target: Phaser.Physics.Arcade.Sprite | Phaser.GameObjects.Image;
  offsetX?: number;
  offsetY?: number;
  width: number;
  height: number;
  onEnter?: () => void;
  onLeave?: () => void;
}

export class InteractionArea {
  private interactionArea?: Phaser.GameObjects.Zone;
  private target?: Phaser.Physics.Arcade.Sprite | Phaser.GameObjects.Image;
  private scene?: Phaser.Scene;
  private player?: Phaser.Types.Physics.Arcade.ArcadeColliderType;
  private onEnter?: () => void;
  private onLeave?: () => void;
  private overlapCollider?: Phaser.Physics.Arcade.Collider;

  public isOverlapping = false;

  create(
    scene: Phaser.Scene,
    {
      player,
      target,
      width,
      height,
      offsetX = 0,
      offsetY = 0,
      onEnter,
      onLeave,
    }: Options,
  ) {
    this.destroy();

    this.scene = scene;
    this.target = target;
    this.player = player;
    this.onEnter = onEnter;
    this.onLeave = onLeave;
    this.isOverlapping = false;

    const interactionArea = scene.add.zone(0, 0, width, height);
    scene.physics.add.existing(interactionArea, true);

    this.interactionArea = interactionArea;

    this.syncInteractionArea(offsetX, offsetY);

    this.overlapCollider = scene.physics.add.overlap(
      player,
      interactionArea,
      () => {
        if (!this.isOverlapping) {
          this.isOverlapping = true;
          this.onEnter?.();
        }
      },
      undefined,
      this,
    );
  }

  syncInteractionArea(offsetX: number, offsetY: number) {
    if (!this.target || !this.interactionArea) return;

    const bounds = this.target.getBounds();

    this.interactionArea.setPosition(
      bounds.centerX + offsetX,
      bounds.centerY + offsetY,
    );

    const body = this.interactionArea.body as
      | Phaser.Physics.Arcade.StaticBody
      | undefined;
    body?.updateFromGameObject();
  }

  update() {
    if (
      !this.scene ||
      !this.player ||
      !this.interactionArea ||
      !this.isOverlapping
    ) {
      return;
    }

    const stillOverlapping = this.scene.physics.overlap(
      this.player,
      this.interactionArea,
    );

    if (!stillOverlapping) {
      this.isOverlapping = false;
      this.onLeave?.();
    }
  }

  destroy() {
    this.overlapCollider?.destroy();
    this.overlapCollider = undefined;

    this.interactionArea?.destroy();
    this.interactionArea = undefined;

    this.target = undefined;
    this.player = undefined;
    this.scene = undefined;
    this.onEnter = undefined;
    this.onLeave = undefined;
    this.isOverlapping = false;
  }
}
