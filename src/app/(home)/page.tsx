import Image from "next/image";
import { HomeCTA } from "@/components/HomePage/HomeCTA";
import { HomeMobile } from "@/components/HomePage/HomeMobile";

export default function Home() {
  return (
    <>
      {/* app mobile - landscape */}
      <main
        className={[
          "hidden landscape-short:block landscape-short:h-screen landscape-short:w-screen",
        ].join(" ")}
      >
        <HomeMobile />
      </main>

      {/* web */}
      <main
        className={[
          "relative w-full flex-1 min-h-0 overflow-hidden bg-[#FF161A]",
          "landscape-short:hidden",
        ].join(" ")}
        aria-label="Learning With Ghosts"
      >
        <h1 className="sr-only">Learning With Ghosts</h1>

        {/* Desktop/Tablet */}
        <Image
          src="/ui/home_page/hero-image.png"
          alt=""
          aria-hidden="true"
          fill
          priority
          className="hidden sm:block object-cover object-center"
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
          className="absolute inset-0 flex items-end justify-center p-6 mb-20 sm:p-20"
          role="navigation"
          aria-label="Primary action"
        >
          <HomeCTA />
        </div>
      </main>
    </>
  );
}
