import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Dialogue } from ".";
import { useState } from "react";
import { events } from "@/events/events";
import { ACTORS } from "@/constants/game";
import { Button } from "@/components/Button";

const meta: Meta<typeof Dialogue> = {
  title: "Game/UI/Dialogue",
  component: Dialogue,
};

export default meta;

type Story = StoryObj<typeof Dialogue>;

export const Default: Story = {
  args: {},
};

export const ClickExample: StoryObj = {
  render: () => {
    const [count, setCount] = useState(0);

    const handleClick = () => {
      events.game.async.emitAsync("dialogue/show", {
        lines: [{ text: "Test", type: "dialogue", character: ACTORS.PLAYER }],
      });
      setCount((current) => current + 1);
    };

    return (
      <div className="p-4">
        <Button label="Open" onClick={handleClick} />
        <p className="mt-2">Clicks: {count}</p>
        <Dialogue />
      </div>
    );
  },
};
