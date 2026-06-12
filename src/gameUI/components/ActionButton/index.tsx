import Image from "next/image";

export type ActionIcons = "attack" | "coal" | "pronunciation-repeat" | "next";

interface ActionButtonProps {
  label: string;
  icon: ActionIcons;
  hotkey: string;
  disabled?: boolean;
  active: boolean;
  onClick: () => void;
}

const WIDTH = 220;
const HEIGHT = 40;

export function ActionButton({
  disabled,
  active,
  onClick,
  icon,
  label,
  hotkey,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      data-active={active}
      onClick={onClick}
      style={{ width: WIDTH, height: HEIGHT }}
      className={[
        "group flex overflow-hidden bg-[#D9D9D9]",
        "transition select-none",
        disabled ? "cursor-not-allowed opacity-80" : "cursor-pointer",
      ].join(" ")}
    >
      <div
        style={{ width: HEIGHT, height: HEIGHT }}
        className="relative flex items-center justify-center shrink-0 ml-1"
      >
        <Image
          src={`/ui/action_button/${icon}_icon_active.png`}
          width={42}
          height={HEIGHT}
          alt={`${icon}_icon_active`}
          priority
          className={[
            "absolute opacity-100",
            "group-hover:opacity-0",
            "group-data-[active=true]:opacity-0",
            "group-disabled:opacity-0",
            "transition-opacity",
          ].join(" ")}
        />
        <Image
          src={`/ui/action_button/${icon}_icon_hover.png`}
          width={47}
          height={HEIGHT}
          alt={`${icon}_icon_hover`}
          priority
          className={[
            "absolute opacity-0",
            "group-hover:opacity-100 group-disabled:opacity-0",
            "group-data-[active=true]:opacity-100",
            "transition-opacity",
          ].join(" ")}
        />
        <Image
          src={`/ui/action_button/${icon}_icon_disabled.png`}
          width={47}
          height={HEIGHT}
          alt={`${icon}_icon_disabled`}
          priority
          className={[
            "absolute opacity-0 group-disabled:opacity-100 transition-opacity",
          ].join(" ")}
        />
      </div>

      <span
        className={[
          "flex-1 flex items-center justify-start text-left pl-2 pr-3 pt-1",
          "font-primary text-xl",
          "group-hover:font-bold",
          "group-data-[active=true]:font-bold",
          "text-[#3A3A3A] group-disabled:text-[#9B9B9B]",
        ].join(" ")}
      >
        {label}
      </span>

      <div
        style={{ width: 54, height: HEIGHT }}
        className={[
          "flex items-center justify-center shrink-0",
          "bg-[#414141]",
          "group-hover:bg-[#FF161A] ",
          "group-data-[active=true]:bg-[#FF161A]",
          "group-disabled:bg-[#BDBDBD]",
          "transition-colors",
        ].join(" ")}
      >
        <span className="text-white font-primary text-2xl font-bold">
          {hotkey}
        </span>
      </div>
    </button>
  );
}
