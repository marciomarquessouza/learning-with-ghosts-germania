import { InlineLoading } from "@/components/InlineLoading";

interface LessonLoadingProps {
  isVisible?: boolean;
}

export function LessonLoading({ isVisible }: LessonLoadingProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute left-0 top-12 flex w-full items-center px-12 text-white outline-none">
      <div className="flex w-full flex-col items-center">
        <InlineLoading variant="secondary" />
      </div>
    </div>
  );
}
