import { getRequired } from "@/utils/getRequired";

export interface TutorBlockerZoneConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  debug?: boolean;
}

export class TutorBlockerZone {
  private _scene?: Phaser.Scene;
  private _zone?: Phaser.GameObjects.Zone;
  private _debugGraphics?: Phaser.GameObjects.Graphics;

  private get scene(): Phaser.Scene {
    return getRequired(this._scene, "TutorBlockerZone", "_scene");
  }

  private get zone(): Phaser.GameObjects.Zone {
    return getRequired(this._zone, "TutorBlockerZone", "_zone");
  }

  create(scene: Phaser.Scene, config: TutorBlockerZoneConfig) {
    this._scene = scene;
    const { x, y, width, height, debug = false } = config;

    this._zone = scene.add.zone(x, y, width, height);

    scene.physics.add.existing(this._zone, true);

    const body = this._zone.body as Phaser.Physics.Arcade.StaticBody;

    body.setSize(width, height);
    body.setOffset(0, 0);

    if (debug) {
      this.createDebug(x, y, width, height);
    }

    return this._zone;
  }

  addCollisionWith(
    player: Phaser.Types.Physics.Arcade.ArcadeColliderType,
  ): Phaser.Physics.Arcade.Collider {
    return this.scene.physics.add.collider(player, this.zone);
  }

  refreshBody() {
    const body = this.zone.body as Phaser.Physics.Arcade.StaticBody;
    body.updateFromGameObject();
  }

  destroy() {
    this._debugGraphics?.destroy();
    this._zone?.destroy();

    this._debugGraphics = undefined;
    this._zone = undefined;
    this._scene = undefined;
  }

  private createDebug(x: number, y: number, width: number, height: number) {
    this._debugGraphics = this.scene.add.graphics();

    this._debugGraphics.lineStyle(2, 0xff0000, 1);
    this._debugGraphics.fillStyle(0xff0000, 0.25);

    this._debugGraphics.fillRect(x - width / 2, y - height / 2, width, height);

    this._debugGraphics.strokeRect(
      x - width / 2,
      y - height / 2,
      width,
      height,
    );
  }
}
