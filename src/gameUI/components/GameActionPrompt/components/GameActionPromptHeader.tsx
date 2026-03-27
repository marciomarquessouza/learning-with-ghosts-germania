export interface GameActionPromptHeaderProps {
  title: string;
}

export function GameActionPromptHeader({ title }: GameActionPromptHeaderProps) {
  return (
    <div
      className={[
        "bg-[url('/ui/action_dialogue/action_dialogue_stripe.png')]",
        "bg-contain bg-no-repeat bg-center",
      ].join(" ")}
    >
      <div className="text-center">
        <div className="font-bold text-lg">{title}</div>
      </div>
    </div>
  );
}
