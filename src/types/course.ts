export type FolderColor =
  | 'sand'
  | 'violet'
  | 'green'
  | 'orange'
  | 'blue'
  | 'teal'
  | 'rose'
  | 'olive';

export type StepPhase =
  | 'PROBLEM'
  | 'ARCHITECTURE'
  | 'TECHNIQUE'
  | 'PITFALL'
  | 'UE5_NEW'
  | 'SOLUTION'
  | 'RECAP';

export type PacketKind =
  | 'input'
  | 'predict'
  | 'rpc'
  | 'rep'
  | 'ge'
  | 'cue'
  | 'error'
  | 'none';

export type NodeColor =
  | 'blue'
  | 'green'
  | 'amber'
  | 'violet'
  | 'rose'
  | 'teal'
  | 'sand'
  | 'slate'
  | 'red';

export type NodeIcon =
  | 'server'
  | 'client'
  | 'pawn'
  | 'playerstate'
  | 'asc'
  | 'attr'
  | 'ge'
  | 'ga'
  | 'tag'
  | 'cue'
  | 'task'
  | 'shield'
  | 'sword'
  | 'code'
  | 'users';

export interface HudMetric {
  key: string;
  label: string;
  value: string;
  status?: 'good' | 'warn' | 'bad' | 'neutral';
}

export interface IsoNode {
  id: string;
  col: number;
  row: number;
  shape?: 'block' | 'cylinder' | 'platform';
  size?: 'sm' | 'md' | 'lg';
  color: NodeColor;
  icon: NodeIcon;
  label: string;
  sublabel?: string;
  badge?: {
    text: string;
    tone?: 'good' | 'warn' | 'bad' | 'neutral';
    progress?: number; // 0..100
  };
  bottomPill?: string;
  state?: 'normal' | 'active' | 'disabled' | 'crashed' | 'predicted';
}

export interface IsoEdge {
  id: string;
  from: string;
  to: string;
  style?: 'solid' | 'dashed';
  label?: string;
  labelTone?: 'green' | 'amber' | 'violet' | 'red' | 'neutral';
  packet?: PacketKind;
  bidirectional?: boolean;
  packetRate?: 'slow' | 'normal' | 'fast';
}

export interface InspectCardData {
  title: string;
  position?: 'top-right' | 'bottom-right' | 'top-left';
  rows: Array<{
    left: string;
    right?: string;
    highlight?: 'green' | 'amber' | 'red' | 'violet';
  }>;
}

export interface StageScene {
  nodes: IsoNode[];
  edges: IsoEdge[];
  inspectCard?: InspectCardData;
  legend?: Array<{
    type: Exclude<PacketKind, 'none'>;
    label: string;
  }>;
}

export interface LessonGoal {
  id: string;
  text: string;
  unlockAtStep: number; // 1-based step index
}

export interface StepChange {
  op: 'add' | 'mod' | 'del';
  text: string;
}

export interface StepCallout {
  kind: 'insight' | 'warn' | 'tip' | 'ue5';
  label?: string;
  text: string;
}

export interface LessonStep {
  id: string;
  shortLabel: string;
  phase: StepPhase;
  title: string;
  paragraphs: string[];
  codeSnippet?: {
    title: string;
    code: string;
  };
  callout?: StepCallout;
  changes?: StepChange[];
  hud: HudMetric[];
  scene: StageScene;
}

export interface LessonData {
  slug: string;
  title: string;
  titleEn: string;
  summary: string;
  durationMin: number;
  difficulty: '入门' | '进阶' | '高阶';
  goals: LessonGoal[];
  steps: LessonStep[];
}

export interface ModuleData {
  id: string;
  indexLabel: string;
  title: string;
  titleEn: string;
  folderColor: FolderColor;
  lessons: LessonData[];
}

export interface PracticeQuestion {
  id: string;
  moduleTag: string;
  difficulty: '入门' | '进阶' | '高阶';
  title: string;
  scenario: string;
  codeContext?: string;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }>;
  takeaway: string;
  relatedLessonSlug: string;
}

export interface GlossaryConcept {
  term: string;
  category: string;
  summary: string;
  lessonSlug: string;
  stepIndex: number; // 1-based
}
