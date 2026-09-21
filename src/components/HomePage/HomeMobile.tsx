"use client";
import { useState } from "react";
import { PageTransition } from "../PageTransition";
import { HeroMobile } from "./mobile/HeroMobile";
import { HomeMenu } from "./mobile/HomeMenu";
import { useGameProgressStore } from "@/store/progressStore";
import { useRouter } from "next/navigation";

export function HomeMobile() {
  const router = useRouter();
  const [transitioning, setTransitioning] = useState(false);
  const { snapshot, clearSnapshot } = useGameProgressStore();
  const hasSavedProgress = Boolean(snapshot && snapshot.day && snapshot.scene);

  const handleOnNewGame = () => {
    clearSnapshot();
    setTransitioning(true);
  };

  const handleOnContinueGame = () => {
    setTransitioning(true);
  };

  const onPageTransition = () => {
    const nextPage =
      hasSavedProgress || !snapshot
        ? "/register"
        : `/game/A1-1/${snapshot.day}?scene=${snapshot.scene}`;
    router.push(nextPage);
  };

  return (
    <div id="home-mobile">
      <PageTransition active={transitioning} onComplete={onPageTransition} />
      <div
        id="app-mobile"
        className="relative h-screen w-full overflow-hidden bg-[#ff171b]"
      >
        <HeroMobile />
        <HomeMenu
          hideContinue={!hasSavedProgress}
          onNewGame={handleOnNewGame}
          onContinueGame={handleOnContinueGame}
        />
      </div>
    </div>
  );
}
