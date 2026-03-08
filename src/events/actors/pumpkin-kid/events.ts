import { CrackEvent, DropSeedEvent } from "./types";
import { createEventManagers } from "@/libs/events/createEventManagers";

type PumpkinsAsyncEvents = {
  placeholder: undefined;
};
type PumpkinsSyncEvents = {
  "pumpkin-kid/lesson:drop-seed": DropSeedEvent;
  "pumpkin-kid/lesson:crack-ground": CrackEvent;
};

export const pumpkinKidEvents = createEventManagers<
  PumpkinsSyncEvents,
  PumpkinsAsyncEvents
>();
