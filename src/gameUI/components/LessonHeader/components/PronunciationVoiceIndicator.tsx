import { useMemo } from "react";
import { IconAudioWithCircle } from "../../LessonChallenges/icons/IconAudioWithCircle";
import { useAudioStore } from "@/store/audioStore";

export interface PronunciationVoiceIndicatorProps {
  isVisible: boolean;
}

const MEDIUM_THRESHOLD = 40;

const MIN_VOLUME = 0.01;
const MAX_VOLUME = 0.18;

export function PronunciationVoiceIndicator({
  isVisible,
}: PronunciationVoiceIndicatorProps) {
  const { currentVoiceRecordingVolume } = useAudioStore();

  const mirroredWidth = useMemo(() => {
    const volume = currentVoiceRecordingVolume;

    if (volume <= MIN_VOLUME) {
      return 0;
    }

    const normalized = Math.min(
      1,
      (volume - MIN_VOLUME) / (MAX_VOLUME - MIN_VOLUME),
    );

    return Math.pow(normalized, 1.05) * 100;
  }, [currentVoiceRecordingVolume]);

  const activeColor = useMemo(() => {
    return mirroredWidth >= MEDIUM_THRESHOLD ? "#31A24C" : "#C20013";
  }, [mirroredWidth]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      id="pronunciation-voice-indicator"
      className="pointer-events-none absolute left-0 top-6 flex w-full items-center px-12 text-white outline-none"
    >
      <div className="flex w-full h-20 flex-col items-center justify-center">
        <p className="font-mono mb-3">SPEAK!!!</p>
        <div className="mt-2 w-[520px] mx-auto text-center">
          <div className="relative flex items-center justify-center">
            <div className="relative h-3 w-full rounded-full bg-[#efe6d9] shadow-[0_1px_0_rgba(0,0,0,0.2)]">
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 h-full transition-[width,background-color] duration-120 ease-out rounded-full"
                style={{
                  width: `${mirroredWidth}%`,
                  backgroundColor: activeColor,
                }}
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
    </div>
  );
}
