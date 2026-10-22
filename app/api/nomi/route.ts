import Anthropic from "@anthropic-ai/sdk";
import { systemPrompt, todayNote } from "./systemPrompt";

// Nomi's chat endpoint: the visitor's conversation in, Nomi's reply out as a
// plain-text stream. The API key stays on the server (ANTHROPIC_API_KEY in
// .env.local locally, Vercel env vars in production).

const MODEL = "claude-haiku-5-5";
// Hard backstop only — the prompt keeps normal answers to ~40 words; this
// leaves room for an "in detail" answer without cutting it off mid-sentence.
const MAX_REPLY_TOKENS = 500;
const MAX_QUESTION_CHARS = 600;
const MAX_HISTORY = 12; // only the most recent messages are sent

// Per-visitor limit. Best effort: it's per server instance, so it slows down
// a spammer rather than guaranteeing a hard cap — the monthly spend limit on
// the Anthropic account is the hard cap.
const LIMIT = { requests: 20, windowMs: 10 * 60 * 1000 };
const recent = new Map<string, number[]>();
function overLimit(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < LIMIT.windowMs);
  hits.push(now);
  recent.set(ip, hits);
  if (recent.size > 5000) recent.clear(); // keep memory bounded
  return hits.length > LIMIT.requests;
}

type ChatMessage = { role: "user" | "assistant"; content: string };
function parseMessages(body: unknown): ChatMessage[] | null {
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const messages = raw.slice(-MAX_HISTORY).map((m) => ({
    role: m?.role === "assistant" ? "assistant" : "user",
    content: typeof m?.content === "string" ? m.content.trim().slice(0, MAX_QUESTION_CHARS * 2) : "",
  })) as ChatMessage[];
  // The API needs the conversation to start and end with the visitor.
  while (messages.length && messages[0].role !== "user") messages.shift();
  const last = messages[messages.length - 1];
  if (!last || last.role !== "user" || !last.content || last.content.length > MAX_QUESTION_CHARS) return null;
  return messages.every((m) => m.content) ? messages : null;
}

const text = (body: string, status = 200) =>
  new Response(body, { status, headers: { "content-type": "text/plain; charset=utf-8" } });

// Created on first use, not when the module loads: the SDK throws without an
// API key, which would break the build/deploy if the key isn't set yet.
let client: Anthropic | null = null;

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (overLimit(ip)) return text("I need a little catnap 😴 — try again in a few minutes!", 429);

  const messages = parseMessages(await request.json().catch(() => null));
  if (!messages) return text("Hmm, I couldn't read that question — try asking again?", 400);

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("[nomi] ANTHROPIC_API_KEY is not set");
    return text("Sorry, my brain isn't plugged in yet — try again later, or email Joyce directly!", 503);
  }
  client ??= new Anthropic();

  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: MAX_REPLY_TOKENS,
    // No "thinking" pass: it's billed as output and counted against
    // max_tokens (it was eating ~300 of 400 and cutting answers off), and for
    // short look-up answers from the provided content it isn't needed.
    thinking: { type: "disabled" },
    // One cached block: identical every request, so after the first question
    // it's billed at the cache-read rate (a tenth of normal input).
    system: [
      { type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } },
      { type: "text", text: todayNote() },
    ],
    messages,
  });

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      let sent = false;
      stream.on("text", (delta) => {
        sent = true;
        controller.enqueue(encoder.encode(delta));
      });
      stream
        .finalMessage()
        .catch((error) => {
          console.error("[nomi] reply failed:", error?.status ?? "", error?.message ?? error);
          controller.enqueue(
            encoder.encode(sent ? " …sorry, I lost my train of thought." : "Sorry, my brain's a bit fuzzy right now — try again in a moment?"),
          );
        })
        .finally(() => controller.close());
    },
    cancel() {
      stream.abort(); // visitor closed the chat mid-answer
    },
  });

  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
}
