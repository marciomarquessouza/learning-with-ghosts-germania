import { Language } from "@/server/lessons/schemas/language";
import { NationIcon } from "../../Icons/NationIcon";
import { LESSON_CHALLENGE_DETAILS } from "../data/register-data";

interface ChallengeItemProps {
  language: Language;
  selected: boolean;
  onSelected: (language: Language) => void;
}

export function ChallengeItem({
  language,
  selected,
  onSelected,
}: ChallengeItemProps) {
  const challenge = LESSON_CHALLENGE_DETAILS[language];

  if (!challenge) return;

  return (
    <button
      type="button"
      onClick={() => onSelected(challenge.language)}
      className={`
        flex h-[180px] w-[280px] flex-col
        rounded-lg border p-5
        text-left
        transition-all duration-200
        ${
          selected
            ? "border-[#ff1f26] bg-[#f5efe4] shadow-[0_10px_30px_rgba(255,31,38,0.25)]"
            : "border-[#352020] bg-[#171719] hover:border-[#633]"
        }
      `}
    >
      <div className="mb-4 flex w-full items-center justify-between">
        <span
          className={`
            rounded px-3 py-1
            text-[11px] font-bold leading-none
            ${
              selected
                ? "bg-[#ff1f26] text-white"
                : "bg-[#2b2b2f] text-[#f5f1ec]"
            }
          `}
        >
          {challenge.nation}
        </span>

        {selected && <NationIcon />}
      </div>

      <h3
        className={`
          mb-1 text-2xl font-bold uppercase
          ${selected ? "text-[#171719]" : "text-[#f5f1ec]"}
        `}
      >
        {challenge.title}
      </h3>

      <p
        className={`
          max-w-[240px] text-[13px] leading-[1.45]
          ${selected ? "text-[#45403b]" : "text-[#8d8580]"}
        `}
      >
        {challenge.description}
      </p>
    </button>
  );
}
