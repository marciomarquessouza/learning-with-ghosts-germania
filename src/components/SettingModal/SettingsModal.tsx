import {
  DEFAULT_LESSON_LANGUAGE,
  DEFAULT_LEVEL,
  DEFAULT_PLAYER_LANGUAGE,
  Language,
  Level,
} from "@/constants/lesson";
import { useState } from "react";

type Settings = {
  lessonLanguage: Language;
  playerLanguage: Language;
  lessonLevel: Level;
};

export function SettingsModal() {
  const [setting, setSettings] = useState<Settings>({
    lessonLanguage: DEFAULT_LESSON_LANGUAGE,
    playerLanguage: DEFAULT_PLAYER_LANGUAGE,
    lessonLevel: DEFAULT_LEVEL,
  });

  return (
    <section>
      <p>{setting.lessonLanguage}</p>
      <p>{setting.playerLanguage}</p>
      <p>{setting.lessonLevel}</p>
    </section>
  );
}
