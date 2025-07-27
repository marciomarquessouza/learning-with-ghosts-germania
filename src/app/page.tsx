import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { HERO_IMAGE } from "@/constants/images";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen font-primary bg-[#FAF5E4] text-black flex flex-col ">
      <Navbar />

      {/* Hero Section */}
      <main className="bg-red-600 text-white flex flex-wrap flex-1">
        <div className="flex items-center w-full lg:w-1/2 container">
          <div className="max-w-2xl mb-8 container p-8 mx-auto xl:px-0 text-center md:text-left">
            <h1 className="font-extrabold leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center md:text-left">
              Learn/Obey/
              <span className="font-secondary uppercase text-black tracking-wider">
                SURVIVE!
              </span>
            </h1>
            <p className="py-5 text-xl leading-normal text-white lg:text-xl xl:text-2xl ">
              <strong>Learning With Ghosts: GERMANIA</strong> is a story-driven
              game that teaches you real German through tension, choices, and
              consequence.
            </p>

            <div className="flex flex-col items-center md:items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row">
              <Link
                href="/game"
                className="px-8 py-4 text-lg font-medium text-center text-white bg-black rounded-md"
              >
                LEARN/PLAY
              </Link>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-full lg:w-1/2">
          <div className="">
            <Image
              src={HERO_IMAGE}
              width="474"
              height="590"
              className={"object-cover"}
              alt="Hero Illustration"
              loading="eager"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
