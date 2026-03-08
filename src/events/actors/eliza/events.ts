import { createEventManagers } from "@/libs/events/createEventManagers";

export type ElizaEvents = {
  idle: undefined;
  sowing: undefined;
  teaching: undefined;
  praising: undefined;
  swearing: undefined;
};

export const elizaEvents = createEventManagers<ElizaEvents>();
