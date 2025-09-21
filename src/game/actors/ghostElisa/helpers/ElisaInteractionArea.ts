export class ElisaInteractionArea {
  interactionArea!: Phaser.GameObjects.Zone;
  elisa!: Phaser.Physics.Arcade.Sprite;
  public isOverlapping = false;
  private player!: Phaser.Types.Physics.Arcade.ArcadeColliderType;
  private onEnter?: () => void;
  private onLeave?: () => void;

  create(
    scene: Phaser.Scene,
    player: Phaser.Types.Physics.Arcade.ArcadeColliderType,
    elisa: Phaser.Physics.Arcade.Sprite,
    onEnter?: () => void,
    onLeave?: () => void
  ) {
    this.elisa = elisa;
    this.player = player;
    this.onEnter = onEnter;
    this.onLeave = onLeave;

    this.interactionArea = scene.add.zone(0, 0, 500, 400);
    scene.physics.add.existing(this.interactionArea, true);

    this.syncElisaInteractionArea();

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
      this
    );
  }

  syncElisaInteractionArea() {
    if (!this.elisa || !this.interactionArea) return;

    const bounds = this.elisa.getBounds();
    this.interactionArea.setPosition(bounds.centerX - 180, bounds.centerY);

    const body = this.interactionArea.body as Phaser.Physics.Arcade.StaticBody;
    body.updateFromGameObject();
  }

  update(scene: Phaser.Scene) {
    if (!this.isOverlapping) return;

    const stillOverlapping = scene.physics.overlap(
      this.player,
      this.interactionArea
    );

    if (!stillOverlapping) {
      this.isOverlapping = false;
      this.onLeave?.();
    }
  }
}

export const elisaInteractionArea = new ElisaInteractionArea();
