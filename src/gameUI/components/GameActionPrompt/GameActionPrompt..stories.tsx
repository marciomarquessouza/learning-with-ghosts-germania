import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GameActionPrompt } from "./GameActionPrompt";
import { action, HandlerFunction } from "storybook/actions";
import { useState } from "react";
import { PromptStates } from "./GameActionPrompt.boundary";
import { Button } from "@/components/Button";

const meta: Meta<typeof GameActionPrompt> = {
  title: "Game/UI/GameActionPrompt",
  component: GameActionPrompt,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type ActionsProps = {
  initialState: PromptStates;
  title: string;
  description: string;
  durationMs?: number;
  fixed?: boolean;
  onAction: HandlerFunction;
};

const component = ({
  initialState,
  title,
  description,
  durationMs,
  fixed,
  onAction,
}: ActionsProps) => {
  const [state, setState] = useState<PromptStates>(initialState);

  return (
    <>
      <Button
        label={state === "hidden" ? "open" : "close"}
        onClick={() =>
          setState((s) => (s === "hidden" ? "expanded" : "hidden"))
        }
      />
      <GameActionPrompt
        state={state}
        title={title}
        durationMs={durationMs}
        fixed={fixed}
        description={description}
        onAction={onAction}
        onExpanded={() => setState("expanded")}
        onClosed={() => setState(fixed ? "minimized" : "hidden")}
      />
    </>
  );
};

export const Default: StoryObj<ActionsProps> = {
  args: {
    initialState: "expanded",
    title: "Default",
    description: "Press {{key|Space}} or {{key|E}} to interact",
    onAction: action("Action"),
  },
  render: component,
};

export const Timer: StoryObj<ActionsProps> = {
  args: {
    initialState: "expanded",
    title: "With Timer",
    fixed: true,
    description: "Press {{key|Space}} or {{key|E}} to interact",
    durationMs: 30_000,
    onAction: action("Action"),
  },
  render: component,
};

export const Minimized: StoryObj<ActionsProps> = {
  args: {
    initialState: "minimized",
    title: "Minimized",
    description: "Press {{key|Space}} or {{key|E}} to interact",
    fixed: true,
    onAction: action("Action"),
  },
  render: component,
};
