import { PronunciationResultEvent } from "@/events/lesson/types";

interface PronunciationScoreProps {
  isVisible: boolean;
  pronunciationResult?: PronunciationResultEvent;
}

export function PronunciationScore({
  isVisible,
  pronunciationResult,
}: PronunciationScoreProps) {
  if (!isVisible || !pronunciationResult) {
    return null;
  }

  const { feedback, score } = pronunciationResult;

  return (
    <div
      id="pronunciation-score"
      className="pointer-events-none absolute left-0 top-12 flex w-full items-center px-12 text-white outline-none"
    >
      <p>{feedback.label}</p>
      <p>
        {score.characters.map((item) => (
          <span key={item.id}>{item.character}</span>
        ))}
      </p>
    </div>
  );
}
