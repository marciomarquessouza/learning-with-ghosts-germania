"use client";
import {
  DEFAULT_LESSON_LANGUAGE,
  DEFAULT_LEVEL,
  DEFAULT_PLAYER_LANGUAGE,
  Language,
  Level,
} from "@/constants/lesson";
import { useState } from "react";
import { Modal } from "../Modal/Modal";
import { completeInitialSetup, useGameProgressStore } from "@/store/progressStore";
import { ChallengeLevelSelector } from "./components/ChallengeLevelSelector";
import { ChallengeLanguageSelector } from "./components/ChallengeLanguageSelector";
import { PlayerLanguageSelector } from "./components/PlayerLanguageSelector";
import { Button } from "../Button";

type Settings = {
  lessonLanguage: Language;
  playerLanguage: Language;
  lessonLevel: Level;
};

export function SettingsModal() {
  const { hasCompletedInitialSetup, hasHydrated } = useGameProgressStore();
  const [settings, setSettings] = useState<Settings>({
    lessonLanguage: DEFAULT_LESSON_LANGUAGE,
    playerLanguage: DEFAULT_PLAYER_LANGUAGE,
    lessonLevel: DEFAULT_LEVEL,
  });

  if (!hasHydrated) return null;

  return (
    <Modal
      title="SETTINGS"
      size="xl"
      isOpen={!hasCompletedInitialSetup}
      dismissible={false}
      footer={
        <>
          <Button
            label="CONTINUE" 
            onClick={completeInitialSetup}
          />
        </>
      }
    >
      <div className="space-y-6">
        <ChallengeLanguageSelector
          value={settings.lessonLanguage}
          onChange={(lessonLanguage) =>
            setSettings((current) => ({
              ...current,
              lessonLanguage,
            }))
          }
        />

        <PlayerLanguageSelector
          value={settings.playerLanguage}
          onChange={(playerLanguage) =>
            setSettings((current) => ({
              ...current,
              playerLanguage,
            }))
          }
        />

        <ChallengeLevelSelector
          value={settings.lessonLevel}
          onChange={(lessonLevel) =>
            setSettings((current) => ({
              ...current,
              lessonLevel,
            }))
          }
        />
      </div>
    </Modal>
  );
}
