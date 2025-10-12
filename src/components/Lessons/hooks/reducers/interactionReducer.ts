import { Lesson, LessonEntry } from "@/types";

// Lesson: the top-level structure
// Entry: a word or phrase to learn
// Step: a part of the entry (introduction, listening, pronunciation, writing)
interface State {
  lesson: Lesson | null;
  entryFlags: {
    entryIndex: number;
    isFirstEntry: boolean;
    isLastEntry: boolean;
  };
  stepFlags: {
    stepIndex: number;
    isFirstStep: boolean;
    isLastStep: boolean;
  };
  visible: boolean;
  ready: boolean;
}

export const defaultLessonEntry: LessonEntry = {
  id: "",
  reference: "",
  target: "",
  steps: [],
  phase: "hide",
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

export enum LessonActions {
  CREATE_LESSON = "CREATE_LESSON",
  NEXT_LESSON_ENTRY = "NEXT_LESSON_ENTRY",
  NEXT_LESSON_STEP = "NEXT_LESSON_STEP",
  SHOW_LESSON_STEP = "SHOW_LESSON_STEP",
  HIDE_LESSON = "HIDE_LESSON",
}

type LessonAction =
  | { type: LessonActions.CREATE_LESSON; payload: { lesson: Lesson } }
  | { type: LessonActions.NEXT_LESSON_ENTRY }
  | { type: LessonActions.NEXT_LESSON_STEP }
  | { type: LessonActions.SHOW_LESSON_STEP }
  | { type: LessonActions.HIDE_LESSON };

export function lessonReducer(state: State, action: LessonAction): State {
  switch (action.type) {
    case LessonActions.CREATE_LESSON:
      const { lesson } = action.payload;
      return {
        ...state,
        lesson,
        entryFlags: {
          entryIndex: 0,
          isFirstEntry: true,
          isLastEntry: lesson.entries.length === 1,
        },
        stepFlags: {
          stepIndex: 0,
          isFirstStep: true,
          isLastStep: false,
        },
        ready: true,
        visible: false,
      };
    case LessonActions.SHOW_LESSON_STEP:
      return {
        ...state,
        visible: true,
        ready: false,
      };
    case LessonActions.NEXT_LESSON_ENTRY:
      if (!state.lesson) return defaultState;
      const newEntryIndex = state.entryFlags.entryIndex + 1;
      const lessonEntries = state.lesson.entries;

      return {
        ...state,
        entryFlags: {
          entryIndex: newEntryIndex,
          isFirstEntry: false,
          isLastEntry: newEntryIndex + 1 === lessonEntries.length,
        },
      };
    case LessonActions.NEXT_LESSON_STEP:
      if (!state.lesson) return defaultState;
      const lessonEntryIndex = state.entryFlags.entryIndex;
      const entrySteps = state.lesson.entries[lessonEntryIndex].steps;
      const newStepIndex = state.stepFlags.stepIndex + 1;

      return {
        ...state,
        stepFlags: {
          stepIndex: newStepIndex,
          isFirstStep: false,
          isLastStep: newStepIndex + 1 === entrySteps.length,
        },
        ready: true,
      };

    case LessonActions.HIDE_LESSON:
    default:
      return state;
  }
}
