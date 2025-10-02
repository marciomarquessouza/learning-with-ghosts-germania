import mitt from "mitt";

export interface LessonIntroductionProps {
  hideAfter?: number;
  afterClose?: () => void;
}

export type Events = {
  "show-introduction": {
    lesson: string;
    hideAfter?: number;
    afterClose?: () => void;
  };
  "show-lesson-introduction": LessonIntroductionProps;
};

export const dreamEvents = mitt<Events>();
