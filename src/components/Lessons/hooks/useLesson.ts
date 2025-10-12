import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { useTypewriter } from "../../../hooks/useTypewriter";
import {
  lessonReducer,
  defaultState,
  LessonActions,
  defaultLessonEntry,
} from "./reducers/interactionReducer";
import { Lesson, LessonEntry, LessonEntryStep } from "@/types";
import { useCharacterDetails } from "@/hooks/useCharacterDetails";

export const useLesson = () => {
  const { displayedText, setTextToType, startTyping, handleTextClick } =
    useTypewriter();
  const [state, dispatch] = useReducer(lessonReducer, defaultState);
  const onCompleteRef = useRef<() => void | null>(null);
  const characterDetails = useCharacterDetails(state.lesson?.character);

  useEffect(() => {
    if (!state.lesson) return;
    if (state.ready && state.entryFlags.isFirstEntry) {
      setTextToType(getLessonStep().text);
      showLine();
      return;
    }
    if (state.ready) {
      setTextToType(getLessonStep().text);
      showLine();
      startTyping();
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.ready]);

  const showLine = () => {
    dispatch({ type: LessonActions.SHOW_LESSON_STEP });
  };

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
      lessonEntry,
      lessonStep: getLessonStep(),
      displayedText,
      visible: state.visible,
      createLesson,
      nextStep,
      startTyping,
      handleTextClick,
      hideInteraction,
    };
  }, [
    state.visible,
    displayedText,
    characterDetails,
    getLessonStep,
    getLessonEntry,
    createLesson,
    startTyping,
    handleTextClick,
    nextStep,
    hideInteraction,
  ]);
};
