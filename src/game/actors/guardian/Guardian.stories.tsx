import {
  DEFAULT_STORY_HEIGHT,
  DEFAULT_STORY_WIDTH,
  PhaserStory,
} from "@/game/storybook/PhaserStory";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ActorPayload } from "../types/Actor";
import { useRef } from "react";
import { Guardian } from "./Guardian";

const positionX = DEFAULT_STORY_WIDTH / 2;
const positionY = DEFAULT_STORY_HEIGHT / 2;

const defaultSetup = {
  startX: positionX,
  startY: positionY,
  flipX: false,
};

const GuardianStory = ({
  actorSetup = defaultSetup,
  actions,
}: {
  actorSetup?: ActorPayload;
  actions?: (guardian: Guardian) => void;
}) => {
  const guardianRef = useRef<Guardian | null>(null);

  if (!guardianRef.current) {
    guardianRef.current = new Guardian();
  }

  const guardian = guardianRef.current;

  return (
    <PhaserStory
      preload={(scene) => guardian.preload(scene)}
      create={(scene) => {
        guardian.create(scene, actorSetup);
        actions?.(guardian);
      }}
      update={(_, delta) => guardian.update(delta)}
    />
  );
};

const meta: Meta<typeof GuardianStory> = {
  title: "Phaser/Actors/Guardian",
  component: GuardianStory,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof GuardianStory>;

export const Default: Story = {};

export const FadeIn: Story = {
  args: {
    actions: (guardian) => {
      guardian.sprite.setAlpha(0);
      guardian.fadeIn();
    },
  },
};

export const FadeOut: Story = {
  args: {
    actions: (guardian) => {
      guardian.fadeOut();
    },
  },
};

export const Lean: Story = {
  args: {
    actions: (guardian) => {
      guardian.lean();
    },
  },
};

export const LeanIdle: Story = {
  args: {
    actions: (guardian) => {
      guardian.enterLeanIdleState();
    },
  },
};

export const LeanSpeaking: Story = {
  args: {
    actions: (guardian) => {
      guardian.enterLeanSpeakingState();
    },
  },
};
