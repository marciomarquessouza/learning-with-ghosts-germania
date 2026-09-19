import { MAIN_LOGO_INVERTED } from "@/constants/images";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header
      className="flex flex-col md:flex-row justify-between items-center px-6 md:px-8 py-4 gap-4 md:gap-0"
      role="header"
    >
      <Link href="/" aria-label="Go to homepage">
        <Image
          className="w-48"
          alt="Log - Learning with Ghosts"
          src={MAIN_LOGO_INVERTED}
          width={515}
          height={68}
        />
      </Link>
    </header>
  );
}
