"use client";
import Image from "next/image";
import { motion } from "framer-motion";

interface MenuButtonProps {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

export function MenuButton({ children, selected, onClick }: MenuButtonProps) {
  return (
    <button
      type="button"
      className="relative h-10 w-60 overflow-hidden"
      onClick={onClick}
    >
      <motion.div
        className="absolute inset-y-0 left-0 overflow-hidden"
        initial={false}
        animate={{
          width: selected ? "100%" : "0%",
        }}
        transition={{
          duration: 0.22,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <Image
          src="/ui/mobile/btn_mobile_bg.png"
          alt=""
          width={240}
          height={40}
          className="h-full w-60 max-w-none"
        />
      </motion.div>

      <span
        className={["relative z-10 font-mono text-xl text-white"].join(" ")}
      >
        {children}
      </span>
    </button>
  );
}
