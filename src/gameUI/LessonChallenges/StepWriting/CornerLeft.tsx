import Image from "next/image";
import { useEffect, useState } from "react";

interface CornerLeftProps {
  totalTips: number;
  currentTips: number;
}

export const CornerLeft = ({ totalTips, currentTips }: CornerLeftProps) => {
  const [showIcon, setShowIcon] = useState(false);

  useEffect(() => {
    if (currentTips === 0) return;

    setShowIcon(true);

    const timeoutId = setTimeout(() => {
      setShowIcon(false);
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [currentTips]);

  return (
    <div className="absolute -top-4 -left-4">
      <div className="absolute m-2">
        {showIcon ? (
          <div className="animate-pulse fade-out-500">
            <Image
              src="/ui/lesson/rune_eye_tip.png"
              width={48}
              height={48}
              alt="Tip Icon"
              priority
            />
          </div>
        ) : (
          <>
            <p className="font-primary text-sm">TIPS</p>
            <p className="font-mono text-xl font-bold">{`${currentTips}/${totalTips}`}</p>
          </>
        )}
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="122"
        height="105"
        fill="none"
        viewBox="0 0 122 105"
      >
        <path fill="#B40F00" d="M0 105 121.245 0H0z"></path>
      </svg>
    </div>
  );
};
