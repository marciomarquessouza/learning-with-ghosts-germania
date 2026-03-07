import { createEventManagers } from "@/libs/events/createEventManagers";
import { ElizaSowingEvent } from "./types";

type Events = {
  "eliza/lesson:sowing": ElizaSowingEvent;
};

export const elizaEvents = createEventManagers<Events>();
