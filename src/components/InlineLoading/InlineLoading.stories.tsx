import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InlineLoading } from ".";

const meta: Meta<typeof InlineLoading> = {
  title: "Game/UI/Loadings/InlineLoading",
  component: InlineLoading,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof InlineLoading>;

export const Primary: Story = {
  args: { variant: "primary" },
};

export const Secondary: Story = {
  args: { variant: "secondary" },
};
