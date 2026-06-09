import { ACTORS } from "@/constants/game";
import {
  ShowLessonTitleEvent,
  WriteLessonDescriptionEvent,
} from "@/events/lesson/types";

export type LessonHeaderState = {
  showLessonHeader: boolean;
  showLessonTitle: boolean;
  showDescription: boolean;
  showVoiceIndicator: boolean;
  showPronunciationScore: boolean;
  lessonTitle?: string;
  dialogueTitle?: string;
  description: string;
  updateDescription?: string;
  hidePressContinue?: boolean;
  teacher: ACTORS;
  day?: number;
  closeAfter?: number;
};

export const lessonHeaderDefaultState: LessonHeaderState = {
  showLessonHeader: false,
  showLessonTitle: false,
  showDescription: false,
  showVoiceIndicator: false,
  showPronunciationScore: false,
  hidePressContinue: false,
  lessonTitle: "",
  dialogueTitle: "",
  description: "",
  updateDescription: "",
  day: 1,
  teacher: ACTORS.TUTOR,
  closeAfter: 2_000,
};

export type Actions =
  | { type: "show-lesson-header"; payload: ShowLessonTitleEvent }
  | { type: "hide-lesson-header" }
  | { type: "show-lesson-title" }
  | { type: "hide-lesson-title" }
  | { type: "clear-lesson-title" }
  | { type: "show-description" }
  | { type: "write-description"; payload: WriteLessonDescriptionEvent }
  | { type: "hide-description" }
  | { type: "show-voice-indicator" }
  | { type: "hide-voice-indicator" }
  | { type: "show-pronunciation-score" }
  | { type: "hide-pronunciation-score" };

export function lessonHeaderReducer(
  state: LessonHeaderState = lessonHeaderDefaultState,
  actions: Actions,
): LessonHeaderState {
  switch (actions.type) {
    case "show-lesson-header":
      return {
        ...state,
        ...actions.payload,
        showLessonHeader: true,
      };
    case "hide-lesson-header":
      return {
        ...state,
        showLessonHeader: false,
      };
    case "show-lesson-title":
      return {
        ...state,
        showLessonHeader: true,
        showLessonTitle: true,
        showDescription: false,
        showVoiceIndicator: false,
        showPronunciationScore: false,
      };
    case "hide-lesson-title":
      return {
        ...state,
        showLessonTitle: false,
      };
    case "clear-lesson-title":
      return {
        ...state,
        lessonTitle: "",
        day: 1,
      };
    case "show-description":
      return {
        ...state,
        showLessonHeader: true,
        showDescription: true,
        showLessonTitle: false,
        showVoiceIndicator: false,
        showPronunciationScore: false,
      };
    case "write-description":
      return {
        ...state,
        ...actions.payload,
        showLessonHeader: true,
        showDescription: true,
        showLessonTitle: false,
        showVoiceIndicator: false,
        showPronunciationScore: false,
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
        showLessonHeader: true,
        showDescription: false,
        showLessonTitle: false,
        showVoiceIndicator: true,
        showPronunciationScore: false,
      };
    case "hide-voice-indicator":
      return {
        ...state,
        showVoiceIndicator: false,
      };
    case "show-pronunciation-score":
      return {
        ...state,
        showLessonHeader: true,
        showDescription: false,
        showLessonTitle: false,
        showVoiceIndicator: false,
        showPronunciationScore: true,
      };
    case "hide-pronunciation-score":
      return {
        ...state,
        showPronunciationScore: false,
      };
    default:
      return state;
  }
}
