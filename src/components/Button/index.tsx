interface ButtonProps {
  label: string;
  labelIcon?: string;
  iconPosition?: "start" | "end";
  color?: string;
  onClick: () => void;
}

export function Button({
  label,
  labelIcon,
  iconPosition = "end",
  color = "bg-[#B40F00] hover:bg-[#941729]",
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`shrink-0 h-[44px] px-5 ${color} text-white w-40 justify-center
                font-primary font-semibold tracking-wide uppercase
                flex items-center gap-2 shadow-md cursor-pointer`}
      type="button"
      onClick={onClick}
    >
      {labelIcon && iconPosition === "start" && (
        <span aria-hidden> {labelIcon}</span>
      )}
      {label}
      {"  "}
      {labelIcon && iconPosition === "end" && (
        <span aria-hidden> {labelIcon}</span>
      )}
    </button>
  );
}
