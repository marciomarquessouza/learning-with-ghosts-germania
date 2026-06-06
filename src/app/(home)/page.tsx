import Image from "next/image";
import { HomeCTA } from "@/components/HomePage/HomeCTA";

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
        <HomeCTA />
      </div>
    </main>
  );
}
