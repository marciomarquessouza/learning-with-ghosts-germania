import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  labelIcon?: ReactNode;
  iconPosition?: "start" | "end";
  variant?: "primary" | "secondary";
}

const variants = {
  primary: "bg-[#B40F00] hover:bg-[#941729] text-white",
  secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900",
};

export function Button({
  label,
  labelIcon,
  iconPosition = "end",
  variant = "primary",
  disabled = false,
  className,
  type = "button",
  onClick,
  ...props
}: ButtonProps) {
  const hasStartIcon = labelIcon && iconPosition === "start";
  const hasEndIcon = labelIcon && iconPosition === "end";

  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        "inline-flex h-11 w-40 shrink-0 items-center justify-center gap-2 px-5",
        "font-primary text-sm font-semibold uppercase tracking-wide",
        "shadow-md transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        disabled
          ? "cursor-not-allowed bg-gray-400 text-white opacity-50"
          : `${variants[variant]} cursor-pointer`,
        className,
      ].join(" ")}
    >
      {hasStartIcon && <span aria-hidden="true">{labelIcon}</span>}

      <span>{label}</span>

      {hasEndIcon && <span aria-hidden="true">{labelIcon}</span>}
    </button>
  );
}
