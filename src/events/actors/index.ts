import { tutorEvents } from "./tutor/events";
import { playerEvents } from "./player/events";
import { punisherEvents } from "./punisher/events";
import { learningNodeEvents } from "./learningNode/events";
import { ACTORS } from "@/constants/game";

export const actorsEvents = {
  [ACTORS.TUTOR]: tutorEvents,
  [ACTORS.PLAYER]: playerEvents,
  [ACTORS.PUNISHER]: punisherEvents,
  [ACTORS.LEARNING_NODE]: learningNodeEvents,
};

export type ActorsEvents = typeof actorsEvents;
