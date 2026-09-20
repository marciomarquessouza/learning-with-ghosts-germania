interface FooterNavigationProps {
  disabled?: boolean;
  onClickBack: () => void;
  onClickNext: () => void;
}

export function FooterNavigation({
  disabled,
  onClickBack,
  onClickNext,
}: FooterNavigationProps) {
  return (
    <footer
      className={["mt-12 flex items-center gap-6", "landscape-short:mt-6"].join(
        " ",
      )}
    >
      <button
        id="back"
        type="button"
        disabled={disabled}
        onClick={onClickBack}
        className={[
          "flex h-16 min-w-[64px] items-center justify-center gap-2",
          "rounded-md bg-[#FF1F26] px-8",
          "font-staatliches text-4xl text-white",
          "transition-colors hover:bg-[#E71920]",
        ].join(" ")}
      >
        ⏴
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={onClickNext}
        className={[
          "flex h-16 min-w-[164px] items-center justify-center gap-2",
          "rounded-md bg-[#FF1F26] px-8",
          "font-staatliches text-2xl text-white",
          "transition-colors hover:bg-[#E71920]",
        ].join(" ")}
      >
        NEXT
        <span className="text-4xl" aria-hidden="true">
          ▸
        </span>
      </button>

      <button
        type="button"
        disabled
        className={[
          "cursor-not-allowed font-mono text-sm",
          "text-[#8A8378] opacity-70",
        ].join(" ")}
      >
        ...I already have an account
      </button>
    </footer>
  );
}
