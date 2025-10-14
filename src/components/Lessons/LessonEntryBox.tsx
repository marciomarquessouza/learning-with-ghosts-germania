import { LessonEntry, LessonEntryStep } from "@/types";
import { useEffect, useState } from "react";
import { IconFlagDE } from "./icons/IconFlagDE";
import { IconFlagUK } from "./icons/IconFlagUK";
import { AudioButton } from "./AudioButton";
import { useGameAudio } from "@/hooks/useGameAudio";

type LessonEntryBoxProps = Omit<LessonEntry, "steps"> & {
  step: LessonEntryStep;
  isTypingComplete: boolean;
};

export function LessonEntryBox({
  reference,
  target,
  isTypingComplete,
  step,
  audio,
}: LessonEntryBoxProps) {
  const { isPlaying, play } = useGameAudio();
  const [visible, setVisible] = useState(false);

  const [showReference, setShowReference] = useState(false);
  const [showTarget, setShowTarget] = useState(false);
  const [showAudio, setShowAudio] = useState(false);

  const handleOnPlay = () => {
    play(audio);
  };

  const isLong = reference.length > 12 || target.length > 12;

  useEffect(() => {
    if (isTypingComplete) setVisible(true);
  }, [isTypingComplete]);

  useEffect(() => {
    if (!visible) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setShowReference(true);
      setShowTarget(true);
      setShowAudio(true);
      return;
    }

    const t1 = setTimeout(() => setShowReference(true), 40); // 1) EN
    const t2 = setTimeout(() => setShowTarget(true), 180); // 2) DE
    const t3 = setTimeout(() => setShowAudio(true), 320); // 3) Audio
    const t4 = setTimeout(() => play(audio), 120); // 3) Audio

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [visible, audio, play]);

  if (!visible) return null;

  const popClass = (on: boolean) =>
    [
      "transition-all duration-200 ease-out will-change-transform",
      on
        ? "opacity-100 scale-100 translate-y-0"
        : "opacity-0 scale-95 translate-y-1",
    ].join(" ");

  return (
    <div className="relative ml-8 my-1 w-[520px] grid grid-cols-2 shadow-2xl shadow-black">
      <div className="flex items-center justify-end bg-black pr-8 min-h-10 py-1">
        <div className={`flex items-center gap-2 ${popClass(showReference)}`}>
          <p
            className={`font-primary text-[#FFF3E4] text-right leading-none ${
              isLong ? "text-xl" : "text-2xl"
            }`}
          >
            {reference}
          </p>
          <span className="block h-5 w-5">
            <IconFlagUK width="100%" height="100%" />
          </span>
        </div>
      </div>

      <div className="flex items-center justify-start bg-[#C20013] pl-8 min-h-10 py-1">
        <div className={`flex items-center gap-2 ${popClass(showTarget)}`}>
          <span className="block h-5 w-5">
            <IconFlagDE width="100%" height="100%" />
          </span>
          <p
            className={`font-primary text-[#FFF3E4] leading-none ${
              isLong ? "text-xl" : "text-2xl"
            }`}
          >
            {target}
          </p>
        </div>
      </div>

      <div
        className={[
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10",
          popClass(showAudio),
        ].join(" ")}
      >
        {!!audio && (
          <AudioButton
            stepType={step.type}
            isPlaying={isPlaying}
            onClick={handleOnPlay}
          />
        )}
      </div>
    </div>
  );
}
