import { SquareIconButton } from "@/components/IconButton/SquareIconButton";

interface SideButtonsProps {
  hide?: boolean;
  onAction: () => void;
  onClose: () => void;
}

export function SideButtons({ hide, onClose, onAction }: SideButtonsProps) {
  if (hide) return;

  return (
    <div className="flex flex-col gap-2">
      <SquareIconButton variant="close" onClick={onClose} />
      <SquareIconButton variant="action" onClick={onAction} />
    </div>
  );
}
