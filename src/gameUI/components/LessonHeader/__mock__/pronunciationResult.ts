import { PronunciationResultEvent } from "@/events/lesson/types";

export const defaultPronunciationResult: PronunciationResultEvent = {
  recordId: "#",
  score: {
    accuracyPercentage: 100,
    characters: [
      { id: "0-h", character: "H", found: true },
      { id: "1-a", character: "a", found: true },
      { id: "2-l", character: "l", found: true },
      { id: "3-l", character: "l", found: true },
      { id: "4-o", character: "o", found: true },
    ],
  },
  feedback: {
    status: "excellent",
    label: "EXCELLENT!!!",
    barColor: "#009E93",
  },
};

export const goodPronunciationResult: PronunciationResultEvent = {
  recordId: "#",
  score: {
    accuracyPercentage: 85,
    characters: [
      { id: "0-h", character: "H", found: true },
      { id: "1-a", character: "a", found: true },
      { id: "2-l", character: "l", found: false },
      { id: "3-l", character: "l", found: false },
      { id: "4-o", character: "o", found: false },
    ],
  },
  feedback: {
    status: "excellent",
    label: "ALMOST THERE",
    barColor: "#FCA30E",
  },
};

export const failPronunciationResult: PronunciationResultEvent = {
  recordId: "#",
  score: {
    accuracyPercentage: 0,
    characters: [
      { id: "0-h", character: "H", found: false },
      { id: "1-a", character: "a", found: false },
      { id: "2-l", character: "l", found: false },
      { id: "3-l", character: "l", found: false },
      { id: "4-o", character: "o", found: false },
    ],
  },
  feedback: {
    status: "fail",
    label: "TRY AGAIN",
    barColor: "#B40F00",
  },
};
