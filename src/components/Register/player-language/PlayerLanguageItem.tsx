import Image from "next/image";
import { NationIcon } from "../../Icons/NationIcon";
import { Language } from "@/constants/lesson";

interface PlayerLanguageItemProps {
  selected: boolean;
  language: Language;
  onSelected: (language: Language) => void;
}

export type PlayerLanguageDetails = Record<
  Language,
  { label: string; icon: string }
>;

const PLAYER_LANGUAGE_DETAILS: Partial<PlayerLanguageDetails> = {
  "en-UK": {
    label: "ENGLISH",
    icon: "/ui/flags/flag_en-UK.svg",
  },
  "pt-BR": {
    label: "PORTUGUESE",
    icon: "/ui/flags/flag_pt-BR.svg",
  },
  "es-ES": {
    label: "SPANISH",
    icon: "/ui/flags/flag_es-ES.svg",
  },
};

export function PlayerLanguageItem({
  selected,
  language,
  onSelected,
}: PlayerLanguageItemProps) {
  const details = PLAYER_LANGUAGE_DETAILS[language];

  if (!details) return null;

  return (
    <button
      type="button"
      onClick={() => onSelected(language)}
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
			${selected ? "bg-[#ff1f26] text-white" : "bg-[#2b2b2f] text-[#f5f1ec]"}
		  `}
        >
          LANGUAGE
        </span>

        {selected && <NationIcon />}
      </div>

      <div className="flex flex-row items-center justify-center">
        <Image
          className=" p-2"
          width={60}
          height={41}
          alt="flag"
          src={details.icon}
        />
        <p
          className={`
		  pt-2 mb-1 text-2xl font-bold uppercase
		  ${selected ? "text-[#171719]" : "text-[#f5f1ec]"}
		`}
        >
          {details.label}
        </p>
      </div>
    </button>
  );
}
