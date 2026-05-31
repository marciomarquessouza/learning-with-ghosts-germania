import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LessonHeader } from "./LessonHeader";
import { Button } from "@/components/Button";
import { events } from "@/events/events";
import { useCallback, useState } from "react";
import { useAudioStore } from "@/store/audioStore";
import { LessonManager } from "@/game/lesson/LessonManager";
import { useLessonStore } from "@/store/lessonStore";

const meta: Meta<typeof LessonHeader> = {
  title: "Game/UI/LessonHeader",
  component: LessonHeader,
  globals: {
    backgrounds: { value: "white", grid: false },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;

type ActionsProps = {
  title: string;
  description: string;
  isPronunciationRecord?: boolean;
};

type Phases = "close" | "open" | "transition";

const component = ({
  title,
  description,
  isPronunciationRecord,
}: ActionsProps) => {
  const [phase, setPhase] = useState<Phases>("close");
  const { isRecording, setIsRecording } = useAudioStore();
  const [recordId, setRecordId] = useState<string | undefined>(undefined);
  const { lesson } = useLessonStore();
  const lessonManager = new LessonManager(lesson);

  const openHeader = useCallback(async () => {
    setIsRecording(false);
    setPhase("transition");
    await events.lesson.async.emitAsync("write-lesson-description", {
      dialogueTitle: title,
      description: description,
    });
    setPhase("open");
  }, [description, setIsRecording, title]);

  const closeHeader = async () => {
    setPhase("transition");
    await events.lesson.async.emitAsync("hide-lesson-header");
    setPhase("close");
  };

  const recordVoice = async () => {
    const { recordId } = await lessonManager.pronunciationChallenge();
    setRecordId(recordId);
  };

  const stopVoiceRecord = async () => {
    lessonManager.stopPronunciationChallenge();
    await showRecordResult();
  };

  const playAudio = () => {
    if (!recordId) return null;
    lessonManager.playPronunciationRecord(recordId);
  };

  const showRecordResult = async () => {
    return events.lesson.async.emitAsync("write-lesson-description", {
      description: "Your voice is terrible",
    });
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
          onClick={phase === "close" ? openHeader : closeHeader}
          disabled={phase === "transition"}
        />
      </div>
      {phase === "open" && isPronunciationRecord && (
        <div className="mt-4">
          <Button
            label={isRecording ? "Stop" : "Record"}
            labelIcon={isRecording ? "⏹" : "⏺"}
            iconPosition="start"
            onClick={isRecording ? stopVoiceRecord : recordVoice}
          />
        </div>
      )}
      {recordId && (
        <div className="my-4">
          <Button label="Recorded Audio" onClick={() => playAudio()} />
        </div>
      )}
    </div>
  );
};

export const Default: StoryObj<ActionsProps> = {
  args: {
    title: "Default",
    description: "Press {{key|Space}} or {{key|E}} to interact",
  },
  render: component,
};

export const RecordAudio: StoryObj<ActionsProps> = {
  args: {
    title: "Default",
    description: "Press {{key|Space}} or {{key|E}} to interact",
    isPronunciationRecord: true,
  },
  render: component,
};
