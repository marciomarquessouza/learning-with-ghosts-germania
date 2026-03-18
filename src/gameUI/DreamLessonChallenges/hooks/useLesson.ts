import { useCallback, useMemo, useReducer, useRef } from "react";
import {
  lessonReducer,
  defaultState,
  LessonManager,
  defaultLessonEntry,
  defaultLessonDetails,
} from "./reducers/lessonReducer";
import { Lesson, LessonDetails, LessonEntry, LessonEntryStep } from "@/types";

export const useLesson = () => {
  const [state, dispatch] = useReducer(lessonReducer, defaultState);
  const onCompleteRef = useRef<() => void | null>(null);
  const isFirst = useMemo(
    () => state.entryFlags.isFirstEntry && state.stepFlags.isFirstStep,
    [state.entryFlags.isFirstEntry, state.stepFlags.isFirstStep],
  );
  const isLast = useMemo(
    () => state.entryFlags.isLastEntry && state.stepFlags.isLastStep,
    [state.entryFlags.isLastEntry, state.stepFlags.isLastStep],
  );

  const createLesson = useCallback(
    (lesson: Lesson, onComplete?: () => void | null) => {
      onCompleteRef.current = onComplete ?? null;
      dispatch({
        type: LessonManager.CREATE_LESSON,
        payload: { lesson },
      });
    },
    [],
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
    if (isLast) {
      dispatch({
        type: LessonManager.HIDE_LESSON,
      });
      onCompleteRef.current?.();
      onCompleteRef.current = null;
      return;
    }

    dispatch({ type: LessonManager.NEXT_LESSON_STEP });
  }, [isLast]);

  const previousStep = useCallback(() => {
    if (isFirst) return;
    dispatch({ type: LessonManager.PREVIOUS_LESSON_STEP });
  }, [isFirst]);

  const hideInteraction = useCallback(() => {
    dispatch({ type: LessonManager.HIDE_LESSON });
  }, []);

  return useMemo(() => {
    const { steps, ...lessonEntry } = getLessonEntry();
    void steps;
    return {
      isFirst,
      isLast,
      lessonDetails: getLessonDetails(),
      lessonEntry,
      lessonStep: getLessonStep(),
      entryFlags: state.entryFlags,
      stepFlags: state.stepFlags,
      visible: state.visible,
      createLesson,
      nextStep,
      previousStep,
      hideInteraction,
    };
  }, [
    isFirst,
    isLast,
    state.visible,
    state.entryFlags,
    state.stepFlags,
    getLessonDetails,
    getLessonStep,
    getLessonEntry,
    createLesson,
    nextStep,
    previousStep,
    hideInteraction,
  ]);
};
