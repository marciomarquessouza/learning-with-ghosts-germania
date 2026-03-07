import { JosefDamageEvent } from "./types";
import { createEventManagers } from "@/libs/events/createEventManagers";

type Events = {
  "josef/damage:dream": JosefDamageEvent;
};

export const josefEvents = createEventManagers<Events>();
