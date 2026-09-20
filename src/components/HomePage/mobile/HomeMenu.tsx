"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MenuButton } from "./MenuButton";

interface HomeMenuProps {
  hideContinue: boolean;
  onNewGame: () => void;
  onContinueGame: () => void;
}

type MenuOption = "new" | "continue";

export function HomeMenu({
  hideContinue,
  onNewGame,
  onContinueGame,
}: HomeMenuProps) {
  const [selected, setSelected] = useState<MenuOption | null>(null);

  function select(option: MenuOption) {
    setSelected(option);
    if (option == "new") {
      onNewGame();
      return;
    }
    onContinueGame();
  }

  useEffect(() => {
    setTimeout(() => {
      setSelected("new");
    }, 200);
  }, []);

  return (
    <div className="absolute right-10 top-30">
      <div className="flex flex-col items-center justify-center gap-8">
        <Image
          src="/ui/mobile/logo-mobile.svg"
          width={230}
          height={85}
          alt="game logo"
          className="w-40"
        />
        <div className="flex flex-col">
          <MenuButton
            selected={selected === "new"}
            onClick={() => select("new")}
          >
            New Game
          </MenuButton>

          {!hideContinue && (
            <MenuButton
              selected={selected === "continue"}
              onClick={() => select("continue")}
            >
              Continue
            </MenuButton>
          )}
        </div>
      </div>
    </div>
  );
}
