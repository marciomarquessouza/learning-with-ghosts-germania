import { AnimatePresence } from "framer-motion";

export interface GameActionPromptDescriptionProps {
  description: string;
  show?: boolean;
}

export function GameActionPromptDescription({
  description,
  show,
}: GameActionPromptDescriptionProps) {
  return (
    <AnimatePresence>
      {show && (
        <div className={"flex items-center justify-center mt-3 my-4"}>
          <p className="text-black text-lg font-primary tracking-wide">
            {description}
          </p>
        </div>
      )}
    </AnimatePresence>
  );
}
