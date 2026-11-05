"use client";

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Copy, Trash2 } from "lucide-react";
import type { ExplodedCanvasSize, ExplodedPart } from "@/data/caseStudies";
import ExplodedCanvas from "./ExplodedCanvas";
import { cropToParts, useAlphaMaps } from "./explodedGeometry";
import ExplodedPartsViewer from "./ExplodedPartsViewer";

// Dev-only layout editor for the exploded view: pick a part (click it or its
// layer), drag it or set it with the sliders, reorder layers, then Save,
// which crops the canvas to the drawing and writes both back to
// data/caseStudies.ts.
export default function ExplodedViewEditor({
  initialCanvas,
  initial,
}: {
  initialCanvas: ExplodedCanvasSize;
  initial: ExplodedPart[];
}) {
  const [editing, setEditing] = useState(false);
  const [canvas, setCanvas] = useState(initialCanvas);
  const [items, setItems] = useState(initial);
  const maps = useAlphaMaps(items);
  const [selected, setSelected] = useState(0);
  const [status, setStatus] = useState<"clean" | "dirty" | "saving" | "saved" | "error">("clean");
  const canvasRef = useRef<HTMLDivElement>(null);
  const part = items[selected];

  const update = (index: number, change: Partial<ExplodedPart>) => {
    setItems((all) => all.map((p, i) => (i === index ? { ...p, ...change } : p)));
    setStatus("dirty");
  };

  // Moves the selected part toward the front (+1) or back (-1) of the stack
  const moveLayer = (by: 1 | -1) => {
    const to = selected + by;
    if (to < 0 || to >= items.length) return;
    setItems((all) => {
      const next = [...all];
      [next[selected], next[to]] = [next[to], next[selected]];
      return next;
    });
    setSelected(to);
    setStatus("dirty");
  };

  const duplicate = () => {
    setItems((all) => [...all.slice(0, selected + 1), { ...all[selected], x: all[selected].x + 20, y: all[selected].y + 20 }, ...all.slice(selected + 1)]);
    setSelected(selected + 1);
    setStatus("dirty");
  };

  const remove = () => {
    if (items.length === 1) return;
    setItems((all) => all.filter((_, i) => i !== selected));
    setSelected(Math.max(0, selected - 1));
    setStatus("dirty");
  };

  // Dragging: the pointer's movement on screen, converted to canvas units
  const startDrag = (index: number, event: PointerEvent<HTMLImageElement>) => {
    event.preventDefault();
    setSelected(index);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const scale = canvas.w / rect.width;
    const start = { px: event.clientX, py: event.clientY, x: items[index].x, y: items[index].y };
    const move = (e: globalThis.PointerEvent) =>
      update(index, {
        x: Math.round(start.x + (e.clientX - start.px) * scale),
        y: Math.round(start.y + (e.clientY - start.py) * scale),
      });
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  };

  // Arrow keys nudge the selected part 1 unit (10 with Shift), unless
  // you're typing in one of the panel's fields
  useEffect(() => {
    if (!editing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement && e.target.type !== "range") return;
      const step = e.shiftKey ? 10 : 1;
      const delta = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
      if (!delta) return;
      e.preventDefault();
      setItems((all) => all.map((p, i) => (i === selected ? { ...p, x: p.x + delta[0], y: p.y + delta[1] } : p)));
      setStatus("dirty");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editing, selected]);

  const save = async () => {
    const cropped = cropToParts(items, maps.current);
    if (!cropped) return setStatus("error");
    setStatus("saving");
    setCanvas(cropped.canvas);
    setItems(cropped.items);
    const response = await fetch("/api/dev/exploded-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cropped),
    }).catch(() => null);
    setStatus(response?.ok ? "saved" : "error");
  };

  const reset = () => {
    setCanvas(initialCanvas);
    setItems(initial);
    setSelected(0);
    setStatus("clean");
  };

  return (
    <div>
      {/* Closed, it's the page as visitors see it (with unsaved changes) */}
      {editing ? (
        <div ref={canvasRef} className="mx-auto" style={{ maxWidth: canvas.w }}>
          <ExplodedCanvas canvas={canvas} items={items} selected={selected} onPartPointerDown={startDrag} />
        </div>
      ) : (
        <ExplodedPartsViewer canvas={canvas} items={items} />
      )}

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => setEditing(!editing)}
          className="rounded-full border border-dashed border-[var(--color-primary)] px-3 py-1 font-mono text-[12px] text-[var(--color-primary)]"
        >
          {editing ? "Close layout editor" : "Edit layout (dev only)"}
        </button>
      </div>

      {editing && part && (
        <div className="mt-3 grid grid-cols-1 gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-[13px] text-[var(--color-fg)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          {/* Layers, front-most first (the data draws later parts on top) */}
          <div>
            <div className="mb-2 font-semibold">Layers</div>
            <ol className="max-h-80 overflow-y-auto rounded-lg border border-[var(--color-border)]">
              {items
                .map((p, i) => ({ p, i }))
                .reverse()
                .map(({ p, i }) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => setSelected(i)}
                      className={`flex w-full items-center gap-2 px-2.5 py-1.5 text-left ${
                        i === selected ? "bg-[var(--color-primary)] text-white" : "hover:bg-[var(--color-surface)]"
                      }`}
                    >
                      <img src={p.src} alt="" className="h-6 w-6 object-contain" />
                      <span className="truncate">{p.name}</span>
                      <span className="ml-auto font-mono text-[11px] opacity-70">{i + 1}</span>
                    </button>
                  </li>
                ))}
            </ol>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{part.name}</span>
              <div className="ml-auto flex gap-1">
                <IconButton label="Bring forward" onClick={() => moveLayer(1)} disabled={selected === items.length - 1}>
                  <ChevronUp className="h-4 w-4" />
                </IconButton>
                <IconButton label="Send backward" onClick={() => moveLayer(-1)} disabled={selected === 0}>
                  <ChevronDown className="h-4 w-4" />
                </IconButton>
                <IconButton label="Duplicate" onClick={duplicate}>
                  <Copy className="h-4 w-4" />
                </IconButton>
                <IconButton label="Delete" onClick={remove} disabled={items.length === 1}>
                  <Trash2 className="h-4 w-4" />
                </IconButton>
              </div>
            </div>

            <Slider label="X" value={part.x} min={-100} max={canvas.w + 100} onChange={(x) => update(selected, { x })} />
            <Slider label="Y" value={part.y} min={-100} max={canvas.h + 100} onChange={(y) => update(selected, { y })} />
            <Slider label="Width" value={part.w} min={10} max={400} onChange={(w) => update(selected, { w })} />
            <Slider label="Rotate" value={part.rotate ?? 0} min={-180} max={180} onChange={(rotate) => update(selected, { rotate })} />
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={part.flip ?? false} onChange={(e) => update(selected, { flip: e.target.checked })} />
              Flip horizontally
            </label>

            <div className="mt-1 flex items-center gap-2 border-t border-[var(--color-border)] pt-3">
              <span className="text-[12px] text-[var(--color-muted)]">
                {{
                  clean: "Drag parts or use the sliders. Arrow keys nudge (Shift for 10).",
                  dirty: "Unsaved changes",
                  saving: "Saving…",
                  saved: "Saved and cropped to fit, in data/caseStudies.ts",
                  error: "Couldn't save. Wait for the parts to load, and check the dev server is running.",
                }[status]}
              </span>
              <button
                type="button"
                onClick={reset}
                disabled={status === "clean"}
                className="ml-auto rounded-full border border-[var(--color-border)] px-3 py-1.5 disabled:opacity-40"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={save}
                disabled={status === "saving"}
                className="rounded-full bg-[var(--color-primary)] px-4 py-1.5 font-semibold whitespace-nowrap text-white disabled:opacity-60"
              >
                Save layout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid grid-cols-[3.5rem_1fr_4.5rem] items-center gap-3">
      <span>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-[var(--color-primary)]"
      />
      <input
        type="number"
        value={value}
        onChange={(e) => e.target.value !== "" && onChange(Number(e.target.value))}
        className="w-full rounded-md border border-[var(--color-border)] bg-transparent px-2 py-1 font-mono tabular-nums"
      />
    </label>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="rounded-md border border-[var(--color-border)] p-1.5 hover:bg-[var(--color-surface)] disabled:opacity-30"
    >
      {children}
    </button>
  );
}
