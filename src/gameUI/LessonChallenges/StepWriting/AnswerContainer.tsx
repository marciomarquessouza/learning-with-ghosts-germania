import { useMemo } from "react";
import { isSpace } from "./utils/isSpace";
import { PreparedTarget } from "./utils/prepareTarget";
import { StepPhases } from "@/types";

export interface AnswerContainerProps {
  answerIndexes: number[];
  preparedTarget: PreparedTarget;
  phase: StepPhases;
  onBackspace?: () => void;
}

export function AnswerContainer({
  answerIndexes,
  preparedTarget,
  phase,
}: AnswerContainerProps) {
  const letters = preparedTarget.sanitizedTarget.toUpperCase().split("");
  const answerIndexSet = new Set(answerIndexes);

  const underscoreColor = useMemo(() => {
    switch (phase) {
      case "result:correct":
        return "#00A86B";
      case "result:fail":
        return "#941729";
      case "writing":
      default:
        return "#fff";
    }
  }, [phase]);

  return (
    <div
      className={[
        "w-full h-14 bg-black",
        "flex flex-row justify-center items-center",
        "my-3 mx-6",
        "relative",
      ].join(" ")}
    >
      {letters.map((character, index) => {
        const hasSpaceAfter = isSpace(index, preparedTarget.wordIndexes);

        return (
          <div
            key={index}
            className={[
              "flex items-center justify-center",
              "h-7 mx-1 px-2 w-8",
              "border-2 border-dotted border-t-0 border-x-0 outline-white",
              "text-white",
              hasSpaceAfter ? "mr-4" : "",
            ].join(" ")}
            style={{
              borderColor: underscoreColor,
              fontWeight: phase === "writing" ? "normal" : "bold",
            }}
          >
            <p className="font-mono text-2xl">
              {answerIndexSet.has(index) ? character : ""}
            </p>
          </div>
        );
      })}
    </div>
  );
}
