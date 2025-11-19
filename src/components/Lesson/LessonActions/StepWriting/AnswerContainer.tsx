import { IconBackspace } from "../../icons/IconBackspace";
import { PreparedTarget } from "./utils/prepareTarget";

export interface AnswerContainerProps {
  answerIndexes: number[];
  preparedTarget: PreparedTarget;
  onBackspace?: () => void;
}

const isSpace = (index: number, wordIndexes: number[]): boolean =>
  index + 1 < wordIndexes.length &&
  wordIndexes[index] !== wordIndexes[index + 1];

export function AnswerContainer({
  answerIndexes,
  preparedTarget,
  onBackspace,
}: AnswerContainerProps) {
  const letters = preparedTarget.sanitizedTarget.toUpperCase().split("");
  const answerIndexSet = new Set(answerIndexes);

  return (
    <div
      className={[
        "w-full h-14 bg-black",
        "flex flex-row justify-center items-center",
        "my-3",
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
              hasSpaceAfter ? "mr-6" : "",
            ].join(" ")}
          >
            <p className="font-mono text-2xl">
              {answerIndexSet.has(index) ? character : ""}
            </p>
          </div>
        );
      })}

      <button
        className={[
          "absolute right-3",
          "h-8 w-8",
          "hover:scale-105 active:scale-95",
          "cursor-pointer",
        ].join(" ")}
        onClick={onBackspace}
      >
        <IconBackspace />
      </button>
    </div>
  );
}
