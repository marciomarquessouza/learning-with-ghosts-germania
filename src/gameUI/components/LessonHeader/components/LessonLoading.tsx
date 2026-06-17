import { InlineLoading } from "@/components/InlineLoading";

interface LessonLoadingProps {
  isVisible?: boolean;
  text?: string;
}

export function LessonLoading({
  isVisible,
  text = "Loooaaading....",
}: LessonLoadingProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute left-0 top-12 flex w-full items-center px-12 text-white outline-none">
      <div className="flex w-full flex-col items-center">
        <InlineLoading text={text} variant="secondary" />
      </div>
    </div>
  );
}
