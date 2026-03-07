import { CrackEvent, DropSeedEvent } from "./types";
import { createEventManagers } from "@/libs/events/createEventManagers";

type Events = {
  "pumpkin-kid/lesson:drop-seed": DropSeedEvent;
  "pumpkin-kid/lesson:crack-ground": CrackEvent;
};

export const pumpkinKidEvents = createEventManagers<Events>();
