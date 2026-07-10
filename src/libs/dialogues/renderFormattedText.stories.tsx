import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { renderFormattedText } from "./renderFormattedText";

const meta: Meta<typeof renderFormattedText> = {
  title: "Game/libs/renderFormattedText",
  component: renderFormattedText,
  parameters: {
    layout: "centered",
  },
};

export default meta;

const Component = ({ text }: { text: string }) => {
  return renderFormattedText(text);
};

export const Audio: StoryObj<{ text: string }> = {
  args: { text: `Click the mic and say: “{{audio|voice.mp3}}”.` },
  render: Component,
};

export const Key: StoryObj<{ text: string }> = {
  args: { text: "Press {{key|Space}} or {{key|E}} to interact" },
  render: Component,
};

export const Target: StoryObj<{ text: string }> = {
  args: { text: "repeat {{target|Hallo}}" },
  render: Component,
};
