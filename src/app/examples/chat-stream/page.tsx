"use client";

import { useRef, useState } from "react";

type Role = "user" | "assistant";
type Mood = "happy" | "sad" | "embarrassed" | "angry" | "neutral";

interface Message {
  id: string;
  role: Role;
  content: string;
  mood?: Mood;
}

interface MoodMessage {
  mood: Mood;
  text: string;
  moodReady: boolean;
}

export default function ChatStream() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef<AbortController>(null);

  function addMessage(message: Omit<Message, "id">) {
    const id = `${Date.now() + Math.random()}`;
    setMessages((currentMessages) => [...currentMessages, { id, ...message }]);
    return id;
  }

  function updateMessage(id: string, patch: Partial<Message>) {
    setMessages((messages) =>
      messages.map((msg) => (msg.id === id ? { ...msg, ...patch } : msg))
    );
  }

  function parseMoodFromStart(text: string): MoodMessage {
    const messageWithMood = text.match(
      /^\[(happy|sad|embarrassed|angry)\]\s*(.*)$/i
    );
    if (!messageWithMood) {
      return { mood: "neutral", text, moodReady: false };
    }
    return {
      mood: messageWithMood[1].toLowerCase() as Mood,
      text: messageWithMood[2],
      moodReady: true,
    };
  }

  async function sendStreaming() {
    const content = input.trim();
    if (!content || loading) return;

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    addMessage({ role: "user", content });

    const messageId = addMessage({
      role: "assistant",
      content: "",
      mood: "neutral",
    });

    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/examples/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userMessage: `Josef: ${content}` }),
        signal: controller.signal,
      });

      if (!response.body) throw new Error("No stream body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let partial = "";
      let moodLocked = false;
      let currentMood: Mood = "neutral";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        partial += decoder.decode(value, { stream: true });

        if (!moodLocked) {
          const { mood, text, moodReady } = parseMoodFromStart(partial);
          if (moodReady) {
            currentMood = mood;
            moodLocked = true;
            updateMessage(messageId, { mood: currentMood, content: text });
          } else {
            updateMessage(messageId, { content: partial });
          }
        } else {
          updateMessage(messageId, { content: partial });
        }
      }

      if (!moodLocked) {
        const { mood, text } = parseMoodFromStart(partial);
        updateMessage(messageId, { mood, content: text });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      updateMessage(messageId, {
        content: `Error: ${error?.message ?? "stream aborted/failed"}`,
        mood: "sad",
      });
    } finally {
      setLoading(false);
    }
  }

  async function clearAll() {
    controllerRef.current?.abort();
    setMessages([]);
    setInput("");

    try {
      await fetch("/api/dialogue", { method: "DELETE" });
    } catch {}
  }

  function moodBadge(mood?: Mood) {
    const map: Record<Mood, string> = {
      happy: "😊",
      sad: "😔",
      embarrassed: "😳",
      angry: "😠",
      neutral: "😐",
    };
    return map[mood ?? "neutral"];
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-semibold">Elisa — Live (Streaming)</h1>
          <div className="flex gap-2">
            <button
              onClick={clearAll}
              className="px-3 py-1.5 rounded-md bg-gray-200 text-gray-900"
              disabled={loading}
              title="Clear UI (and reset server history if using /api/dialogue)"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 mb-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-[80%] p-2 rounded-lg ${
                m.role === "user"
                  ? "bg-blue-100 text-blue-900 self-end ml-auto"
                  : "bg-pink-100 text-pink-900"
              }`}
            >
              <div className="text-xs opacity-70 mb-0.5">
                <strong>{m.role === "user" ? "Josef" : "Elisa"}</strong>{" "}
                {m.role === "assistant" && <span>{moodBadge(m.mood)}</span>}
              </div>
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          ))}
          {loading && (
            <div className="text-sm text-gray-500 animate-pulse">
              Elisa is typing…
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendStreaming()}
            placeholder="Type as Josef…"
            className="flex-1 border rounded-lg px-3 py-2"
            disabled={loading}
          />
          <button
            onClick={sendStreaming}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60"
            disabled={loading || !input.trim()}
          >
            {loading ? "…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
