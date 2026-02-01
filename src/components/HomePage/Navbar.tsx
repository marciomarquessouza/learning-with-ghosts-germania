import { MAIN_LOGO } from "@/constants/images";
import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <header
      className="flex flex-col md:flex-row justify-between items-center px-6 md:px-8 py-4 gap-4 md:gap-0"
      role="banner"
    >
      <Link href="/" aria-label="Go to homepage">
        <Image
          className="w-64 md:w-[515px]"
          src={MAIN_LOGO}
          alt="Learning With Ghosts — Germania"
          width={515}
          height={68}
          priority
        />
      </Link>

      <nav
        className="flex flex-wrap justify-center gap-4 md:gap-6 font-semibold text-lg md:text-2xl"
        aria-label="Main navigation"
      >
        <Link href="/what" className="hover:text-red-600">
          WHAT?
        </Link>

        <Link href="/who" className="hover:text-red-600">
          WHO?
        </Link>

        <Link href="/how-much" className="hover:text-red-600">
          HOW MUCH?
        </Link>

        <button
          type="button"
          aria-label="Login"
          className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 text-sm md:text-base focus:outline-none focus-visible:ring-4 focus-visible:ring-black/30"
        >
          LOGIN
        </button>
      </nav>
    </header>
  );
}
