"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { GHOST_LOADER_BODY, GHOST_LOADER_FLOOR } from "@/constants/images";

export function GhostLoading() {
  return (
    <div className="h-screen m-0 bg-black text-white flex flex-col justify-center items-center">
      <motion.div
        animate={{
          y: [-5, -40, -5],
        }}
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
        <p className="font-primary font-medium text-2xl text-white">
          Looooading....
        </p>
      </div>
    </div>
  );
}
