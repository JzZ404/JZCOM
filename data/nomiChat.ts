// Words for Nomi's speech bubble and chat window. What Nomi knows and how he
// answers lives in app/api/nomi/ (plus data/nomiKnowledge.ts for facts).

export const nomiChat = {
  bubble: {
    awake: "Ask me anything",
    asleep: "zzz",
  },
  title: "Nomi",
  // PLACEHOLDER — confirm with Joyce
  greeting: "Hi, I'm Nomi! Ask me anything about Joyce — her projects, her skills, or how she works.",
  // Suggested questions. `question` is what gets asked (and shows as your
  // message); `short` is the label on the small pills above the input. The
  // first-screen "Try asking" chips show the full question.
  // The "Try asking" chips — Joyce's picks. Each has a matching answer in
  // nomiKnowledge.ts's qa list.
  examplePrompts: [
    { question: "Who is Joyce?", short: "About Joyce" },
    { question: "What has she shipped?", short: "Shipped work" },
    { question: "What robots has she built?", short: "Robots" },
    { question: "How does she take designs to code?", short: "Design to code" },
  ],
  // Extra pills shown above the input once the chat is going (after the
  // examplePrompts above, minus anything already asked). All have answers in
  // nomiKnowledge.ts.
  followUpPrompts: [
    { question: "Does she code?", short: "Coding" },
    { question: "Does she work with hardware?", short: "Hardware" },
    { question: "What roles is she looking for?", short: "Roles she wants" },
    { question: "Is she open to relocating?", short: "Relocation" },
    { question: "How do I contact her?", short: "Contact" },
  ],
  inputPlaceholder: "Ask about Joyce…",
};
