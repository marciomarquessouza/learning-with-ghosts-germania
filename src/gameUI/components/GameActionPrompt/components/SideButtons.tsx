import {
  SquareIconButton,
  SquareIconsButtonVariants,
} from "@/components/IconButton/SquareIconButton";

interface SideButtonsProps {
  hide?: boolean;
  hideIcons?: Array<SquareIconsButtonVariants>;
  onAction?: () => void;
  onClosed: () => void;
}

export function SideButtons({
  hide,
  hideIcons = [],
  onClosed,
  onAction,
}: SideButtonsProps) {
  if (hide) return;

  return (
    <div className="flex flex-col gap-2">
      <SquareIconButton
        hide={hideIcons.includes("close")}
        variant="close"
        onClick={onClosed}
      />
      <SquareIconButton
        hide={hideIcons.includes("action")}
        variant="action"
        onClick={onAction}
      />
    </div>
  );
}
