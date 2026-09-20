import { HeroMobile } from "./mobile/HeroMobile";
import { HomeMenu } from "./mobile/HomeMenu";

export function HomeMobile() {
  return (
    <div
      id="app-mobile"
      className="relative h-screen w-full overflow-hidden bg-[#ff171b]"
    >
      <HeroMobile />
      <HomeMenu />
    </div>
  );
}
