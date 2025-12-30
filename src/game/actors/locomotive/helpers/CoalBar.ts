type Options = {
  x: number;
  y: number;
  labelText: string;
  width?: number;
  height?: number;
  maxHp?: number;
  currentHp?: number;
};

class CoalBar {
  private container!: Phaser.GameObjects.Container;
  private mainBar!: Phaser.GameObjects.Rectangle;
  private backBar!: Phaser.GameObjects.Rectangle;
  private label!: Phaser.GameObjects.Text;

  create(scene: Phaser.Scene, options: Options) {
    const { x, y, labelText } = options;
    const width = options.width || 300;
    const height = options.height || 40;

    this.container = scene.add.container(x, y);
    this.mainBar = scene.add
      .rectangle(0, 0, width, height, 0x000000)
      .setOrigin(0, 0.5);
    this.backBar = scene.add
      .rectangle(0, 0, width, height, 0xc20013)
      .setOrigin(0, 0.5);
    scene.add
      .text(width * 2, -height / 2 - 5, labelText, {
        fontFamily: "Arial",
        fontSize: "16px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0, 0.5);
  }
}
