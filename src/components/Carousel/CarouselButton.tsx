interface CarouselButtonProps {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}

export function CarouselButton({
  direction,
  disabled,
  onClick,
}: CarouselButtonProps) {
  const isPrev = direction === "prev";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrev ? "Back" : "Next"}
      className={[
        "absolute top-1/2 -translate-y-1/2 z-10 lg:hidden",
        "flex h-9 w-9 items-center justify-center rounded-full",
        "bg-white/90 shadow ring-1 ring-black/5 backdrop-blur",
        "transition disabled:opacity-0 disabled:pointer-events-none",
        isPrev ? "-left-2" : "-right-2",
      ].join(" ")}
    >
      <span className=" text-black text-4xl" aria-hidden>
        {isPrev ? "‹" : "›"}
      </span>
    </button>
  );
}
