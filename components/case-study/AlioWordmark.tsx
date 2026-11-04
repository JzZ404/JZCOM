import { Jost } from "next/font/google";

// The Alio logo, rebuilt as type rather than cut out of the cover photo (it
// only appears there, over an image): lowercase "alio" in a geometric sans
// (Jost — close to the original wordmark's face) with a coral dot for the
// period. Colors sampled from public/images/alio/cover.png.
const jost = Jost({ subsets: ["latin"], weight: ["500"], display: "swap" });
const NAVY = "#1C2480";
const CORAL = "#F45C68";

export default function AlioWordmark({ className = "" }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Alio"
      className={`${jost.className} inline-flex items-baseline leading-none font-medium tracking-[-0.01em] ${className}`}
      style={{ color: NAVY }}
    >
      alio
      <span aria-hidden className="ml-[0.05em] inline-block h-[0.19em] w-[0.19em] rounded-full" style={{ background: CORAL }} />
    </span>
  );
}
