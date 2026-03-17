import { createEventManagers } from "@/libs/events/createEventManagers";

export type PlayerSyncEvents = {
  idle: undefined;
  listening: undefined;
  speaking: undefined;
  scared: undefined;
};

export type PlayerAsyncEvents = {
  placeholder: undefined;
};

export const playerEvents = createEventManagers<
  PlayerSyncEvents,
  PlayerAsyncEvents
>();
