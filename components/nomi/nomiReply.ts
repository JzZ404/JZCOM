// The single seam between the chat window and Nomi's brain (app/api/nomi):
// sends the conversation, calls `onText` with each piece of the reply as it
// streams in, and resolves with the full reply.

export type ChatTurn = { role: "user" | "assistant"; content: string };

export async function getNomiReply(conversation: ChatTurn[], onText: (soFar: string) => void): Promise<string> {
  let reply = "";
  try {
    const res = await fetch("/api/nomi", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: conversation }),
    });
    // Errors (rate limit, bad input) come back as a friendly plain-text line too.
    if (!res.body) return (await res.text()) || fallback;
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      reply += decoder.decode(value, { stream: true });
      onText(reply);
    }
    return reply.trim() || fallback;
  } catch {
    return reply.trim() || fallback;
  }
}

const fallback = "Sorry, I couldn't reach my brain just now — try again in a moment?";
