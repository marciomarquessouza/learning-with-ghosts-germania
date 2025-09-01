import { JOSEF_GHOST_IMG, GHOST_SHADOW_IMG } from "@/constants/images";

const JOSEF_GHOST = "ghost";
const GHOST_SHADOW = "ghostShadow";

export class GhostJosef {
  levitationX = 0;
  levitationY = 0;
  levitationSpeed: number = 0.05;
  levitationMax: number = 30;

  sprite: Phaser.Physics.Arcade.Sprite | null = null;
  shadow: Phaser.Physics.Arcade.Sprite | null = null;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  keyMap: {
    D: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
  } | null = null;
  speed = 160;
  pauseLevitation = false;

  constructor() {}

  preload(scene: Phaser.Scene) {
    const load: Phaser.Loader.LoaderPlugin = scene.load;
    load.image(JOSEF_GHOST, JOSEF_GHOST_IMG);
    load.image(GHOST_SHADOW, GHOST_SHADOW_IMG);
  }

  create(scene: Phaser.Scene, startX: number, startY: number) {
    this.sprite = scene.physics.add.sprite(startX, startY, JOSEF_GHOST);
    this.sprite.setDepth(10).setCollideWorldBounds(true);
    this.shadow = scene.physics.add
      .sprite(startX, startY + 170, GHOST_SHADOW)
      .setDepth(10);

    // TODO: implement mobile/tablet version
    if (!scene.input.keyboard) {
      throw new Error("Mobile/Table version not implemented");
    }

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keyMap = {
      A: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      D: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    return this.sprite;
  }

  levitationUpdate() {
    if (this.pauseLevitation) return;

    this.levitationX =
      this.levitationX >= Math.PI * 2
        ? 0
        : this.levitationX + this.levitationSpeed;
    this.levitationY = Math.sin(this.levitationX) * this.levitationMax;
    const scaleX = (this.shadow?.scaleX || 0) - this.levitationY * 0.0002;
    this.shadow?.setScale(scaleX, this.shadow?.scaleY);

    return this.levitationY;
  }

  update() {
    if (!this.sprite) return;
    const left = this.cursors?.left.isDown || this.keyMap?.A.isDown;
    const right = this.cursors?.right.isDown || this.keyMap?.D.isDown;

    let vx = 0;
    if (left) {
      vx -= this.speed;
      this.sprite.flipX = true;
    }

    if (right) {
      vx += this.speed;
      this.sprite.flipX = false;
    }

    const levitationY = this.levitationUpdate();
    this.sprite.setVelocity(vx, levitationY);
    this.shadow?.setPosition(this.sprite.x, this.shadow.y);
  }
}

export const ghostJosef = new GhostJosef();
