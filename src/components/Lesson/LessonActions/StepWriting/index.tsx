import { LessonEntry, LessonEntryStep } from "@/types";
import { LessonActionContainer } from "../common/LessonActionContainer";
import { LessonEntryInstruction } from "../common/LessonEntryInstruction";
import { Button } from "@/components/Button";
import { useState } from "react";
import { IconWrite } from "../../icons/IconWrite";

type Phases = "writing" | "result";

export interface StepWritingProps {
  lessonEntry: Omit<LessonEntry, "steps">;
  lessonStep: LessonEntryStep;
  show: boolean;
  onClick: () => void;
}

export function StepWriting({
  lessonEntry,
  lessonStep,
  show,
  onClick,
}: StepWritingProps) {
  const [phase, setPhase] = useState<Phases>("writing");
  const [answer, setAnswer] = useState("");
  const { audio, reference, target } = lessonEntry;

  const handleTryAgain = () => {
    setPhase("writing");
    setAnswer("");
  };

  const handleConfirm = () => {
    setPhase("result");
  };

  return (
    <>
      <LessonActionContainer title="Writing">
        <LessonEntryInstruction
          audio={audio}
          instruction={lessonStep.instruction}
        />

        <div className="relative ml-8 my-1 w-[520px] shadow-2xl shadow-black">
          <div className="flex items-center bg-black px-3 py-2 min-h-12">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F5E1C8] mr-2">
              <IconWrite />
            </span>
            <div className="flex items-center w-full rounded-sm bg-white pl-3 pr-1 py-1 ">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Escreva a sua resposta"
                className="flex-1 bg-transparent outline-none font-primary text-[#111] text-base px-1"
              />
            </div>
            <button
              type="button"
              onClick={handleConfirm}
              className="ml-2 px-2 py-1 bg-black hover:bg-gray-700 text-[#FFF3E4] font-primary font-bold text-md uppercase cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      </LessonActionContainer>

      <div className="absolute right-4 -bottom-6">
        <div className="flex flex-row gap-4">
          {phase === "result" && (
            <Button
              label="TRY AGAIN"
              labelIcon="↻"
              color="bg-[#976ED4] hover:bg-[#6700FF]"
              onClick={handleTryAgain}
            />
          )}
          <Button
            label={phase === "writing" ? "SKIP" : "NEXT"}
            labelIcon={phase === "writing" ? "⏭" : "►"}
            color={
              phase === "writing"
                ? "bg-[#976ED4] hover:bg-[#6700FF]"
                : "bg-[#B40F00] hover:bg-[#941729]"
            }
            onClick={onClick}
          />
        </div>
      </div>
    </>
  );
}
