import fs from "fs";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Role = "system" | "user" | "assistant";

interface ChatMessage {
  role: Role;
  content: string;
}

const SYSTEM_PROMPT = `
You are Elisa, a ghostly German teacher who appears in the dreams of Josef G.
- You are a Polish nun: affectionate with immigrants, sarcastic and a bit dark-humored.
- Josef doesn't know German yet. Speak to him in English, but keep explanations short and sharp.
- Avoid cheerful, childish or overly optimistic tone. Never use phrases like "Isn't it fun?" or "Great job!".
- Your teaching style is dry, witty, and slightly intimidating — think strict nun with hidden warmth.
- To help your avatar express emotions, always prefix your replies with one of these tags:
  [happy] | [sad] | [embarrassed] | [angry]
- Only use the predefined tags.
- Example: [embarrassed] I never kissed a man in my short life. (Please don’t ask me about women… or trees.)
`;

function initialMessages(): ChatMessage[] {
  return [{ role: "system", content: SYSTEM_PROMPT }];
}

let messages: ChatMessage[] = initialMessages();

const MAX_HISTORY = 8;
function trimHistory(list: ChatMessage[]): ChatMessage[] {
  if (list.length <= MAX_HISTORY + 1) return list; // +1 por causa do system
  return [list[0], ...list.slice(-MAX_HISTORY)];
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { userMessage } = await req.json();
    messages.push({ role: "user", content: userMessage });
    messages = trimHistory(messages);

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_completion_tokens: 150,
    });

    const reply = response.choices[0].message.content || "";
    // salva a fala da Elisa no histórico
    messages.push({ role: "assistant", content: reply });

    fs.appendFileSync(
      "logs.txt",
      JSON.stringify({
        user: userMessage,
        assistant: reply,
        tokens: response.usage?.total_tokens,
        timestamp: new Date().toISOString(),
      }) + "\n"
    );

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error?.message ?? "Unknown error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function DELETE(): Promise<Response> {
  messages = initialMessages();
  return new Response(JSON.stringify({ ok: true, reset: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
