import { useMemo } from "react";
import { IconAudioWithCircle } from "../../LessonChallenges/icons/IconAudioWithCircle";

export interface PronunciationVoiceIndicatorProps {
  isVisible: boolean;
  voiceLevel: number;
}

export function PronunciationVoiceIndicator({
  isVisible,
  voiceLevel,
}: PronunciationVoiceIndicatorProps) {
  const amplified = useMemo(() => Math.pow(voiceLevel, 0.3), [voiceLevel]);
  const halfPct = useMemo(() => Math.min(100, amplified * 200), [amplified]); // half
  const mirroredWidth = useMemo(() => Math.min(100, halfPct), [halfPct]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      id="pronunciation-voice-indicator"
      className="flex w-full h-20 flex-col items-center justify-center"
    >
      <div className="mt-2 w-[520px] mx-auto text-center">
        <div className="relative flex items-center justify-center">
          <div className="relative h-3 w-full rounded-full bg-[#efe6d9] shadow-[0_1px_0_rgba(0,0,0,0.2)]">
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 h-full bg-[#C20013] transition-[width] duration-120 ease-out rounded-full"
              style={{ width: `${mirroredWidth}%` }}
            />
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <IconAudioWithCircle isPlaying />
          </div>
        </div>
        <div className="flex justify-between text-[11px] text-[#FFF3E4] mt-1 font-primary tracking-tight">
          <span>HIGH</span>
          <span>MEDIUM</span>
          <span>LOW</span>
          <span>LOW</span>
          <span>MEDIUM</span>
          <span>HIGH</span>
        </div>
      </div>
    </div>
  );
}
