import { Alternative } from "@/events/gameEvents";
import { CharacterDetails } from "@/hooks/useCharacterDetails";
import { useEffect, useRef } from "react";

export interface AlternativesProps {
  displayedText: string;
  characterDetails: CharacterDetails;
  alternatives: Alternative[];
  selectedAlternative: string | null;
  isTypeWritingComplete: boolean;
  onSelected: (alternativeId: string) => void;
}

export function Alternatives({
  displayedText,
  characterDetails,
  selectedAlternative,
  alternatives,
  isTypeWritingComplete,
  onSelected,
}: AlternativesProps) {
  const firstInputRef = useRef<HTMLInputElement>(null);

  const handleOnSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSelected(event.target.value);
  };

  useEffect(() => {
    if (selectedAlternative === null) {
      // first alternative as default
      onSelected(alternatives[0].id);
    }
  }, [onSelected, selectedAlternative, alternatives]);

  useEffect(() => {
    requestAnimationFrame(() => firstInputRef.current?.focus());
  }, [isTypeWritingComplete]);

  return (
    <>
      <div className="text-xl font-primary font-semibold tracking-wide">
        {characterDetails.hasHonorific && (
          <span className="text-neutral-800">
            {`${characterDetails.honorific} `}
          </span>
        )}
        <span className="font-bold text-neutral-800">
          {characterDetails.characterName}
        </span>
        <span className="text-[#B20F00] font-bold"> asks: </span>
        <span className="text-neutral-800"> {displayedText}</span>
      </div>

      <div className="mt-2 bg-[rgba(245,245,245,0.5)] px-4 py-2 outline-1 outline-neutral-300 rounded-sm flex-1 overflow-auto">
        <div className="text-neutral-900 font-mono text-base leading-snug whitespace-pre-line">
          <fieldset
            className={`transition-opacity duration-200 ${
              isTypeWritingComplete
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <legend className="sr-only">Choose an answer</legend>
            {alternatives.map((alternative, index) => (
              <div key={alternative.id}>
                <label
                  htmlFor={alternative.id}
                  className="flex items-center gap-2 cursor-pointer select-none my-1"
                >
                  <input
                    ref={index === 0 ? firstInputRef : undefined}
                    type="radio"
                    id={alternative.id}
                    name="alternatives"
                    value={alternative.id}
                    checked={alternative.id === selectedAlternative}
                    onChange={handleOnSelected}
                    className="sr-only peer"
                    autoFocus
                  />
                  <span
                    id="red-icon"
                    className="w-4 h-4 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity"
                  >
                    <svg width="12" height="15" viewBox="0 0 17 20">
                      <path
                        d="M17 10L0.499999 19.5263L0.5 0.47372L17 10Z"
                        fill="#B40F00"
                      />
                    </svg>
                  </span>
                  <span
                    className="font-mono leading-tight px-1
                               peer-checked:text-white
                               bg-none peer-checked:bg-black
                               shadow-none peer-checked:shadow-[0_0_0_1px_rgba(0,0,0,0.6)]
                               peer-focus-visible:outline-1 peer-focus-visible:outline-neutral-700
                               peer-hover:outline-1 peer-hover:outline-neutral-700
                               transition-colors
                               "
                  >
                    {" "}
                    - {alternative.text}
                  </span>
                </label>
              </div>
            ))}
          </fieldset>
        </div>
      </div>
    </>
  );
}
