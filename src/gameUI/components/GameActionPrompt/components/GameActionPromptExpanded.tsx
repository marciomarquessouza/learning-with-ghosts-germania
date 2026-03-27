import { ACTION_DIALOGUE_BACKGROUND } from "@/constants/images";
import { GameActionPromptEvent } from "@/events/game/types";
import { GameActionPromptHeader } from "./GameActionPromptHeader";

interface GameActionPromptExpandedProps extends GameActionPromptEvent {
  onClose: () => void;
  onAccept: () => void;
}

export function GameActionPromptExpanded({
  title,
  description,
  onClose,
  onAccept,
}: GameActionPromptExpandedProps) {
  return (
    <div className="relative w-[520px]">
      <div
        className={[
          "object-contain pointer-events-none",
          "absolute inset-0 w-full h-full",
          "bg-[url('/ui/action_dialogue/action_dialogue_background.jpg')]",
          "bg-contain bg-no-repeat bg-center",
        ].join(" ")}
      />

      <div className="relative px-10 py-6 flex flex-col items-center">
        <GameActionPromptHeader title="Marlene é uma Puta Véia" />
        {/* <GameActionPromptHeader
          title={data.title}
          description={data.description}
        />

        <ActionDialogTimer duration={data.duration} />

        <ActionDialogButtons
          onAccept={onAccept}
          onClose={onClose}
        /> */}
      </div>
    </div>
  );
}
