import { CharacterDetails } from "@/hooks/useCharacterDetails";

export interface DialogueBoxProps {
  characterDetails: CharacterDetails;
  displayedText: string;
}

export function DialogueBox({
  characterDetails,
  displayedText,
}: DialogueBoxProps) {
  return (
    <>
      <div className="text-xl font-primary font-semibold tracking-wide">
        {characterDetails.hasHonorific && (
          <span className="text-neutral-800">
            {`${characterDetails.honorific} `}
          </span>
        )}
        <span className="text-[#B20F00] font-bold">
          {characterDetails.characterName}
        </span>
        <span className="text-neutral-800"> says:</span>
      </div>

      <div className="mt-2 bg-[rgba(245,245,245,0.5)] px-4 py-2 outline-1 outline-neutral-300 rounded-sm flex-1 overflow-auto">
        <p className="text-neutral-900 font-mono text-base leading-snug whitespace-pre-line">
          {displayedText}
        </p>
      </div>
    </>
  );
}
