import { SquareIconButton } from "@/components/IconButton/SquareIconButton";

interface SideButtonsProps {
  hide?: boolean;
  onAction: () => void;
  onClosed: () => void;
}

export function SideButtons({ hide, onClosed, onAction }: SideButtonsProps) {
  if (hide) return;

  return (
    <div className="flex flex-col gap-2">
      <SquareIconButton variant="close" onClick={onClosed} />
      <SquareIconButton variant="action" onClick={onAction} />
    </div>
  );
}
