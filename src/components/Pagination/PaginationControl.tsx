import { PaginationIconButton } from "./PaginationIconButton";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}: PaginationControlsProps) {
  return (
    <div className="flex items-center gap-3 ml-8 mt-2">
      <PaginationIconButton
        direction="prev"
        onClick={onPrev}
        disabled={currentPage <= 1}
        size="sm"
      />
      <span className="font-mono text-sm text-black">
        {currentPage} / {totalPages}
      </span>
      <PaginationIconButton
        direction="next"
        onClick={onNext}
        disabled={currentPage >= totalPages}
        size="sm"
      />
    </div>
  );
}
