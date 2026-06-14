import { ProgressBar } from "../ProgressBar";
import { WaveText } from "../WaveText";

interface InlineLoadingProps {
  text?: string;
  variant?: "primary" | "secondary";
}

export function InlineLoading({
  text = "Loooaaading....",
  variant = "primary",
}: InlineLoadingProps) {
  return (
    <div className="flex flex-col justify-center items-center w-64">
      <div className="font-primary font-medium text-2xl">
        <WaveText text={text} />
      </div>
      <div className="mt-2">
        <ProgressBar variant={variant} />
      </div>
    </div>
  );
}
