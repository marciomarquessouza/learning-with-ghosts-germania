import * as React from "react";

type Direction = "prev" | "next";
type Size = "sm" | "md" | "lg";

interface PaginationIconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  direction: Direction;
  size?: Size;
  label?: string;
}

const sizeMap: Record<Size, { btn: string; icon: number }> = {
  sm: { btn: "h-8 w-8", icon: 16 },
  md: { btn: "h-10 w-10", icon: 20 },
  lg: { btn: "h-12 w-12", icon: 24 },
};

export function PaginationIconButton({
  direction,
  size = "md",
  disabled,
  className = "",
  label,
  ...props
}: PaginationIconButtonProps) {
  const { btn, icon } = sizeMap[size];

  const aria =
    label ?? (direction === "prev" ? "Página anterior" : "Próxima página");

  return (
    <button
      type="button"
      aria-label={aria}
      aria-disabled={disabled}
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center rounded-full",
        "bg-black text-[#FFF3E4] shadow-2xl shadow-black/60",
        "transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C20013]",
        disabled
          ? "opacity-40 cursor-not-allowed"
          : "hover:bg-[#C20013] active:opacity-90",
        btn,
        className,
      ].join(" ")}
      {...props}
    >
      {direction === "prev" ? (
        <ChevronLeft width={icon} height={icon} />
      ) : (
        <ChevronRight width={icon} height={icon} />
      )}
    </button>
  );
}

function ChevronLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}
