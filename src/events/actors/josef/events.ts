import { createEventManagers } from "@/libs/events/createEventManagers";

export type JosefSyncEvents = {
  idle: undefined;
  listening: undefined;
  speaking: undefined;
  scared: undefined;
};

export type JosefAsyncEvents = {
  placeholder: undefined;
};

export const josefEvents = createEventManagers<
  JosefSyncEvents,
  JosefAsyncEvents
>();
