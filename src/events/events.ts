import { actorsEvents } from "./actors";
import { gameEvents } from "./game/events";
import { lessonEvents } from "./lesson/events";
import { scenesEvents } from "./scenes";

export const events = {
  actors: actorsEvents,
  game: gameEvents,
  lesson: lessonEvents,
  scenes: scenesEvents,
};
