import { PropsWithChildren, useEffect, useMemo, useRef } from "react";
import { getDialogueDimension } from "@/components/Dialogues/helpers/getDialgueDimension";
import { useDeviceType } from "@/hooks/useDeviceType";
import { motion, AnimatePresence } from "framer-motion";

export interface DialogContainerProps extends PropsWithChildren {
  show?: boolean;
  onClickOnText?: () => void;
  onKeyDown?: () => void;
  onAnimationComplete: () => void;
}

export function DialogContainer({
  children,
  show = true,
  onAnimationComplete,
  onClickOnText,
  onKeyDown,
}: DialogContainerProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const device = useDeviceType();
  const { heightClass, widthClass } = useMemo(
    () => getDialogueDimension(device),
    [device]
  );

  useEffect(() => {
    if (show) {
      requestAnimationFrame(() => boxRef.current?.focus());
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          ref={boxRef}
          tabIndex={0}
          className={`fixed left-1/2 -translate-x-1/2 ${heightClass} ${widthClass}
							  bg-[url('/dialogue/dialogue_background.png')] bg-cover bg-center
							  shadow-xl outline-none`}
          initial={{ opacity: 0, bottom: -40 }}
          animate={{ opacity: 1, bottom: 46 }}
          exit={{ opacity: 0, bottom: -40 }}
          onAnimationComplete={onAnimationComplete}
          transition={{ duration: 0.5, ease: "linear" }}
          onClick={onClickOnText}
          onKeyDown={onKeyDown}
          role="dialog"
          aria-live="polite"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
