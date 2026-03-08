import { JosefDamageEvent } from "./types";
import { createEventManagers } from "@/libs/events/createEventManagers";

export type JosefSyncEvents = {
  "josef/damage:dream": JosefDamageEvent;
};

export type JosefAsyncEvents = {
  placeholder: undefined;
};

export const josefEvents = createEventManagers<
  JosefSyncEvents,
  JosefAsyncEvents
>();
