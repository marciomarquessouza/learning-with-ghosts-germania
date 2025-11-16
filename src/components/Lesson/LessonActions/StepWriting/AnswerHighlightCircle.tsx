import { useEffect, useState } from "react";

export function AnswerHighlightCircle() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={[
        "absolute",
        "h-16 w-16",
        "rounded-full",
        "bg-[#FFB300]",
        "transition-transform duration-150 ease-out",
        isVisible ? "scale-100" : "scale-0",
        "z-20",
      ].join(" ")}
    />
  );
}
