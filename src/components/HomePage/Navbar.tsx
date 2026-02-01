import { MAIN_LOGO } from "@/constants/images";
import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center px-6 md:px-8 py-4 gap-4 md:gap-0">
      <Link href="/">
        <Image
          className="w-64 md:w-[515px]"
          src={MAIN_LOGO}
          alt="Logo - Learning with Ghosts - Germania"
          width={515}
          height={68}
          priority
        />
      </Link>
      <nav className="flex flex-wrap justify-center gap-4 md:gap-6 font-semibold text-lg md:text-2xl">
        <a href="/home/what" className="hover:text-red-600">
          WHAT?
        </a>
        <a href="/home/who" className="hover:text-red-600">
          WHO?
        </a>
        <a href="/home/how-much" className="hover:text-red-600">
          HOW MUCH?
        </a>
        <button className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 text-sm md:text-base">
          LOGIN
        </button>
      </nav>
    </header>
  );
}
