import { createEventManagers } from "@/libs/events/createEventManagers";

export type GuardianSyncEvents = {
  placeholder: undefined;
};

export type GuardianAsyncEvents = {
  placeholder: undefined;
};

export const guardianEvents = createEventManagers<
  GuardianSyncEvents,
  GuardianAsyncEvents
>();
