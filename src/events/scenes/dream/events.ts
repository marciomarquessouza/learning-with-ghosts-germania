import { DreamShowIntroductionEvent } from "./types";
import { createEventManagers } from "@/libs/events/createEventManagers";

type Events = {
  "dream/show-introduction": DreamShowIntroductionEvent;
};

export const dreamEvents = createEventManagers<Events>();
