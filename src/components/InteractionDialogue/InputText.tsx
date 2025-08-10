import { CharacterDetails } from "@/hooks/useCharacterDetails";
import { useEffect, useRef } from "react";

export interface InputTextProps {
  questionText: string;
  inputLabel: React.ReactNode;
  characterDetails: CharacterDetails;
  answerText: string;
  isTypeWritingComplete: boolean;
  onSubmit: () => void;
  onAnswerChange: (answer: string) => void;
}

export function InputText({
  questionText,
  characterDetails,
  answerText,
  inputLabel,
  isTypeWritingComplete,
  onSubmit,
  onAnswerChange,
}: InputTextProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onAnswerChange(event.target.value);
  };

  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSubmit();
    }
  };

  useEffect(() => {
    if (!isTypeWritingComplete) return;
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [isTypeWritingComplete]);

  return (
    <>
      <div className=" text-lg font-primary font-semibold tracking-wide">
        {characterDetails.hasHonorific && (
          <span className="text-neutral-800">
            {`${characterDetails.honorific} `}
          </span>
        )}
        <span className="font-bold text-neutral-800">
          {characterDetails.characterName}
        </span>
        <span className="text-[#B20F00] font-bold"> asks: </span>
        <span className="text-neutral-800"> {questionText}</span>
      </div>

      <div className="bg-[rgba(245,245,245,0.5)] px-4 py-2 outline-1 outline-neutral-300 rounded-sm flex-1 overflow-auto">
        <div
          className={`transition-opacity duration-200 ${
            isTypeWritingComplete
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <legend className="sr-only">Add your answer</legend>
          <label className="block font-primary text-sm leading-snug whitespace-pre-line text-neutral-800 m-auto">
            {inputLabel}
          </label>
          <input
            ref={inputRef}
            className="block grow py-1.5 px-3 font-mono text-gray-900 bg-white border border-slate-200 rounded-md
                      placeholder:text-gray-400 sm:text-sm/6 w-full
                      transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow
                      "
            placeholder="ANSWER"
            type="text"
            value={answerText}
            onChange={handleOnChange}
            onKeyDown={handleOnKeyDown}
          />
        </div>
      </div>
    </>
  );
}
