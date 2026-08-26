import { PhaserStory } from "@/game/storybook/PhaserStory";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tutor } from "./Tutor";
import { ActorPayload } from "../types/Actor";
import { useRef } from "react";

const defaultSetup = {
  startX: 0,
  startY: 300,
  scale: 0.6,
  flipX: true,
};

const TutorStory = ({
  actorSetup = defaultSetup,
  actions,
}: {
  actorSetup?: ActorPayload;
  actions?: (tutor: Tutor) => void;
}) => {
  const tutorRef = useRef<Tutor | null>(null);

  if (!tutorRef.current) {
    tutorRef.current = new Tutor();
  }

  const tutor = tutorRef.current;

  return (
    <PhaserStory
      preload={(scene) => tutor.preload(scene)}
      create={(scene) => {
        tutor.create(scene, actorSetup);
        actions?.(tutor);
      }}
      update={(_, delta) => tutor.update(delta)}
    />
  );
};

const meta: Meta<typeof TutorStory> = {
  title: "Phaser/Actors/Tutor",
  component: TutorStory,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof TutorStory>;

export const Default: Story = {};

export const Teaching: Story = {
  args: {
    actions: (tutor) => {
      tutor.enterTeaching();
    },
  },
};

export const Away: Story = {
  args: {
    actions: (tutor) => {
      tutor.enterAway();
    },
  },
};
