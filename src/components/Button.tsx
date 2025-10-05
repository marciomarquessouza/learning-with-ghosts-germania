interface ButtonProps {
  label: string;
  labelIcon?: string;
  variant?: "primary" | "transparent";
  onClick: () => void;
}

export function Button({
  label,
  labelIcon,
  variant = "primary",
  onClick,
}: ButtonProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case "transparent":
        return "bg-transparent hove:bg-transparent";
      case "primary":
      default:
        return "bg-red-700 hover:bg-red-800";
    }
  };

  return (
    <button
      className={`shrink-0 h-[44px] px-5 ${getVariantStyle()} text-white w-40 justify-center
                font-primary font-semibold tracking-wide uppercase
                flex items-center gap-2 shadow-md cursor-pointer`}
      type="button"
      onClick={onClick}
    >
      {label}
      {"  "}
      {labelIcon ?? <span aria-hidden> {labelIcon}</span>}
    </button>
  );
}
