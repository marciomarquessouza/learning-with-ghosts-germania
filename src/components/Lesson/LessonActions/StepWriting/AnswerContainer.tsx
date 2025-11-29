import { useMemo } from "react";
import { Phases } from ".";
import { IconBackspace } from "../../icons/IconBackspace";
import { isSpace } from "./utils/isSpace";
import { PreparedTarget } from "./utils/prepareTarget";

export interface AnswerContainerProps {
  answerIndexes: number[];
  preparedTarget: PreparedTarget;
  showBackspace?: boolean;
  phase: Phases;
  onBackspace?: () => void;
}

export function AnswerContainer({
  answerIndexes,
  preparedTarget,
  showBackspace = false,
  phase,
  onBackspace,
}: AnswerContainerProps) {
  const letters = preparedTarget.sanitizedTarget.toUpperCase().split("");
  const answerIndexSet = new Set(answerIndexes);

  const backgroundColor = useMemo(() => {
    switch (phase) {
      case "result:correct":
        return "#00A86B";
      case "result:fail":
        return "#000";
      case "writing":
      default:
        return "#000";
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
      style={{
        backgroundColor,
      }}
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
              hasSpaceAfter ? "mr-4" : "",
            ].join(" ")}
            style={{
              color: phase === "result:fail" ? "#941729" : "#fff",
              borderColor: "#fff",
              fontWeight: phase === "result:fail" ? "bold" : "normal",
            }}
          >
            <p className="font-mono text-2xl">
              {answerIndexSet.has(index) ? character : ""}
            </p>
          </div>
        );
      })}

      {showBackspace && (
        <button
          className={[
            "ml-2",
            "h-8 w-8",
            "hover:scale-105 active:scale-95",
            "cursor-pointer",
          ].join(" ")}
          onClick={onBackspace}
        >
          <IconBackspace />
        </button>
      )}
    </div>
  );
}
