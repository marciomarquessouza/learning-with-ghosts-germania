import { ACTORS, MOODS } from "@/constants/game";
import { createDialogue } from "./dialogueExpressions";
import { createAlternatives } from "./alternativeExpression";

export const dialogue = createDialogue(
  Object.values(ACTORS),
  Object.values(MOODS),
);

export const alternatives = createAlternatives(
  Object.values(ACTORS),
  Object.values(MOODS),
);
