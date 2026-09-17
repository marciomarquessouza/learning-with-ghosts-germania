import { Language } from "@/constants/lesson";

type PlayerLanguageSelectorProps = {
  value: Language;
  onChange: (language: Language) => void;
};

const languages = [
  {
    value: "pt-BR",
    label: "Português (Brasil)",
  },
  {
    value: "en-US",
    label: "English",
  },
] satisfies Array<{
  value: Language;
  label: string;
}>;

export function PlayerLanguageSelector({
  value,
  onChange,
}: PlayerLanguageSelectorProps) {
  return (
    <fieldset>
      <legend className="mb-3 font-bold uppercase">2. Seu idioma</legend>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value as Language)}
        className="
          h-14
          w-full
          rounded-xl
          border
          border-gray-200
          bg-white
          px-4
          font-bold
          outline-none
          focus:border-[#17141d]
        "
      >
        {languages.map((language) => (
          <option key={language.value} value={language.value}>
            {language.label}
          </option>
        ))}
      </select>
    </fieldset>
  );
}
