import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LessonHeader } from "./LessonHeader";
import { Button } from "@/components/Button";
import { events } from "@/events/events";
import { useState } from "react";

const meta: Meta<typeof LessonHeader> = {
  title: "Game/UI/LessonHeader",
  component: LessonHeader,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type ActionsProps = {
  lessonName: string;
  title: string;
  description: string;
  titleDurationMs?: number;
  days: number;
};

type Phases = "close" | "open" | "transition";

const component = ({
  lessonName,
  title,
  description,
  titleDurationMs,
  days,
}: ActionsProps) => {
  const [phase, setPhase] = useState<Phases>("close");

  const handleOpenClick = async () => {
    setPhase("transition");
    await events.lesson.async.emitAsync("show-lesson-title", {
      title: lessonName || "Lesson Name",
      day: days,
      closeAfter: titleDurationMs || 3_500,
    });

    await events.lesson.async.emitAsync("write-lesson-description", {
      dialogueTitle: title,
      description: description,
    });

    setPhase("open");
  };

  const handleCloseClick = async () => {
    setPhase("transition");
    await events.lesson.async.emitAsync("hide-lesson-title");
    setPhase("close");
  };

  return (
    <div>
      <LessonHeader />
      <div className="">
        <Button
          label={
            phase === "transition"
              ? "Wait"
              : phase === "open"
                ? "Close"
                : "Open"
          }
          onClick={phase === "close" ? handleOpenClick : handleCloseClick}
          disabled={phase === "transition"}
        />
      </div>
    </div>
  );
};

export const Default: StoryObj<ActionsProps> = {
  args: {
    lessonName: "Lesson Title",
    title: "Default",
    description: "Press {{key|Space}} or {{key|E}} to interact",
    titleDurationMs: 3_500,
  },
  render: component,
};
