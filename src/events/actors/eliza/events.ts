import { createEventManagers } from "@/libs/events/createEventManagers";

type Events = {
  idle: undefined;
  sowing: undefined;
  teaching: undefined;
  praising: undefined;
  swearing: undefined;
};

export const elizaEvents = createEventManagers<Events>();
