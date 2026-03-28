import { SquareIconButton } from "@/components/IconButton/SquareIconButton";

interface GameActionPromptButtonsProps {
  onAction: () => void;
  onClose: () => void;
}

export function GameActionPromptButtons({
  onClose,
  onAction,
}: GameActionPromptButtonsProps) {
  return (
    <div className="flex flex-col gap-2">
      <SquareIconButton variant="close" onClick={onClose} />
      <SquareIconButton variant="action" onClick={onAction} />
    </div>
  );
}
