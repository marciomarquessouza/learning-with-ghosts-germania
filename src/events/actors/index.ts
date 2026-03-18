import { tutorEvents } from "./tutor/events";
import { playerEvents } from "./player/events";
import { punisherEvents } from "./punisher/events";
import { learningNodeEvents } from "./learningNode/events";

export const actorsEvents = {
  tutor: tutorEvents,
  player: playerEvents,
  punisher: punisherEvents,
  learningNode: learningNodeEvents,
};

export type ActorsEvents = typeof actorsEvents;
