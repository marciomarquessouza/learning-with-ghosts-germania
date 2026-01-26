import Image from "next/image";
import { useEffect, useState } from "react";

interface CornerRightProps {
  totalErrors: number;
  currentErrors: number;
}

export const CornerRight = ({
  totalErrors,
  currentErrors,
}: CornerRightProps) => {
  const [showIcon, setShowIcon] = useState(false);

  useEffect(() => {
    if (currentErrors === 0) return;

    setShowIcon(true);

    const timeoutId = setTimeout(() => {
      setShowIcon(false);
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [currentErrors]);

  return (
    <div className="absolute -top-4 -right-4">
      <div className="absolute right-0 m-2 text-right z-20">
        {showIcon ? (
          <div className="animate-pulse fade-out-500">
            <Image
              src="/ui/lesson/rune_skull.png"
              width={38}
              height={46}
              alt="Error"
              priority
            />
          </div>
        ) : (
          <>
            <p className="font-primary text-sm">ERRORS</p>
            <p className="font-mono text-xl font-bold">
              {currentErrors}/{totalErrors}
            </p>
          </>
        )}
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="122"
        height="105"
        fill="none"
        viewBox="0 0 122 105"
        className="drop-shadow-lg z-10"
      >
        <path fill="#B40F00" d="M121.244 105 .001 0h121.243z" />
      </svg>
    </div>
  );
};
