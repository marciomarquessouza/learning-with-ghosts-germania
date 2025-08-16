import { CHARACTERS } from "@/constants/game";
import { gameEvents } from "@/events";

export class DayActions {
  clicked = {
    desk: 0,
    ratHole: 0,
    bed: 0,
    food: 0,
    solitaire: 0,
    challenge: 0,
    bars: 0,
  };

  onStart() {
    gameEvents.emit("show-introduction", {
      title: "More one day...",
    });
  }

  onDeskClick() {
    gameEvents.emit("show-dialogue", {
      lines: [
        {
          type: "dialogue",
          character: CHARACTERS.JOSEF,
          text: "I don't want to do anything at this table right now",
        },
      ],
    });

    this.clicked.desk += 1;
  }

  onBedClick() {
    gameEvents.emit("show-dialogue", {
      lines: [
        {
          type: "dialogue",
          character: CHARACTERS.JOSEF,
          text: "I don't want to do anything in bed right now",
        },
      ],
    });

    this.clicked.desk += 1;
  }

  onFoodClick() {
    gameEvents.emit("show-dialogue", {
      lines: [
        {
          type: "dialogue",
          character: CHARACTERS.JOSEF,
          text: "Food",
        },
      ],
    });

    this.clicked.desk += 1;
  }

  onRatClick() {
    gameEvents.emit("show-dialogue", {
      lines: [
        {
          type: "dialogue",
          character: CHARACTERS.JOSEF,
          text: "Food",
        },
      ],
    });

    this.clicked.desk += 1;
  }

  onBarsClick() {
    gameEvents.emit("show-dialogue", {
      lines: [
        {
          type: "dialogue",
          character: CHARACTERS.MARLENE,
          text: "I Hate You!",
        },
      ],
    });
  }
}

export const defaultDayActions = new DayActions();
