import { Lesson } from "@/types";
import { defaultState, State } from "./lessonReducer";

export const createLesson = (state: State, lesson: Lesson): State => {
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
      isLastStep: lesson.entries[0].steps.length === 1,
    },
    ready: true,
    visible: true,
  };
};

export const getNextEntry = (state: State): State => {
  if (!state.lesson) return defaultState;
  const newEntryIndex = state.entryFlags.entryIndex + 1;
  const lessonEntries = state.lesson.entries;

  return {
    ...state,
    entryFlags: {
      entryIndex: newEntryIndex,
      isFirstEntry: false,
      isLastEntry: newEntryIndex === lessonEntries.length - 1,
    },
    stepFlags: {
      stepIndex: 0,
      isFirstStep: true,
      isLastStep: lessonEntries[newEntryIndex].steps.length === 1,
    },
    ready: true,
  };
};

export const getPreviousEntry = (state: State): State => {
  if (!state.lesson) return defaultState;
  if (state.entryFlags.isFirstEntry) return state;
  const previousEntryIndex = state.entryFlags.entryIndex - 1;
  const previousEntries = state.lesson.entries[previousEntryIndex];

  return {
    ...state,
    entryFlags: {
      entryIndex: previousEntryIndex,
      isFirstEntry: previousEntryIndex === 0,
      isLastEntry: false,
    },
    stepFlags: {
      stepIndex: previousEntries.steps.length - 1,
      isFirstStep: previousEntries.steps.length === 1,
      isLastStep: true,
    },
  };
};

export const getNextStep = (state: State): State => {
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
};

export const getPreviousStep = (state: State): State => {
  if (!state.lesson) return defaultState;
  const previousStepIndex = state.stepFlags.stepIndex - 1;

  return {
    ...state,
    stepFlags: {
      stepIndex: previousStepIndex,
      isFirstStep: previousStepIndex === 0,
      isLastStep: false,
    },
    ready: true,
  };
};
