import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useTypewriter } from "./useTypewriter";
import { useEffect } from "react";
import { renderFormattedText } from "../dialogues/renderFormattedText";

const meta: Meta<typeof useTypewriter> = {
  title: "Game/libs/typewriter",
  parameters: {
    layout: "centered",
  },
};

export default meta;

type TypewriterProps = {
  text: string;
};

const Component = ({ text }: TypewriterProps) => {
  const { displayedText, setTextToType, startTyping } = useTypewriter();

  useEffect(() => {
    setTextToType(text);
    startTyping();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className=" w-2xl flex flex-1 justify-center items-center flex-col">
      <div className=" h-8">
        <p className="font-mono">{renderFormattedText(displayedText)}</p>
      </div>
    </div>
  );
};

export const Default: StoryObj<TypewriterProps> = {
  args: { text: `Typewriter Example` },
  render: Component,
};

export const FormattedText: StoryObj<TypewriterProps> = {
  args: {
    text: `Press {{key|Space}} repeat {{target|Hallo}} listen {{audio|voice.mp3}}`,
  },
  render: Component,
};
