import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main
      className="relative w-full flex-1 min-h-0 overflow-hidden bg-[#FF161A]"
      aria-label="Learning With Ghosts — Germania"
    >
      <h1 className="sr-only">Learning With Ghosts — Germania</h1>

      {/* Desktop/Tablet */}
      <Image
        src="/ui/home_page/hero-image.png"
        alt=""
        aria-hidden="true"
        fill
        priority
        className="hidden sm:block object-contain object-center"
      />

      {/* Mobile */}
      <Image
        src="/ui/home_page/hero-image_mobile.png"
        alt=""
        aria-hidden="true"
        fill
        priority
        className="block sm:hidden object-cover object-center"
      />

      <div
        className="absolute inset-0 flex items-end justify-center p-6 sm:p-20"
        role="navigation"
        aria-label="Primary action"
      >
        <Link
          href="/game"
          aria-label="Start Learning With Ghosts — Germania"
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
    </main>
  );
}
