import {
  DEFAULT_STORY_HEIGHT,
  DEFAULT_STORY_WIDTH,
  PhaserStory,
} from "@/game/storybook/PhaserStory";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ActorPayload } from "../types/Actor";
import { useRef } from "react";
import { Guardian } from "./Guardian";
import { events } from "@/events/events";
import { ACTORS } from "@/constants/game";

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

export const Default: Story = {
  args: {
    actions: (guardian) => {
      guardian.enterIdleState();
    },
  },
};

export const Speaking: Story = {
  args: {
    actions: (guardian) => {
      guardian.setAlpha(1);
      guardian.animations.playSpeaking();
    },
  },
};

export const FadeIn: Story = {
  args: {
    actions: (guardian) => {
      guardian.fadeIn();
    },
  },
};

export const FadeOut: Story = {
  args: {
    actions: (guardian) => {
      guardian.enterIdleState();
      setTimeout(() => {
        guardian.fadeOut();
      }, 800);
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

export const Unlean: Story = {
  args: {
    actions: async (guardian) => {
      await guardian.lean();
      await guardian.unlean();
    },
  },
};

export const LeanIdle: Story = {
  args: {
    actions: async (guardian) => {
      await guardian.lean();
      guardian.enterIdleState();
    },
  },
};

export const LeanSpeaking: Story = {
  args: {
    actions: (guardian) => {
      guardian.setAlpha(1);
      guardian.animations.playLeanSpeaking();
    },
  },
};
