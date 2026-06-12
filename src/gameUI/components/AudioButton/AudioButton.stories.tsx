import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AudioButton } from ".";
import { action } from "storybook/actions";

const meta: Meta<typeof AudioButton> = {
  title: "Game/UI/AudoButton",
  component: AudioButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked" },
  },
};

export default meta;

type Story = StoryObj<typeof AudioButton>;

export const Default: Story = {
  args: {
    type: "reproduce",
  },
};
