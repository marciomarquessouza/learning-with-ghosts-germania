"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { GHOST_LOADER_BODY, GHOST_LOADER_FLOOR } from "@/constants/images";
import { WaveText } from "./WaveText";

export function GhostLoading() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  const MIN_WIDTH = 300;
  const MIN_HEIGHT = 300;

  useEffect(() => {
    if (!ref.current) return;

    const obs = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;

      if (width < MIN_WIDTH || height < MIN_HEIGHT) {
        setVisible(false);
      }
    });

    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={ref}
      className="absolute inset-0 bg-black text-white flex flex-col justify-center items-center z-[9999]"
    >
      <motion.div
        animate={{ y: [-5, -40, -5] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        <Image
          src={GHOST_LOADER_BODY}
          alt="Floating Ghost"
          width={99}
          height={117}
        />
      </motion.div>

      <Image
        src={GHOST_LOADER_FLOOR}
        alt="Ghost Loader Floor"
        width={63}
        height={12}
        className="mt-1"
      />

      <div className="mt-4">
        <div className="w-64 h-2 bg-white/30 relative overflow-hidden rounded">
          <motion.div
            className="h-full bg-red-600"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "left" }}
          />
        </div>
      </div>

      <div className="my-4">
        <div className="font-primary font-medium text-2xl text-white">
          <WaveText text="Loooaaading...." />
        </div>
      </div>
    </div>
  );
}
