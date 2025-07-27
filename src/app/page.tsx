import { HERO_IMAGE, MAIN_LOGO } from "@/constants/images";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen font-primary bg-[#FAF5E4] text-black flex flex-col">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center px-6 md:px-8 py-4 gap-4 md:gap-0">
        <Image
          className="w-64 md:w-[515px]"
          src={MAIN_LOGO}
          alt="Logo - Learning with Ghosts - Germania"
          width={515}
          height={68}
          priority
        />
        <nav className="flex flex-wrap justify-center gap-4 md:gap-6 font-semibold text-lg md:text-2xl">
          <a href="#" className="hover:text-red-600">
            WHAT?
          </a>
          <a href="#" className="hover:text-red-600">
            WHO?
          </a>
          <a href="#" className="hover:text-red-600">
            HOW MUCH?
          </a>
          <button className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 text-sm md:text-base">
            LOGIN
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="bg-red-600 text-white flex flex-col md:flex-row flex-1 px-6 md:px-12 pt-2 pb-2  md:py-0">
        <div className="w-full md:w-1/2 flex justify-center items-end">
          <Image
            className="w-full max-w-xs sm:max-w-md md:max-w-lg self-end"
            src={HERO_IMAGE}
            alt="Frau Marlene Weiss"
            width={806}
            height={970}
          />
        </div>
        <div className="flex item-start">
          <div className="w-full md:w-1/2 text-center md:text-center items-center flex flex-col justify-center">
            <h2 className="hidden md:block text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight mb-4">
              Learn.
              <br />
              Obey.
              <br />
              <span className="font-secondary uppercase text-black tracking-wider">
                SURVIVE!
              </span>
            </h2>
            <p className="md:w-xl mb-6 text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto md:mx-0">
              <strong>Learning With Ghosts: GERMANIA</strong> is a short,
              story-driven game that teaches you real German through tension,
              choices, and consequence.
            </p>
            <Link
              href="/game"
              className="bg-black font-secondary text-white px-6 py-3 rounded-full text-base sm:text-lg font-bold hover:bg-white hover:text-black transition cursor-pointer"
            >
              LEARN/PLAY
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-black text-center py-4 text-sm sm:text-base">
        <p className="text-white">
          <span className="font-bold">Created by:</span> Marcio Marques de Souza
        </p>
      </footer>
    </div>
  );
}
