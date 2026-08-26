import type {
  WriteLessonDescriptionEvent,
  ShowLessonTitleEvent,
  ToggleNotebookEvent,
  PronunciationResultEvent,
  LoadingEvent,
  VoiceIndicatorEvent,
  ShowWritingBoardEvent,
  WriteLessonDialogueEvent,
  UpdateLessonScoreEvent,
} from "./types";
import { createEventManagers } from "@/libs/events/createEventManagers";

export type LessonSyncEvents = {
  "start-lesson": undefined;
  "toggle-notebook": ToggleNotebookEvent;
  "show-description": undefined;
  "show-voice-indicator": VoiceIndicatorEvent;
  "hide-voice-indicator": undefined;
  "show-pronunciation-score": PronunciationResultEvent;
  "hide-pronunciation-score": undefined;
  "show-loading": LoadingEvent;
  "hide-loading": undefined;
  "action-button:next": undefined;
  "action-button:repeat": undefined;
  "show-writing-board": ShowWritingBoardEvent;
  "hide-writing-board": undefined;
  "update-lesson-score": UpdateLessonScoreEvent;
};

export type LessonAsyncEvents = {
  "show-lesson-header": ShowLessonTitleEvent;
  "hide-lesson-header": undefined;
  "write-lesson-description": WriteLessonDescriptionEvent;
  "write-lesson-dialogue": WriteLessonDialogueEvent;
  "hide-lesson-description": undefined;
  "action-button:reproduce-audio": undefined;
};

export const lessonEvents = createEventManagers<
  LessonSyncEvents,
  LessonAsyncEvents
>();
