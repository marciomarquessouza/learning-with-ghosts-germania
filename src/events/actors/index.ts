import { tutorEvents } from "./tutor/events";
import { playerEvents } from "./player/events";
import { punisherEvents } from "./punisher/events";
import { learningNodeEvents } from "./learningNode/events";
import { guardianEvents } from "./guardian/events";
import { ACTORS } from "@/constants/game";

export const actorsEvents = {
  [ACTORS.TUTOR]: tutorEvents,
  [ACTORS.PLAYER]: playerEvents,
  [ACTORS.PUNISHER]: punisherEvents,
  [ACTORS.LEARNING_NODE]: learningNodeEvents,
  [ACTORS.GUARDIAN]: guardianEvents,
};

export type ActorsEvents = typeof actorsEvents;
