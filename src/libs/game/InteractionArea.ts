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
  interactionArea!: Phaser.GameObjects.Zone;
  target!: Phaser.Physics.Arcade.Sprite | Phaser.GameObjects.Image;
  private scene: Phaser.Scene | null = null;
  public isOverlapping = false;
  private player!: Phaser.Types.Physics.Arcade.ArcadeColliderType;
  private onEnter?: () => void;
  private onLeave?: () => void;

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
    this.scene = scene;
    this.target = target;
    this.player = player;
    this.onEnter = onEnter;
    this.onLeave = onLeave;

    this.interactionArea = scene.add.zone(0, 0, width, height);
    scene.physics.add.existing(this.interactionArea, true);

    this.syncInteractionArea(offsetX, offsetY);

    scene.physics.add.overlap(
      player,
      this.interactionArea,
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

    const body = this.interactionArea.body as Phaser.Physics.Arcade.StaticBody;
    body.updateFromGameObject();
  }

  update() {
    if (!this.scene || !this.isOverlapping) return;

    const stillOverlapping = this.scene.physics.overlap(
      this.player,
      this.interactionArea,
    );

    if (!stillOverlapping) {
      this.isOverlapping = false;
      this.onLeave?.();
    }
  }
}
