"use client";

import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    setLoading(true);

    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");

    try {
      const res = await fetch("/api/examples/dialogue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage: `Josef: ${text}` }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages([
        ...next,
        { role: "assistant", content: "Error: could not reach server." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function clearChat() {
    setLoading(true);
    try {
      await fetch("/api/dialogue", { method: "DELETE" });
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-black">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 space-y-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-100 text-blue-900 self-end"
                  : "bg-pink-100 text-pink-900 self-start"
              }`}
            >
              <strong>{msg.role === "user" ? "Josef" : "Elisa"}:</strong>{" "}
              {msg.content}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 border rounded-lg p-2 font-black"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 rounded-lg disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "..." : "Send"}
          </button>
          <button
            onClick={clearChat}
            className="bg-gray-200 text-gray-800 px-4 rounded-lg disabled:opacity-60"
            disabled={loading}
            title="Clear chat & reset server history"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
