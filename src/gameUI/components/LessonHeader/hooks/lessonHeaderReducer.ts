import {
  LoadingEvent,
  PronunciationResultEvent,
  ShowLessonTitleEvent,
  VoiceIndicatorEvent,
  WriteLessonDescriptionEvent,
} from "@/events/lesson/types";

export type LessonHeaderState = {
  showHeader: boolean;
  hidePressContinue?: boolean;
  closeAfter?: number;
  lesson: {
    show: boolean;
    title?: string;
    day?: number;
  };
  step: {
    show: boolean;
    title?: string;
    description?: string;
  };
  voiceIndicator: {
    show: boolean;
    text?: string;
  };
  pronunciationScore: {
    show: boolean;
    pronunciationResult?: PronunciationResultEvent;
  };
  loading: {
    show: boolean;
    text?: string;
  };
};

export const lessonHeaderDefaultState: LessonHeaderState = {
  showHeader: false,
  hidePressContinue: true,
  closeAfter: 2_000,
  lesson: {
    show: false,
    title: "",
    day: 1,
  },
  step: {
    show: false,
    title: "",
    description: "",
  },
  voiceIndicator: {
    show: false,
  },
  pronunciationScore: {
    show: false,
    pronunciationResult: undefined,
  },
  loading: {
    show: false,
    text: "Loooaaading....",
  },
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
  | { type: "show-voice-indicator"; payload?: VoiceIndicatorEvent }
  | { type: "hide-voice-indicator" }
  | { type: "show-pronunciation-score"; payload: PronunciationResultEvent }
  | { type: "hide-pronunciation-score" }
  | { type: "show-loading"; payload?: LoadingEvent }
  | { type: "hide-loading" };

export function lessonHeaderReducer(
  state: LessonHeaderState = lessonHeaderDefaultState,
  actions: Actions,
): LessonHeaderState {
  switch (actions.type) {
    case "show-lesson-header":
      return {
        ...state,
        ...actions.payload,
        showHeader: true,
      };
    case "hide-lesson-header":
      return {
        ...state,
        showHeader: false,
      };
    case "show-lesson-title":
      return {
        ...state,
        lesson: {
          ...state.lesson,
          show: true,
        },
        step: {
          ...state.step,
          show: false,
        },
        voiceIndicator: {
          ...state.voiceIndicator,
          show: false,
        },
        pronunciationScore: {
          pronunciationResult: undefined,
          show: false,
        },
        loading: { show: false },
      };
    case "hide-lesson-title":
      return {
        ...state,
        lesson: {
          ...state.lesson,
          show: false,
        },
      };
    case "clear-lesson-title":
      return {
        ...state,
        lesson: {
          ...state.lesson,
          show: false,
          title: "",
          day: 1,
        },
      };
    case "show-description":
      return {
        ...state,
        showHeader: true,
        lesson: {
          ...state.lesson,
          show: false,
        },
        step: {
          ...state.step,
          show: true,
        },
        voiceIndicator: {
          ...state.voiceIndicator,
          show: false,
        },
        pronunciationScore: {
          pronunciationResult: undefined,
          show: false,
        },
        loading: { show: false },
      };
    case "write-description":
      return {
        ...state,
        showHeader: true,
        hidePressContinue: actions.payload.hidePressContinue,
        lesson: {
          ...state.lesson,
          show: false,
        },
        step: {
          ...state.step,
          show: true,
          title: actions.payload.dialogueTitle,
          description: actions.payload.description,
        },
        voiceIndicator: {
          ...state.voiceIndicator,
          show: false,
        },
        pronunciationScore: {
          pronunciationResult: undefined,
          show: false,
        },
        loading: { show: false },
      };
    case "hide-description":
      return {
        ...state,
        step: {
          ...state.step,
          show: false,
          title: "",
          description: "",
        },
      };
    case "show-voice-indicator":
      return {
        ...state,
        voiceIndicator: {
          ...state.voiceIndicator,
          show: true,
          text: actions?.payload?.target,
        },
        lesson: {
          ...state.lesson,
          show: false,
        },
        step: {
          ...state.step,
          show: false,
        },
        pronunciationScore: {
          pronunciationResult: undefined,
          show: false,
        },
        loading: { show: false },
      };
    case "hide-voice-indicator":
      return {
        ...state,
        voiceIndicator: {
          ...state.voiceIndicator,
          show: false,
        },
      };
    case "show-pronunciation-score":
      return {
        ...state,
        lesson: {
          ...state.lesson,
          show: false,
        },
        step: {
          ...state.step,
          show: false,
        },
        voiceIndicator: {
          ...state.voiceIndicator,
          show: false,
        },
        pronunciationScore: {
          ...state.pronunciationScore,
          show: true,
          pronunciationResult: actions.payload,
        },
        loading: { show: false },
      };
    case "hide-pronunciation-score":
      return {
        ...state,
        pronunciationScore: {
          ...state.pronunciationScore,
          show: false,
          pronunciationResult: undefined,
        },
      };
    case "show-loading":
      return {
        ...state,
        loading: { show: true, text: actions?.payload?.text },
        lesson: {
          ...state.lesson,
          show: false,
        },
        step: {
          ...state.step,
          show: false,
        },
        voiceIndicator: {
          ...state.voiceIndicator,
          show: false,
        },
        pronunciationScore: {
          ...state.pronunciationScore,
          show: false,
        },
      };
    case "hide-loading":
      return {
        ...state,
        loading: { show: false },
      };
    default:
      return state;
  }
}
