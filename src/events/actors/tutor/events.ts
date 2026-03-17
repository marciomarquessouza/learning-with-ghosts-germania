import { createEventManagers } from "@/libs/events/createEventManagers";

export type TutorAsyncEvents = {
  sowing: undefined;
};

export type TutorSyncEvents = {
  idle: undefined;
  teaching: undefined;
  praising: undefined;
  swearing: undefined;
};

export const tutorEvents = createEventManagers<
  TutorSyncEvents,
  TutorAsyncEvents
>();
