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
  duration?: number;
  onAction: HandlerFunction;
};

const component = ({
  initialState,
  title,
  description,
  duration,
  onAction,
}: ActionsProps) => {
  const [state, setState] = useState<PromptStates>(initialState);

  const changeState = (newState: PromptStates) => {
    setState(newState);
  };

  return (
    <>
      <Button
        label={state === "hidden" ? "open" : "close"}
        onClick={() => changeState(state === "hidden" ? "expanded" : "hidden")}
      />
      <GameActionPrompt
        state={state}
        title={title}
        duration={duration}
        description={description}
        changeState={changeState}
        onAction={onAction}
      />
    </>
  );
};

export const Default: StoryObj<ActionsProps> = {
  args: {
    initialState: "expanded",
    title: "Default",
    description: "Description",
    onAction: action("Action"),
  },
  render: component,
};

export const Timer: StoryObj<ActionsProps> = {
  args: {
    initialState: "expanded",
    title: "With Timer",
    description: "Description",
    duration: 30,
    onAction: action("Action"),
  },
  render: component,
};
