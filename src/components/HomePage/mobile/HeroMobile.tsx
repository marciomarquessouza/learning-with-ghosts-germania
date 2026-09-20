import Image from "next/image";

export function HeroMobile() {
  return (
    <div className="">
      <Image
        src="/ui/mobile/hero_mobile_red_bg.png"
        alt=""
        fill
        priority
        className="object-cover"
      />

      <Image
        src="/ui/mobile/hero_mobile_stain.png"
        alt=""
        fill
        priority
        className="object-cover animate-stain-pulse"
      />

      <Image
        src="/ui/mobile/hero_mobile_marlene.png"
        alt=""
        fill
        priority
        className="object-cover animate-marlene-glitch animate-marlene-blur"
      />

      <Image
        src="/ui/mobile/hero_mobile_title.png"
        alt=""
        fill
        className="object-cover"
      />

      <Image
        src="/ui/mobile/hero_mobile_title.png"
        alt=""
        fill
        className="object-cover animate-title-glitch-1"
      />

      <Image
        src="/ui/mobile/hero_mobile_title.png"
        alt=""
        fill
        className="object-cover animate-title-glitch-2"
      />
    </div>
  );
}
