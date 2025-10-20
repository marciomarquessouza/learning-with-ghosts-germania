import { CharacterDetails } from "@/hooks/useCharacterDetails";
import { useTypewriter } from "@/hooks/useTypewriter";
import { LessonEntryStep } from "@/types";
import { useEffect, useRef, useState } from "react";
import { StepFlags } from "../hooks/reducers/interactionReducer";

export interface LessonEntryProps {
  isEntering: boolean;
  lessonStep: LessonEntryStep;
  stepFlags: StepFlags;
  characterDetails: CharacterDetails;
}

export function LessonEntry({
  isEntering,
  lessonStep,
  stepFlags,
  characterDetails,
}: LessonEntryProps) {
  const { displayedText, setTextToType, startTyping } = useTypewriter();
  const [show, setShow] = useState(false);
  const { characterName, honorific, hasHonorific } = characterDetails;
  const currentStep = useRef<number | null>(null);

  const handleOnIntroductionAnimationEnd = () => {
    startTyping();
  };

  useEffect(() => {
    if (isEntering && !show) {
      setTextToType(lessonStep.text);
      setShow(true);
      return;
    }

    if (show && stepFlags.stepIndex !== currentStep.current) {
      setTextToType(lessonStep.text);
      startTyping();
      currentStep.current = stepFlags.stepIndex;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEntering, lessonStep.text, show, stepFlags.stepIndex]);

  if (!show) return null;

  return (
    <div
      className="pointer-events-none flex h-full w-full items-center justify-center px-12 text-white opacity-0"
      style={{
        animation: `${
          show ? "scene-intro-fade-in" : "scene-intro-fade-out"
        } 900ms ease-out forwards`,
        animationDelay: show ? `200ms` : `0ms`,
      }}
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
  );
}
