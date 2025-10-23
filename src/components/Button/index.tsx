interface ButtonProps {
  label: string;
  labelIcon?: string;
  color?: string;
  onClick: () => void;
}

export function Button({
  label,
  labelIcon,
  color = "bg-red-700 hover:bg-red-800",
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
      {label}
      {"  "}
      {labelIcon ?? <span aria-hidden> {labelIcon}</span>}
    </button>
  );
}
