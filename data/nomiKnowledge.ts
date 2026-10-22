// Facts about Joyce for Nomi (the site's chat cat) that the rest of the site
// doesn't say. Nomi already reads everything in projects.ts, caseStudies.ts,
// about.ts and archive.ts — only add what's NOT there. (Nomi's own cat facts
// live in nomiPersona.ts.)
//
// How to fill it in:
// - Write between the backticks ` ` in plain language, in your own words.
//   Multiple lines and bullet points are fine. Just don't type a backtick
//   inside your answer.
// - Leave a section empty to skip it — Nomi will use a cat excuse and point
//   people to your email instead of guessing.
// - Changes take effect as soon as you save. No retraining.

export const nomiKnowledge = {
  skillsAndTools: `
- Design: Figma is her main tool and she's used it for five years. Also
  design systems, prototyping from wireframes to high fidelity, Framer,
  Adobe Creative Suite, and Miro.
- User research: interviews, contextual inquiry, usability testing, surveys,
  and A/B testing.
- Frontend: has shipped Next.js frontends in React, TypeScript, and Tailwind,
  including Alio and Poopidex, both deployed on Vercel. Works with AI coding
  tools like Claude Code, Codex, Cursor, and Figma MCP to take her own
  designs to working code.
- AI: builds with LLM APIs (Anthropic, OpenAI, Gemini), writes system prompts
  and structured output schemas, has run Gemma 4 on device with Ollama, and
  has worked with RAG, LangChain, YOLO, CLIP fine-tuning, and Hugging Face.
- Python: ML experiments, computer vision, and robot interfaces (PyTorch,
  tkinter, Streamlit).
- Robotics: ROS2, OpenCV, LeRobot, TurtleBot, SO-101 arms, LiDAR and camera
  integration, Fusion 360 CAD, 3D printing, and laser cutting.
- Also: C++, SQL, HTML/CSS, and Git.
- Certifications: Google UX Design, Google Project Management, and Stanford
  Supervised Machine Learning.
`,
  // CHECK: add honest levels if you want, e.g. "comfortable" vs "basic"

  lookingFor: `
- Full-time new grad, early career, and junior roles.
- Role types: design engineer and design technologist first, plus product
  designer, AI product manager, AI engineering, robotics and ML, and
  creative technology.
- Especially interested in hardware-adjacent companies like robotics, AI,
  and medical devices.
- Location, in order of preference: Seattle/Bellevue, Bay Area, NYC, remote.
- Graduates from the University of Washington in March 2027.
`,
  // CHECK: start date. Right after graduation, or a specific month?

  workingStyle: `
- Starts from research. She talks to the people who'll actually use the
  thing before designing anything.
- Builds what she designs, so the gap between design and engineering is
  where she's most at home.
- Likes problems where the interface has to explain something complex,
  like an AI's output or a robot's behavior.
- Cares about trust in AI, like keeping a human reviewer in the loop
  before AI output reaches anyone.
`,
  // CHECK: rewrite in your own voice, especially how you work with
  // engineers and PMs.

  background: `
- Started in UX and product design, then moved into AI and robotics to
  understand what happens beneath the interface.
- Speaks English and Chinese.
`,

  funFacts: `
- Into cocktail culture, which is partly why she built Drunky, a robot
  bartender.
`,
  // CHECK: the Drunky link is my guess. Add hobbies you want shared.

  contact: `
- Email is the best way to reach her: joycez0317@gmail.com
- Also on LinkedIn: linkedin.com/in/joycez0317
`,

  qa: [
    { q: "Who is Joyce? / What does she do?", a: "Joyce Zhou is a design technologist who moves between research, interface, and code, across UX, AI, and robotics. She's finishing her MS in Technology Innovation (Robotics) at the University of Washington in March 2027." },
    { q: "Does she code?", a: "Yes. She designs in Figma and builds her own frontends in React, TypeScript, and Next.js, using AI coding tools to move fast. She's also written Python for ML and robotics projects." },
    { q: "Is she open to relocating?", a: "Yes. Seattle/Bellevue is her first choice, then the Bay Area, NYC, or remote." },
    { q: "Does she have robotics experience?", a: "Yes. Her master's at UW focuses on robotics, and she's built three robots: Drunky, a two-armed robot bartender; PELICAN, an autonomous trash-collecting robot; and an autonomous maze-solving robot." },
    // CHECK: drop the maze robot if it's not on your site
    { q: "What does she do on robotics projects?", a: "She works where the robot meets people and the real world: computer vision so the robot can find objects, navigation, physical design and fabrication, and the interfaces people use to operate the robot." },
    { q: "Does she work with hardware?", a: "Yes. She has designed robot bodies in Fusion 360, fabricated them with 3D printing and laser cutting, and wired cameras, LiDAR, and motors into ROS2, the software framework robots run on." },
    { q: "What robots has she built?", a: "Three: Drunky, a two-armed robot bartender; PELICAN, an autonomous trash-collecting robot; and an autonomous maze-solving robot. Her master's at UW focuses on robotics." },
    { q: "How does she take designs to code?", a: "She designs in Figma, then builds the frontend herself in React, TypeScript, and Next.js, using Figma MCP and Claude Code to move from design to working code. On Alio, she kept the AI-generated code true to her designs by writing her design tokens and component rules into the coding agent's instructions." },
    { q: "What has she shipped?", a: "Alio, an elder care app built for the Google Gemma 4 Good Hackathon, and Poopidex, a wildlife identification app, are both live on Vercel. She also designed and built this portfolio site, including me." },
  ] as { q: string; a: string }[],

  offLimits: [
    "Phone number",
    "Salary expectations",
    "Visa or work authorization details",
    "Never credit Joyce with a teammate's work, for example Aaron's ML work on Alio",
    "Anything about other candidates or companies she's applying to",
  ] as string[],
};
