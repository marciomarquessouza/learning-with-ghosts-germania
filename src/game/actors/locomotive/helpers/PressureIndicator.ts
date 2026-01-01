import { gameEvents } from "@/events/gameEvents";

type Options = {
  x: number;
  y: number;
  width?: number;
  height?: number;
  initialPercent?: number;
  fillColor?: number;
  bgColor?: number;
  borderColor?: number;
  borderWidth?: number;
  padding?: number;
  label?: string;
  fontFamily?: string;
  fontSize?: number;
};

class PressureIndicator {
  private container?: Phaser.GameObjects.Container;

  private gfx?: Phaser.GameObjects.Graphics;
  private text?: Phaser.GameObjects.Text;

  private percent = 0;

  private width = 248;
  private height = 38;

  private padding = 2;
  private bgColor = 0xc00000;
  private fillColor = 0x000000;
  private borderColor = 0xffffff;
  private borderWidth = 1;

  private label = "PRESSURE";
  private fontFamily = "JosefinSans";
  private fontSize = 18;

  private offFn?: () => void;

  private onPressure = ({ pressure }: { pressure: number }) =>
    this.pressureUpdate(pressure);

  create(scene: Phaser.Scene, options: Options) {
    const { x, y } = options;
    this.width = options.width ?? this.width;
    this.height = options.height ?? this.height;
    this.padding = options.padding ?? this.padding;

    this.bgColor = options.bgColor ?? this.bgColor;
    this.fillColor = options.fillColor ?? this.fillColor;
    this.borderColor = options.borderColor ?? this.borderColor;
    this.borderWidth = options.borderWidth ?? this.borderWidth;

    this.label = options.label ?? this.label;

    this.fontFamily = options.fontFamily ?? this.fontFamily;
    this.fontSize = options.fontSize ?? this.fontSize;

    const initial = Phaser.Math.Clamp(options.initialPercent ?? 0, 0, 1);
    this.percent = initial;

    const container = scene.add.container(x, y);

    const gfx = scene.add.graphics();
    container.add(gfx);

    document.fonts.ready.then(() => {
      const text = scene.add.text(0, 0, "", {
        fontFamily: this.fontFamily,
        fontSize: `${this.fontSize}px`,
        color: "#ffffff",
        align: "center",
      });
      text.setOrigin(0.5, 0.5);
      container.add(text);
      this.text = text;
    });

    this.container = container;
    this.gfx = gfx;

    this.redraw();

    gameEvents.on("train/pressure", this.onPressure);

    return container;
  }

  destroy() {
    if (this.offFn) {
      this.offFn();
      this.offFn = undefined;
    }
    this.container?.destroy(true);
    this.container = undefined;
    this.gfx = undefined;
    this.text = undefined;
  }

  pressureUpdate(pressure: number) {
    this.percent = Phaser.Math.Clamp(pressure, 0, 1);
    this.redraw();
  }

  getPercent() {
    return this.percent;
  }

  private redraw() {
    if (!this.gfx || !this.text) return;

    const w = this.width;
    const h = this.height;

    const pad = this.padding;

    const innerW = Math.max(0, w - pad * 2);
    const innerH = Math.max(0, h - pad * 2);

    const fillW = Math.floor(innerW * this.percent);

    this.gfx.clear();

    if (this.borderWidth > 0) {
      this.gfx.lineStyle(this.borderWidth, this.borderColor, 1);
      this.gfx.strokeRect(-w / 2, -h / 2, w, h);
    }

    this.gfx.fillStyle(this.bgColor, 1);
    this.gfx.fillRect(-w / 2 + pad, -h / 2 + pad, innerW, innerH);

    this.gfx.fillStyle(this.fillColor, 1);
    this.gfx.fillRect(-w / 2 + pad, -h / 2 + pad, fillW, innerH);

    const pct = Math.round(this.percent * 100);
    this.text.setText(`${this.label} ${pct}%`);
    this.text.setPosition(0, 0);
  }
}

export const pressureIndicator = new PressureIndicator();
