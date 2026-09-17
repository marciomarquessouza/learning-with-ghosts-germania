import { Level } from "@/constants/lesson";

type ChallengeLevelSelectorProps = {
  value: Level;
  onChange: (level: Level) => void;
};

const levels = [
  {
    id: "A1-1",
    title: "Nível A1-1",
    description:
      "Conhecimento Zero. Sobrevivência básica, cumprimentos e ordens diretas de Frau Marlene.",
  },
  {
    id: "A1-2",
    title: "Nível A1-2",
    description:
      "Comunicação Elementar. Diálogos breves nas ruelas escuras de Germania.",
  },
  {
    id: "A2-1",
    title: "Nível A2-1",
    description:
      "Rotina Distópica. Expressões cotidianas e leitura de cartazes de propaganda militar.",
  },
] satisfies Array<{
  id: Level;
  title: string;
  description: string;
}>;

export function ChallengeLevelSelector({
  value,
  onChange,
}: ChallengeLevelSelectorProps) {
  return (
    <fieldset>
      <legend className="mb-3 font-bold uppercase">
        3. Nível do desafio
      </legend>

      <div className="grid grid-cols-3 gap-4">
        {levels.map((level) => {
          const selected = value === level.id;

          return (
            <button
              key={level.id}
              type="button"
              onClick={() => onChange(level.id)}
              className={[
                "min-h-[142px] rounded-xl border p-5 text-left",
                selected
                  ? "border-[#17141d]"
                  : "border-gray-200",
              ].join(" ")}
            >
              <strong className="block text-2xl uppercase">
                {level.title}
              </strong>

              <span className="mt-2 block text-sm leading-tight">
                {level.description}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}