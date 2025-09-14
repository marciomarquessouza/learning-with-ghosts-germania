import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTypewriter } from "@/hooks/useTypewriter";
import {
  DialogueEvent,
  gameEvents,
  InteractionLine,
} from "@/events/gameEvents";
import { CHARACTERS, MOODS } from "@/constants/game";
import { useDeviceType } from "@/hooks/useDeviceType";
import Image from "next/image";
import { useCharacterDetails } from "@/hooks/useCharacterDetails";
import { useUiStore } from "@/store/uiStore";
import { useDialogueKeyDown } from "@/hooks/useDialogueKeyDown";
import { DialogueLines } from "./DialogueLines";
import { Alternatives } from "./Alternatives";
import { DialogueCTA } from "./DialogueCTA";
import { getDialogueDimension } from "./helpers/getDialgueDimension";
import { InputText } from "./InputText";
import { getUUID } from "@/utils/getUUID";
import { setCharactersMood } from "@/events/helpers/setCharactersMood";

export function Dialogue() {
  const device = useDeviceType();
  const [visible, setVisible] = useState(false);
  const [character, setCharacter] = useState<CHARACTERS | null>(null);
  const {
    displayedText,
    isComplete,
    setTextToType,
    startTyping,
    handleTextClick,
  } = useTypewriter();
  const [lineIndex, setLineIndex] = useState(0);
  const [lines, setLines] = useState<InteractionLine[]>([]);
  const [isLastLine, setLastLine] = useState(false);
  const [selectedAlternative, setSelectedAlternative] = useState<string | null>(
    null
  );
  const [answer, setAnswer] = useState<string>("");
  const characterDetails = useCharacterDetails(character);
  const { setInteractionDialogueOpen } = useUiStore();
  const { heightClass, widthClass } = useMemo(
    () => getDialogueDimension(device),
    [device]
  );
  const onCompleteRef = useRef<() => void | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const dialogueId = useRef<string>("");

  useEffect(() => {
    setInteractionDialogueOpen(visible);
    if (visible) {
      requestAnimationFrame(() => boxRef.current?.focus());
    }
  }, [visible, setInteractionDialogueOpen]);

  useEffect(() => {
    const handler = (payload: DialogueEvent) => {
      dialogueId.current = getUUID();
      setLines(payload.lines);
      setLineIndex(0);
      setCharactersMood(payload.lines[0].moods);
      setCharacter(payload.lines[0].character);
      setTextToType(payload.lines[0].text);
      setLastLine(payload.lines.length === 1);
      onCompleteRef.current = payload?.onComplete ?? null;
      setVisible(true);
    };

    gameEvents.on("show-dialogue", handler);
    return () => gameEvents.off("show-dialogue", handler);
  }, [setTextToType]);

  const advanceLine = useCallback(() => {
    if (lines[lineIndex].type === "alternatives" && selectedAlternative) {
      lines[lineIndex].onSubmitted(selectedAlternative);
      setSelectedAlternative(null);
    }

    if (lines[lineIndex].type === "input") {
      lines[lineIndex].onSubmitted(answer);
      setAnswer("");
    }

    const newIndex = lineIndex + 1;
    const newLine = lines[newIndex];

    if (!newLine) {
      gameEvents.emit("hide-dialogue", { dialogueId: dialogueId.current });
      setVisible(false);
      setLastLine(false);
      setCharactersMood(
        Object.values(CHARACTERS).map((character) => ({
          mood: MOODS.NEUTRAL,
          character,
        }))
      );
      if (onCompleteRef.current) {
        onCompleteRef.current?.();
        onCompleteRef.current = null;
      }
      return;
    }

    setLineIndex(newIndex);
    setCharacter(newLine.character);
    setLastLine(newIndex === lines.length - 1);
    setCharactersMood(newLine.moods);
    setTextToType(newLine.text);
    startTyping();
  }, [
    lineIndex,
    lines,
    startTyping,
    setTextToType,
    selectedAlternative,
    answer,
  ]);

  const handleClickOnText = useCallback(() => {
    if (lines[lineIndex].type !== "dialogue") {
      return;
    }

    handleTextClick(() => advanceLine());
  }, [handleTextClick, advanceLine, lineIndex, lines]);

  const handleOnClick = useCallback(() => {
    if (lines[lineIndex].type !== "dialogue") {
      advanceLine();
      return;
    }

    handleTextClick(() => advanceLine());
  }, [handleTextClick, advanceLine, lineIndex, lines]);

  const handleKeyDown = useDialogueKeyDown({
    keyAction: () => handleTextClick(() => advanceLine()),
  });

  if (!visible || !characterDetails) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={boxRef}
          tabIndex={0}
          className={`fixed left-1/2 -translate-x-1/2 ${heightClass} ${widthClass}
                      bg-[url('/dialogue/dialogue_background.png')] bg-cover bg-center
                      border-y border-neutral-800 shadow-xl outline-none`}
          initial={{ opacity: 0, bottom: -40 }}
          animate={{ opacity: 1, bottom: 40 }}
          exit={{ opacity: 0, bottom: -40 }}
          onAnimationComplete={startTyping}
          transition={{ duration: 0.5, ease: "linear" }}
          onClick={handleClickOnText}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-live="polite"
        >
          <div className="absolute inset-0 bg-neutral-900/10"></div>

          <div className="relative h-full flex items-start gap-4">
            <div className="shrink-0">
              <Image
                src={characterDetails.avatarURL}
                width={136}
                height={179}
                alt={`${characterDetails.characterName} picture`}
                priority
              />
            </div>

            <div className="flex-1 min-w-0 pr-4 pt-4 flex flex-col h-full">
              {lines[lineIndex].type === "dialogue" && (
                <DialogueLines
                  displayedText={displayedText}
                  characterDetails={characterDetails}
                />
              )}

              {lines[lineIndex].type === "alternatives" && (
                <Alternatives
                  displayedText={displayedText}
                  isTypeWritingComplete={isComplete}
                  characterDetails={characterDetails}
                  selectedAlternative={selectedAlternative}
                  alternatives={lines[lineIndex].alternatives}
                  onSelected={setSelectedAlternative}
                />
              )}

              {lines[lineIndex].type === "input" && (
                <InputText
                  questionText={displayedText}
                  isTypeWritingComplete={isComplete}
                  inputLabel={lines[lineIndex].inputLabel}
                  answerText={answer}
                  characterDetails={characterDetails}
                  onAnswerChange={setAnswer}
                  onSubmit={advanceLine}
                />
              )}

              <div className="-mt-2 mb-1 flex justify-center">
                <Image
                  src="/dialogue/dialogue_germania_logo.png"
                  alt=""
                  width={30}
                  height={30}
                />
              </div>
            </div>

            <DialogueCTA
              isTypeWritingComplete={isComplete}
              isLastLine={isLastLine}
              interactionType={lines[lineIndex].type}
              onClick={handleOnClick}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
