import { ACTORS } from "@/constants/game";
import { events } from "@/events/events";
import {
  ShowLessonTitleEvent,
  UpdateLessonDescriptionEvent,
  WriteLessonDescriptionEvent,
} from "@/events/lesson/types";
import { DescriptionPhases } from "@/gameUI/components/LessonHeader/components/StepDescription";
import { HeaderPhases } from "@/gameUI/components/LessonHeader/components/LessonHeaderWrapper";
import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";

export type LessonHeaderState = {
  showHeader: boolean;
  showTitle: boolean;
  showDescription: boolean;
  showVoiceIndicator: boolean;
  title: string;
  dialogueTitle?: string;
  description: string;
  updateDescription?: string;
  hidePressContinue?: boolean;
  teacher: ACTORS;
  day: number;
  closeAfter?: number;
};

const defaultState: LessonHeaderState = {
  showHeader: false,
  showTitle: false,
  showDescription: false,
  showVoiceIndicator: false,
  hidePressContinue: false,
  title: "",
  dialogueTitle: "",
  description: "",
  updateDescription: "",
  day: 1,
  teacher: ACTORS.TUTOR,
  closeAfter: 2_000,
};

type Actions =
  | { type: "show-header"; payload: ShowLessonTitleEvent }
  | { type: "show-title" }
  | { type: "hide-title" }
  | { type: "clear-title" }
  | { type: "write-description"; payload: WriteLessonDescriptionEvent }
  | { type: "show-description" }
  | {
      type: "update-description";
      payload: UpdateLessonDescriptionEvent;
    }
  | { type: "hide-description" }
  | { type: "hide-header" }
  | { type: "show-voice-indicator" }
  | { type: "hide-voice-indicator" };

function reducer(
  state: LessonHeaderState = defaultState,
  actions: Actions,
): LessonHeaderState {
  switch (actions.type) {
    case "show-header":
      return {
        ...state,
        ...actions.payload,
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
        showTitle: true,
        showDescription: false,
        showVoiceIndicator: false,
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
    case "show-description":
      return {
        ...state,
        showDescription: true,
        showTitle: false,
        showVoiceIndicator: false,
      };
    case "write-description":
      return {
        ...state,
        ...actions.payload,
        showDescription: true,
        showTitle: false,
        showVoiceIndicator: false,
      };
    case "update-description":
      const { description, title } = actions.payload;
      return {
        ...state,
        dialogueTitle: title ?? state.dialogueTitle,
        description: description ?? state.description,
      };
    case "hide-description":
      return {
        ...state,
        description: "",
        showDescription: false,
      };
    case "show-voice-indicator":
      return {
        ...state,
        showDescription: false,
        showTitle: false,
        showVoiceIndicator: true,
      };
    case "hide-voice-indicator":
      return {
        ...state,
        showVoiceIndicator: false,
      };
    default:
      return state;
  }
}

export function useLessonHeader() {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const onHeaderHidden = useRef(() => {});
  const onDescriptionReady = useRef(() => {});
  const onDescriptionHide = useRef(() => {});

  const onHeaderPhaseChange = useCallback((phase: HeaderPhases) => {
    if (phase === "visible") {
      dispatch({ type: "show-title" });
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

    if (phase === "hidden") {
      const done = onDescriptionHide.current;
      onDescriptionHide.current = () => {};
      done();
    }
  }, []);

  const clearTitle = useCallback(() => {
    dispatch({ type: "clear-title" });
  }, []);

  useEffect(() => {
    const handle = (payload: ShowLessonTitleEvent, done: () => void) => {
      dispatch({ type: "show-header", payload });
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
    const handle = (_payload: undefined, done: () => void) => {
      onHeaderHidden.current = done;
      dispatch({ type: "hide-header" });
    };
    events.lesson.async.on("hide-lesson-title", handle);
    return () => {
      events.lesson.async.off("hide-lesson-title", handle);
    };
  }, []);

  useEffect(() => {
    const handle = (payload: WriteLessonDescriptionEvent, done: () => void) => {
      const hidePressContinue = payload.hidePressContinue ?? false;
      dispatch({
        type: "write-description",
        payload: { ...payload, hidePressContinue },
      });
      onDescriptionReady.current = done;
    };
    events.lesson.async.on("write-lesson-description", handle);
    return () => {
      events.lesson.async.off("write-lesson-description", handle);
    };
  }, []);

  useEffect(() => {
    const handle = () => {
      dispatch({ type: "show-description" });
    };
    events.lesson.sync.on("show-description", handle);
    return () => {
      events.lesson.sync.off("show-description", handle);
    };
  }, []);

  useEffect(() => {
    const handle = (_: undefined, done: () => void) => {
      dispatch({
        type: "hide-description",
      });
      onDescriptionHide.current = done;
    };
    events.lesson.async.on("hide-lesson-description", handle);
    return () => {
      events.lesson.async.off("hide-lesson-description", handle);
    };
  }, []);

  useEffect(() => {
    const handle = (payload: UpdateLessonDescriptionEvent) => {
      dispatch({ type: "update-description", payload });
    };
    events.lesson.sync.on("update-lesson-description", handle);
    return () => {
      events.lesson.sync.off("update-lesson-description", handle);
    };
  }, []);

  useEffect(() => {
    const handle = () => {
      dispatch({ type: "show-voice-indicator" });
    };
    events.lesson.sync.on("show-voice-indicator", handle);
    return () => {
      events.lesson.sync.off("show-voice-indicator", handle);
    };
  }, []);

  useEffect(() => {
    const handle = () => {
      dispatch({ type: "hide-voice-indicator" });
    };
    events.lesson.sync.on("hide-voice-indicator", handle);
    return () => {
      events.lesson.sync.off("hide-voice-indicator", handle);
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
