"use client";

import { useEffect, useState } from "react";

export function RotateOverlay() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      setShow(!isLandscape);
    };

    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);
    checkOrientation();

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white text-center p-6">
      <div className="text-6xl animate-pulse mb-6">🔄</div>
      <p className="text-xl">
        Please rotate your device to <br />
        <strong className="text-red-400">landscape mode</strong>.
      </p>
    </div>
  );
}
