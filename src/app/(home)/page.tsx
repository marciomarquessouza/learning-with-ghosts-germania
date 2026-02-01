import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <section className="relative w-full flex-1 min-h-0 overflow-hidden bg-[#FF161A]">
      {/* Desktop/Tablet */}
      <Image
        src="/ui/home_page/hero-image.png"
        alt="Learning With Ghosts - Germania hero"
        fill
        priority
        className="hidden sm:block object-contain object-center"
      />

      {/* Mobile */}
      <Image
        src="/ui/home_page/hero-image_mobile.png"
        alt="Learning With Ghosts - Germania hero mobile"
        fill
        priority
        className="block sm:hidden object-cover object-center"
      />

      <div className="absolute inset-0 flex items-end justify-center p-6 sm:p-20">
        <Link
          href="/game"
          className={[
            "rounded-xl border-2 border-black bg-[#F3B162]",
            "px-10 py-4 font-primary text-xl font-bold tracking-wide text-black",
            "transition-transform active:translate-y-[2px] focus:outline-none",
            "focus-visible:ring-4 focus-visible:ring-black/30",
          ].join(" ")}
        >
          LEARN/PLAY
        </Link>
      </div>
    </section>
  );
}
