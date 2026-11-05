"use client";

import { useEffect, useRef } from "react";
import type { ExplodedCanvasSize, ExplodedPart } from "@/data/caseStudies";

// Geometry for the exploded view's parts, measured from their actual pixels
// (the images are transparent, and their boxes overlap a lot).

type AlphaMap = { width: number; height: number; data: Uint8ClampedArray };
export type AlphaMaps = Map<string, AlphaMap>;

// Each part image's pixels, loaded once per image
export function useAlphaMaps(items: ExplodedPart[]) {
  const maps = useRef<AlphaMaps>(new Map());
  useEffect(() => {
    for (const src of new Set(items.map((p) => p.src))) {
      if (maps.current.has(src)) continue;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
        maps.current.set(src, { width: canvas.width, height: canvas.height, data });
      };
      img.src = src;
    }
  }, [items]);
  return maps;
}

const SOLID = 40;
const solidAt = (map: AlphaMap, u: number, v: number) => map.data[(v * map.width + u) * 4 + 3] > SOLID;

// A part turns about its center (rotate, then flip, as in the CSS). These
// map between canvas units and the part's own unrotated box, centered on 0.
function frame(part: ExplodedPart, map: AlphaMap) {
  const h = (part.w * map.height) / map.width;
  const r = ((part.rotate ?? 0) * Math.PI) / 180;
  const cx = part.x + part.w / 2;
  const cy = part.y + h / 2;
  const flip = part.flip ? -1 : 1;
  return {
    h,
    toLocal: (px: number, py: number) => {
      const dx = px - cx;
      const dy = py - cy;
      return [(dx * Math.cos(r) + dy * Math.sin(r)) * flip, -dx * Math.sin(r) + dy * Math.cos(r)];
    },
    toCanvas: (lx: number, ly: number) => {
      const fx = lx * flip;
      return [cx + fx * Math.cos(r) - ly * Math.sin(r), cy + fx * Math.sin(r) + ly * Math.cos(r)];
    },
  };
}

// The front-most part with a solid pixel under a point (canvas units)
export function partAt(items: ExplodedPart[], maps: AlphaMaps, px: number, py: number) {
  for (let i = items.length - 1; i >= 0; i--) {
    const map = maps.get(items[i].src);
    if (!map) continue;
    const { h, toLocal } = frame(items[i], map);
    const [lx, ly] = toLocal(px, py);
    const u = Math.floor((lx / items[i].w + 0.5) * map.width);
    const v = Math.floor((ly / h + 0.5) * map.height);
    if (u >= 0 && v >= 0 && u < map.width && v < map.height && solidAt(map, u, v)) return i;
  }
  return null;
}

// The solid pixels' bounding box, in image pixels
function solidBox(map: AlphaMap) {
  let [x0, y0, x1, y1] = [map.width, map.height, 0, 0];
  for (let v = 0; v < map.height; v++)
    for (let u = 0; u < map.width; u++)
      if (solidAt(map, u, v)) {
        x0 = Math.min(x0, u);
        y0 = Math.min(y0, v);
        x1 = Math.max(x1, u + 1);
        y1 = Math.max(y1, v + 1);
      }
  return [x0, y0, x1, y1];
}

// Shifts every part so the drawing's outermost solid points (rotation
// included) sit `margin` in from the edges, and sizes the canvas to fit.
// Null until every image has loaded.
export function cropToParts(items: ExplodedPart[], maps: AlphaMaps, margin = 4) {
  let [minX, minY, maxX, maxY] = [Infinity, Infinity, -Infinity, -Infinity];
  for (const part of items) {
    const map = maps.get(part.src);
    if (!map) return null;
    const { h, toCanvas } = frame(part, map);
    const [x0, y0, x1, y1] = solidBox(map);
    for (const [u, v] of [[x0, y0], [x1, y0], [x0, y1], [x1, y1]]) {
      const [cx, cy] = toCanvas((u / map.width - 0.5) * part.w, (v / map.height - 0.5) * h);
      minX = Math.min(minX, cx);
      minY = Math.min(minY, cy);
      maxX = Math.max(maxX, cx);
      maxY = Math.max(maxY, cy);
    }
  }
  const round = (n: number) => Math.round(n * 10) / 10;
  const canvas: ExplodedCanvasSize = { w: Math.ceil(maxX - minX + 2 * margin), h: Math.ceil(maxY - minY + 2 * margin) };
  return {
    canvas,
    items: items.map((p) => ({ ...p, x: round(p.x - minX + margin), y: round(p.y - minY + margin) })),
  };
}
