"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MenuButton } from "./MenuButton";
import { useRouter } from "next/navigation";

type MenuOption = "new" | "continue";

export function HomeMenu() {
  const router = useRouter();
  const [selected, setSelected] = useState<MenuOption | null>(null);

  function select(option: MenuOption, action: () => void) {
    setSelected(option);
    setTimeout(() => {
      action();
    }, 200);
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
            onClick={() => {
              select("new", () => {
                router.push("/register");
              });
            }}
          >
            New Game
          </MenuButton>

          <MenuButton
            selected={selected === "continue"}
            onClick={() => {
              select("continue", () => {
                console.log("Continue");
              });
            }}
          >
            Continue
          </MenuButton>
        </div>
      </div>
    </div>
  );
}
