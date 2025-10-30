export const popClass = (on: boolean) =>
  [
    "transition-all duration-200 ease-out will-change-transform",
    on
      ? "opacity-100 scale-100 translate-y-0"
      : "opacity-0 scale-95 translate-y-1",
  ].join(" ");
