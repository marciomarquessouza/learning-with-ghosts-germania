import { gameEvents } from "@/events";
import { DayActions } from "../defaultActions";

class DayActions1 extends DayActions {
  constructor() {
    super();
  }

  onStart(): void {
    gameEvents.emit("show-introduction", {
      title: "Welcome to the Prison",
    });
  }
}

export const dayAction = new DayActions1();
