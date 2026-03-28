import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { action } from "storybook/actions";
import { SquareIconButton } from "./SquareIconButton";

const meta: Meta<typeof SquareIconButton> = {
  title: "Game/UI/SquareIconButton",
  component: SquareIconButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked" },
  },
};

export default meta;

type Story = StoryObj<typeof SquareIconButton>;

export const Action: Story = {
  args: {
    variant: "action",
    onClick: action("button-click"),
  },
};

export const Close: Story = {
  args: {
    variant: "close",
    onClick: action("button-click"),
  },
};
