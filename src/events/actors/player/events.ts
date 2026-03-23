import { createEventManagers } from "@/libs/events/createEventManagers";

export type PlayerSyncEvents = {
  placeholder: undefined;
};

export type PlayerAsyncEvents = {
  placeholder: undefined;
};

export const playerEvents = createEventManagers<
  PlayerSyncEvents,
  PlayerAsyncEvents
>();
