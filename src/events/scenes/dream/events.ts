import { createEventManagers } from "@/libs/events/createEventManagers";

export type DreamSyncEvents = {
  placeholder: undefined;
};

export type DreamAsyncEvents = {
  placeholder: undefined;
};

export const dreamEvents = createEventManagers<
  DreamSyncEvents,
  DreamAsyncEvents
>();
