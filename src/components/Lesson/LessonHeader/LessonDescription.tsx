import { CharacterDetails } from "@/hooks/useCharacterDetails";
import { useTypewriter } from "@/hooks/useTypewriter";
import { LessonEntryStep } from "@/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { StepFlags } from "../hooks/reducers/interactionReducer";

export interface LessonDescriptionProps {
  visible: boolean;
  lessonStep: LessonEntryStep;
  stepFlags: StepFlags;
  characterDetails: CharacterDetails;
}

type Phases = "hide" | "entering" | "typing" | "ready" | "exiting";

export function LessonDescription({
  visible,
  lessonStep,
  stepFlags,
  characterDetails,
}: LessonDescriptionProps) {
  const [phase, setPhase] = useState<Phases>("hide");
  const { displayedText, setTextToType, startTyping } = useTypewriter();
  const { characterName, honorific, hasHonorific } = characterDetails;
  const currentStep = useRef<number | null>(null);

  const handleOnIntroductionAnimationEnd = () => {
    startTyping();
  };

  useEffect(() => {
    if (visible && phase === "hide") {
      setTextToType(lessonStep.text);
      setPhase("entering");
      currentStep.current = stepFlags.stepIndex;
      return;
    }

    if (phase === "ready" && stepFlags.stepIndex !== currentStep.current) {
      setTextToType(lessonStep.text);
      startTyping();
      currentStep.current = stepFlags.stepIndex;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, lessonStep.text, phase, stepFlags.stepIndex]);

  const getAnimationStyle = (currentPhase: Phases) => {
    switch (currentPhase) {
      case "entering":
        return {
          animation: `scene-intro-fade-in 900ms ease-out forwards`,
          animationDelay: `200ms`,
        };
      case "exiting":
        return {
          animation: `scene-intro-fade-out 900ms ease-out forwards`,
          animationDelay: `0ms`,
        };
      default:
        return undefined;
    }
  };

  const isEntering = useMemo(() => phase === "entering", [phase]);

  if (!isEntering) return null;

  return (
    <>
      <div
        className="pointer-events-none flex h-full w-full items-center justify-center px-12 text-white opacity-0"
        style={getAnimationStyle(phase)}
        onAnimationEnd={(event) => {
          if (event.animationName === "scene-intro-fade-in") {
            handleOnIntroductionAnimationEnd();
          }
        }}
      >
        <div className="flex flex-col items-center mx-auto">
          <div className="bg-[#FFF3E4] px-4 py-0 mb-4">
            <p className="text-lg font-primary font-semibold tracking-wide text-center text-black">
              {`${hasHonorific ? honorific + " " : ""}${characterName}`}:
            </p>
          </div>
          <div className="flex items-start px-4">
            <p className="font-mono text-xl text-center min-h-20 text-[#FFF3E4]">
              {displayedText}
            </p>
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes scene-intro-fade-in  { 0% { opacity: 0; } 100% { opacity: 1; } }
          @keyframes scene-intro-fade-out { 0% { opacity: 1; } 100% { opacity: 0; } }
        `}
      </style>
    </>
  );
}
