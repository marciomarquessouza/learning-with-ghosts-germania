import { getScoreFeedback } from "@/libs/audio/utils/renderScore/getScoreFeedback";

export function ScoreFeedback({ score }: { score: number }) {
  const feedback = getScoreFeedback(score);

  const getBgColor = () => {
    switch (feedback.status) {
      case "excellent":
        return "bg-gradient-to-r from-green-500/20 to-emerald-500/20";
      case "good":
        return "bg-gradient-to-r from-green-400/20 to-cyan-500/20";
      case "pass":
        return "bg-gradient-to-r from-yellow-500/20 to-amber-500/20";
      case "fail":
        return "bg-gradient-to-r from-red-500/20 to-pink-500/20";
    }
  };

  return (
    <div
      className={`mt-4 p-4 rounded-xl border ${feedback.color.replace(
        "text",
        "border"
      )} ${getBgColor()}`}
    >
      <div className="flex items-center gap-3">
        <div>
          <div className={`text-lg font-bold ${feedback.color}`}>
            {feedback.message}
          </div>
        </div>
      </div>
    </div>
  );
}
