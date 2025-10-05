interface ButtonProps {
  label: string;
  labelIcon?: string;
  onClick: () => void;
}

export function ButtonTransparent({ label, labelIcon, onClick }: ButtonProps) {
  return (
    <button
      className={`shrink-0 h-[44px] px-5 "bg-transparent hove:bg-transparent" w-40 justify-center
				text-white hover:text-[#FFF1E1] hover:scale-[1.04]
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
