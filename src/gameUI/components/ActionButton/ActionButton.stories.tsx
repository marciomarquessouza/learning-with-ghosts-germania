import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ActionButton } from ".";
import { action } from "storybook/actions";

const meta: Meta<typeof ActionButton> = {
  title: "Game/UI/ActionButton",
  component: ActionButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked" },
  },
};

export default meta;

type Story = StoryObj<typeof ActionButton>;

export const Default: Story = {
  args: {
    label: "ATTACK",
    icon: "attack",
    active: false,
    hotkey: "A",
    onClick: action("action-button-click"),
  },
};
