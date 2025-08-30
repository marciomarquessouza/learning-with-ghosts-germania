export class GhostJosef {
  sprite: Phaser.Physics.Arcade.Sprite;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  keyMap: {
    D: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
  };
  speed = 160;

  constructor(
    private scene: Phaser.Scene,
    textureKey: string,
    startX: number,
    startY: number
  ) {
    this.sprite = scene.physics.add.sprite(startX, startY, textureKey);
    this.sprite.setDepth(10).setCollideWorldBounds(true);

    // TODO: implement mobile/tablet version
    if (!scene.input.keyboard) {
      throw new Error("Mobile/Table version not implemented");
    }

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keyMap = {
      A: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      D: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
  }

  update() {
    const left = this.cursors.left.isDown || this.keyMap.A.isDown;
    const right = this.cursors.right.isDown || this.keyMap.D.isDown;

    let vx = 0;
    if (left) {
      vx -= this.speed;
      this.sprite.flipX = true;
    }

    if (right) {
      vx += this.speed;
      this.sprite.flipX = false;
    }

    this.sprite.setVelocity(vx, 0);
  }
}
