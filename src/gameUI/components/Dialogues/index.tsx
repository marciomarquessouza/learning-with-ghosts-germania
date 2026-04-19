import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTypewriter } from "@/gameUI/hooks/useTypewriter";
import { ACTORS } from "@/constants/game";
import { useDeviceType } from "@/gameUI/hooks/useDeviceType";
import Image from "next/image";
import { useCharacterDetails } from "@/gameUI/hooks/useCharacterDetails";
import { useUiStore } from "@/store/uiStore";
import { createDialogueKeyDownHandler } from "@/libs/inputs/createDialogueKeyDownHandler";
import { DialogueLines } from "./components/DialogueLines";
import { Alternatives } from "./components/Alternatives";
import { DialogueCTA } from "./components/DialogueCTA";
import { getDialogueDimension } from "./helpers/getDialgueDimension";
import { InputText } from "./components/InputText";
import { getUUID } from "@/utils/getUUID";
import { handleAlternativeKeyDown } from "@/libs/dialogues/handleAlternativeKeyDown";
import { events } from "@/events/events";
import { DialogueEvent } from "@/events/game/types";
import { InteractionLine } from "@/libs/dialogues/types";
import { setCharactersMood } from "./helpers/setCharacterMood";

export function Dialogue() {
  const device = useDeviceType();
  const [visible, setVisible] = useState(false);
  const [character, setCharacter] = useState<ACTORS | null>(null);
  const { displayedText, isComplete, setTextToType, startTyping, resumeText } =
    useTypewriter();
  const [lineIndex, setLineIndex] = useState(0);
  const [lines, setLines] = useState<InteractionLine[]>([]);
  const [isLastLine, setLastLine] = useState(false);
  const [selectedAlternative, setSelectedAlternative] = useState<string | null>(
    null,
  );
  const [answer, setAnswer] = useState<string>("");
  const characterDetails = useCharacterDetails(character);
  const { setInteractionDialogueOpen } = useUiStore();
  const { heightClass, widthClass } = useMemo(
    () => getDialogueDimension(device),
    [device],
  );
  const onCompleteRef = useRef<() => void>(() => {});
  const onAlternativeSelectedRef = useRef<(id: string) => void | null>(null);
  const onAnswerSubmittedRef = useRef<(answer: string) => void | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const dialogueId = useRef<string>("");

  useEffect(() => {
    setInteractionDialogueOpen(visible);
    if (visible) {
      requestAnimationFrame(() => boxRef.current?.focus());
    }
  }, [visible, setInteractionDialogueOpen]);

  useEffect(() => {
    const handler = (payload: DialogueEvent, done: () => void) => {
      dialogueId.current = getUUID();
      setLines(payload.lines);
      setLineIndex(0);
      setCharactersMood(payload.lines[0].moods);
      setCharacter(payload.lines[0].character);
      setTextToType(payload.lines[0].text);
      setLastLine(payload.lines.length === 1);
      onCompleteRef.current = () => {
        payload?.onComplete?.();
        done();
      };
      onAlternativeSelectedRef.current = payload.onAlternativeSelected ?? null;
      onAnswerSubmittedRef.current = payload.onAnswerSubmitted ?? null;
      setVisible(true);
    };

    events.game.async.on("dialogue/show", handler);
    return () => events.game.async.off("dialogue/show", handler);
  }, [setTextToType]);

  useEffect(() => {
    const handle = () => {
      closeDialogue();
    };
    events.game.sync.on("dialogue/hide", handle);
    return () => events.game.sync.off("dialogue/hide", handle);
  }, []);

  const advanceLine = useCallback(() => {
    if (lines[lineIndex].type === "alternatives" && selectedAlternative) {
      onAlternativeSelectedRef.current?.(selectedAlternative);
      setSelectedAlternative(null);
    }

    if (lines[lineIndex].type === "input") {
      onAnswerSubmittedRef.current?.(answer);
      setAnswer("");
    }

    const newIndex = lineIndex + 1;
    const newLine = lines[newIndex];

    if (!newLine) {
      closeDialogue();
      return;
    }

    setLineIndex(newIndex);
    setCharacter(newLine.character);
    setLastLine(newIndex === lines.length - 1);
    setCharactersMood(newLine.moods);
    setTextToType(newLine.text);
    startTyping({ actor: newLine.character });
  }, [
    lineIndex,
    lines,
    startTyping,
    setTextToType,
    selectedAlternative,
    answer,
  ]);

  const closeDialogue = () => {
    setVisible(false);
    setLastLine(false);
    if (onCompleteRef.current) {
      onCompleteRef.current?.();
      onCompleteRef.current = () => {};
    }
  };

  const handleClickOnText = useCallback(() => {
    if (lines[lineIndex].type === "dialogue") {
      resumeText(() => advanceLine());
    }
  }, [resumeText, advanceLine, lineIndex, lines]);

  const handleOnCTAClick = useCallback(() => {
    if (lines[lineIndex].type !== "dialogue") {
      advanceLine();
      return;
    }

    resumeText(() => advanceLine());
  }, [resumeText, advanceLine, lineIndex, lines]);

  const handleKeyDown = createDialogueKeyDownHandler({
    keyUp: () => {
      if (lines[lineIndex].type === "alternatives") {
        handleAlternativeKeyDown({
          alternatives: lines[lineIndex].alternatives,
          selectedAlternative,
          setAlternative: setSelectedAlternative,
          selectPrevious: true,
        });
      }
    },
    keyDown: () => {
      if (lines[lineIndex].type === "alternatives") {
        handleAlternativeKeyDown({
          alternatives: lines[lineIndex].alternatives,
          selectedAlternative,
          setAlternative: setSelectedAlternative,
        });
      }
    },
    keyAction: () => resumeText(() => advanceLine()),
  });

  const handleOnSelectedAlternative = useCallback((alternativeId: string) => {
    setSelectedAlternative(alternativeId);
    onAlternativeSelectedRef.current?.(alternativeId);
  }, []);

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
          onAnimationComplete={() => startTyping({ actor: character })}
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
                  onSelected={handleOnSelectedAlternative}
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
              onClick={handleOnCTAClick}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
