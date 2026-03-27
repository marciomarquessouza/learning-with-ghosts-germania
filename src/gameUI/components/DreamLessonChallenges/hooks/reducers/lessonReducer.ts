import {
  Lesson,
  LessonDetails,
  LessonEntry,
  StepFlags,
} from "@/libs/lesson/types";
import {
  createLesson,
  getNextEntry,
  getNextStep,
  getPreviousEntry,
  getPreviousStep,
} from "./lessonMutations";

export interface EntryFlags {
  entryIndex: number;
  isFirstEntry: boolean;
  isLastEntry: boolean;
}

// Lesson: the top-level structure
// Entry: a word or phrase to learn
// Step: a part of the entry (introduction, listening, pronunciation, writing)
export interface State {
  lesson: Lesson | null;
  entryFlags: EntryFlags;
  stepFlags: StepFlags;
  visible: boolean;
  ready: boolean;
}

export const defaultLessonDetails: LessonDetails = {
  id: "",
  day: 0,
  title: "",
};

export const defaultLessonEntry: LessonEntry = {
  id: "",
  reference: "",
  target: "",
  steps: [],
};

export const defaultState: State = {
  lesson: null,
  entryFlags: {
    entryIndex: 0,
    isFirstEntry: false,
    isLastEntry: false,
  },
  stepFlags: {
    stepIndex: 0,
    isFirstStep: false,
    isLastStep: false,
  },
  visible: false,
  ready: false,
};

export enum LessonController {
  CREATE_LESSON = "CREATE_LESSON",
  NEXT_LESSON_ENTRY = "NEXT_LESSON_ENTRY",
  PREVIOUS_LESSON_ENTRY = "PREVIOUS_LESSON_ENTRY",
  NEXT_LESSON_STEP = "NEXT_LESSON_STEP",
  PREVIOUS_LESSON_STEP = "PREVIOUS_LESSON_STEP",
  SHOW_LESSON_STEP = "SHOW_LESSON_STEP",
  HIDE_LESSON = "HIDE_LESSON",
}

type LessonAction =
  | { type: LessonController.CREATE_LESSON; payload: { lesson: Lesson } }
  | { type: LessonController.NEXT_LESSON_ENTRY }
  | { type: LessonController.PREVIOUS_LESSON_ENTRY }
  | { type: LessonController.NEXT_LESSON_STEP }
  | { type: LessonController.PREVIOUS_LESSON_STEP }
  | { type: LessonController.SHOW_LESSON_STEP }
  | { type: LessonController.HIDE_LESSON };

export function lessonReducer(state: State, action: LessonAction): State {
  switch (action.type) {
    case LessonController.CREATE_LESSON:
      const { lesson } = action.payload;
      return createLesson(state, lesson);
    case LessonController.SHOW_LESSON_STEP:
      return {
        ...state,
        ready: false,
      };
    case LessonController.NEXT_LESSON_ENTRY:
      return getNextEntry(state);
    case LessonController.PREVIOUS_LESSON_ENTRY:
      return getPreviousEntry(state);
    case LessonController.NEXT_LESSON_STEP:
      if (state.stepFlags.isLastStep) {
        if (state.entryFlags.isLastEntry) return state;
        return getNextEntry(state);
      }
      return getNextStep(state);
    case LessonController.PREVIOUS_LESSON_STEP:
      if (state.stepFlags.isFirstStep) {
        if (state.entryFlags.isFirstEntry) return state;
        return getPreviousEntry(state);
      }
      return getPreviousStep(state);
    case LessonController.HIDE_LESSON:
      return {
        ...state,
        visible: false,
        ready: false,
      };
    default:
      return state;
  }
}
