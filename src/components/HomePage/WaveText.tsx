import { motion } from "framer-motion";

interface WaveTextProps {
  text: string;
}

export function WaveText({ text }: WaveTextProps) {
  const letters = text.split("");

  return (
    <div className="inline-block">
      {letters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ y: 10 }}
          animate={{ y: 0 }}
          transition={{
            delay: index * 0.03,
            duration: 0.8,
            ease: "easeOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
}
