// Used by export-portfolio-pdf.mjs. Lays the PDF portfolio out on fixed pages, filling each from top to bottom
// with no blank stretches. Runs in the page, after every reveal has played.
// Plan first (measure only), then move the blocks into page boxes.
(({ pageHeight, pad }) => {
  // A little slack keeps the bottom margin even with rounding
  const usable = pageHeight - 2 * pad - 12;
  const root = document.querySelector("[data-pdf-root]");

  // Mostly picture: photos, video, and big drawings cover over 40% of it
  // (small icons don't count). These can shrink further than text.
  const isMedia = (el) => {
    if (el.matches("img, video, canvas")) return true;
    const r = el.getBoundingClientRect();
    const area = [...el.querySelectorAll("img, video, canvas, svg")]
      .map((m) => m.getBoundingClientRect())
      .filter((m) => m.width * m.height > 150 * 150)
      .reduce((sum, m) => sum + m.width * m.height, 0);
    return area > 0.4 * r.width * r.height;
  };
  // A block can be taken apart into its children when they stack vertically
  const stacksVertically = (el) => {
    if (el.children.length < 2 || el.matches("img, video, svg, table, figure, [data-section-head]")) return false;
    const cs = getComputedStyle(el);
    if (cs.display === "block") return true;
    if (cs.display === "flex") return cs.flexDirection === "column";
    if (cs.display === "grid") return cs.gridTemplateColumns.split(" ").length === 1;
    return false;
  };
  const measure = (el, gap = 0) => {
    const r = el.getBoundingClientRect();
    const box = el.closest(".pdf-project").getBoundingClientRect();
    return { el, h: r.height, w: r.width, top: r.top, bottom: r.bottom, left: r.left - box.left, right: box.right - r.right, gap };
  };
  // Children as blocks, each remembering the space above it in the layout
  const childrenOf = (el) => {
    const kids = [...el.children].filter((c) => c.getBoundingClientRect().height > 0).map((c) => measure(c));
    kids.forEach((k, i) => (k.gap = i ? Math.max(0, Math.min(64, k.top - kids[i - 1].bottom)) : 0));
    return kids;
  };

  // A section's rows: its blocks after the heading, or, when those are one
  // vertical stack, that stack's children (e.g. the demo's features)
  const rowsOf = (section) => {
    const kids = childrenOf(section).filter((k) => !k.el.matches("[data-section-head]"));
    return kids.length === 1 && stacksVertically(kids[0].el) ? childrenOf(kids[0].el) : kids;
  };

  // A fixed page plan (data/portfolioPdf.ts): each page gets exactly the
  // sections it lists, scaled down as a whole if they run long
  const planned = (column, groups) => {
    const sections = new Map(
      [...column.children].filter((c) => c.matches("[data-case-study-section]")).map((c) => [c.id, c]),
    );
    const intro = [...column.children].filter(
      (c) => !c.matches("[data-case-study-section]") && c.getBoundingClientRect().height > 0,
    );
    return groups.map((ids) => {
      const blocks = [];
      for (const id of ids) {
        const [sid, row] = id.split("#");
        let found;
        if (sid === "overview") found = intro.map((el) => measure(el));
        else {
          const section = sections.get(sid);
          if (!section) { console.warn("no section", sid); continue; }
          const head = [...section.children].find((c) => c.matches("[data-section-head]"));
          if (row) {
            // "2.1" is the first row inside the section's second row, and so
            // on down; the heading comes with the very first row
            const path = row.split(".").map(Number);
            let block = { el: section };
            for (const n of path) block = block && rowsOf(block.el)[n - 1];
            const first = path.every((n) => n === 1);
            found = [...(first && head ? [measure(head)] : []), block].filter(Boolean);
          } else found = childrenOf(section);
        }
        found.forEach((b, i) => (b.gap = i === 0 ? (blocks.length ? 40 : 0) : Math.min(64, b.gap)));
        blocks.push(...found);
      }
      const natural = blocks.reduce((sum, b) => sum + b.gap + b.h, 0);
      return { items: blocks.map((b) => ({ ...b, zoom: 1 })), natural, scale: Math.min(1, usable / natural) };
    });
  };

  const plan = [];
  // Each page links back to its case study on the site
  const tag = (from, url) => plan.slice(from).forEach((p) => p !== "project-end" && (p.url = url));
  for (const project of root.querySelectorAll(".pdf-project")) {
    // The shell's content column: overview, hero, then the sections
    const column = project.querySelector("#overview").parentElement;
    const from = plan.length;
    if (project.dataset.pdfPages) {
      plan.push(...planned(column, JSON.parse(project.dataset.pdfPages)), "project-end");
      tag(from, project.dataset.pdfUrl);
      continue;
    }
    let queue = [];
    for (const child of column.children) {
      if (child.getBoundingClientRect().height === 0) continue;
      if (child.matches("[data-case-study-section]")) {
        const kids = childrenOf(child);
        kids[0].gap = 48;
        if (kids[0].el.matches("[data-section-head]")) kids[0].head = true;
        queue.push(...kids);
      } else queue.push(measure(child, 0));
    }

    // Each page holds blocks at their natural height (`natural`, with any
    // block-only shrink in item.zoom) plus one `scale` for the whole page,
    // never below MIN_SCALE, so text never gets smaller than that
    const MIN_SCALE = 0.85;
    let page = { items: [], natural: 0, scale: 1 };
    const newPage = () => { if (page.items.length) plan.push(page); page = { items: [], natural: 0, scale: 1 }; };
    const add = (b, gap, zoom = 1) => {
      page.items.push({ ...b, gap, zoom });
      page.natural += gap + b.h * zoom;
      page.scale = Math.min(1, usable / page.natural);
    };
    const fitsWith = (extra) => (page.natural + extra) * MIN_SCALE <= usable;
    while (queue.length) {
      const b = queue.shift();
      const gap = page.items.length ? b.gap : 0;
      // A section heading stays with what follows it: the whole next block,
      // or its first row when that block can be taken apart
      if (b.head && page.items.length) {
        let next = queue[0];
        while (next && !fitsWith(gap + b.h + next.gap + next.h) && stacksVertically(next.el) && next.h > usable * 0.3) {
          next = childrenOf(next.el)[0];
        }
        if (!fitsWith(gap + b.h + (next ? next.gap + next.h : 0))) { newPage(); queue.unshift(b); continue; }
      }
      // Fits as is, or with the page tightened a little
      if (fitsWith(gap + b.h)) { add(b, gap); continue; }
      // Too big for what's left: take it apart if it's a stack of rows
      if (stacksVertically(b.el) && b.h > usable * 0.3) {
        const kids = childrenOf(b.el);
        kids[0].gap = b.gap;
        queue.unshift(...kids);
        continue;
      }
      // A mostly-picture block can shrink on its own to fill what's left
      if (page.items.length && isMedia(b.el)) {
        const room = usable / page.scale - page.natural - gap;
        if (room / b.h >= 0.65) { add(b, gap, room / b.h); continue; }
      }
      // Otherwise it starts the next page (shrunk to fit if taller than one)
      if (page.items.length) { newPage(); queue.unshift(b); continue; }
      add(b, 0, Math.min(1, usable / b.h));
    }
    newPage();
    // A nearly empty last page: tighten the page before it to take it in
    const last = plan[plan.length - 1];
    const prev = plan[plan.length - 2];
    if (prev && prev !== "project-end" && last.natural < usable * 0.3) {
      const natural = prev.natural + 24 + last.natural;
      if (natural * MIN_SCALE <= usable) {
        last.items[0].gap = 24;
        prev.items.push(...last.items);
        prev.natural = natural;
        prev.scale = Math.min(1, usable / natural);
        plan.pop();
      }
    }
    plan.push("project-end");
    tag(from, project.dataset.pdfUrl);
  }

  // Build the pages and move each block into place, keeping its original
  // horizontal position
  const pages = document.createElement("div");
  for (const p of plan) {
    if (p === "project-end") continue;
    const box = document.createElement("div");
    box.className = "pdf-page";
    // A cover page takes the whole page, edge to edge
    const bleed = p.items.length === 1 && p.items[0].el.matches("[data-pdf-bleed]");
    if (bleed) {
      Object.assign(box.style, { height: `${pageHeight}px`, overflow: "hidden", breakAfter: "page" });
      p.items[0].el.style.height = `${pageHeight}px`;
      p.items[0].el.style.marginTop = "0";
      box.appendChild(p.items[0].el);
      pages.appendChild(box);
      continue;
    }
    Object.assign(box.style, {
      height: `${pageHeight}px`, boxSizing: "border-box", padding: `${pad}px 0`,
      overflow: "hidden", breakAfter: "page", background: "var(--color-bg)",
      display: "flex", flexDirection: "column",
      // A page that couldn't be filled sits centered, like a slide, rather
      // than ending in a blank stretch
      justifyContent: p.natural * p.scale < usable * 0.8 ? "center" : "flex-start",
    });
    for (const item of p.items) {
      const zoom = item.zoom * p.scale;
      // The spacing above each block is already in item.gap, so its own
      // margins would only push the page past its bottom edge
      item.el.style.marginTop = "0";
      item.el.style.marginBottom = "0";
      const wrap = document.createElement("div");
      Object.assign(wrap.style, {
        marginTop: `${item.gap * p.scale}px`, paddingLeft: `${item.left}px`, paddingRight: `${item.right}px`,
      });
      if (zoom < 1) {
        // Shrunk blocks keep their own width (scaled) and sit centered
        const inner = document.createElement("div");
        Object.assign(inner.style, { zoom, width: `${item.w}px`, display: "flow-root" });
        Object.assign(wrap.style, { display: "flex", justifyContent: "center" });
        inner.appendChild(item.el);
        wrap.appendChild(inner);
      } else wrap.appendChild(item.el);
      box.appendChild(wrap);
    }
    // "View on website" in the bottom-right corner, in the page's margin
    if (p.url) {
      box.style.position = "relative";
      const link = document.createElement("a");
      link.href = p.url;
      link.textContent = "View on website ↗";
      Object.assign(link.style, {
        position: "absolute", right: "40px", bottom: "9px", fontSize: "12px", fontWeight: "600",
        color: "var(--color-primary)", textDecoration: "none",
      });
      box.appendChild(link);
    }
    pages.appendChild(box);
  }
  pages.lastElementChild && (pages.lastElementChild.style.breakAfter = "auto");
  root.replaceChildren(pages);
  const name = (el) => (el.id ? "#" + el.id : "") + (el.className && typeof el.className === "string" ? "." + el.className.split(" ").slice(0, 2).join(".") : el.tagName);
  return plan.filter((p) => p !== "project-end").map((p) => ({
    used: Math.round(p.natural * p.scale),
    items: p.items.map((i) => `${name(i.el).slice(0, 40)} h${Math.round(i.h)} z${Math.round(i.zoom * p.scale * 100)}`),
  }));
})
