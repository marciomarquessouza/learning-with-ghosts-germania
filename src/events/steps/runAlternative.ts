export interface RunAlternative {
  id: string;
  do: () => void;
}

export function runAlternative(alternatives: RunAlternative[]) {
  return (id?: string) => {
    const alternativeToRun = alternatives.find(
      (alternative) => alternative.id === id
    );
    if (alternativeToRun) {
      alternativeToRun.do();
    }
  };
}
