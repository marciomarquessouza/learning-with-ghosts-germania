import { CloseIcon } from "../Icons/CloseIcon";
import { SuccessIcon } from "../Icons/SuccessIcon";
import { IconProps } from "../Icons/types";

export type SquareIconsButtonVariants = "action" | "close";

export interface SquareIconButtonProps {
  variant: SquareIconsButtonVariants;
  hide?: boolean;
  onClick?: () => void;
}

const VARIANT_CONFIG: Record<
  SquareIconsButtonVariants,
  { color: string; Icon: React.ComponentType<IconProps> }
> = {
  action: {
    color: "#009E93",
    Icon: SuccessIcon,
  },
  close: {
    color: "#B40F00",
    Icon: CloseIcon,
  },
};

export function SquareIconButton({
  variant,
  hide,
  onClick,
}: SquareIconButtonProps) {
  const { color, Icon } = VARIANT_CONFIG[variant];

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    onClick?.();
  };

  if (hide) return;

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{ backgroundColor: color }}
      className={[
        "cursor-pointer",
        "flex h-10 w-10 items-center justify-center",
        "hover:scale-[1.04] hover:shadow-md active:scale-[0.96] transition-transform",
      ].join(" ")}
    >
      <Icon />
    </button>
  );
}
