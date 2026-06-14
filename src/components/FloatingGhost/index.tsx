import Image from "next/image";
import { motion } from "framer-motion";
import { GHOST_LOADER_BODY, GHOST_LOADER_FLOOR } from "@/constants/images";

export function FloatingGhost() {
  return (
    <div className=" w-80 flex flex-col items-center">
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
    </div>
  );
}
