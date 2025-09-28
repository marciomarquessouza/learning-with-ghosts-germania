import { Alternative } from "@/events/gameEvents";

export interface SelectNextAlternativeProps {
  alternatives: Alternative[];
  selectedAlternative: string | null;
  selectPrevious?: boolean;
  setAlternative: (id: string) => void;
}

export function handleAlternativeKeyDown({
  alternatives,
  selectedAlternative,
  selectPrevious = false,
  setAlternative,
}: SelectNextAlternativeProps) {
  if (alternatives.length === 0) return;

  if (!selectedAlternative) {
    setAlternative(alternatives[0].id);
    return;
  }

  const signal = selectPrevious ? -1 : 1;

  const currentIndex = alternatives.findIndex(
    ({ id }) => id === selectedAlternative
  );

  if (currentIndex === -1) {
    setAlternative(alternatives[0].id);
    return;
  }

  const alternativeLength = alternatives.length;
  const nextIndex =
    (currentIndex + signal + alternativeLength) % alternativeLength;

  setAlternative(alternatives[nextIndex].id);
}
