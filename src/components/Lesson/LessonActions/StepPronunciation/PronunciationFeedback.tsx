import { ScoreResult } from "@/libs/audio/utils/audioScore";
import { AudioPlaybackContainer } from "../common/AudioPlaybackContainer";
import { PRONUNCIATION_FEEDBACK_THRESHOLDS } from "@/constants/game";
import { useMemo } from "react";
import { LessonEntry } from "@/types";

export function getScoreFeedback(score: number): {
  status: "excellent" | "good" | "pass" | "fail";
  headline: string;
  label: string;
  textColor: string;
  barColor: string;
} {
  if (score >= PRONUNCIATION_FEEDBACK_THRESHOLDS.EXCELLENT) {
    return {
      status: "excellent",
      headline: "That sounded natural and clear.",
      label: "NATURAL",
      textColor: "text-emerald-600",
      barColor: "bg-emerald-500",
    };
  } else if (score >= PRONUNCIATION_FEEDBACK_THRESHOLDS.GOOD) {
    return {
      status: "good",
      headline: "Very close — just a few small details.",
      label: "ALMOST THERE",
      textColor: "text-lime-600",
      barColor: "bg-lime-500",
    };
  } else if (score >= PRONUNCIATION_FEEDBACK_THRESHOLDS.PASS) {
    return {
      status: "pass",
      headline: "I can understand you. Let’s smooth it out a bit.",
      label: "UNDERSTANDABLE",
      textColor: "text-amber-600",
      barColor: "bg-amber-500",
    };
  } else {
    return {
      status: "fail",
      headline: "Not quite there yet. Listen once more and try again.",
      label: "TRY AGAIN",
      textColor: "text-red-700",
      barColor: "bg-red-600/80",
    };
  }
}

export interface PronunciationFeedbackProps {
  scoreResult: ScoreResult;
  lessonEntry: Omit<LessonEntry, "steps">;
  isPlaying: boolean;
  onClickReproduce: () => void;
}

export function PronunciationFeedback({
  scoreResult,
  lessonEntry,
  isPlaying,
  onClickReproduce,
}: PronunciationFeedbackProps) {
  const rawScore = scoreResult.score ?? 0;
  const clampedScore = Math.max(0, Math.min(100, Math.round(rawScore)));
  const barWidth = `${Math.max(15, clampedScore)}%`;

  const { audio, target } = lessonEntry;

  const { headline, label, textColor, barColor } = useMemo(
    () => getScoreFeedback(clampedScore),
    [clampedScore]
  );

  return (
    <div>
      <div className="w-full min-h-14 flex justify-center items-center">
        <p
          className={`text-center font-mono text-base sm:text-lg leading-snug whitespace-pre-line mt-2 ${textColor}`}
        >
          {headline}
        </p>
      </div>

      <div className="relative ml-8 my-1 w-[520px] grid grid-cols-2 shadow-2xl shadow-black">
        {/* LEFT – target */}
        <div className="flex items-center justify-end bg-black pr-8 min-h-10 py-1">
          <p className="font-primary text-[#FFF3E4] text-right leading-none text-xl">
            {target}
          </p>
        </div>

        {/* RIGHT – feedback */}
        <div className="relative flex items-center justify-center bg-black min-h-10 py-1 px-8 overflow-hidden">
          <div
            className={`absolute left-0 top-0 bottom-0 ${barColor} transition-[width] duration-500 ease-out`}
            style={{ width: barWidth }}
          />
          <p className="relative z-10 font-primary text-[#FFF3E4] leading-none text-xs tracking-[0.18em] uppercase">
            {label}
          </p>
        </div>

        {audio && (
          <AudioPlaybackContainer
            iconType="reproduce"
            showAudioButton
            isPlaying={isPlaying}
            onClickAudio={onClickReproduce}
          />
        )}
      </div>
    </div>
  );
}
