import { elizaEvents } from "./eliza/events";
import { josefEvents } from "./josef/events";
import { krampusEvents } from "./krampus/events";
import { pumpkinKidEvents } from "./pumpkin-kid/events";

export const actorsEvents = {
  eliza: elizaEvents,
  josef: josefEvents,
  krampus: krampusEvents,
  pumpkinKid: pumpkinKidEvents,
};

export type ActorsEvents = typeof actorsEvents;
