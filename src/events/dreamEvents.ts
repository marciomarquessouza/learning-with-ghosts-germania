import mitt from "mitt";

export type Events = {
  "show-introduction": {
    lesson: string;
    hideAfter?: number;
    afterClose?: () => void;
  };
};

export const dreamEvents = mitt<Events>();
