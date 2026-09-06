export type TriggerZoneOptions = {
  x: number;
  y: number;
  height: number;
  width: number;
  once?: boolean;
};

export class TriggerZone {
  private zone?: Phaser.GameObjects.Zone;
  private triggered = false;

  create(
    scene: Phaser.Scene,
    target: Phaser.GameObjects.GameObject,
    options: TriggerZoneOptions,
    onTrigger: () => void,
  ) {
    const { x, y, width, height, once } = options;
    this.zone = scene.add.zone(x, y, width, height);

    scene.physics.add.existing(this.zone, true);

    scene.physics.add.overlap(target, this.zone, () => {
      if (once && this.triggered) {
        return;
      }

      this.triggered = true;

      onTrigger();
    });
  }

  reset() {
    this.triggered = false;
  }

  destroy() {
    this.zone?.destroy();
    this.zone = undefined;
  }
}
