import { createEventManagers } from "@/libs/events/createEventManagers";

export type LearningNodeAsyncEvents = {
  "plant": undefined;
};

export type LearningNodeSyncEvents = {
  placeholder: undefined;
};

export const learningNodeEvents = createEventManagers<
  LearningNodeSyncEvents,
  LearningNodeAsyncEvents
>();
