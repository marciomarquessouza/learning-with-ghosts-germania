import { createEventManagers } from "@/libs/events/createEventManagers";

export type TutorAsyncEvents = {
  placeholder: undefined;
};

export type TutorSyncEvents = {
  placeholder: undefined;
};

export const tutorEvents = createEventManagers<
  TutorSyncEvents,
  TutorAsyncEvents
>();
