import { createEventManagers } from "@/libs/events/createEventManagers";

export type LearningNodeAsyncEvents = {
  "sprouting:transition": undefined;
  "emerging:transition": undefined;
  "growing:transition": undefined;
};

export type LearningNodeSyncEvents = {
  "sprouting:idle": undefined;
  "sprouting:speaking": undefined;
  "emerging:idle": undefined;
  "growing:idle": undefined;
};

export const learningNodeEvents = createEventManagers<
  LearningNodeSyncEvents,
  LearningNodeAsyncEvents
>();
