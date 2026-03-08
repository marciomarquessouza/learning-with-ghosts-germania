import { createEventManagers } from "@/libs/events/createEventManagers";

export type PumpkinAsyncEvents = {
  "plant-pumpkin": undefined;
};

export type PumpkinSyncEvents = {
  placeholder: undefined;
};

export const pumpkinKidEvents = createEventManagers<
  PumpkinSyncEvents,
  PumpkinAsyncEvents
>();
