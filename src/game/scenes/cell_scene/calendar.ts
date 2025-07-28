import { CALENDAR_IMG } from "@/constants/images";

type CalendarContainer = Phaser.GameObjects.Container & {
  updateDay: (value: number) => void;
};

const CALENDAR_KEY = "calendar";

class Calendar {
  preload(scene: Phaser.Scene) {
    scene.load.image(CALENDAR_KEY, CALENDAR_IMG);
  }

  create(scene: Phaser.Scene, day: number = 1): CalendarContainer {
    const container = scene.add.container(0, 0);
    const calendarImage = scene.add.image(0, 0, CALENDAR_KEY);
    calendarImage.setOrigin(0.5, 0);
    calendarImage.setScale(1.2);

    const dayText = scene.add.text(0, 38, `${day}`, {
      fontSize: "68px",
      color: "#000000",
    });
    dayText.setOrigin(0.5, 0);
    dayText.setAlign("center");

    document.fonts.ready.then(() => {
      dayText.setFontFamily("SpecialElite");
    });

    function updateDay(newDay: number) {
      dayText.setText(`Day ${newDay}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (container as any).updateDay = updateDay;

    container.add(calendarImage);
    container.add(dayText);

    return container as CalendarContainer;
  }
}

export const calendar = new Calendar();
