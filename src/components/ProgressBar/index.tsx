import { motion } from "framer-motion";

interface ProgressBarProps {
  variant?: "primary" | "secondary";
}

export function ProgressBar({ variant = "primary" }: ProgressBarProps) {
  const barColor = variant === "primary" ? "bg-red-600" : "bg-[#FCA30E]";
  return (
    <div className="w-64 h-2 bg-white/30 relative overflow-hidden rounded">
      <motion.div
        className={["h-full", `${barColor}`].join(" ")}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "left" }}
      />
    </div>
  );
}
