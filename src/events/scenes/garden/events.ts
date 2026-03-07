import { createEventManagers } from "@/libs/events/createEventManagers";

type Events = {
  "garden/placeholder": undefined;
};

export const gardenEvents = createEventManagers<Events>();
