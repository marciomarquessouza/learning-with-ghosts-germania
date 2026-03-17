import { tutorEvents } from "./tutor/events";
import { playerEvents } from "./player/events";
import { krampusEvents } from "./krampus/events";
import { pumpkinKidEvents } from "./pumpkin/events";

export const actorsEvents = {
  tutor: tutorEvents,
  player: playerEvents,
  krampus: krampusEvents,
  pumpkinKid: pumpkinKidEvents,
};

export type ActorsEvents = typeof actorsEvents;
