import {
  getScoreFeedback,
  SCORE_THRESHOLDS,
} from "@/libs/audio/utils/getScoreFeedback";

export function ScoreFeedback({ score }: { score: number }) {
  const feedback = getScoreFeedback(score);

  const getIcon = () => {
    switch (feedback.status) {
      case "excellent":
        return "🎯";
      case "good":
        return "✅";
      case "pass":
        return "⚠️";
      case "fail":
        return "❌";
    }
  };

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
        <span className="text-2xl">{getIcon()}</span>
        <div>
          <div className={`text-lg font-bold ${feedback.color}`}>
            {feedback.message}
          </div>
          <div className="text-sm text-gray-300 mt-1">
            {score >= SCORE_THRESHOLDS.PASS
              ? "🎉 Ótimo trabalho! Continue praticando!"
              : "💡 Dica: Preste atenção na entonação e nos sons individuais."}
          </div>
        </div>
      </div>
    </div>
  );
}
