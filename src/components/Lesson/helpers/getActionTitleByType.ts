import { LessonStepType } from "@/types";

export function getActionTitleByType(type: LessonStepType) {
  switch (type) {
    case "introduction":
      return "Introduction";
    case "listening":
      return "Listening";
    case "pronunciation":
      return "Pronunciation";
    case "writing":
      return "Writing";

    default:
      return type;
  }
}
