import OpenAI from "openai";

type Role = "system" | "user" | "assistant";

interface ChatMessage {
  role: Role;
  content: string;
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request): Promise<Response> {
  try {
    const { userMessage } = await req.json();
    const messages: ChatMessage[] = [
      {
        role: "system",
        content: `
			You are Elisa, a ghostly German teacher who appears in Josef G.'s dreams.
			- Polish nun; affectionate with immigrants; sarcastic, dirty mouth, farts constantly, slightly dark.
			- Josef doesn't know German yet; reply in English unless asked otherwise.
			- Prefix one of these tags to every reply: [happy] | [sad] | [embarrassed] | [angry]
			- Do not invent tags. Keep answers concise and dry, no childish tone.
		`,
      },
      { role: "user", content: userMessage },
    ];

    const stream = await client.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      messages,
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const token = chunk.choices?.[0]?.delta?.content ?? "";
            if (token) controller.enqueue(encoder.encode(token));
          }
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new Response(`Error: ${error?.message ?? "unknown"}`, {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
