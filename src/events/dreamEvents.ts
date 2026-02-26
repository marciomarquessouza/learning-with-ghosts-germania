import { createAsyncMitt } from "@/libs/events/asyncEvents";
import mitt from "mitt";

/**
 * Only events used in Dream Scene
 */


export type Events = {
  "dream/show-introduction": {
    lesson: string;
    hideAfter?: number;
    afterClose?: () => void;
  };
};

export const dreamEvents = mitt<Events>();
export const dreamEventsAsync = createAsyncMitt<Events>()
