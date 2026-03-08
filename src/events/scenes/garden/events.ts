import { createEventManagers } from "@/libs/events/createEventManagers";

export type GardenSyncEvents = {
  placeholder: undefined;
};

export type GardenAsyncEvents = {
  placeholder: undefined;
};

export const gardenEvents = createEventManagers<
  GardenSyncEvents,
  GardenAsyncEvents
>();
