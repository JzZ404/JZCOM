import HoverEffects from "./_components/HoverEffects";
import ScrollReveals from "./_components/ScrollReveals";
import TextEffects from "./_components/TextEffects";
import Carousels from "./_components/Carousels";
import Microinteractions from "./_components/Microinteractions";
import AmbientBackgrounds from "./_components/AmbientBackgrounds";
import LoadingStates from "./_components/LoadingStates";

export default function PlaygroundPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-16 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-sm text-[var(--color-muted)]">
        Temporary build page — not part of the site IA, will be deleted later. Reference any
        demo below by its name and it can get applied to the real site.
      </div>
      <h1 className="text-[length:var(--text-h1)] font-serif font-bold">Animation Playground</h1>
      <div className="mt-16 flex flex-col gap-20">
        <HoverEffects />
        <ScrollReveals />
        <TextEffects />
        <Carousels />
        <Microinteractions />
        <AmbientBackgrounds />
        <LoadingStates />
      </div>
    </div>
  );
}
