import React from 'react';

export type StageDiagramId =
  | 'coupled-vs-gas-decoupled'
  | 'gas-five-pillars-blueprint'
  | 'owner-avatar-anatomy'
  | 'asc-init-sequence'
  | 'replication-mode-matrix'
  | 'tag-refcount-waveform'
  | 'tag-hierarchy-tree'
  | 'ga-six-tag-gates'
  | 'base-vs-current-gauge'
  | 'clamping-dual-gauge'
  | 'meta-damage-funnel'
  | 'periodic-tick-timeline'
  | 'ge-stacking-bars'
  | 'ge-53-component-puzzle'
  | 'aggregator-55-pipeline'
  | 'ge-calculator-decision-tree'
  | 'ga-lifecycle-state-machine'
  | 'ability-task-lifecycle'
  | 'target-data-pipeline'
  | 'prediction-key-swimlane'
  | 'rpc-batcher-timeline'
  | 'cue-pooling-ring'
  | 'cue-relevancy-timeline'
  | 'cue-context-bitstream'
  | 'melee-combo-montage-sweep'
  | 'lyra-abilityset-anatomy';

export interface DiagramMeta {
  id: StageDiagramId;
  shortTitle: string;
  shortTitleEn: string;
  title: string;
  categoryLabel: string;
}

export interface DiagramProps {
  stepId: string;
  phase: number; // 0..1 continuous animation progress
  theme: 'light' | 'dark';
  lang: 'zh' | 'en';
}

export interface DiagramPalette {
  ink: string;
  ink2: string;
  muted: string;
  card: string;
  card2: string;
  stage: string;
  chip: string;
  line: string;
  lineStrong: string;
  green: string;
  greenBg: string;
  greenInk: string;
  amber: string;
  amberBg: string;
  amberInk: string;
  red: string;
  redBg: string;
  redInk: string;
  violet: string;
  violetBg: string;
  violetInk: string;
  blue: string;
  blueBg: string;
  blueInk: string;
  teal: string;
  tealBg: string;
}

export function getDiagramPalette(theme: 'light' | 'dark'): DiagramPalette {
  if (theme === 'dark') {
    return {
      ink: '#efe6d6',
      ink2: '#d8ccb8',
      muted: '#9e9283',
      card: '#26231e',
      card2: '#2d2822',
      stage: '#292520',
      chip: '#322c25',
      line: '#3d362e',
      lineStrong: '#5b5146',
      green: '#6bc465',
      greenBg: '#2d3b26',
      greenInk: '#d9ecc2',
      amber: '#e8b339',
      amberBg: '#3d3120',
      amberInk: '#fae1b8',
      red: '#e5534b',
      redBg: '#3e2321',
      redInk: '#fad4ce',
      violet: '#a87ee6',
      violetBg: '#352847',
      violetInk: '#e7daf8',
      blue: '#5b9ee0',
      blueBg: '#253546',
      blueInk: '#d4e5f9',
      teal: '#56b8b0',
      tealBg: '#233b39'
    };
  }
  return {
    ink: '#1d1b18',
    ink2: '#34302b',
    muted: '#6f6961',
    card: '#f8f0e6',
    card2: '#f2e7d9',
    stage: '#faf3e9',
    chip: '#fbf7f1',
    line: '#dfd5c7',
    lineStrong: '#c2b6a6',
    green: '#4caf50',
    greenBg: '#e4f0d5',
    greenInk: '#1f3518',
    amber: '#d98a1c',
    amberBg: '#faeccf',
    amberInk: '#4a3210',
    red: '#d9443b',
    redBg: '#fae0dc',
    redInk: '#6e1f19',
    violet: '#7e57c2',
    violetBg: '#ebe2f8',
    violetInk: '#34214d',
    blue: '#3b82c4',
    blueBg: '#e1ecf8',
    blueInk: '#18314f',
    teal: '#2d958c',
    tealBg: '#daf0ed'
  };
}

/**
 * Top banner inside the 850x510 SVG canvas (placed at y=64 so it sits cleanly below .stage__topbar)
 */
export const DiagramHeader: React.FC<{
  pal: DiagramPalette;
  category: string;
  title: string;
  subtitle?: string;
  rightBadge?: string;
}> = ({ pal, category, title, subtitle, rightBadge }) => (
  <g transform="translate(24, 62)">
    <rect
      x="0"
      y="0"
      width="802"
      height="36"
      rx="8"
      fill={pal.card2}
      stroke={pal.lineStrong}
      strokeWidth="1.2"
    />
    <rect x="8" y="7" width="4" height="22" rx="2" fill={pal.violet} />
    <text x="20" y="16" fontSize="9.5" fontWeight="800" fill={pal.violet}>
      {category}
    </text>
    <text x="20" y="29" fontSize="12.5" fontWeight="800" fill={pal.ink}>
      {title}
    </text>
    {subtitle && (
      <text x="790" y="23" textAnchor="end" fontSize="10.2" fontWeight="600" fill={pal.muted}>
        {subtitle}
      </text>
    )}
    {rightBadge && !subtitle && (
      <g transform="translate(650, 7)">
        <rect
          x="0"
          y="0"
          width="144"
          height="22"
          rx="11"
          fill={pal.chip}
          stroke={pal.ink}
          strokeWidth="1.2"
        />
        <text x="72" y="14.5" textAnchor="middle" fontSize="10" fontWeight="800" fill={pal.ink}>
          {rightBadge}
        </text>
      </g>
    )}
  </g>
);

/**
 * Animated packet dot moving along (x1,y1) -> (x2,y2)
 */
export const FlowDot: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  phase: number;
  color: string;
  stroke: string;
  offset?: number;
  r?: number;
}> = ({ x1, y1, x2, y2, phase, color, stroke, offset = 0, r = 4.5 }) => {
  const t = (phase + offset) % 1;
  const cx = x1 + (x2 - x1) * t;
  const cy = y1 + (y2 - y1) * t;
  return <circle cx={cx} cy={cy} r={r} fill={color} stroke={stroke} strokeWidth="1.3" />;
};
