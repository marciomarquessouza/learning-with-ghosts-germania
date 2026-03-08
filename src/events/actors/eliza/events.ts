import { createEventManagers } from "@/libs/events/createEventManagers";

export type ElizaAsyncEvents = {
  sowing: undefined;
};

export type ElizaSyncEvents = {
  idle: undefined;
  teaching: undefined;
  praising: undefined;
  swearing: undefined;
};

export const elizaEvents = createEventManagers<
  ElizaSyncEvents,
  ElizaAsyncEvents
>();
