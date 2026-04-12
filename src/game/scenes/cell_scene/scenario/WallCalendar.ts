import { CALENDAR_IMG } from "@/constants/images";
import { useGameStore } from "@/store/gameStore";

type CalendarContainer = Phaser.GameObjects.Container & {
  increaseDay: () => void;
};

const CALENDAR_KEY = "calendar";

export class WallCalendar {
  public container: CalendarContainer | null = null;
  private dayText: Phaser.GameObjects.Text | null = null;

  preload(scene: Phaser.Scene) {
    scene.load.image(CALENDAR_KEY, CALENDAR_IMG);
  }

  create(scene: Phaser.Scene): CalendarContainer {
    const day = useGameStore.getState().day;

    this.container = scene.add
      .container(0, 0)
      .setPosition(1390, 180)
      .setScale(0.8) as CalendarContainer;
    this.container.name = "calendar";
    const calendarImage = scene.add.image(0, 0, CALENDAR_KEY);
    calendarImage.setOrigin(0.5, 0);
    calendarImage.setScale(1.2);

    this.dayText = scene.add.text(0, 38, `${day}`, {
      fontSize: "68px",
      color: "#000000",
    });
    this.dayText.setOrigin(0.5, 0);
    this.dayText.setAlign("center");

    document.fonts.ready.then(() => {
      this.dayText?.setFontFamily("SpecialElite");
    });

    this.container.increaseDay = this.increaseDay;

    this.container.add(calendarImage);
    this.container.add(this.dayText);

    return this.container;
  }

  setVisible(isVisible: boolean) {
    this.container?.setVisible(isVisible);
  }

  increaseDay() {
    useGameStore.getState().increaseDay();
    const newDay = useGameStore.getState().day;
    this.dayText?.setText(`${newDay}`);
  }

  destroy() {
    this.container?.destroy();
    this.dayText?.destroy();
  }
}
