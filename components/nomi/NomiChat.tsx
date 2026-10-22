"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, MotionConfig, motion, useReducedMotion } from "framer-motion";
import { nomiChat } from "@/data/nomiChat";
import { getNomiReply } from "./nomiReply";
import RevealText from "./RevealText";
import TypingDots from "./TypingDots";

// A Nomi message goes: thinking (dots) -> streaming (words reveal as they
// arrive) -> revealing (stream done, words still catching up) -> done.
type Status = "thinking" | "streaming" | "revealing" | "done";
type Message = { id: number; from: "you" | "nomi"; text: string; chip?: string; status?: Status };

const AVATAR = "/images/cat-widget/nomi-avatar.png";
const SPRING = { type: "spring" as const, stiffness: 420, damping: 32 };
// Shared shape so a tapped suggestion chip morphs smoothly into your message.
const YOUR_RADIUS = "16px 16px 6px 16px";

// Nomi answers in plain text: drop any stray markdown bold markers (they'd
// show as literal asterisks), and turn his "- " list lines into "•" bullets.
const plain = (text: string) =>
  text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*\*/g, "")
    .replace(/^[ \t]*[-*•][ \t]+/gm, "• ");

// The chat card. Stays mounted so the conversation survives closing it and
// moving between pages — only the card itself animates in and out.
export default function NomiChat({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);
  const reduceMotion = !!useReducedMotion();

  const busy = messages.some((m) => m.status && m.status !== "done");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const scrollToEnd = useCallback(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });
  }, [reduceMotion]);
  useEffect(scrollToEnd, [messages.length, scrollToEnd]);

  const update = (id: number, patch: Partial<Message>) =>
    setMessages((all) => all.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  async function send(text: string, chip?: string) {
    const question = text.trim();
    if (!question || busy) return;
    setDraft("");
    const conversation = [
      ...messages.map((m) => ({ role: m.from === "you" ? ("user" as const) : ("assistant" as const), content: m.text })),
      { role: "user" as const, content: question },
    ];
    const replyId = nextId.current + 1;
    setMessages((all) => [
      ...all,
      { id: nextId.current, from: "you", text: question, chip },
      { id: replyId, from: "nomi", text: "", status: "thinking" },
    ]);
    nextId.current += 2;
    const reply = await getNomiReply(conversation, (soFar) => update(replyId, { text: soFar, status: "streaming" }));
    update(replyId, { text: reply, status: "revealing" });
  }

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && (
          <motion.section
            key="nomi-chat"
            role="dialog"
            aria-labelledby="nomi-chat-title"
            // Grows out of the corner where Nomi / his bubble are.
            className="fixed inset-x-3 bottom-3 z-[95] flex h-[75vh] origin-bottom-right flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-[0_18px_50px_rgba(43,58,26,0.22)] sm:inset-x-auto sm:right-4 sm:bottom-[124px] sm:h-[min(520px,calc(100vh-164px))] sm:w-[360px]"
            initial={{ opacity: 0, scale: 0.6, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 30, transition: { duration: 0.18, ease: "easeIn" } }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            onAnimationComplete={() => inputRef.current?.focus()}
          >
            {/* Header */}
            <header className="flex items-center gap-3 bg-[var(--color-primary-light)] px-4 py-3">
              <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-[var(--color-primary)] bg-[var(--color-bg)]">
                <img src={AVATAR} alt="" className="h-full w-full" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id="nomi-chat-title" className="truncate text-[16px] leading-tight font-semibold text-[var(--color-primary-dark)]">
                  {nomiChat.title}
                </h2>
                {/* "typing…" under his name only while he answers */}
                <AnimatePresence initial={false}>
                  {busy && (
                    <motion.p
                      key="typing"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-[12px] text-[var(--color-primary-dark)]/75"
                    >
                      typing…
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close chat"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-primary-dark)] transition-colors hover:bg-[var(--color-bg)]"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </header>

            {/* Conversation. flex column so the empty-state prompts can take
                mt-auto and sit at the bottom, right above the input. */}
            <LayoutGroup>
              <div ref={listRef} className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4" aria-live="polite">
                <NomiRow>{nomiChat.greeting}</NomiRow>

                <AnimatePresence>
                  {messages.length === 0 && (
                    <motion.div
                      key="prompts"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                      className="mt-auto"
                    >
                      <p className="mb-2 text-[12px] font-semibold tracking-wide text-[var(--color-primary-dark)] uppercase">Try asking</p>
                      <div className="flex flex-col items-start gap-2">
                        {nomiChat.examplePrompts.map(({ question: prompt }, i) => (
                          <motion.button
                            key={prompt}
                            layoutId={`chip-${prompt}`}
                            type="button"
                            onClick={() => send(prompt, prompt)}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0, transition: { delay: 0.2 + i * 0.06 } }}
                            whileHover={{ x: 3 }}
                            whileTap={{ scale: 0.96 }}
                            style={{ borderRadius: 16 }}
                            className="border border-[var(--color-primary)] bg-[var(--color-bg)] px-3.5 py-1.5 text-left text-[13px] text-[var(--color-primary-dark)] transition-colors hover:bg-[var(--color-primary-light)]"
                          >
                            {prompt}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {messages.map((m) =>
                  m.from === "you" ? (
                    <YourRow key={m.id} chip={m.chip}>
                      {m.text}
                    </YourRow>
                  ) : (
                    <NomiRow key={m.id} wide={m.status !== "thinking"}>
                      {m.status === "thinking" ? (
                        <TypingDots />
                      ) : (
                        <RevealText
                          text={plain(m.text)}
                          streaming={m.status === "streaming"}
                          // Only animate replies that arrive while you watch —
                          // already-finished ones show instantly on reopen.
                          animate={!reduceMotion && m.status !== "done"}
                          onProgress={scrollToEnd}
                          onDone={() => update(m.id, { status: "done" })}
                        />
                      )}
                    </NomiRow>
                  ),
                )}
              </div>

              {/* Once the chat is going, small suggestion pills ride above the input. */}
              <AnimatePresence>
                {messages.length > 0 && (
                  <SuggestionPills
                    asked={messages.filter((m) => m.from === "you").map((m) => m.text)}
                    disabled={busy}
                    onPick={(prompt) => send(prompt, prompt)}
                  />
                )}
              </AnimatePresence>
            </LayoutGroup>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(draft);
              }}
              className="flex items-center gap-2 border-t border-[var(--color-border)] bg-[var(--color-card)] px-3 py-3"
            >
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={nomiChat.inputPlaceholder}
                maxLength={600}
                aria-label="Your question"
                className="min-w-0 flex-1 rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 text-[14px] text-[var(--color-fg)] transition-colors outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
              />
              <motion.button
                type="submit"
                disabled={!draft.trim() || busy}
                aria-label="Send"
                animate={{ scale: draft.trim() && !busy ? 1 : 0.9 }}
                whileHover={draft.trim() && !busy ? { scale: 1.08 } : undefined}
                whileTap={{ scale: 0.88, x: 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] transition-opacity disabled:opacity-35"
              >
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </motion.button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}

// A sideways-scrolling row of small pills with short labels ("Robots"), each
// asking its full question: the main suggestions plus a few follow-ups, minus
// anything already asked. A tapped pill glides into
// place as your message (shared layoutId), same as the big chips.
function SuggestionPills({ asked, disabled, onPick }: { asked: string[]; disabled: boolean; onPick: (prompt: string) => void }) {
  const remaining = [...nomiChat.examplePrompts, ...nomiChat.followUpPrompts].filter((p) => !asked.includes(p.question));
  const rowRef = useRef<HTMLDivElement>(null);
  // After a pill is used up, slide back to the start — otherwise the row can
  // be left scrolled past its (now shorter) end, showing one clipped pill.
  useEffect(() => {
    rowRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [remaining.length]);
  if (remaining.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: disabled ? 0.45 : 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className={disabled ? "pointer-events-none" : ""}
      aria-label="Suggested questions"
    >
      {/* faded edges hint that the row scrolls sideways */}
      <div
        ref={rowRef}
        className="no-scrollbar flex gap-1.5 overflow-x-auto px-3 pt-1 pb-2"
        style={{
          maskImage: "linear-gradient(to right, transparent 0, black 12px, black calc(100% - 24px), transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0, black 12px, black calc(100% - 24px), transparent 100%)",
        }}
      >
        <AnimatePresence initial={false}>
          {remaining.map(({ question, short }) => (
            <motion.button
              key={question}
              layoutId={`chip-${question}`}
              type="button"
              onClick={() => onPick(question)}
              title={question}
              disabled={disabled}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.94 }}
              transition={SPRING}
              style={{ borderRadius: 16 }}
              className="shrink-0 border border-[var(--color-primary)] bg-[var(--color-bg)] px-2.5 py-1 text-[12px] whitespace-nowrap text-[var(--color-primary-dark)] transition-colors hover:bg-[var(--color-primary-light)]"
            >
              {short}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Your message: slides in from the right — or, if you tapped a suggestion,
// that chip glides into this spot (shared layoutId) instead.
function YourRow({ chip, children }: { chip?: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={chip ? false : { opacity: 0, x: 16, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={SPRING}
      className="flex justify-end"
    >
      <motion.div
        layoutId={chip ? `chip-${chip}` : undefined}
        transition={SPRING}
        style={{ borderRadius: YOUR_RADIUS }}
        className="max-w-[85%] bg-[var(--color-primary)] px-3.5 py-2 text-[14px] leading-snug text-[var(--color-on-primary)]"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// Nomi's message: his avatar plus a bubble that slides in from the left. No
// layout (resize) animation: RevealText starts empty and adds words one at a
// time, so the bubble already grows smoothly on its own — a layout animation
// on top of that briefly drew the text outside the still-small bubble.
function NomiRow({ wide = true, children }: { wide?: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={SPRING}
      className="flex items-end gap-2"
    >
      <img src={AVATAR} alt="" className="h-6 w-6 shrink-0 rounded-full border border-[var(--color-primary)] bg-[var(--color-bg)]" />
      <div
        style={{ borderRadius: "16px 16px 16px 6px" }}
        className={`${wide ? "max-w-[85%]" : ""} bg-[var(--color-primary-light)] px-3.5 py-2 text-[14px] leading-snug text-[var(--color-fg)]`}
      >
        {children}
      </div>
    </motion.div>
  );
}
