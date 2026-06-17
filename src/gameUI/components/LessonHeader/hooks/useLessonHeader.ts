import { events } from "@/events/events";
import {
  LoadingEvent,
  PronunciationResultEvent,
  ShowLessonTitleEvent,
  WriteLessonDescriptionEvent,
} from "@/events/lesson/types";
import { DescriptionPhases } from "@/gameUI/components/LessonHeader/components/StepDescription";
import { HeaderPhases } from "@/gameUI/components/LessonHeader/components/LessonHeaderWrapper";
import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import {
  lessonHeaderDefaultState,
  lessonHeaderReducer,
} from "./lessonHeaderReducer";

const DEFAULT_CLOSE_TITLE_AFTER = 3_000;

export function useLessonHeader() {
  const [state, dispatch] = useReducer(
    lessonHeaderReducer,
    lessonHeaderDefaultState,
  );
  const onHeaderHidden = useRef(() => {});
  const onDescriptionReady = useRef(() => {});
  const onDescriptionHide = useRef(() => {});

  const onHeaderPhaseChange = useCallback((phase: HeaderPhases) => {
    if (phase === "visible") {
      dispatch({ type: "show-lesson-title" });
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
    dispatch({ type: "clear-lesson-title" });
  }, []);

  useEffect(() => {
    const handle = (payload: ShowLessonTitleEvent, done: () => void) => {
      dispatch({ type: "show-lesson-header", payload });
      setTimeout(() => {
        dispatch({ type: "hide-lesson-title" });
        done();
      }, payload.closeAfter ?? DEFAULT_CLOSE_TITLE_AFTER);
    };
    events.lesson.async.on("show-lesson-header", handle);
    return () => {
      events.lesson.async.off("show-lesson-header", handle);
    };
  }, []);

  useEffect(() => {
    const handle = (_payload: undefined, done: () => void) => {
      onHeaderHidden.current = done;
      dispatch({ type: "hide-lesson-header" });
    };
    events.lesson.async.on("hide-lesson-header", handle);
    return () => {
      events.lesson.async.off("hide-lesson-header", handle);
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
    const handle = async () => {
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

  useEffect(() => {
    const handle = (payload: PronunciationResultEvent) => {
      dispatch({ type: "show-pronunciation-score", payload });
    };
    events.lesson.sync.on("show-pronunciation-score", handle);
    return () => {
      events.lesson.sync.off("show-pronunciation-score", handle);
    };
  }, []);

  useEffect(() => {
    const handle = () => {
      dispatch({ type: "hide-pronunciation-score" });
    };
    events.lesson.sync.on("hide-pronunciation-score", handle);
    return () => {
      events.lesson.sync.off("hide-pronunciation-score", handle);
    };
  }, []);

  useEffect(() => {
    const handle = (payload: LoadingEvent) => {
      dispatch({ type: "show-loading", payload });
    };
    events.lesson.sync.on("show-loading", handle);
    return () => {
      events.lesson.sync.off("show-loading", handle);
    };
  }, []);

  useEffect(() => {
    const handle = () => {
      dispatch({ type: "hide-loading" });
    };
    events.lesson.sync.on("hide-loading", handle);
    return () => {
      events.lesson.sync.off("hide-loading", handle);
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
