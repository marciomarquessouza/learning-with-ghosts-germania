import { ScoreResult } from "@/libs/audio/utils/audioScore";
import { AudioPlaybackContainer } from "../common/AudioPlaybackContainer";
import { LessonEntry } from "@/types";
import { AudioScoreSummary } from "@/libs/audio/useAudioScoreV2";

export interface PronunciationFeedbackProps {
  scoreResult: ScoreResult;
  audioScoreSummary: AudioScoreSummary | null;
  lessonEntry: Omit<LessonEntry, "steps">;
  isPlaying: boolean;
  onClickReproduce: () => void;
}

export function PronunciationFeedback({
  scoreResult,
  audioScoreSummary,
  lessonEntry,
  isPlaying,
  onClickReproduce,
}: PronunciationFeedbackProps) {
  const rawScore = scoreResult.score ?? 0;
  const clampedScore = Math.max(0, Math.min(100, Math.round(rawScore)));
  const barWidth = `${Math.max(15, clampedScore)}%`;

  const { audio, target } = lessonEntry;


  const headline = audioScoreSummary?.headline ?? "";
  const label = audioScoreSummary?.label ?? "";
  const textColor = audioScoreSummary?.textColor ?? "";
  const barColor = audioScoreSummary?.barColor ?? "";

  if (!audioScoreSummary) {
    return null;
  }

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
