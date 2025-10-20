import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import {
  lessonReducer,
  defaultState,
  LessonActions,
  defaultLessonEntry,
  defaultLessonDetails,
} from "./reducers/interactionReducer";
import { Lesson, LessonDetails, LessonEntry, LessonEntryStep } from "@/types";
import { useCharacterDetails } from "@/hooks/useCharacterDetails";

export const useLesson = () => {
  const [state, dispatch] = useReducer(lessonReducer, defaultState);
  const onCompleteRef = useRef<() => void | null>(null);
  const characterDetails = useCharacterDetails(state.lesson?.character);

  const createLesson = useCallback(
    (lesson: Lesson, onComplete?: () => void | null) => {
      onCompleteRef.current = onComplete ?? null;
      dispatch({
        type: LessonActions.CREATE_LESSON,
        payload: { lesson },
      });
    },
    []
  );

  const getLessonDetails = useCallback((): LessonDetails => {
    if (!state.lesson) return defaultLessonDetails;
    const { entries, ...lessonDetails } = state.lesson;
    void entries;
    return lessonDetails;
  }, [state.lesson]);

  const getLessonEntry = useCallback((): LessonEntry => {
    if (!state.lesson) return defaultLessonEntry;
    const entryIndex = state.entryFlags.entryIndex;
    return state.lesson?.entries[entryIndex];
  }, [state.entryFlags.entryIndex, state.lesson]);

  const getLessonStep = useCallback((): LessonEntryStep => {
    const lessonEntry = getLessonEntry();
    const stepIndex = state.stepFlags.stepIndex;
    return lessonEntry.steps[stepIndex];
  }, [getLessonEntry, state.stepFlags.stepIndex]);

  const nextStep = useCallback(() => {
    if (state.entryFlags.isLastEntry) {
      dispatch({
        type: LessonActions.HIDE_LESSON,
      });
      onCompleteRef.current?.();
      onCompleteRef.current = null;
      return;
    }

    if (state.stepFlags.isLastStep) {
      dispatch({ type: LessonActions.NEXT_LESSON_ENTRY });
    }

    dispatch({ type: LessonActions.NEXT_LESSON_STEP });
  }, [state.entryFlags.isLastEntry, state.stepFlags.isLastStep]);

  const hideInteraction = useCallback(() => {
    dispatch({ type: LessonActions.HIDE_LESSON });
  }, []);

  return useMemo(() => {
    const { steps, ...lessonEntry } = getLessonEntry();
    void steps;
    return {
      characterDetails,
      lessonDetails: getLessonDetails(),
      lessonEntry,
      entryFlags: state.entryFlags,
      lessonStep: getLessonStep(),
      stepFlags: state.stepFlags,
      visible: state.visible,
      createLesson,
      nextStep,
      hideInteraction,
    };
  }, [
    state.visible,
    state.entryFlags,
    state.stepFlags,
    characterDetails,
    getLessonDetails,
    getLessonStep,
    getLessonEntry,
    createLesson,
    nextStep,
    hideInteraction,
  ]);
};
