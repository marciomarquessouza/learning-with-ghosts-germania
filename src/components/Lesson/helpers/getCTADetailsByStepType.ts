import { LessonStepType } from "@/types";

interface LessonCTAOptions {
  name: "primary" | "secondary";
  color: string;
  label: string;
  icon: string;
}

export function getCTADetailsByStepType(
  stepType: LessonStepType
): LessonCTAOptions[] {
  switch (stepType) {
    case "introduction":
      return [
        {
          name: "primary",
          color: "bg-red-700 hover:bg-red-800",
          label: "NEXT",
          icon: "►",
        },
      ];
    case "pronunciation":
      return [
        {
          name: "primary",
          color: "bg-red-700 hover:bg-red-800",
          label: "NEXT",
          icon: "►",
        },
      ];
    case "listening":
      return [
        {
          name: "primary",
          color: "bg-red-700 hover:bg-red-800",
          label: "NEXT",
          icon: "►",
        },
      ];
    default:
      return [
        {
          name: "primary",
          color: "bg-red-700 hover:bg-red-800",
          label: "NEXT",
          icon: "►",
        },
      ];
  }
}
