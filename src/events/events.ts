import { actorsEvents } from "./actors";
import { audioEvents } from "./audio/events";
import { gameEvents } from "./game/events";
import { interactionsEvents } from "./interactions/events";
import { lessonEvents } from "./lesson/events";
import { scenesEvents } from "./scenes";

export const events = {
  actors: actorsEvents,
  audio: audioEvents,
  game: gameEvents,
  lesson: lessonEvents,
  scenes: scenesEvents,
  interactions: interactionsEvents,
};
