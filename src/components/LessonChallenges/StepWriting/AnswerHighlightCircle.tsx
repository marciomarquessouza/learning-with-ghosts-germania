import { useEffect, useState } from "react";

interface AnswerHighlightCircleProps {
  color: string;
}

export function AnswerHighlightCircle({ color }: AnswerHighlightCircleProps) {
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
        "transition-transform duration-150 ease-out",
        isVisible ? "scale-100" : "scale-0",
        "z-20",
      ].join(" ")}
      style={{ backgroundColor: color }}
    />
  );
}
