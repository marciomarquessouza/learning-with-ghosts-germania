import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RotateOverlay } from ".";

const meta: Meta<typeof RotateOverlay> = {
  title: "Game/UI/RotateOverlay",
  component: RotateOverlay,
};

export default meta;

type Story = StoryObj<typeof RotateOverlay>;

export const Default: Story = {
  args: {},
};
