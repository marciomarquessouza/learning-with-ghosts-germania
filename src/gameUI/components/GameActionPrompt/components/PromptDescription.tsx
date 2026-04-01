import { AnimatePresence } from "framer-motion";

export interface PromptDescriptionProps {
  description: string;
  hide?: boolean;
}

export function PromptDescription({
  description,
  hide,
}: PromptDescriptionProps) {
  return (
    <AnimatePresence>
      {!hide && (
        <div className={"flex items-center justify-center mt-3 my-4"}>
          <p className="text-black text-lg font-primary tracking-wide">
            {description}
          </p>
        </div>
      )}
    </AnimatePresence>
  );
}
