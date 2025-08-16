import { timerFormat } from "@/utils/timerFormat";

export interface TimerOptions {
  offsetX?: number;
  offsetY?: number;
  backgroundColor?: number;
  textColor?: string;
  fontSize?: number;
}

export function attachTimerToIcon(
  scene: Phaser.Scene,
  iconImage: Phaser.GameObjects.Image,
  iconContainer: Phaser.GameObjects.Container,
  timeInSeconds: number = 480,
  onFinish: () => void,
  options: TimerOptions = {}
) {
  const {
    offsetX = 0,
    offsetY = 10,
    backgroundColor = 0xd0021b,
    textColor = "#ffffff",
    fontSize = 20,
  } = options;

  const timerBackground = scene.add.graphics();
  const timerText = scene.add.text(
    offsetX,
    offsetY,
    timerFormat(timeInSeconds),
    {
      fontFamily: "sans-serif",
      fontSize: `${fontSize}px`,
      color: textColor,
      fontStyle: "700",
    }
  );
  timerText.setOrigin(0.5);

  iconContainer.add([timerBackground, timerText]);

  timerBackground.setPosition(0, 0);
  timerBackground.clear();

  const width = iconImage.displayWidth + 20;
  const height = 25;
  const positionX = -width / 2 + offsetX;
  const positionY = -height / 2 + offsetY;

  timerBackground.fillStyle(backgroundColor);
  timerBackground.fillRect(positionX, positionY, width, height);
  timerBackground.strokeRect(positionX, positionY, width, height);

  const destroyTimer = () => {
    timerBackground.destroy();
    timerText.destroy();
  };

  const setTimer = (seconds: number) => {
    timerText.setText(timerFormat(seconds));
  };

  let currentTime = timeInSeconds;

  const timerEvent = scene.time.addEvent({
    delay: 1000,
    loop: true,
    callback: () => {
      if (currentTime === 0) {
        onFinish(), timerEvent.remove();
        destroyTimer();
      }

      setTimer(currentTime);
      currentTime -= 1;
    },
  });
}
