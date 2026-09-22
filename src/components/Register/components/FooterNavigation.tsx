"use client";
import { useRegisterFlow } from "../hooks/usePageNavigation";

interface FooterNavigationProps {
  disabled?: boolean;
  onNavigate: (nextPath: string) => void;
}

export function FooterNavigation({
  disabled,
  onNavigate,
}: FooterNavigationProps) {
  const { isLast, getNextPath, getPreviousPath } = useRegisterFlow();

  return (
    <footer
      className={[
        "mt-12 flex items-center justify-center gap-6",
        "landscape-short:mt-6",
      ].join(" ")}
    >
      <button
        id="back"
        type="button"
        disabled={disabled}
        onClick={() => onNavigate(getPreviousPath())}
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
        onClick={() => onNavigate(getNextPath())}
        className={[
          "flex h-16 min-w-[164px] items-center justify-center gap-2",
          "rounded-md bg-[#FF1F26] px-8",
          "font-staatliches text-2xl text-white",
          "transition-colors hover:bg-[#E71920]",
        ].join(" ")}
      >
        {isLast ? "START" : "NEXT"}
        {!isLast && (
          <span className="text-4xl" aria-hidden="true">
            ▸
          </span>
        )}
      </button>
    </footer>
  );
}
