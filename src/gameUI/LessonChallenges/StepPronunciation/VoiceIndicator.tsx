export function VoiceIndicator({
  level,
  isRecording,
}: {
  level: number;
  isRecording: boolean;
}) {
  const amplifiedLevel = Math.pow(level, 0.3);
  const percentage = Math.min(100, amplifiedLevel * 300);

  let color = "bg-red-500";
  if (percentage > 30) color = "bg-yellow-500";
  if (percentage > 60) color = "bg-green-500";

  return (
    <div className="mt-1 w-full">
      <div className="flex items-center justify-between text-xs text-[#bdbdbd] mb-2">
        <span>Nível de voz</span>
        <span className="font-mono">{percentage.toFixed(0)}%</span>
      </div>
      <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-100 ease-out ${
            isRecording ? "animate-pulse" : ""
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-[#888] mt-1">
        <span>Silêncio</span>
        <span>Baixo</span>
        <span>Médio</span>
        <span>Alto</span>
      </div>
    </div>
  );
}
