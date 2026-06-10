
interface PronunciationScoreProps {
  isVisible: boolean;
  target: string;
}

export function PronunciationScore({
  isVisible,
  target,
}: PronunciationScoreProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      id="pronunciation-score"
      className="pointer-events-none absolute left-0 top-12 flex w-full items-center px-12 text-white outline-none"
    >
      
    </div>
  );
}
