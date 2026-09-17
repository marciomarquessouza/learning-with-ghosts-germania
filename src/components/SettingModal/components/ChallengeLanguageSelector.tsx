import { Language } from "@/constants/lesson";

type ChallengeLanguageSelectorProps = {
  value: Language;
  onChange: (language: Language) => void;
};

const languages = [
  {
    value: "de-DE",
    label: "Alemão",
    flag: "🇩🇪",
  },
  {
    value: "en-US",
    label: "Inglês",
    flag: "🇺🇸",
  },
] satisfies Array<{
  value: Language;
  label: string;
  flag: string;
}>;

export function ChallengeLanguageSelector({
  value,
  onChange,
}: ChallengeLanguageSelectorProps) {
  return (
    <fieldset>
      <legend className="mb-3 font-bold uppercase">
        1. Idioma do desafio
      </legend>

      <div className="grid grid-cols-2 gap-4">
        {languages.map((language) => {
          const selected = value === language.value;

          return (
            <button
              key={language.value}
              type="button"
              onClick={() => onChange(language.value)}
              aria-pressed={selected}
              className={[
                "flex h-14 items-center justify-center gap-3 rounded-xl border",
                "font-bold uppercase transition-colors",
                selected
                  ? "border-[#17141d] bg-gray-100"
                  : "border-gray-200 bg-white",
              ].join(" ")}
            >
              <span aria-hidden="true" className="text-xl">
                {language.flag}
              </span>

              {language.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}