import { ACTION_DIALOGUE_STRIPE } from "@/constants/images";
import Image from "next/image";

export interface PromptHeaderProps {
  title: string;
}

export function PromptHeader({ title }: PromptHeaderProps) {
  return (
    <div className="relative">
      <Image
        alt="action prompt title"
        src={ACTION_DIALOGUE_STRIPE}
        width={512}
        height={38}
        priority
      />
      <div className="absolute inset-0 flex items-center justify-center mt-2">
        <p className="text-center text-base text-white font-mono tracking-wide">
          {title}
        </p>
      </div>
    </div>
  );
}
