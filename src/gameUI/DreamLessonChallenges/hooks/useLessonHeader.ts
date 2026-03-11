import { CHARACTERS } from "@/constants/game";
import { events } from "@/events/events";
import {
  ShowLessonTitleEvent,
  WriteLessonDescriptionEvent,
} from "@/events/lesson/types";
import { DescriptionPhases } from "@/gameUI/LessonHeader/LessonDescription";
import { HeaderPhases } from "@/gameUI/LessonHeader/LessonHeaderWrapper";
import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";

export interface State {
  showHeader: boolean;
  showTitle: boolean;
  showDescription: boolean;
  title: string;
  description: string;
  teacher: CHARACTERS;
  day: number;
  closeAfter?: number;
}

const defaultState: State = {
  showHeader: false,
  showTitle: false,
  showDescription: false,
  title: "",
  description: "",
  day: 1,
  teacher: CHARACTERS.ELIZA,
  closeAfter: 2_000,
};

type Actions =
  | { type: "show-header" }
  | { type: "show-title"; payload: ShowLessonTitleEvent }
  | { type: "hide-title" }
  | { type: "clear-title" }
  | { type: "write-description"; payload: WriteLessonDescriptionEvent }
  | { type: "hide-header" };

function reducer(state: State = defaultState, actions: Actions): State {
  switch (actions.type) {
    case "show-header":
      return {
        ...state,
        showHeader: true,
      };
    case "hide-header":
      return {
        ...state,
        showHeader: false,
      };
    case "show-title":
      return {
        ...state,
        ...actions.payload,
        showTitle: true,
      };
    case "hide-title":
      return {
        ...state,
        showTitle: false,
      };
    case "clear-title":
      return {
        ...state,
        title: "",
        day: 1,
      };
    case "write-description":
      return {
        ...state,
        ...actions.payload,
        showDescription: true,
      };
    default:
      return state;
  }
}

export function useLessonHeader() {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const onHeaderVisible = useRef(() => {});
  const onHeaderHidden = useRef(() => {});
  const onDescriptionReady = useRef(() => {});

  const onHeaderPhaseChange = useCallback((phase: HeaderPhases) => {
    if (phase === "visible") {
      const done = onHeaderVisible.current;
      onHeaderVisible.current = () => {};
      done();
    }
    if (phase === "hidden") {
      const done = onHeaderHidden.current;
      onHeaderHidden.current = () => {};
      done();
    }
  }, []);

  const onDescriptionPhaseChange = useCallback((phase: DescriptionPhases) => {
    if (phase === "ready") {
      const done = onDescriptionReady.current;
      onDescriptionReady.current = () => {};
      done();
    }
  }, []);

  const clearTitle = useCallback(() => {
    dispatch({ type: "clear-title" });
  }, []);

  useEffect(() => {
    const handle = (_payload: undefined, done: () => void) => {
      onHeaderVisible.current = done;
      dispatch({ type: "show-header" });
    };
    events.lesson.async.on("show-header", handle);
    return () => {
      events.lesson.async.off("show-header", handle);
    };
  }, []);

  useEffect(() => {
    const handle = (_payload: undefined, done: () => void) => {
      onHeaderHidden.current = done;
      dispatch({ type: "hide-header" });
    };
    events.lesson.async.on("hide-header", handle);
    return () => {
      events.lesson.async.off("hide-header", handle);
    };
  }, []);

  useEffect(() => {
    const handle = (payload: ShowLessonTitleEvent, done: () => void) => {
      dispatch({ type: "show-title", payload });
      setTimeout(() => {
        dispatch({ type: "hide-title" });
        done();
      }, payload.closeAfter ?? 2_000);
    };
    events.lesson.async.on("show-lesson-title", handle);
    return () => {
      events.lesson.async.off("show-lesson-title", handle);
    };
  }, []);

  useEffect(() => {
    const handle = (payload: WriteLessonDescriptionEvent, done: () => void) => {
      dispatch({ type: "write-description", payload });
      onDescriptionReady.current = done;
    };
    events.lesson.async.on("write-lesson-description", handle);
    return () => {
      events.lesson.async.off("write-lesson-description", handle);
    };
  }, []);

  return useMemo(
    () => ({
      headerState: state,
      clearTitle,
      onHeaderPhaseChange,
      onDescriptionPhaseChange,
    }),
    [state, clearTitle, onHeaderPhaseChange, onDescriptionPhaseChange],
  );
}
