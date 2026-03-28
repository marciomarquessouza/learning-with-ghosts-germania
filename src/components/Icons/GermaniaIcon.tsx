import Image from "next/image";
import { ACTION_DIALOGUE_ICON } from "@/constants/images";

export function GermaniaIcon() {
  return (
    <Image
      alt="action prompt icon"
      src={ACTION_DIALOGUE_ICON}
      width={30}
      height={30}
      priority
    />
  );
}
