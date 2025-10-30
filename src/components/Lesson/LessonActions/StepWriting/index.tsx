import { LessonEntry, LessonEntryStep } from "@/types";

export interface StepWritingProps {
  lessonEntry: Omit<LessonEntry, "steps">;
  lessonStep: LessonEntryStep;
  show: boolean;
  onClick: () => void;
}

export function StepWriting({
  lessonEntry,
  lessonStep,
  show,
  onClick,
}: StepWritingProps) {
  return <p>Step Writing</p>;
}
