import { isSpace } from "@/utils/isSpece";
import { IconBackspace } from "../../icons/IconBackspace";

export interface AnswerContainerProps {
  answerIndexes: number[];
  target: string;
  onBackspace?: () => void;
}

export function AnswerContainer({
  answerIndexes,
  target,
  onBackspace,
}: AnswerContainerProps) {
  return (
    <div
      className={[
        "w-full h-14 bg-black",
        "flex flex-row justify-center items-center",
        "my-3",
      ].join(" ")}
    >
      {target.split("").map((character, index) => (
        <div
          className={[
            "flex items-center justify-center",
            "h-7 mx-1 px-2 w-8",
            `border-2 border-dotted border-t-0 border-x-0 outline-white ${
              isSpace(character) && "border-b-0"
            }`,
          ].join(" ")}
          key={`${index}`}
        >
          <p className="font-mono text-2xl">
            {answerIndexes.includes(index) && character.toUpperCase()}
          </p>
        </div>
      ))}
      <button
        className={[
          "absolute right-10",
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
