import { CharacterMood } from "@/types";
import { DialogueEntry, DialogueLine, InteractionLine } from "./types";

type DialogueLineBuilder = DialogueLine & {
  reactions: (charactersMood: CharacterMood[]) => DialogueLine;
  end: () => DialogueLine;
};

type AuthoringLine = InteractionLine | DialogueLineBuilder;

type AuthoringDialogueEntry = {
  scene: DialogueEntry["scene"];
  lines: AuthoringLine[];
};

function isDialogueLineBuilder(
  line: AuthoringLine,
): line is DialogueLineBuilder {
  return (
    typeof line === "object" &&
    line !== null &&
    "end" in line &&
    typeof line.end === "function"
  );
}

function normalizeLine(line: AuthoringLine): InteractionLine {
  if (isDialogueLineBuilder(line)) {
    return line.end();
  }

  return line;
}

export function defineDialogues<
  T extends Record<string, AuthoringDialogueEntry>,
>(dialogues: T): { [K in keyof T]: DialogueEntry } {
  return Object.fromEntries(
    Object.entries(dialogues).map(([key, entry]) => [
      key,
      {
        ...entry,
        lines: entry.lines.map(normalizeLine),
      },
    ]),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) as any;
}
