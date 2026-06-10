import { getPronunciationScoreFeedback } from "@/libs/lesson/getPronunciationScoreFeedback";

interface PronunciationScoreProps {
  isVisible: boolean;
  target: string;
}

export function PronunciationScore({
  isVisible,
  target,
}: PronunciationScoreProps) {
  const { headline, label, textColor, barColor } =
    getPronunciationScoreFeedback(100);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      id="pronunciation-score"
      className="pointer-events-none absolute left-0 top-12 flex w-full items-center px-12 text-white outline-none"
    >
      <div className="w-full min-h-14 flex justify-center items-center">
        <p
          className={`text-center font-mono text-base sm:text-lg leading-snug whitespace-pre-line mt-2 ${textColor}`}
        >
          {headline}
        </p>
      </div>

      <div className="relative ml-8 my-1 w-[520px] grid grid-cols-2 shadow-2xl shadow-black">
        {/* LEFT – target */}
        <div className="flex items-center justify-end bg-black pr-8 min-h-10 py-1">
          <p className="font-primary text-[#FFF3E4] text-right leading-none text-xl">
            {target}
          </p>
        </div>

        {/* RIGHT – feedback */}
        <div className="relative flex items-center justify-center bg-black min-h-10 py-1 px-8 overflow-hidden">
          <div
            className={`absolute left-0 top-0 bottom-0 ${barColor} transition-[width] duration-500 ease-out`}
            style={{ width: 100 }}
          />
          <p className="relative z-10 font-primary text-[#FFF3E4] leading-none text-xs tracking-[0.18em] uppercase">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}
