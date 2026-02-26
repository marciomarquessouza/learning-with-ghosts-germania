import { CHARACTERS, MOODS } from "@/constants/game";
import { createDialogue } from "./dialogueExpressions";
import { createAlternatives } from "./alternativeExpression";

export const dialogue = createDialogue(
  Object.values(CHARACTERS),
  Object.values(MOODS)
);

export const alternatives = createAlternatives(
  Object.values(CHARACTERS),
  Object.values(MOODS)
);
