import React, { useEffect, useMemo, useRef, useState } from 'react';
import { RotateCcw, Pause, Play, Maximize2, Minimize2, ZoomIn, ZoomOut } from 'lucide-react';
import { HudMetric, IsoEdge, IsoNode, NodeColor, NodeIcon, PacketKind, StageScene } from '../types/course';

interface IsoStageProps {
  hud: HudMetric[];
  scene: StageScene;
  theme: 'light' | 'dark';
  isPaused: boolean;
  onTogglePause: () => void;
  replayNonce: number;
  onReplay: () => void;
  lang: 'zh' | 'en';
}

interface Palette {
  top: string;
  left: string;
  right: string;
  text: string;
}

const LIGHT_PALETTES: Record<NodeColor, Palette> = {
  blue: { top: '#c4daf4', left: '#9fc0e8', right: '#84addd', text: '#16283d' },
  green: { top: '#d2e7b8', left: '#b5d592', right: '#9bc273', text: '#1b3014' },
  amber: { top: '#fce2b6', left: '#f2ca88', right: '#e2b368', text: '#3d2809' },
  violet: { top: '#e4d7f5', left: '#cbb7e8', right: '#b39bd8', text: '#2a1a42' },
  rose: { top: '#f7d2de', left: '#eab2c4', right: '#da95ac', text: '#421625' },
  teal: { top: '#c3e7e2', left: '#9cd2cb', right: '#7ebdb5', text: '#123632' },
  sand: { top: '#efe5d6', left: '#dfd2be', right: '#cbbca5', text: '#2a251e' },
  slate: { top: '#d7d4ce', left: '#bfbbb3', right: '#a8a39a', text: '#2e2b27' },
  red: { top: '#f9cfc8', left: '#eeaba0', right: '#df8c7f', text: '#4c1712' }
};

const DARK_PALETTES: Record<NodeColor, Palette> = {
  blue: { top: '#334c69', left: '#283c54', right: '#1f3044', text: '#e7f0fb' },
  green: { top: '#3f542c', left: '#324322', right: '#27351a', text: '#e5f4d3' },
  amber: { top: '#664c29', left: '#523c20', right: '#402f18', text: '#fbe8c7' },
  violet: { top: '#4f3a6b', left: '#3f2e56', right: '#312344', text: '#eee3fc' },
  rose: { top: '#633444', left: '#4f2936', right: '#3e1f2a', text: '#fbe0e8' },
  teal: { top: '#2b534f', left: '#21423f', right: '#193330', text: '#d8f4f0' },
  sand: { top: '#443d34', left: '#363029', right: '#2b2620', text: '#efe6d6' },
  slate: { top: '#3d3934', left: '#302d29', right: '#25231f', text: '#cbc3b8' },
  red: { top: '#68312c', left: '#542622', right: '#421d1a', text: '#fde0dc' }
};

const PACKET_COLORS: Record<Exclude<PacketKind, 'none'>, string> = {
  input: '#f0944d',
  predict: '#a87ee6',
  rpc: '#5b9ee0',
  rep: '#6bc465',
  ge: '#e8b339',
  cue: '#e57399',
  error: '#e5534b'
};

function projectIso(col: number, row: number): { x: number; y: number } {
  const cx = 425;
  const cy = 268;
  return {
    x: cx + (col - row) * 76,
    y: cy + (col + row) * 41
  };
}

interface RectBox {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

function estimateTextWidth(text: string, fontSize: number): number {
  let width = 0;
  for (const ch of text) {
    if (/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/u.test(ch)) {
      width += fontSize * 1.32;
    } else if (/[\u2E80-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF]/.test(ch)) {
      width += fontSize * 1.06;
    } else if (' .,;:!|/-()\'il1'.includes(ch)) {
      width += fontSize * 0.45;
    } else {
      width += fontSize * 0.64;
    }
  }
  return width;
}

function overlapArea(a: RectBox, b: RectBox, pad = 2): number {
  const ox = Math.max(0, Math.min(a.right + pad, b.right + pad) - Math.max(a.left - pad, b.left - pad));
  const oy = Math.max(0, Math.min(a.bottom + pad, b.bottom + pad) - Math.max(a.top - pad, b.top - pad));
  return ox * oy;
}

function outOfBoundsPenalty(b: RectBox): number {
  const minX = 8;
  const maxX = 842;
  const minY = 50;
  const maxY = 496;
  let penalty = 0;
  if (b.left < minX) penalty += (minX - b.left) * 20;
  if (b.right > maxX) penalty += (b.right - maxX) * 20;
  if (b.top < minY) penalty += (minY - b.top) * 20;
  if (b.bottom > maxY) penalty += (b.bottom - maxY) * 20;
  return penalty;
}

function renderNodeIcon(icon: NodeIcon, stroke: string) {
  switch (icon) {
    case 'server':
      return (
        <g stroke={stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x="-11" y="-11" width="22" height="7" rx="2" />
          <rect x="-11" y="-1" width="22" height="7" rx="2" />
          <circle cx="-6.5" cy="-7.5" r="0.9" fill={stroke} />
          <circle cx="-6.5" cy="2.5" r="0.9" fill={stroke} />
          <line x1="2" y1="-7.5" x2="7" y2="-7.5" />
          <line x1="2" y1="2.5" x2="7" y2="2.5" />
        </g>
      );
    case 'client':
      return (
        <g stroke={stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x="-11" y="-10" width="22" height="14" rx="2" />
          <line x1="-5" y1="7" x2="5" y2="7" />
          <line x1="0" y1="4" x2="0" y2="7" />
        </g>
      );
    case 'pawn':
      return (
        <g stroke={stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="0" cy="-7" r="4" />
          <path d="M-8 6 C-8 0, 8 0, 8 6 Z" />
        </g>
      );
    case 'playerstate':
      return (
        <g stroke={stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x="-10" y="-9" width="20" height="16" rx="2.5" />
          <circle cx="-4" cy="-2" r="2.2" />
          <line x1="1" y1="-3" x2="6" y2="-3" />
          <line x1="1" y1="1" x2="6" y2="1" />
        </g>
      );
    case 'asc':
      return (
        <g stroke={stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="0,-11 10,-5.5 10,5.5 0,11 -10,5.5 -10,-5.5" />
          <circle cx="0" cy="0" r="3.5" />
        </g>
      );
    case 'attr':
      return (
        <g stroke={stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="0" cy="-7" rx="9" ry="3.5" />
          <path d="M-9 -7 V5 C-9 7, 9 7, 9 5 V-7" />
          <path d="M-9 -1 C-9 1, 9 1, 9 -1" />
        </g>
      );
    case 'ge':
      return (
        <g stroke={stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 -11 L-7 0 H0 L-2 9 L8 -2 H1 Z" />
        </g>
      );
    case 'ga':
      return (
        <g stroke={stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="0,-10 3,-3 10,-3 4.5,1.5 6.5,8.5 0,4.5 -6.5,8.5 -4.5,1.5 -10,-3 -3,-3" />
        </g>
      );
    case 'tag':
      return (
        <g stroke={stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M-9 -8 H0 L9 1 L1 9 L-9 0 Z" />
          <circle cx="-4.5" cy="-3.5" r="1.3" fill={stroke} />
        </g>
      );
    case 'cue':
      return (
        <g stroke={stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M0 -10 L2.2 -2.2 L10 0 L2.2 2.2 L0 10 L-2.2 2.2 L-10 0 L-2.2 -2.2 Z" />
        </g>
      );
    case 'task':
      return (
        <g stroke={stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="0" cy="0" r="9" />
          <polyline points="0,-5 0,0 4,2.5" />
        </g>
      );
    case 'shield':
      return (
        <g stroke={stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M0 -10 L9 -6 V0 C9 5.5, 0 9.5, 0 9.5 C0 9.5, -9 5.5, -9 0 V-6 Z" />
        </g>
      );
    case 'sword':
      return (
        <g stroke={stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <line x1="-8" y1="8" x2="8" y2="-8" />
          <polyline points="2,-8 8,-8 8,-2" />
          <line x1="-6" y1="2" x2="-2" y2="6" />
        </g>
      );
    case 'users':
      return (
        <g stroke={stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="-4" cy="-5" r="3" />
          <circle cx="4" cy="-5" r="3" />
          <path d="M-10 6 C-10 1, 2 1, 2 6" />
          <path d="M0 6 C0 1, 10 1, 10 6" />
        </g>
      );
    default:
      return (
        <g stroke={stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="-4,-5 -9,0 -4,5" />
          <polyline points="4,-5 9,0 4,5" />
          <line x1="1.5" y1="-6" x2="-1.5" y2="6" />
        </g>
      );
  }
}

export function computeSceneLayout(scene: StageScene) {
  interface NodeGeom {
    node: IsoNode;
    x: number;
    y: number;
    w: number;
    h: number;
    depth: number;
    capW: number;
    capH: number;
    capTop: number;
    textBox: RectBox;
    blockBox: RectBox;
  }

  // ---- Stage regions ----
  const hasLegend = !!(scene.legend && scene.legend.length > 0);
  const avail: RectBox = { left: 20, right: 830, top: 66, bottom: hasLegend ? 462 : 494 };
  const cardBox: RectBox | null = scene.inspectCard
    ? {
        left: 850 - 14 - 270,
        right: 850 - 14,
        top: 56,
        bottom: 62 + 34 + scene.inspectCard.rows.length * 22 + 6
      }
    : null;

  // ---- Uniform, compact block sizes; text lives in a caption below the block ----
  const dimsOf = (n: IsoNode) => {
    const w = n.size === 'lg' ? 62 : n.size === 'sm' ? 44 : 52;
    const h = w * 0.5;
    const depth = n.shape === 'platform' ? 8 : n.size === 'lg' ? 20 : n.size === 'sm' ? 14 : 17;
    const labelW = estimateTextWidth(n.label, 12);
    const subW = n.sublabel ? estimateTextWidth(n.sublabel, 10) : 0;
    const capW = Math.ceil(Math.max(labelW, subW, 30) + 16);
    const capH = n.sublabel ? 34 : 20;
    return { w, h, depth, capW, capH };
  };

  const buildGeom = (n: IsoNode, x: number, y: number): NodeGeom => {
    const { w, h, depth, capW, capH } = dimsOf(n);
    const capTop = y + h + depth + 6;
    return {
      node: n,
      x,
      y,
      w,
      h,
      depth,
      capW,
      capH,
      capTop,
      textBox: { left: x - capW / 2, right: x + capW / 2, top: capTop, bottom: capTop + capH },
      blockBox: { left: x - w, right: x + w, top: y - h, bottom: y + h + depth }
    };
  };

  // Footprint used to fit the scene into the stage (block + caption + reserved pill space)
  const footprintOf = (g: NodeGeom): RectBox => {
    const n = g.node;
    let top = g.blockBox.top;
    let left = Math.min(g.blockBox.left, g.textBox.left);
    let right = Math.max(g.blockBox.right, g.textBox.right);
    let bottom = g.textBox.bottom;
    if (n.badge) {
      const bw = estimateTextWidth(n.badge.text, 10.2) + 60;
      top -= 30;
      left = Math.min(left, g.x - bw / 2);
      right = Math.max(right, g.x + bw / 2);
    }
    if (n.bottomPill) {
      const bw = estimateTextWidth(n.bottomPill, 10.2) + 30;
      bottom += 26;
      left = Math.min(left, g.x - bw / 2);
      right = Math.max(right, g.x + bw / 2);
    }
    return { left, right, top, bottom };
  };

  // ---- Auto-fit: spread nodes as far as the stage allows, keeping sizes constant ----
  const raw = scene.nodes.map((n) => {
    const p = projectIso(n.col, n.row);
    return { n, vx: p.x - 425, vy: p.y - 268 };
  });

  // Distance from node center to the visual boundary (block + caption) along a direction
  const boundaryDist = (g: NodeGeom, ux: number, uy: number) => {
    const hv = uy < 0 ? g.h : g.h + g.depth;
    let t = 1 / (Math.abs(ux) / g.w + Math.abs(uy) / hv + 1e-6);
    if (uy > 0.05) {
      const tc = (g.capTop + g.capH - g.y) / uy;
      if (Math.abs(ux * tc) <= g.capW / 2 + 2) t = Math.max(t, tc);
    }
    return t + 7;
  };

  // Layout quality: hard constraints (fits / no overlaps) + soft score (long connectors, no crossings)
  const evaluate = (geoms: NodeGeom[]) => {
    for (const g of geoms) {
      const f = footprintOf(g);
      if (f.left < avail.left || f.right > avail.right || f.top < avail.top || f.bottom > avail.bottom) {
        return { clean: false, score: -Infinity };
      }
    }
    for (let i = 0; i < geoms.length; i++) {
      const gi = geoms[i];
      if (cardBox && overlapArea(footprintOf(gi), cardBox, 4) > 0) return { clean: false, score: -Infinity };
      for (let j = 0; j < geoms.length; j++) {
        if (i === j) continue;
        const gj = geoms[j];
        if (j > i && overlapArea(gi.blockBox, gj.blockBox, 10) > 0) return { clean: false, score: -Infinity };
        if (overlapArea(gi.textBox, gj.blockBox, 6) > 0) return { clean: false, score: -Infinity };
        if (j > i && overlapArea(gi.textBox, gj.textBox, 8) > 0) return { clean: false, score: -Infinity };
        if (j > i && overlapArea(footprintOf(gi), footprintOf(gj), 2) > 0) return { clean: false, score: -Infinity };
      }
    }
    const byId = new Map(geoms.map((g) => [g.node.id, g] as const));
    const lens: number[] = [];
    let crossings = 0;
    scene.edges.forEach((e) => {
      const ga = byId.get(e.from);
      const gb = byId.get(e.to);
      if (!ga || !gb) return;
      const dx = gb.x - ga.x;
      const dy = gb.y - ga.y;
      const dist = Math.hypot(dx, dy) || 1;
      const ux = dx / dist;
      const uy = dy / dist;
      const t0 = boundaryDist(ga, ux, uy);
      const t1 = dist - boundaryDist(gb, -ux, -uy);
      lens.push(t1 - t0);
      for (let t = t0; t <= t1; t += 8) {
        const px = ga.x + ux * t;
        const py = ga.y + uy * t;
        for (const g of geoms) {
          if (g === ga || g === gb) continue;
          const inBox = (r: RectBox) => px > r.left && px < r.right && py > r.top && py < r.bottom;
          if (inBox(g.blockBox) || inBox(g.textBox)) {
            crossings++;
            break;
          }
        }
      }
    });
    const minLen = lens.length ? Math.min(...lens) : 120;
    const avgLen = lens.length ? lens.reduce((acc, v) => acc + v, 0) / lens.length : 120;
    return {
      clean: true,
      score: Math.min(minLen, 130) + 0.15 * Math.min(avgLen, 260) - 12 * crossings
    };
  };

  const tryLayout = (kx: number, ky: number, align: 'center' | 'left') => {
    let geoms = raw.map(({ n, vx, vy }) => buildGeom(n, vx * kx, vy * ky));
    const bb = geoms.map(footprintOf).reduce(
      (acc, f) => ({
        left: Math.min(acc.left, f.left),
        right: Math.max(acc.right, f.right),
        top: Math.min(acc.top, f.top),
        bottom: Math.max(acc.bottom, f.bottom)
      }),
      { left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity }
    );
    const fits = bb.right - bb.left <= avail.right - avail.left && bb.bottom - bb.top <= avail.bottom - avail.top;
    const ox =
      align === 'left'
        ? avail.left - bb.left
        : (avail.left + avail.right) / 2 - (bb.left + bb.right) / 2;
    const oy = (avail.top + avail.bottom) / 2 - (bb.top + bb.bottom) / 2;
    geoms = raw.map(({ n, vx, vy }) => buildGeom(n, vx * kx + ox, vy * ky + oy));
    const ev = evaluate(geoms);
    const score = ev.clean
      ? ev.score - 18 * Math.abs(Math.log(kx / ky)) + 8 * Math.min(kx, ky)
      : -Infinity;
    return { geoms, fits, clean: ev.clean, score };
  };

  let best: { geoms: NodeGeom[]; score: number } | null = null;
  let fallback: NodeGeom[] | null = null;
  let fallbackK = 0;
  const aligns = cardBox ? (['center', 'left'] as const) : (['center'] as const);
  for (let ky = 1.5; ky >= 0.6 - 1e-6; ky -= 0.1) {
    for (let ratio = 1; ratio <= 3.0001; ratio += 0.25) {
      const kx = ky * ratio;
      for (const align of aligns) {
        const r = tryLayout(kx, ky, align);
        if (r.clean && (!best || r.score > best.score)) best = { geoms: r.geoms, score: r.score };
        if (r.fits && Math.min(kx, ky) > fallbackK) {
          fallback = r.geoms;
          fallbackK = Math.min(kx, ky);
        }
      }
    }
  }

  // Local refinement: nudge individual nodes to lengthen cramped connectors while staying clean
  if (best) {
    let cur = best.geoms.map((g) => ({ ...g }));
    const origin = new Map(cur.map((g) => [g.node.id, { x: g.x, y: g.y }] as const));
    const drift = (geoms: NodeGeom[]) =>
      geoms.reduce((acc, g) => {
        const o = origin.get(g.node.id)!;
        return acc + Math.hypot(g.x - o.x, g.y - o.y);
      }, 0);
    let curScore = evaluate(cur).score - 0.04 * drift(cur);
    const dirs = [
      [1, 0], [-1, 0], [0, 1], [0, -1],
      [0.7, 0.7], [-0.7, 0.7], [0.7, -0.7], [-0.7, -0.7]
    ];
    for (let iter = 0; iter < 40; iter++) {
      let improved = false;
      for (let i = 0; i < cur.length; i++) {
        for (const step of [16, 8]) {
          for (const [dx, dy] of dirs) {
            const g = cur[i];
            const moved = buildGeom(g.node, g.x + dx * step, g.y + dy * step);
            const trial = cur.slice();
            trial[i] = moved;
            const ev = evaluate(trial);
            if (!ev.clean) continue;
            const sc = ev.score - 0.04 * drift(trial);
            if (sc > curScore + 0.5) {
              cur = trial;
              curScore = sc;
              improved = true;
            }
          }
        }
      }
      if (!improved) break;
    }
    best = { geoms: cur, score: curScore };
  }
  const finalGeoms = best?.geoms || fallback || tryLayout(0.6, 0.6, 'center').geoms;

  const nodeMap = new Map<string, NodeGeom>();
  const nodeTextBoxes: Array<{ id: string; box: RectBox }> = [];
  const nodeBlockBoxes: Array<{ id: string; box: RectBox }> = [];
  finalGeoms.forEach((g) => {
    nodeMap.set(g.node.id, g);
    nodeTextBoxes.push({ id: g.node.id, box: g.textBox });
    nodeBlockBoxes.push({ id: g.node.id, box: g.blockBox });
  });

  // Painter's algorithm sort (top-to-bottom so front blocks overlap back blocks cleanly)
  const sortedNodes = Array.from(nodeMap.values()).sort((a, b) => a.y - b.y);

  // Group edges by unordered endpoint pair to separate bidirectional / parallel edges
  const pairGroups = new Map<string, IsoEdge[]>();
  scene.edges.forEach((e) => {
    const key = [e.from, e.to].sort().join('::');
    const arr = pairGroups.get(key) || [];
    arr.push(e);
    pairGroups.set(key, arr);
  });

  interface EdgeGeom {
    edge: IsoEdge;
    sx: number;
    sy: number;
    ex: number;
    ey: number;
    mx: number;
    my: number;
    cnx: number;
    cny: number;
    laneOffset: number;
    isMulti: boolean;
  }

  const edgeGeoms: EdgeGeom[] = [];
  scene.edges.forEach((edge) => {
    const a = nodeMap.get(edge.from);
    const b = nodeMap.get(edge.to);
    if (!a || !b) return;

    const key = [edge.from, edge.to].sort().join('::');
    const group = pairGroups.get(key)!;
    const idxInGroup = group.indexOf(edge);
    const isMulti = group.length > 1;
    const laneOffset = isMulti ? (idxInGroup - (group.length - 1) / 2) * 22 : 0;

    // Canonical perpendicular normal based on sorted node IDs
    const minNode = edge.from < edge.to ? a : b;
    const maxNode = edge.from < edge.to ? b : a;
    const cdx = maxNode.x - minNode.x;
    const cdy = maxNode.y - minNode.y;
    const cdist = Math.hypot(cdx, cdy) || 1;
    const cnx = -cdy / cdist;
    const cny = cdx / cdist;

    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.hypot(dx, dy) || 1;
    const ux = dx / dist;
    const uy = dy / dist;
    let padStart = boundaryDist(a, ux, uy);
    let padEnd = boundaryDist(b, -ux, -uy);
    const maxPad = dist * 0.42;
    padStart = Math.min(padStart, maxPad);
    padEnd = Math.min(padEnd, maxPad);

    const sx = a.x + ux * padStart + cnx * laneOffset;
    const sy = a.y + uy * padStart + cny * laneOffset;
    const ex = b.x - ux * padEnd + cnx * laneOffset;
    const ey = b.y - uy * padEnd + cny * laneOffset;

    edgeGeoms.push({
      edge,
      sx,
      sy,
      ex,
      ey,
      mx: (sx + ex) / 2,
      my: (sy + ey) / 2,
      cnx,
      cny,
      laneOffset,
      isMulti
    });
  });

  // Sample points along every connector so pills avoid sitting on lines / arrowheads
  const edgeSamples: Array<{ id: string; x: number; y: number; w: number }> = [];
  edgeGeoms.forEach((g) => {
    const len = Math.hypot(g.ex - g.sx, g.ey - g.sy);
    const steps = Math.max(2, Math.ceil(len / 6));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const distToEnd = (1 - t) * len;
      const distToStart = t * len;
      const nearHead = distToEnd < 18 || (g.edge.bidirectional && distToStart < 18);
      edgeSamples.push({
        id: g.edge.id,
        x: g.sx + (g.ex - g.sx) * t,
        y: g.sy + (g.ey - g.sy) * t,
        w: nearHead ? 260 : 26
      });
    }
  });

  // Place all pill/oval-border labels in a dedicated top layer with collision avoidance
  const uiExclusionBoxes: RectBox[] = [];
  if (scene.inspectCard) {
    const cardH = 34 + scene.inspectCard.rows.length * 22;
    uiExclusionBoxes.push({
      left: 850 - 14 - 270,
      right: 850 - 14,
      top: 58,
      bottom: 62 + cardH
    });
  }
  if (scene.legend && scene.legend.length > 0) {
    const legendW = scene.legend.reduce(
      (acc, it) => acc + estimateTextWidth(it.label, 11) + 25,
      24
    );
    uiExclusionBoxes.push({
      left: 10,
      right: Math.min(836, 14 + legendW),
      top: 470,
      bottom: 504
    });
  }

  const placedPills: RectBox[] = [];
  const pickBestPosition = (
    candidates: Array<{ cx: number; cy: number }>,
    halfW: number,
    halfH: number,
    defaultX: number,
    defaultY: number,
    ownNodeId?: string,
    ownEdgeId?: string
  ) => {
    let best = candidates[0];
    let bestScore = Infinity;
    for (const c of candidates) {
      const box: RectBox = {
        left: c.cx - halfW,
        right: c.cx + halfW,
        top: c.cy - halfH,
        bottom: c.cy + halfH
      };
      let score = 0;
      for (const p of placedPills) {
        score += overlapArea(box, p, 3) * 1000;
      }
      for (const ui of uiExclusionBoxes) {
        score += overlapArea(box, ui, 2) * 700;
      }
      for (const tb of nodeTextBoxes) {
        score += overlapArea(box, tb.box, 3) * 500;
      }
      for (const s of edgeSamples) {
        if (s.id === ownEdgeId && s.w < 100) continue;
        if (s.x > box.left - 3 && s.x < box.right + 3 && s.y > box.top - 3 && s.y < box.bottom + 3) {
          score += s.w;
        }
      }
      score += outOfBoundsPenalty(box) * 500;
      for (const bb of nodeBlockBoxes) {
        if (bb.id === ownNodeId) continue;
        score += overlapArea(box, bb.box, 1) * 0.08;
      }
      for (const g of sortedNodes) {
        const iconBox = { left: g.x - 15, right: g.x + 15, top: g.y - 14, bottom: g.y + 14 };
        score += overlapArea(box, iconBox, 0) * 30;
      }
      score += Math.hypot(c.cx - defaultX, c.cy - defaultY);
      if (score < bestScore) {
        bestScore = score;
        best = c;
      }
    }
    placedPills.push({
      left: best.cx - halfW,
      right: best.cx + halfW,
      top: best.cy - halfH,
      bottom: best.cy + halfH
    });
    return best;
  };

  type OverlayPill =
    | {
        kind: 'badge';
        key: string;
        cx: number;
        cy: number;
        pillW: number;
        badge: NonNullable<IsoNode['badge']>;
        hasBar: boolean;
      }
    | {
        kind: 'bottomPill';
        key: string;
        cx: number;
        cy: number;
        pillW: number;
        text: string;
      }
    | {
        kind: 'edge';
        key: string;
        cx: number;
        cy: number;
        anchorX: number;
        anchorY: number;
        pillW: number;
        label: string;
        labelTone?: IsoEdge['labelTone'];
      };

  const overlayPills: OverlayPill[] = [];

  // 1. Node badges and bottom pills (anchored tightly to their nodes)
  sortedNodes.forEach(({ node, x, y, h, capTop, capH }) => {
    const belowCaption = capTop + capH + 14;
    if (node.badge) {
      const hasBar = typeof node.badge.progress === 'number';
      const textW = estimateTextWidth(node.badge.text, 10.2);
      const pillW = Math.max(hasBar ? 88 : 76, Math.ceil(textW) + (hasBar ? 58 : 26));
      const defX = x;
      const defY = y - h - 17;
      const candidates = [
        { cx: defX, cy: defY },
        { cx: defX, cy: defY - 12 },
        { cx: defX, cy: defY - 24 },
        { cx: defX - 40, cy: defY - 6 },
        { cx: defX + 40, cy: defY - 6 },
        { cx: defX - 70, cy: defY - 12 },
        { cx: defX + 70, cy: defY - 12 },
        { cx: defX, cy: belowCaption + (node.bottomPill ? 24 : 0) }
      ];
      const pos = pickBestPosition(candidates, pillW / 2, 10.5, defX, defY, node.id);
      overlayPills.push({
        kind: 'badge',
        key: `badge-${node.id}`,
        cx: pos.cx,
        cy: pos.cy,
        pillW,
        badge: node.badge,
        hasBar
      });
    }

    if (node.bottomPill) {
      const textW = estimateTextWidth(node.bottomPill, 10.2);
      const pillW = Math.max(84, Math.ceil(textW) + 26);
      const defX = x;
      const defY = belowCaption;
      const candidates = [
        { cx: defX, cy: defY },
        { cx: defX, cy: defY + 12 },
        { cx: defX - 44, cy: defY },
        { cx: defX + 44, cy: defY }
      ];
      const pos = pickBestPosition(candidates, pillW / 2, 10, defX, defY, node.id);
      overlayPills.push({
        kind: 'bottomPill',
        key: `bottom-${node.id}`,
        cx: pos.cx,
        cy: pos.cy,
        pillW,
        text: node.bottomPill
      });
    }
  });

  // 2. Edge label pills (placed after node pills so they never cover badges or node text)
  edgeGeoms.forEach(({ edge, sx, sy, ex, ey, mx, my, cnx, cny, laneOffset, isMulti }) => {
    if (!edge.label) return;
    const textW = estimateTextWidth(edge.label, 10.3);
    const pillW = Math.max(88, Math.ceil(textW) + 26);

    const side = laneOffset >= 0 ? 1 : -1;
    const defX = isMulti ? mx + cnx * (side * 18) : mx;
    const defY = isMulti ? my + cny * (side * 18) : my - 14;

    const candidates: Array<{ cx: number; cy: number }> = [{ cx: defX, cy: defY }];
    const tList = [0.5, 0.38, 0.62, 0.25, 0.75];
    const perpList = isMulti
      ? [side * 18, side * 32, side * 46]
      : [0, -18, 18, -32, 32, -46, 46];

    tList.forEach((t) => {
      const px = sx + (ex - sx) * t;
      const py = sy + (ey - sy) * t;
      perpList.forEach((po) => {
        candidates.push({ cx: px + cnx * po, cy: py + cny * po });
      });
      [-14, 14, -28, 28, -42, 42, -56, 56, -70, 70].forEach((vy) => {
        candidates.push({ cx: px, cy: py + vy });
      });
      // Beside the line (left / right of the anchor), useful for short or steep connectors
      [-1, 1].forEach((sgn) => {
        [0, -12, 12].forEach((vy) => {
          candidates.push({ cx: px + sgn * (pillW / 2 + 10), cy: py + vy });
        });
      });
    });

    const pos = pickBestPosition(candidates, pillW / 2, 10.5, defX, defY, undefined, edge.id);
    overlayPills.push({
      kind: 'edge',
      key: `edge-${edge.id}`,
      cx: pos.cx,
      cy: pos.cy,
      anchorX: mx,
      anchorY: my,
      pillW,
      label: edge.label,
      labelTone: edge.labelTone
    });
  });

  return { sortedNodes, edgeGeoms, overlayPills };
}

export const IsoStage: React.FC<IsoStageProps> = ({
  hud,
  scene,
  theme,
  isPaused,
  onTogglePause,
  replayNonce,
  onReplay,
  lang
}) => {
  const [phase, setPhase] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  // Track changed HUD metrics for subtle green pulse
  const prevHudRef = useRef<Record<string, string>>({});
  const [changedKeys, setChangedKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const nextChanged: Record<string, boolean> = {};
    hud.forEach((m) => {
      if (prevHudRef.current[m.key] !== undefined && prevHudRef.current[m.key] !== m.value) {
        nextChanged[m.key] = true;
      }
      prevHudRef.current[m.key] = m.value;
    });
    if (Object.keys(nextChanged).length > 0) {
      setChangedKeys(nextChanged);
      const timer = setTimeout(() => setChangedKeys({}), 900);
      return () => clearTimeout(timer);
    }
  }, [hud]);

  // Reset phase when replay is clicked
  useEffect(() => {
    setPhase(0);
  }, [replayNonce]);

  // Smooth deterministic animation loop
  useEffect(() => {
    if (isPaused) return;
    let rafId = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      setPhase((p) => (p + dt * 0.00038) % 1);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPaused]);

  const sceneLayout = useMemo(() => computeSceneLayout(scene), [scene]);

  const inkStroke = theme === 'dark' ? '#e5dccb' : '#1d1b18';
  const cardBg = theme === 'dark' ? '#26231e' : '#fbf7f1';
  const mutedStroke = theme === 'dark' ? '#6a6054' : '#9c9386';
  const palettes = theme === 'dark' ? DARK_PALETTES : LIGHT_PALETTES;

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPan({
      x: dragStartRef.current.panX + (e.clientX - dragStartRef.current.x),
      y: dragStartRef.current.panY + (e.clientY - dragStartRef.current.y)
    });
  };

  const handleMouseUp = () => setDragging(false);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className={`stage ${isFullscreen ? 'is-fullscreen' : ''}`}>
      {/* Top HUD & Playback Controls */}
      <div className="stage__topbar">
        <div className="stage__hud">
          {hud.map((m) => (
            <div
              key={m.key}
              className={`chip ${m.status ? `chip--${m.status}` : ''} ${
                changedKeys[m.key] ? 'is-changed' : ''
              }`}
            >
              <div className="chip__label">{m.label}</div>
              <div className="chip__value">{m.value}</div>
            </div>
          ))}
        </div>

        <div className="stage__tools">
          {(zoom !== 1 || pan.x !== 0 || pan.y !== 0) && (
            <button className="btn-pop" onClick={resetView} title="重置视图">
              100%
            </button>
          )}
          <button
            className="btn-pop"
            onClick={() => setZoom((z) => Math.min(1.5, +(z + 0.15).toFixed(2)))}
            title="放大"
          >
            <ZoomIn size={14} />
          </button>
          <button
            className="btn-pop"
            onClick={() => setZoom((z) => Math.max(0.75, +(z - 0.15).toFixed(2)))}
            title="缩小"
          >
            <ZoomOut size={14} />
          </button>
          <button className="btn-pop" onClick={onReplay} title="重播当前步骤动画 (R)">
            <RotateCcw size={13} />
            {lang === 'zh' ? '重播' : 'Replay'}
          </button>
          <button
            className={`btn-pop ${isPaused ? 'btn-pop--green' : ''}`}
            onClick={onTogglePause}
            title="暂停 / 播放 (Space)"
          >
            {isPaused ? <Play size={13} /> : <Pause size={13} />}
            {isPaused ? (lang === 'zh' ? '播放' : 'Play') : lang === 'zh' ? '暂停' : 'Pause'}
          </button>
          <button
            className="btn-pop"
            onClick={() => setIsFullscreen((f) => !f)}
            title="全屏切换"
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>
      </div>

      {/* Floating Canvas Code / Formula Inspection Card */}
      {scene.inspectCard && (
        <div
          style={{
            position: 'absolute',
            top: 62,
            right: 14,
            zIndex: 4,
            minWidth: 220,
            maxWidth: 300,
            padding: '10px 12px',
            borderRadius: 10,
            border: `1.5px solid ${inkStroke}`,
            background: cardBg,
            boxShadow: '2px 3px 0 rgba(0,0,0,0.22)',
            fontSize: 11.2,
            pointerEvents: 'none'
          }}
        >
          <div
            style={{
              fontWeight: 800,
              fontSize: 10.5,
              letterSpacing: '0.04em',
              marginBottom: 6,
              color: 'var(--muted)'
            }}
          >
            # {scene.inspectCard.title}
          </div>
          {scene.inspectCard.rows.map((r, idx) => {
            let bg = 'transparent';
            let color = 'var(--ink)';
            if (r.highlight === 'green') {
              bg = 'var(--green)';
              color = 'var(--green-ink)';
            } else if (r.highlight === 'amber') {
              bg = 'var(--amber)';
              color = 'var(--amber-ink)';
            } else if (r.highlight === 'red') {
              bg = 'var(--red)';
              color = 'var(--red-ink)';
            } else if (r.highlight === 'violet') {
              bg = 'var(--violet)';
              color = 'var(--violet-ink)';
            }
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 10,
                  padding: r.highlight ? '2px 6px' : '2px 0',
                  marginTop: r.highlight ? 3 : 0,
                  borderRadius: 4,
                  background: bg,
                  color,
                  fontWeight: r.highlight ? 700 : 500
                }}
              >
                <span>{r.left}</span>
                {r.right && <span style={{ fontWeight: 700 }}>{r.right}</span>}
              </div>
            );
          })}
        </div>
      )}

      {/* Isometric SVG Canvas */}
      <svg
        viewBox="0 0 850 510"
        className="stage__canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <defs>
          <pattern id="iso-grid" width="64" height="32" patternUnits="userSpaceOnUse">
            <path
              d="M 0 16 L 32 0 L 64 16 L 32 32 Z"
              fill="none"
              stroke="var(--grid-stroke)"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id="grid-fade" cx="50%" cy="54%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="68%" stopColor="white" stopOpacity="0.65" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="grid-mask">
            <rect width="850" height="510" fill="url(#grid-fade)" />
          </mask>
          <marker
            id="arrow-ink"
            viewBox="0 0 10 10"
            refX="7"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill={inkStroke} />
          </marker>
        </defs>

        <g
          transform={`translate(${pan.x}, ${pan.y}) translate(425, 255) scale(${zoom}) translate(-425, -255)`}
        >
          {/* Isometric Diamond Grid */}
          <rect width="850" height="510" fill="url(#iso-grid)" mask="url(#grid-mask)" />

          {/* Connectors & Animated Packets */}
          {sceneLayout.edgeGeoms.map(({ edge, sx, sy, ex, ey }) => {
            const packetKind = edge.packet && edge.packet !== 'none' ? edge.packet : null;
            const count = edge.packetRate === 'fast' ? 3 : edge.packetRate === 'slow' ? 1 : 2;
            const speedMul = edge.packetRate === 'fast' ? 1.4 : edge.packetRate === 'slow' ? 0.75 : 1;

            return (
              <g key={edge.id}>
                <line
                  x1={sx}
                  y1={sy}
                  x2={ex}
                  y2={ey}
                  stroke={edge.packet === 'error' ? '#e5534b' : inkStroke}
                  strokeWidth="1.9"
                  strokeDasharray={edge.style === 'dashed' ? '5 5' : undefined}
                  markerEnd="url(#arrow-ink)"
                  markerStart={edge.bidirectional ? 'url(#arrow-ink)' : undefined}
                  opacity={0.88}
                />

                {/* Animated Particles */}
                {packetKind &&
                  Array.from({ length: count }).map((_, idx) => {
                    const rawT = (phase * speedMul + idx / count) % 1;
                    // Error packet stops at 68% and pulses to show rejection/drop
                    const t = packetKind === 'error' ? Math.min(0.68, rawT * 0.95) : rawT;
                    const px = sx + (ex - sx) * t;
                    const py = sy + (ey - sy) * t;
                    const fill = PACKET_COLORS[packetKind];

                    if (packetKind === 'error') {
                      return (
                        <g key={idx} transform={`translate(${px}, ${py})`}>
                          <circle r="6.5" fill={fill} stroke={inkStroke} strokeWidth="1.3" />
                          <path
                            d="M-2.5 -2.5 L2.5 2.5 M2.5 -2.5 L-2.5 2.5"
                            stroke="#fff"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </g>
                      );
                    }

                    if (packetKind === 'predict') {
                      return (
                        <polygon
                          key={idx}
                          points={`${px},${py - 6} ${px + 6},${py} ${px},${py + 6} ${px - 6},${py}`}
                          fill={fill}
                          stroke={inkStroke}
                          strokeWidth="1.3"
                        />
                      );
                    }

                    if (packetKind === 'ge') {
                      return (
                        <rect
                          key={idx}
                          x={px - 4.5}
                          y={py - 4.5}
                          width="9"
                          height="9"
                          rx="2"
                          fill={fill}
                          stroke={inkStroke}
                          strokeWidth="1.3"
                        />
                      );
                    }

                    return (
                      <circle
                        key={idx}
                        cx={px}
                        cy={py}
                        r="5"
                        fill={fill}
                        stroke={inkStroke}
                        strokeWidth="1.3"
                      />
                    );
                  })}
              </g>
            );
          })}

          {/* 3D Isometric Blocks */}
          {sceneLayout.sortedNodes.map(({ node, x, y, w, h, depth }) => {
            const isCrashed = node.state === 'crashed';
            const isDisabled = node.state === 'disabled';
            const pal = isCrashed || isDisabled ? palettes.slate : palettes[node.color];

            return (
              <g
                key={node.id}
                transform={`translate(${x}, ${y})`}
                opacity={isDisabled ? 0.58 : 1}
              >
                {/* Ground Drop Shadow */}
                <polygon
                  points={`0,${-h + depth + 6} ${w + 4},${depth + 6} 0,${h + depth + 8} ${-w - 4},${depth + 6}`}
                  fill="rgba(0,0,0,0.14)"
                />

                {/* Active / Predicted Halo */}
                {node.state === 'active' && (
                  <ellipse
                    cx="0"
                    cy={depth * 0.4}
                    rx={w + 10}
                    ry={h + 8}
                    fill="none"
                    stroke="#6cc067"
                    strokeWidth="2.2"
                    strokeDasharray="6 4"
                  />
                )}
                {node.state === 'predicted' && (
                  <ellipse
                    cx="0"
                    cy={depth * 0.4}
                    rx={w + 10}
                    ry={h + 8}
                    fill="none"
                    stroke="#a87ee6"
                    strokeWidth="2.2"
                    strokeDasharray="5 4"
                  />
                )}

                {node.shape === 'cylinder' ? (
                  <>
                    {/* Cylinder Body */}
                    <path
                      d={`M ${-w * 0.82} -6 V ${depth} A ${w * 0.82} ${h * 0.72} 0 0 0 ${
                        w * 0.82
                      } ${depth} V -6 Z`}
                      fill={pal.left}
                      stroke={inkStroke}
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    {/* Cylinder Top */}
                    <ellipse
                      cx="0"
                      cy="-6"
                      rx={w * 0.82}
                      ry={h * 0.72}
                      fill={pal.top}
                      stroke={inkStroke}
                      strokeWidth="1.8"
                    />
                  </>
                ) : (
                  <>
                    {/* Left Extruded Wall */}
                    <polygon
                      points={`${-w},0 0,${h} 0,${h + depth} ${-w},${depth}`}
                      fill={pal.left}
                      stroke={inkStroke}
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    {/* Right Extruded Wall */}
                    <polygon
                      points={`${w},0 0,${h} 0,${h + depth} ${w},${depth}`}
                      fill={pal.right}
                      stroke={inkStroke}
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    {/* Top Isometric Diamond */}
                    <polygon
                      points={`0,${-h} ${w},0 0,${h} ${-w},0`}
                      fill={pal.top}
                      stroke={inkStroke}
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                  </>
                )}

                {/* Node Icon (centered on the top face) */}
                <g transform={`translate(0, ${node.shape === 'cylinder' ? -6 : node.shape === 'platform' ? -1 : -1})`}>
                  {isCrashed ? (
                    <path
                      d="M-10 -10 L10 10 M10 -10 L-10 10"
                      stroke="#e5534b"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                    />
                  ) : (
                    <g
                      transform={`scale(${
                        node.size === 'lg' ? 1.2 : node.size === 'sm' ? 0.92 : 1.05
                      })`}
                    >
                      {renderNodeIcon(node.icon, pal.text)}
                    </g>
                  )}
                </g>
              </g>
            );
          })}

          {/* Node Captions (label + sublabel) — drawn above every block so no block can hide them */}
          {sceneLayout.sortedNodes.map(({ node, x, capTop, capW, capH }) => {
            const dim = node.state === 'crashed' || node.state === 'disabled';
            return (
              <g key={`cap-${node.id}`} transform={`translate(${x}, ${capTop})`}>
                <rect
                  x={-capW / 2}
                  y="0"
                  width={capW}
                  height={capH}
                  rx="6"
                  fill="var(--stage)"
                  opacity={0.94}
                />
                <text
                  x="0"
                  y="14.5"
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="800"
                  fill={dim ? 'var(--muted)' : 'var(--ink)'}
                  textDecoration={node.state === 'crashed' ? 'line-through' : undefined}
                >
                  {node.label}
                </text>
                {node.sublabel && (
                  <text
                    x="0"
                    y="28.5"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    fill="var(--muted)"
                  >
                    {node.sublabel}
                  </text>
                )}
              </g>
            );
          })}

          {/* Top Overlay Layer: All Floating Pill / Oval-Border Labels (never occluded by 3D blocks) */}
          {sceneLayout.overlayPills.map((item) => {
            if (item.kind === 'edge') {
              const distFromAnchor = Math.hypot(item.cx - item.anchorX, item.cy - item.anchorY);
              return (
                <g key={item.key}>
                  {distFromAnchor > 24 && (
                    <line
                      x1={item.anchorX}
                      y1={item.anchorY}
                      x2={item.cx}
                      y2={item.cy}
                      stroke={inkStroke}
                      strokeWidth="1"
                      strokeDasharray="2.5 2.5"
                      opacity={0.45}
                    />
                  )}
                  <g transform={`translate(${item.cx}, ${item.cy})`}>
                    <rect
                      x={-item.pillW / 2}
                      y="-11"
                      width={item.pillW}
                      height="21"
                      rx="10.5"
                      fill={
                        item.labelTone === 'green'
                          ? 'var(--green)'
                          : item.labelTone === 'amber'
                          ? 'var(--amber)'
                          : item.labelTone === 'violet'
                          ? 'var(--violet)'
                          : item.labelTone === 'red'
                          ? 'var(--red)'
                          : cardBg
                      }
                      stroke={inkStroke}
                      strokeWidth="1.3"
                    />
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      fontSize="10.3"
                      fontWeight="700"
                      fill="var(--ink)"
                    >
                      {item.label}
                    </text>
                  </g>
                </g>
              );
            }

            if (item.kind === 'badge') {
              const barColor =
                item.badge.tone === 'bad'
                  ? '#e5534b'
                  : item.badge.tone === 'warn'
                  ? '#e09b2d'
                  : '#4caf50';
              return (
                <g key={item.key} transform={`translate(${item.cx}, ${item.cy})`}>
                  <rect
                    x={-item.pillW / 2 + 1.5}
                    y="-9.5"
                    width={item.pillW}
                    height="21"
                    rx="10.5"
                    fill={inkStroke}
                  />
                  <rect
                    x={-item.pillW / 2}
                    y="-11"
                    width={item.pillW}
                    height="21"
                    rx="10.5"
                    fill={cardBg}
                    stroke={inkStroke}
                    strokeWidth="1.4"
                  />
                  {item.hasBar && (
                    <>
                      <rect
                        x={-item.pillW / 2 + 9}
                        y="-3.5"
                        width="28"
                        height="6"
                        rx="3"
                        fill="var(--line)"
                      />
                      <rect
                        x={-item.pillW / 2 + 9}
                        y="-3.5"
                        width={Math.max(2, (28 * (item.badge.progress ?? 0)) / 100)}
                        height="6"
                        rx="3"
                        fill={barColor}
                      />
                    </>
                  )}
                  <text
                    x={item.hasBar ? 16 : 0}
                    y="3"
                    textAnchor="middle"
                    fontSize="10.2"
                    fontWeight="800"
                    fill={
                      item.badge.tone === 'bad'
                        ? '#e5534b'
                        : item.badge.tone === 'warn'
                        ? '#d98a1c'
                        : 'var(--ink)'
                    }
                  >
                    {item.badge.text}
                  </text>
                </g>
              );
            }

            return (
              <g key={item.key} transform={`translate(${item.cx}, ${item.cy})`}>
                <rect
                  x={-item.pillW / 2 + 1.5}
                  y="-9"
                  width={item.pillW}
                  height="20"
                  rx="10"
                  fill={inkStroke}
                />
                <rect
                  x={-item.pillW / 2}
                  y="-10.5"
                  width={item.pillW}
                  height="20"
                  rx="10"
                  fill={cardBg}
                  stroke={inkStroke}
                  strokeWidth="1.4"
                />
                <text
                  x="0"
                  y="3"
                  textAnchor="middle"
                  fontSize="10.2"
                  fontWeight="700"
                  fill={mutedStroke === '#6a6054' ? '#efe6d6' : '#1d1b18'}
                >
                  {item.text}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Bottom-Left Legend */}
      {scene.legend && scene.legend.length > 0 && (
        <div className="stage__legend">
          {scene.legend.map((item, idx) => (
            <span key={idx} className="legend-item">
              <span
                className="legend-dot"
                style={{ background: PACKET_COLORS[item.type] }}
              />
              {item.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
