import { Footer } from "@/components/HomePage/Footer";
import { Navbar } from "@/components/HomePage/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen font-primary bg-[#FAF5E4] text-black flex flex-col">
      <Navbar />
      <section className="relative w-full flex-1 min-h-0 overflow-hidden bg-[#FF161A]">
        <Image
          src="/ui/home_page/hero-image.png"
          alt="Learning With Ghosts - Germania hero"
          fill
          priority
          className="object-contain object-center"
        />

        <div className="absolute inset-0 flex items-end justify-center m-20">
          <Link
            href="/game"
            className={[
              "rounded-xl border-2 border-black bg-[#F3B162]",
              "px-10 py-4 font-primary text-xl font-bold tracking-wide text-black",
              "transition-transform active:translate-y-[2px]",
              "focus:outline-none focus-visible:ring-4 focus-visible:ring-black/30",
            ].join(" ")}
          >
            LEARN/PLAY
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
