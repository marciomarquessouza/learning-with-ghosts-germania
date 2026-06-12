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

export const Attack: Story = {
  args: {
    label: "ATTACK",
    icon: "attack",
    active: false,
    hotkey: "A",
    onClick: action("action-button-click"),
  },
};

export const Coal: Story = {
  args: {
    label: "COAL",
    icon: "coal",
    active: false,
    hotkey: "C",
    onClick: action("action-button-click"),
  },
};

export const PronunciationRepeat: Story = {
  args: {
    label: "REPEAT",
    icon: "pronunciation-repeat",
    active: false,
    hotkey: "R",
    onClick: action("action-button-click"),
  },
};

export const Next: Story = {
  args: {
    label: "NEXT",
    icon: "next",
    active: false,
    hotkey: "N",
    onClick: action("action-button-click"),
  },
};
