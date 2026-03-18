import { tutorEvents } from "./tutor/events";
import { playerEvents } from "./player/events";
import { punisherEvents } from "./punisher/events";
import { pumpkinKidEvents } from "./pumpkin/events";

export const actorsEvents = {
  tutor: tutorEvents,
  player: playerEvents,
  punisher: punisherEvents,
  pumpkinKid: pumpkinKidEvents,
};

export type ActorsEvents = typeof actorsEvents;
