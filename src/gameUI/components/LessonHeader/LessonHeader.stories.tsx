import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LessonHeader } from "./LessonHeader";
import { Button } from "@/components/Button";
import { events } from "@/events/events";
import { useCallback, useState } from "react";
import { useAudioStore } from "@/store/audioStore";
import { LessonManager } from "@/game/lesson/LessonManager";
import { Lesson } from "@/libs/lesson/types";
import { PronunciationResultEvent } from "@/events/lesson/types";

const meta: Meta<typeof LessonHeader> = {
  title: "Game/UI/LessonHeader",
  component: LessonHeader,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type ActionsProps = {
  title: string;
  description: string;
  showPronunciationRecord?: boolean;
  showPronunciationResults?: boolean;
  showLoading?: boolean;
};

type Phases = "close" | "open" | "transition";

const lesson: Lesson = {
  id: "__ID__",
  day: 1,
  title: "__MOCK__LESSON__",
  entries: [
    {
      id: "__ID__",
      reference: "Hello",
      target: "Hallo",
      steps: [],
    },
  ],
};

const defaultPronunciationResult: PronunciationResultEvent = {
  recordId: "#",
  score: {
    accuracyPercentage: 100,
    characters: [
      { id: "0-h", character: "H", found: true },
      { id: "1-a", character: "a", found: true },
      { id: "2-l", character: "l", found: true },
      { id: "3-l", character: "l", found: true },
      { id: "4-o", character: "o", found: true },
    ],
  },
  feedback: {
    status: "excellent",
    label: "EXCELLENT!!!",
    barColor: "#009E93",
  },
};

const goodPronunciationResult: PronunciationResultEvent = {
  recordId: "#",
  score: {
    accuracyPercentage: 85,
    characters: [
      { id: "0-h", character: "H", found: true },
      { id: "1-a", character: "a", found: true },
      { id: "2-l", character: "l", found: false },
      { id: "3-l", character: "l", found: false },
      { id: "4-o", character: "o", found: false },
    ],
  },
  feedback: {
    status: "excellent",
    label: "ALMOST THERE",
    barColor: "#FCA30E",
  },
};

const failPronunciationResult: PronunciationResultEvent = {
  recordId: "#",
  score: {
    accuracyPercentage: 0,
    characters: [
      { id: "0-h", character: "H", found: false },
      { id: "1-a", character: "a", found: false },
      { id: "2-l", character: "l", found: false },
      { id: "3-l", character: "l", found: false },
      { id: "4-o", character: "o", found: false },
    ],
  },
  feedback: {
    status: "fail",
    label: "TRY AGAIN",
    barColor: "#B40F00",
  },
};

const lessonManager = new LessonManager(lesson);

const component = ({
  title,
  description,
  showPronunciationRecord,
  showPronunciationResults,
  showLoading,
}: ActionsProps) => {
  const [phase, setPhase] = useState<Phases>("close");
  const { isRecording, setIsRecording } = useAudioStore();
  const [recordId, setRecordId] = useState<string | undefined>(undefined);
  const [recordingTimeout, setRecordingTimeout] = useState(false);
  const [loading, setLoading] = useState(false);

  const openHeader = useCallback(async () => {
    setIsRecording(false);
    setPhase("transition");
    await events.lesson.async.emitAsync("show-lesson-header", {
      title: "Lesson",
      day: 1,
    });
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
    setRecordingTimeout(false);
    const { recordId } = await lessonManager.pronunciationChallenge({
      onRecordTimeout: () => setRecordingTimeout(true),
    });
    setRecordId(recordId);
    await showRecordResult();
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

  const showPronunciationScore = (value: PronunciationResultEvent) => {
    return events.lesson.sync.emit("show-pronunciation-score", value);
  };

  const toggleLoading = useCallback(() => {
    setLoading((value) => {
      if (value) {
        events.lesson.sync.emit("hide-loading");
        return false;
      } else {
        events.lesson.sync.emit("show-loading");
        return true;
      }
    });
  }, []);

  return (
    <div
      id="container"
      className={[
        "flex flex-1 min-h-screen min-w-screen -m-8 p-0",
        "w-full h-full flex-col items-center justify-center bg-white",
      ].join(" ")}
    >
      <LessonHeader />
      <div className="">
        {!loading && (
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
        )}
      </div>
      {phase === "open" && showPronunciationRecord && (
        <div className="mt-4">
          <Button
            label={isRecording ? "Stop" : "Record"}
            labelIcon={isRecording ? "⏹" : "⏺"}
            iconPosition="start"
            onClick={isRecording ? stopVoiceRecord : recordVoice}
          />
        </div>
      )}
      {phase === "open" && showLoading && (
        <div className="mt-4">
          <Button
            label={loading ? "hide loading" : "show loading"}
            onClick={toggleLoading}
          />
        </div>
      )}
      <div className="flex flex-row gap-4">
        {phase === "open" && showPronunciationResults && (
          <div className="mt-4">
            <Button
              label="Show Score - Excellent"
              onClick={() => showPronunciationScore(defaultPronunciationResult)}
            />
          </div>
        )}
        {phase === "open" && showPronunciationResults && (
          <div className="mt-4">
            <Button
              label="Show Score - Good"
              onClick={() => showPronunciationScore(goodPronunciationResult)}
            />
          </div>
        )}
        {phase === "open" && showPronunciationResults && (
          <div className="mt-4">
            <Button
              label="Show Score - fail"
              onClick={() => showPronunciationScore(failPronunciationResult)}
            />
          </div>
        )}
      </div>
      {recordId && (
        <div className="my-4">
          <Button label="Recorded Audio" onClick={() => playAudio()} />
        </div>
      )}
      <div className="absolute bottom-0 w-8/12 p-2 bg-black">
        <div className="flex items-center justify-center gap-6">
          <span className="font-mono text-sm leading-relaxed text-[#FFF3E4]">
            <strong>Phase:</strong> {phase}
          </span>
          <span className="font-mono text-sm leading-relaxed text-[#FFF3E4]">
            <strong>Recording:</strong>{" "}
            {isRecording ? <span className="text-red-600">yes</span> : "no"}
          </span>
          <span className="font-mono text-sm leading-relaxed text-[#FFF3E4]">
            <strong>Audio Id:</strong> {recordId || "NA"}
          </span>
          <span className="font-mono text-sm leading-relaxed text-[#FFF3E4]">
            <strong>Auto Stop by Time:</strong>{" "}
            {recordingTimeout ? "yes" : "false"}
          </span>
          <span className="font-mono text-sm leading-relaxed text-[#FFF3E4]">
            <strong>Loading:</strong> {loading ? "yes" : "false"}
          </span>
        </div>
      </div>
    </div>
  );
};

export const Default: StoryObj<ActionsProps> = {
  args: {
    title: "Default",
    description: "Press {{key|Space}} or {{key|E}} to interact",
    showPronunciationRecord: false,
    showPronunciationResults: false,
  },
  render: component,
};

export const RecordAudio: StoryObj<ActionsProps> = {
  args: {
    title: "Default",
    description: "Press {{key|Space}} or {{key|E}} to interact",
    showPronunciationRecord: true,
    showPronunciationResults: false,
  },
  render: component,
};

export const PronunciationResult: StoryObj<ActionsProps> = {
  args: {
    title: "Default",
    description: "Press {{key|Space}} or {{key|E}} to interact",
    showPronunciationRecord: false,
    showPronunciationResults: true,
  },
  render: component,
};

export const Loading: StoryObj<ActionsProps> = {
  args: {
    title: "Default",
    description: "Press {{key|Space}} or {{key|E}} to interact",
    showPronunciationRecord: false,
    showPronunciationResults: false,
    showLoading: true,
  },
  render: component,
};
