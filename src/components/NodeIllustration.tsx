import React from 'react';
import { IsoNode, NodeColor } from '../types/course';

export interface ArtPalette {
  light: string;
  base: string;
  shade: string;
  deep: string;
  glow: string;
  ink: string;
  rim: string;
}

const LIGHT_ART_PALETTES: Record<NodeColor, ArtPalette> = {
  blue: {
    light: '#b9d9fb',
    base: '#6da7ea',
    shade: '#467ec2',
    deep: '#234a7a',
    glow: '#3b82f6',
    ink: '#24201b',
    rim: 'rgba(255, 255, 255, 0.72)'
  },
  green: {
    light: '#c3e8aa',
    base: '#7ec262',
    shade: '#54963c',
    deep: '#275219',
    glow: '#34b856',
    ink: '#24201b',
    rim: 'rgba(255, 255, 255, 0.72)'
  },
  amber: {
    light: '#fce0a2',
    base: '#eba642',
    shade: '#bf791b',
    deep: '#6e4106',
    glow: '#f59e0b',
    ink: '#24201b',
    rim: 'rgba(255, 255, 255, 0.75)'
  },
  violet: {
    light: '#d8c4f9',
    base: '#9f7be3',
    shade: '#734db8',
    deep: '#3f2275',
    glow: '#a855f7',
    ink: '#24201b',
    rim: 'rgba(255, 255, 255, 0.72)'
  },
  rose: {
    light: '#fac2d4',
    base: '#e3789c',
    shade: '#b54c71',
    deep: '#6b203a',
    glow: '#f43f5e',
    ink: '#24201b',
    rim: 'rgba(255, 255, 255, 0.72)'
  },
  teal: {
    light: '#ade8e1',
    base: '#52b8ae',
    shade: '#318a81',
    deep: '#17524c',
    glow: '#14b8a6',
    ink: '#24201b',
    rim: 'rgba(255, 255, 255, 0.72)'
  },
  sand: {
    light: '#ece0ce',
    base: '#c9b396',
    shade: '#9c8568',
    deep: '#594834',
    glow: '#d49a56',
    ink: '#24201b',
    rim: 'rgba(255, 255, 255, 0.72)'
  },
  slate: {
    light: '#c7c1b8',
    base: '#948e84',
    shade: '#6a645c',
    deep: '#3d3934',
    glow: '#94a3b8',
    ink: '#24201b',
    rim: 'rgba(255, 255, 255, 0.55)'
  },
  red: {
    light: '#fcbdb8',
    base: '#e36960',
    shade: '#b83e35',
    deep: '#691913',
    glow: '#ef4444',
    ink: '#24201b',
    rim: 'rgba(255, 255, 255, 0.72)'
  }
};

const DARK_ART_PALETTES: Record<NodeColor, ArtPalette> = {
  blue: {
    light: '#7cb5f2',
    base: '#4b7eb8',
    shade: '#305480',
    deep: '#1b314d',
    glow: '#6cb6ff',
    ink: '#171411',
    rim: 'rgba(235, 245, 255, 0.34)'
  },
  green: {
    light: '#8fd175',
    base: '#599446',
    shade: '#39662c',
    deep: '#213d18',
    glow: '#7be36c',
    ink: '#171411',
    rim: 'rgba(235, 255, 230, 0.34)'
  },
  amber: {
    light: '#f0b85b',
    base: '#bf822e',
    shade: '#855517',
    deep: '#4d2f0a',
    glow: '#ffd066',
    ink: '#171411',
    rim: 'rgba(255, 244, 214, 0.36)'
  },
  violet: {
    light: '#b390f0',
    base: '#7a57ba',
    shade: '#503682',
    deep: '#2f1d52',
    glow: '#c69eff',
    ink: '#171411',
    rim: 'rgba(242, 232, 255, 0.34)'
  },
  rose: {
    light: '#eb8dab',
    base: '#b35474',
    shade: '#7a334b',
    deep: '#471a29',
    glow: '#ff85ab',
    ink: '#171411',
    rim: 'rgba(255, 230, 240, 0.34)'
  },
  teal: {
    light: '#72cfc5',
    base: '#3f948b',
    shade: '#26635d',
    deep: '#153b37',
    glow: '#5eead4',
    ink: '#171411',
    rim: 'rgba(225, 255, 250, 0.34)'
  },
  sand: {
    light: '#cbb79b',
    base: '#948168',
    shade: '#635542',
    deep: '#3b3226',
    glow: '#e5c69b',
    ink: '#171411',
    rim: 'rgba(255, 244, 226, 0.3)'
  },
  slate: {
    light: '#9e978e',
    base: '#6f6961',
    shade: '#4c4741',
    deep: '#2e2b27',
    glow: '#a8a29e',
    ink: '#171411',
    rim: 'rgba(235, 228, 218, 0.25)'
  },
  red: {
    light: '#ed857d',
    base: '#bd4c44',
    shade: '#822d27',
    deep: '#4a1714',
    glow: '#ff7b72',
    ink: '#171411',
    rim: 'rgba(255, 232, 230, 0.34)'
  }
};

type VisualKind =
  | 'hero'
  | 'rogue'
  | 'boss'
  | 'boss-burning'
  | 'transform-gizmo'
  | 'squad'
  | 'aoe-targets'
  | 'server-rack'
  | 'ai-chip'
  | 'execcalc-core'
  | 'client-terminal'
  | 'gamepad-input'
  | 'reticle-ray'
  | 'tampered-client'
  | 'fx-output'
  | 'wifi-jitter'
  | 'playerstate'
  | 'playerstate-slow'
  | 'asc-hub'
  | 'asc-master'
  | 'aggregator-prism'
  | 'meta-funnel'
  | 'data-stack'
  | 'stack-core'
  | 'leaked-core'
  | 'attr-bars'
  | 'ammo-mag'
  | 'raw-float'
  | 'ability-sigil'
  | 'fireball'
  | 'sprint-wing'
  | 'death-skull'
  | 'charged-shot'
  | 'single-instance'
  | 'multi-instance'
  | 'ge-crystal'
  | 'potion-heal'
  | 'potion-poison'
  | 'ice-rune'
  | 'flame-aura'
  | 'grenade-blast'
  | 'ge-modular'
  | 'ge-spec'
  | 'math-prism'
  | 'sword-slash'
  | 'sword-broken'
  | 'aegis-shield'
  | 'shield-clamp'
  | 'security-gate'
  | 'defense-tower'
  | 'mech-pawn'
  | 'handle-pouch'
  | 'tag-tree'
  | 'tag-stun'
  | 'tag-freeze'
  | 'tag-cooldown'
  | 'tag-counter'
  | 'tag-combo'
  | 'cue-spark'
  | 'vfx-burst'
  | 'cleanse-halo'
  | 'ice-shatter'
  | 'cue-pool'
  | 'crit-popup'
  | 'task-clock'
  | 'task-montage'
  | 'task-radar'
  | 'task-bomb'
  | 'code-gear'
  | 'data-envelope'
  | 'set-filter'
  | 'ability-loadout'
  | 'mmc-lens';

function resolveVisualKind(node: IsoNode): VisualKind {
  const txt = `${node.label} ${node.sublabel || ''}`;

  switch (node.icon) {
    case 'pawn': {
      if (txt.includes('Transform') || txt.includes('LocationInfo')) return 'transform-gizmo';
      if (txt.includes('着火') || txt.includes('Burning')) return 'boss-burning';
      if (txt.includes('Boss')) return 'boss';
      if (txt.includes('盗贼')) return 'rogue';
      return 'hero';
    }
    case 'users': {
      if (txt.includes('AOE') || txt.includes('扇形') || txt.includes('ActorArray')) return 'aoe-targets';
      return 'squad';
    }
    case 'server': {
      if (txt.includes('AAIController')) return 'ai-chip';
      if (txt.includes('ExecCalc')) return 'execcalc-core';
      return 'server-rack';
    }
    case 'client': {
      if (txt.includes('准星') || txt.includes('LineTrace')) return 'reticle-ray';
      if (txt.includes('篡改')) return 'tampered-client';
      if (txt.includes('Niagara') || txt.includes('震屏')) return 'fx-output';
      if (txt.includes('Wi-Fi') || txt.includes('抖动')) return 'wifi-jitter';
      if (txt.includes('EnhancedInput') || txt.includes('按键')) return 'gamepad-input';
      return 'client-terminal';
    }
    case 'playerstate': {
      if (txt.includes('1.0f')) return 'playerstate-slow';
      return 'playerstate';
    }
    case 'asc': {
      if (txt.includes('FAggregator')) return 'aggregator-prism';
      if (txt.includes('IncomingDamage') || txt.includes('Meta Attribute')) return 'meta-funnel';
      if (txt.includes('ActivatableAbilities') || txt.includes('RPCBatch') || txt.includes('SubObjectList')) {
        return 'data-stack';
      }
      if (txt.includes('堆叠容器')) return 'stack-core';
      if (txt.includes('残留') || txt.includes('泄漏')) return 'leaked-core';
      if (txt.includes('MMC')) return 'mmc-lens';
      if (txt.includes('架构大师')) return 'asc-master';
      return 'asc-hub';
    }
    case 'attr': {
      if (txt.includes('Ammo') || txt.includes('弹药')) return 'ammo-mag';
      if (txt.includes('float ')) return 'raw-float';
      return 'attr-bars';
    }
    case 'ga': {
      if (txt.includes('Fireball') || txt.includes('火球')) return 'fireball';
      if (txt.includes('Sprint') || txt.includes('冲刺')) return 'sprint-wing';
      if (txt.includes('Death') || txt.includes('倒地')) return 'death-skull';
      if (txt.includes('RifleFire') || txt.includes('蓄力射击')) return 'charged-shot';
      if (txt.includes('InstancedPerExecution')) return 'multi-instance';
      if (txt.includes('InstancedPerActor')) return 'single-instance';
      return 'ability-sigil';
    }
    case 'ge': {
      if (txt.includes('治疗药水')) return 'potion-heal';
      if (txt.includes('Poison') || txt.includes('DOT')) return 'potion-poison';
      if (txt.includes('Frost')) return 'ice-rune';
      if (txt.includes('灼烧')) return 'flame-aura';
      if (txt.includes('手雷') || txt.includes('AOE')) return 'grenade-blast';
      if (txt.includes('UGameplayEffect')) return 'ge-modular';
      if (txt.includes('Spec')) return 'ge-spec';
      if (txt.includes('Multiply')) return 'math-prism';
      return 'ge-crystal';
    }
    case 'sword': {
      if (txt.includes('Cancel') || txt.includes('丢弃')) return 'sword-broken';
      return 'sword-slash';
    }
    case 'shield': {
      if (txt.includes('防御塔') || txt.includes('宝箱')) return 'defense-tower';
      if (txt.includes('机甲') || txt.includes('载具')) return 'mech-pawn';
      if (txt.includes('GrantedHandles') || txt.includes('收据袋')) return 'handle-pouch';
      if (txt.includes('Clamp') || txt.includes('PreAttribute')) return 'shield-clamp';
      if (txt.includes('验真网关')) return 'security-gate';
      return 'aegis-shield';
    }
    case 'tag': {
      if (txt.includes('Stun') || txt.includes('眩晕')) return 'tag-stun';
      if (txt.includes('Freeze') || txt.includes('冰冻')) return 'tag-freeze';
      if (txt.includes('Cooldown')) return 'tag-cooldown';
      if (txt.includes('TagCountContainer')) return 'tag-counter';
      if (txt.includes('ComboWindow')) return 'tag-combo';
      return 'tag-tree';
    }
    case 'cue': {
      if (txt.includes('Cleanse') || txt.includes('净化')) return 'cleanse-halo';
      if (txt.includes('IceShatter')) return 'ice-shatter';
      if (txt.includes('对象池')) return 'cue-pool';
      if (txt.includes('飘字')) return 'crit-popup';
      if (txt.includes('Impact') || txt.includes('爆心') || txt.includes('SlashImpact')) return 'vfx-burst';
      return 'cue-spark';
    }
    case 'task': {
      if (txt.includes('Montage') || txt.includes('Section:')) return 'task-montage';
      if (txt.includes('WaitGameplayEvent')) return 'task-radar';
      if (txt.includes('FTimerHandle')) return 'task-bomb';
      return 'task-clock';
    }
    case 'code': {
      if (txt.includes('TargetData') || txt.includes('EffectContext')) return 'data-envelope';
      if (txt.includes('HitActorsThisSwing') || txt.includes('TSet')) return 'set-filter';
      if (txt.includes('AbilitySet') || txt.includes('GiveToAbilitySystem')) return 'ability-loadout';
      if (txt.includes('MMC')) return 'mmc-lens';
      return 'code-gear';
    }
  }
}

interface NodeIllustrationProps {
  node: IsoNode;
  theme: 'light' | 'dark';
}

function renderArtwork(kind: VisualKind, pal: ArtPalette, theme: 'light' | 'dark') {
  const sw = theme === 'dark' ? 1.25 : 1.35;
  const stroke = pal.ink;

  switch (kind) {
    case 'hero':
    case 'rogue': {
      const isRogue = kind === 'rogue';
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Subtle spatial actor locator ring on physical floor */}
          <ellipse
            cx="0"
            cy="18"
            rx="21"
            ry="6.8"
            fill="none"
            stroke={pal.glow}
            strokeWidth="1.2"
            strokeDasharray="4 3"
            opacity="0.6"
          />
          {/* Heroic armored torso */}
          <path
            d="M-11 17 L-9 1 L-15 -4 L-9 -9 L9 -9 L15 -4 L9 1 L11 17 Q0 20 -11 17 Z"
            fill={pal.base}
            stroke={stroke}
            strokeWidth={sw}
          />
          {/* Right shadow facet */}
          <path d="M0 -9 L9 -9 L15 -4 L9 1 L11 17 Q5 19 0 18.5 Z" fill={pal.shade} opacity="0.55" />
          {/* Left & Right Pauldrons */}
          <path
            d="M-16 -3 C-19 -9, -12 -11, -7 -8 L-9 -1 Z"
            fill={pal.light}
            stroke={stroke}
            strokeWidth={sw}
          />
          <path
            d="M16 -3 C19 -9, 12 -11, 7 -8 L9 -1 Z"
            fill={pal.shade}
            stroke={stroke}
            strokeWidth={sw}
          />
          {/* Chest core crest */}
          <polygon points="0,-3 4.5,2 0,7 -4.5,2" fill={pal.glow} stroke={stroke} strokeWidth="1" />
          {/* Belt */}
          <path d="M-9.5 11 Q0 13 9.5 11" fill="none" stroke={pal.deep} strokeWidth="2.2" />
          {/* Helmet / Hooded Head */}
          {isRogue ? (
            <path
              d="M0 -25 C-7.5 -24, -10 -16, -7 -10 Q0 -8.5 7 -10 C10 -16, 7.5 -24, 0 -25 Z"
              fill={pal.light}
              stroke={stroke}
              strokeWidth={sw}
            />
          ) : (
            <rect
              x="-8"
              y="-24"
              width="16"
              height="14.5"
              rx="6.5"
              fill={pal.light}
              stroke={stroke}
              strokeWidth={sw}
            />
          )}
          {/* Visor */}
          <path
            d="M-5.2 -17.2 Q0 -15.5 5.2 -17.2 L4.4 -14.2 Q0 -12.8 -4.4 -14.2 Z"
            fill={pal.deep}
          />
          <path d="M-4.2 -16.2 Q0 -14.8 4.2 -16.2" fill="none" stroke={pal.glow} strokeWidth="1.6" />
          {/* Rim highlight */}
          <path d="M-5 -22 Q0 -23.5 5 -21.5" fill="none" stroke={pal.rim} strokeWidth="1.2" />
          {isRogue && (
            <path d="M12 6 L22 -4 M17 -3 L21 1" stroke={pal.light} strokeWidth="1.8" />
          )}
        </g>
      );
    }

    case 'boss':
    case 'boss-burning': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {kind === 'boss-burning' && (
            <g opacity="0.92">
              <path
                d="M-21 4 C-26 -6, -19 -14, -15 -22 C-13 -13, -7 -10, -10 2 Z"
                fill="#f97316"
              />
              <path
                d="M21 4 C26 -6, 19 -14, 15 -22 C13 -13, 7 -10, 10 2 Z"
                fill="#f97316"
              />
              <path
                d="M-18 2 C-21 -4, -17 -10, -15 -16 C-13 -10, -10 -7, -12 1 Z"
                fill="#fde047"
              />
              <path
                d="M18 2 C21 -4, 17 -10, 15 -16 C13 -10, 10 -7, 12 1 Z"
                fill="#fde047"
              />
            </g>
          )}
          {/* Heavy broad Boss torso */}
          <path
            d="M-15 18 L-13 0 L-22 -6 L-12 -11 L12 -11 L22 -6 L13 0 L15 18 Q0 21 -15 18 Z"
            fill={pal.base}
            stroke={stroke}
            strokeWidth={sw}
          />
          <path d="M0 -11 L12 -11 L22 -6 L13 0 L15 18 Q7 20 0 19.5 Z" fill={pal.shade} opacity="0.6" />
          {/* Spiked Pauldrons */}
          <path
            d="M-23 -4 L-26 -13 L-16 -11 L-10 -9 L-12 -1 Z"
            fill={pal.light}
            stroke={stroke}
            strokeWidth={sw}
          />
          <path
            d="M23 -4 L26 -13 L16 -11 L10 -9 L12 -1 Z"
            fill={pal.shade}
            stroke={stroke}
            strokeWidth={sw}
          />
          {/* Chest spikes & core */}
          <polygon points="0,-4 6,3 0,10 -6,3" fill={pal.deep} stroke={stroke} strokeWidth="1.1" />
          <circle cx="0" cy="3" r="2.6" fill={pal.glow} />
          {/* Horned Helm */}
          <path
            d="M-9 -17 Q-20 -23.5 -22 -14 Q-15 -15 -9 -12 Z"
            fill={pal.light}
            stroke={stroke}
            strokeWidth={sw}
          />
          <path
            d="M9 -17 Q20 -23.5 22 -14 Q15 -15 9 -12 Z"
            fill={pal.light}
            stroke={stroke}
            strokeWidth={sw}
          />
          <rect
            x="-9.5"
            y="-22"
            width="19"
            height="13.5"
            rx="4.5"
            fill={pal.base}
            stroke={stroke}
            strokeWidth={sw}
          />
          {/* Fierce glowing eyes */}
          <path d="M-6 -16 L-2 -14.5 L-5.5 -13.2 Z" fill="#fde047" />
          <path d="M6 -16 L2 -14.5 L5.5 -13.2 Z" fill="#fde047" />
        </g>
      );
    }

    case 'transform-gizmo': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <ellipse
            cx="0"
            cy="12"
            rx="23"
            ry="8.5"
            fill={pal.base}
            fillOpacity="0.16"
            stroke={pal.glow}
            strokeWidth="1.4"
            strokeDasharray="4 3"
          />
          <ellipse cx="0" cy="12" rx="11" ry="4" fill="none" stroke={pal.light} strokeWidth="1.2" />
          {/* Z axis (Up - Blue) */}
          <line x1="0" y1="9" x2="0" y2="-19" stroke="#5299e8" strokeWidth="2.6" />
          <polygon points="0,-24 -4,-16 4,-16" fill="#5299e8" stroke={stroke} strokeWidth="1" />
          {/* X axis (Right-Down - Red) */}
          <line x1="0" y1="9" x2="20" y2="17" stroke="#eb5757" strokeWidth="2.4" />
          <polygon points="24,18.5 16,12.5 17.5,19.5" fill="#eb5757" stroke={stroke} strokeWidth="1" />
          {/* Y axis (Left-Down - Green) */}
          <line x1="0" y1="9" x2="-20" y2="17" stroke="#52c46d" strokeWidth="2.4" />
          <polygon points="-24,18.5 -17.5,19.5 -16,12.5" fill="#52c46d" stroke={stroke} strokeWidth="1" />
          {/* Origin Gizmo Node */}
          <circle cx="0" cy="9" r="4.5" fill={pal.light} stroke={stroke} strokeWidth={sw} />
        </g>
      );
    }

    case 'squad': {
      const mini = (ox: number, oy: number, s: number, bodyFill: string, headFill: string) => (
        <g transform={`translate(${ox}, ${oy}) scale(${s})`}>
          <path
            d="M-9 14 L-8 0 L-12 -3 L-7 -7 L7 -7 L12 -3 L8 0 L9 14 Z"
            fill={bodyFill}
            stroke={stroke}
            strokeWidth={sw / s}
          />
          <circle cx="0" cy="-14" r="6.5" fill={headFill} stroke={stroke} strokeWidth={sw / s} />
          <path d="M-3.5 -14 Q0 -12.8 3.5 -14" stroke={pal.glow} strokeWidth="1.8" fill="none" />
        </g>
      );
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M-23 13 Q0 22 23 13"
            fill="none"
            stroke={pal.glow}
            strokeWidth="1.5"
            strokeDasharray="3.5 3"
          />
          {mini(-15, 2, 0.72, pal.shade, pal.base)}
          {mini(15, 2, 0.72, pal.shade, pal.base)}
          {mini(0, 0, 0.9, pal.base, pal.light)}
        </g>
      );
    }

    case 'aoe-targets': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <ellipse
            cx="0"
            cy="10"
            rx="26"
            ry="11"
            fill={pal.glow}
            fillOpacity="0.16"
            stroke={pal.glow}
            strokeWidth="1.5"
            strokeDasharray="5 3"
          />
          {[
            { x: -13, y: 2, s: 0.68 },
            { x: 13, y: 2, s: 0.68 },
            { x: 0, y: 6, s: 0.76 }
          ].map((p, idx) => (
            <g key={idx} transform={`translate(${p.x}, ${p.y}) scale(${p.s})`}>
              <path d="M-8 10 L-6 -3 H6 L8 10 Z" fill={pal.base} stroke={stroke} strokeWidth={1.6} />
              <circle cx="0" cy="-10" r="5.5" fill={pal.light} stroke={stroke} strokeWidth={1.6} />
              <circle cx="0" cy="-10" r="9.5" fill="none" stroke="#ef4444" strokeWidth="1.3" strokeDasharray="3 2" />
            </g>
          ))}
        </g>
      );
    }

    case 'server-rack': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Sleek cylindrical/rounded Dedicated Server Tower */}
          <path
            d="M-16 -14 C-16 -20, 16 -20, 16 -14 V14 C16 20, -16 20, -16 14 Z"
            fill={pal.base}
            stroke={stroke}
            strokeWidth={sw}
          />
          {/* Right shaded curvature */}
          <path
            d="M2 -18.5 C10 -18, 16 -16, 16 -14 V14 C16 17.5, 9 19.2, 2 19.5 Z"
            fill={pal.shade}
            opacity="0.55"
          />
          {/* Top elliptical dome cap */}
          <ellipse cx="0" cy="-14" rx="16" ry="5" fill={pal.light} stroke={stroke} strokeWidth={sw} />
          {/* 3 recessed server blade bays */}
          {[-4, 4, 12].map((by, idx) => (
            <g key={idx} transform={`translate(0, ${by})`}>
              <rect x="-11.5" y="-3" width="23" height="5.4" rx="2.2" fill={pal.deep} />
              <circle cx="-7.5" cy="-0.3" r="1.4" fill={idx === 0 ? '#4ade80' : pal.glow} />
              <line x1="-3" y1="-0.3" x2="7.5" y2="-0.3" stroke={pal.light} strokeWidth="1.3" opacity="0.7" />
            </g>
          ))}
          {/* Authority Crown Seal at top-right */}
          <g transform="translate(15, -16)">
            <circle cx="0" cy="0" r="8" fill={pal.glow} stroke={stroke} strokeWidth="1.2" />
            <path d="M-4 2.5 L-4.5 -2.5 L-1.5 0 L0 -3.5 L1.5 0 L4.5 -2.5 L4 2.5 Z" fill="#fff" stroke={stroke} strokeWidth="0.7" />
          </g>
        </g>
      );
    }

    case 'ai-chip': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Synaptic pins */}
          {[-7, 0, 7].map((v) => (
            <g key={v} stroke={pal.light} strokeWidth="2">
              <line x1="-19" y1={v} x2="-14" y2={v} />
              <line x1={v} y1="-19" x2={v} y2="-14" />
              <line x1={v} y1="14" x2={v} y2="19" />
            </g>
          ))}
          <polygon
            points="-8,-15 8,-15 15,-8 15,8 8,15 -8,15 -15,8 -15,-8"
            fill={pal.base}
            stroke={stroke}
            strokeWidth={sw}
          />
          <circle cx="0" cy="0" r="8.5" fill={pal.deep} />
          {/* AI neural eye */}
          <circle cx="0" cy="0" r="4.2" fill={pal.glow} />
          <circle cx="0" cy="0" r="1.7" fill="#fff" />
          {/* Severed connection badge */}
          <g transform="translate(16, -13)">
            <circle cx="0" cy="0" r="6.5" fill="#e5534b" stroke={stroke} strokeWidth="1.1" />
            <path d="M-2.5 -2.5 L2.5 2.5 M2.5 -2.5 L-2.5 2.5" stroke="#fff" strokeWidth="1.7" />
          </g>
        </g>
      );
    }

    case 'execcalc-core': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Incoming modifier conduits from left */}
          <path d="M-26 -10 H-13 M-28 0 H-15 M-26 10 H-13" stroke={pal.light} strokeWidth="2.1" />
          {/* Outgoing damage ray to right */}
          <path d="M14 0 H26" stroke={pal.glow} strokeWidth="3" />
          <polygon points="29,0 22,-4 22,4" fill={pal.glow} />
          {/* Octagonal Processor Core */}
          <polygon
            points="-9,-16 9,-16 17,-8 17,8 9,16 -9,16 -17,8 -17,-8"
            fill={pal.base}
            stroke={stroke}
            strokeWidth={sw}
          />
          <polygon points="0,-16 9,-16 17,-8 17,8 9,16 0,16" fill={pal.shade} opacity="0.5" />
          <circle cx="0" cy="0" r="9.5" fill={pal.deep} stroke={pal.light} strokeWidth="1.2" />
          {/* Calculation lightning gear */}
          <path d="M1.5 -7 L-4.5 0.5 H0.5 L-1.5 7 L5 -0.5 H0 Z" fill={pal.glow} />
        </g>
      );
    }

    case 'client-terminal': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Stand */}
          <path d="M-5 8 L-8 17 H8 L5 8 Z" fill={pal.shade} stroke={stroke} strokeWidth={sw} />
          <ellipse cx="0" cy="17.5" rx="12" ry="3.2" fill={pal.deep} stroke={stroke} strokeWidth="1.1" />
          {/* Curved Gaming Monitor */}
          <path
            d="M-24 -17 Q0 -20 24 -17 L22 7 Q0 10 -22 7 Z"
            fill={pal.base}
            stroke={stroke}
            strokeWidth={sw}
          />
          <path d="M-20 -13.5 Q0 -16 20 -13.5 L18.5 4 Q0 6.5 -18.5 4 Z" fill={pal.deep} />
          {/* Screen HUD bars */}
          <rect x="-14" y="-9.5" width="18" height="3.2" rx="1.5" fill="#4ade80" />
          <rect x="-14" y="-4" width="12" height="2.6" rx="1.3" fill={pal.glow} />
          <circle cx="11" cy="-5" r="4.5" fill={pal.light} opacity="0.9" />
          {/* Mini controller silhouette in front */}
          <g transform="translate(13, 13)">
            <path
              d="M-9 -2 C-11 -4, -13 2, -10 5 C-8 7, -5 3, -3 2 H3 C5 3, 8 7, 10 5 C13 2, 11 -4, 9 -2 Z"
              fill={pal.light}
              stroke={stroke}
              strokeWidth="1.2"
            />
            <circle cx="5.5" cy="0" r="1.1" fill={pal.deep} />
            <circle cx="-5.5" cy="0" r="1.1" fill={pal.deep} />
          </g>
        </g>
      );
    }

    case 'gamepad-input': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Input pulse waves */}
          <path d="M-8 -16 Q0 -21 8 -16" fill="none" stroke={pal.glow} strokeWidth="1.8" />
          <path d="M-13 -20 Q0 -27 13 -20" fill="none" stroke={pal.light} strokeWidth="1.4" opacity="0.8" />
          {/* Gamepad body */}
          <path
            d="M-13 -9 H13 C20 -9, 25 2, 22 11 C20 17, 14 15, 10 8 L7 4 H-7 L-10 8 C-14 15, -20 17, -22 11 C-25 2, -20 -9, -13 -9 Z"
            fill={pal.base}
            stroke={stroke}
            strokeWidth={sw}
          />
          <path d="M0 -9 H13 C20 -9, 25 2, 22 11 C20 17, 14 15, 10 8 L7 4 H0 Z" fill={pal.shade} opacity="0.45" />
          {/* D-pad */}
          <path d="M-14 -3 H-8 M-11 -6 V0" stroke={pal.light} strokeWidth="2.4" />
          {/* Face buttons */}
          <circle cx="11" cy="-5" r="1.6" fill="#f59e0b" />
          <circle cx="14.5" cy="-2" r="1.6" fill="#ef4444" />
          <circle cx="11" cy="1" r="1.6" fill="#4ade80" />
          <circle cx="7.5" cy="-2" r="1.6" fill="#60a5fa" />
          {/* Thumbsticks */}
          <circle cx="-5.5" cy="2" r="2.8" fill={pal.deep} stroke={pal.light} strokeWidth="1" />
          <circle cx="5.5" cy="2" r="2.8" fill={pal.deep} stroke={pal.light} strokeWidth="1" />
        </g>
      );
    }

    case 'reticle-ray': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Ray trace line */}
          <line x1="-7" y1="-3" x2="20" y2="12" stroke={pal.glow} strokeWidth="2.2" strokeDasharray="4 2.5" />
          {/* Hit star on target */}
          <path d="M20 6 L21.8 10.2 L26 12 L21.8 13.8 L20 18 L18.2 13.8 L14 12 L18.2 10.2 Z" fill="#f59e0b" stroke={stroke} strokeWidth="1" />
          {/* Crosshair scope */}
          <circle cx="-8" cy="-4" r="14" fill={pal.base} fillOpacity="0.22" stroke={pal.light} strokeWidth="2" />
          <circle cx="-8" cy="-4" r="9" fill="none" stroke={stroke} strokeWidth="1.2" />
          <line x1="-25" y1="-4" x2="-17" y2="-4" stroke={pal.glow} strokeWidth="2" />
          <line x1="1" y1="-4" x2="9" y2="-4" stroke={pal.glow} strokeWidth="2" />
          <line x1="-8" y1="-21" x2="-8" y2="-13" stroke={pal.glow} strokeWidth="2" />
          <line x1="-8" y1="5" x2="-8" y2="13" stroke={pal.glow} strokeWidth="2" />
          <circle cx="-8" cy="-4" r="2.5" fill="#ef4444" />
        </g>
      );
    }

    case 'tampered-client': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M-5 8 L-8 17 H8 L5 8 Z" fill={pal.shade} stroke={stroke} strokeWidth={sw} />
          <path
            d="M-22 -16 L22 -18 L20 8 L-20 6 Z"
            fill={pal.base}
            stroke={stroke}
            strokeWidth={sw}
          />
          <path d="M-18 -13 L18 -14.5 L16.5 4.5 L-16.5 3 Z" fill={pal.deep} />
          {/* Red glitch bars + warning triangle */}
          <line x1="-15" y1="-8" x2="14" y2="-8" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 3" />
          <polygon points="0,-12 -8,2 8,2" fill="#ef4444" stroke="#fff" strokeWidth="1" />
          <line x1="0" y1="-7.5" x2="0" y2="-2.5" stroke="#fff" strokeWidth="1.8" />
          <circle cx="0" cy="0" r="1" fill="#fff" />
        </g>
      );
    }

    case 'fx-output': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Sound speaker */}
          <path d="M-21 -4 H-14 L-6 -12 V8 L-14 0 H-21 Z" fill={pal.base} stroke={stroke} strokeWidth={sw} />
          <path d="M-2 -7 Q2 -2 -2 3" fill="none" stroke={pal.light} strokeWidth="1.8" />
          <path d="M2 -11 Q8 -2 2 7" fill="none" stroke={pal.glow} strokeWidth="1.8" />
          {/* Niagara Spark burst */}
          <path
            d="M14 -15 L16.5 -7.5 L24 -5 L16.5 -2.5 L14 5 L11.5 -2.5 L4 -5 L11.5 -7.5 Z"
            fill="#fbbf24"
            stroke={stroke}
            strokeWidth="1.1"
          />
          <circle cx="22" cy="-14" r="2.2" fill={pal.glow} />
          <circle cx="19" cy="9" r="2" fill="#f43f5e" />
        </g>
      );
    }

    case 'wifi-jitter': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M-5 9 L-8 17 H8 L5 9 Z" fill={pal.shade} stroke={stroke} strokeWidth={sw} />
          <path
            d="M-21 -9 Q0 -12 21 -9 L19 8 Q0 11 -19 8 Z"
            fill={pal.base}
            stroke={stroke}
            strokeWidth={sw}
          />
          <path d="M-17 -5.5 Q0 -8 17 -5.5 L15.5 5 Q0 7.5 -15.5 5 Z" fill={pal.deep} />
          {/* Stuttering Wi-Fi arcs */}
          <path d="M-11 -16 Q0 -24 11 -16" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 3" />
          <path d="M-6.5 -12.5 Q0 -17.5 6.5 -12.5" fill="none" stroke="#ef4444" strokeWidth="2" />
          <text x="0" y="3" textAnchor="middle" fontSize="9.2" fontWeight="800" fill="#fbbf24">
            ! LAG
          </text>
        </g>
      );
    }

    case 'playerstate':
    case 'playerstate-slow': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Crest-shaped Persistent Player Identity Card */}
          <path
            d="M-21 -15 Q0 -19 21 -15 L19 7 Q0 21 -19 7 Z"
            fill={pal.base}
            stroke={stroke}
            strokeWidth={sw}
          />
          <path d="M0 -17 Q11 -16.5 21 -15 L19 7 Q10 14 0 16 Z" fill={pal.shade} opacity="0.45" />
          {/* Inner dark faceplate */}
          <path d="M-16 -10.5 Q0 -13.5 16 -10.5 L14.5 5 Q0 15.5 -14.5 5 Z" fill={pal.deep} />
          {/* Mini avatar bust */}
          <circle cx="-6" cy="-4" r="3.4" fill={pal.light} />
          <path d="M-11 4 C-11 0, -1 0, -1 4 Z" fill={pal.light} />
          {/* Level star & bars */}
          <polygon points="6,-8 7.4,-5 10.5,-5 8,-3 9,0 6,-1.8 3,0 4,-3 1.5,-5 4.6,-5" fill="#fbbf24" />
          <line x1="2" y1="3.5" x2="11" y2="3.5" stroke={pal.glow} strokeWidth="2" />
          {/* Pulse heartbeat across bottom */}
          <polyline
            points="-10,9 -4,9 -2,5 1,12 3,9 10,9"
            fill="none"
            stroke={kind === 'playerstate-slow' ? '#ef4444' : '#4ade80'}
            strokeWidth="1.7"
          />
          {kind === 'playerstate-slow' && (
            <g transform="translate(17, -14)">
              <circle cx="0" cy="0" r="7.5" fill="#ef4444" stroke={stroke} strokeWidth="1.1" />
              <text x="0" y="3" textAnchor="middle" fontSize="7.5" fontWeight="900" fill="#fff">
                1Hz
              </text>
            </g>
          )}
        </g>
      );
    }

    case 'asc-hub':
    case 'asc-master': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Radiating orbital circuit spokes */}
          {[
            [-21, -13],
            [21, -13],
            [-21, 13],
            [21, 13]
          ].map(([sx, sy], idx) => (
            <g key={idx}>
              <line x1="0" y1="0" x2={sx} y2={sy} stroke={pal.light} strokeWidth="1.7" opacity="0.85" />
              <circle cx={sx} cy={sy} r="3.8" fill={pal.glow} stroke={stroke} strokeWidth="1.2" />
            </g>
          ))}
          {/* Main hexagonal ASC reactor body */}
          <polygon
            points="0,-20 17.5,-10 17.5,10 0,20 -17.5,10 -17.5,-10"
            fill={pal.base}
            stroke={stroke}
            strokeWidth={sw}
          />
          <polygon points="0,-20 17.5,-10 17.5,10 0,20" fill={pal.shade} opacity="0.48" />
          <polygon
            points="0,-13 11.5,-6.5 11.5,6.5 0,13 -11.5,6.5 -11.5,-6.5"
            fill={pal.deep}
            stroke={pal.light}
            strokeWidth="1.1"
          />
          <circle cx="0" cy="0" r="6" fill={pal.glow} />
          {kind === 'asc-master' ? (
            <polygon points="0,-5 1.5,-1.5 5,-1.5 2.2,0.8 3.2,4.5 0,2.2 -3.2,4.5 -2.2,0.8 -5,-1.5 -1.5,-1.5" fill="#fff" />
          ) : (
            <circle cx="0" cy="0" r="2.6" fill="#fff" opacity="0.9" />
          )}
        </g>
      );
    }

    case 'aggregator-prism': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Incoming modifier rays */}
          <path d="M-27 -11 Q-16 -7 -8 -3" fill="none" stroke="#60a5fa" strokeWidth="2.2" />
          <path d="M-28 0 H-10" fill="none" stroke="#f59e0b" strokeWidth="2.2" />
          <path d="M-27 11 Q-16 7 -8 3" fill="none" stroke="#c084fc" strokeWidth="2.2" />
          {/* Unified output beam */}
          <line x1="11" y1="0" x2="27" y2="0" stroke={pal.glow} strokeWidth="3.5" />
          <polygon points="30,0 22,-4.5 22,4.5" fill={pal.glow} />
          {/* Faceted mixing crystal lens */}
          <polygon points="0,-18 14,0 0,18 -14,0" fill={pal.base} stroke={stroke} strokeWidth={sw} />
          <polygon points="0,-18 14,0 0,0" fill={pal.light} opacity="0.7" />
          <polygon points="0,0 14,0 0,18" fill={pal.shade} opacity="0.6" />
          <circle cx="0" cy="0" r="4.5" fill={pal.glow} stroke="#fff" strokeWidth="1" />
        </g>
      );
    }

    case 'meta-funnel': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Incoming bolts */}
          <circle cx="-11" cy="-21" r="2.6" fill="#ef4444" />
          <circle cx="0" cy="-23" r="3" fill="#f59e0b" />
          <circle cx="11" cy="-21" r="2.6" fill="#a855f7" />
          {/* Conical funnel body */}
          <path
            d="M-21 -14 H21 L7 4 V16 L-7 19 V4 Z"
            fill={pal.base}
            stroke={stroke}
            strokeWidth={sw}
          />
          <path d="M0 -14 H21 L7 4 V16 L0 17.5 Z" fill={pal.shade} opacity="0.55" />
          <ellipse cx="0" cy="-14" rx="21" ry="5" fill={pal.light} stroke={stroke} strokeWidth={sw} />
          <ellipse cx="0" cy="-14" rx="14" ry="2.8" fill={pal.deep} />
          {/* Clean channeled output drop */}
          <path d="M0 19 C3 22, 3 25, 0 25 C-3 25, -3 22, 0 19 Z" fill={pal.glow} />
        </g>
      );
    }

    case 'data-stack': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {[-13, -1, 11].map((sy, idx) => (
            <g key={idx} transform={`translate(${idx === 1 ? 2 : -2}, ${sy})`}>
              <rect
                x="-19"
                y="-5"
                width="38"
                height="10"
                rx="5"
                fill={idx === 0 ? pal.light : idx === 1 ? pal.base : pal.shade}
                stroke={stroke}
                strokeWidth={sw}
              />
              <circle cx="-11" cy="0" r="2" fill={pal.glow} />
              <line x1="-5" y1="0" x2="12" y2="0" stroke={pal.deep} strokeWidth="2" />
            </g>
          ))}
          <path d="M21 -10 Q27 0 21 10" fill="none" stroke={pal.glow} strokeWidth="1.8" />
          <polygon points="21,12 17.5,7.5 23.5,8" fill={pal.glow} />
        </g>
      );
    }

    case 'stack-core': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Left stack of 5 rings */}
          {[12, 7, 2, -3, -8].map((ry, i) => (
            <ellipse
              key={`l-${i}`}
              cx="-11"
              cy={ry}
              rx="10"
              ry="3.6"
              fill={i === 4 ? '#86efac' : '#4ade80'}
              stroke={stroke}
              strokeWidth="1.1"
            />
          ))}
          {/* Right stack of 5 rings */}
          {[12, 7, 2, -3, -8].map((ry, i) => (
            <ellipse
              key={`r-${i}`}
              cx="11"
              cy={ry}
              rx="10"
              ry="3.6"
              fill={i === 4 ? '#99f6e4' : '#2dd4bf'}
              stroke={stroke}
              strokeWidth="1.1"
            />
          ))}
          <circle cx="0" cy="-14" r="6" fill={pal.base} stroke={stroke} strokeWidth={sw} />
        </g>
      );
    }

    case 'leaked-core': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <polygon
            points="0,-17 15,-8 15,8 0,17 -15,8 -15,-8"
            fill={pal.base}
            stroke={stroke}
            strokeWidth={sw}
          />
          {/* Jagged crack */}
          <polyline points="-4,-13 2,-4 -3,3 4,13" fill="none" stroke="#fff" strokeWidth="1.8" />
          {/* Dangling ghost handles */}
          <path d="M15 4 Q23 7 22 14" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeDasharray="3 2" />
          <circle cx="22" cy="15" r="3" fill="#ef4444" />
          <path d="M-15 -3 Q-24 -6 -22 -13" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="3 2" />
          <circle cx="-22" cy="-14" r="2.8" fill="#f59e0b" />
        </g>
      );
    }

    case 'attr-bars': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Vertical Spine */}
          <rect x="-21" y="-17" width="5" height="34" rx="2.5" fill={pal.light} stroke={stroke} strokeWidth={sw} />
          {/* 3 Horizontal RPG Resource Bars (top bar reflects node color semantics) */}
          {[
            { y: -13.5, w: 36, h: 10, fillW: 29, barCol: pal.base, shine: pal.light },
            { y: -1, w: 33, h: 8.5, fillW: 22, barCol: pal.glow, shine: pal.rim },
            { y: 11, w: 29, h: 8.5, fillW: 24, barCol: pal.shade, shine: pal.light }
          ].map((b, i) => (
            <g key={i} transform={`translate(-13, ${b.y})`}>
              <rect x="0" y={-b.h / 2} width={b.w} height={b.h} rx={b.h / 2} fill={pal.deep} stroke={stroke} strokeWidth="1.15" />
              <rect x="1.5" y={-b.h / 2 + 1.5} width={b.fillW} height={b.h - 3} rx={(b.h - 3) / 2} fill={b.barCol} />
              <line x1="4" y1={-b.h / 2 + 2.6} x2={b.fillW - 2} y2={-b.h / 2 + 2.6} stroke={b.shine} strokeWidth="1.1" opacity="0.7" />
            </g>
          ))}
          {/* Attribute crystal accent badge */}
          <polygon points="18,-19 23,-14 18,-9 13,-14" fill={pal.glow} stroke={stroke} strokeWidth="1.1" />
        </g>
      );
    }

    case 'ammo-mag': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Curved magazine silhouette */}
          <path
            d="M-18 -14 L-4 -17 L0 12 Q-6 17 -14 15 Z"
            fill={pal.base}
            stroke={stroke}
            strokeWidth={sw}
          />
          <path d="M-12 -10 L-7 -11 L-4 10" fill="none" stroke={pal.light} strokeWidth="1.5" />
          {/* 3 gleaming brass cartridges */}
          {[4, 12, 20].map((bx, idx) => (
            <g key={idx} transform={`translate(${bx}, ${idx * 2 - 2})`}>
              <rect x="-2.5" y="-8" width="5" height="15" rx="1.5" fill="#f59e0b" stroke={stroke} strokeWidth="1.1" />
              <path d="M-2.5 -8 Q0 -15 2.5 -8 Z" fill="#fcd34d" stroke={stroke} strokeWidth="1" />
            </g>
          ))}
        </g>
      );
    }

    case 'raw-float': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round" transform="rotate(-7)">
          {/* Unstable oscillating scalar bubble */}
          <path
            d="M-12 -11 H12 A11 11 0 0 1 12 11 H-12 A11 11 0 0 1 -12 -11 Z"
            fill={pal.base}
            stroke={stroke}
            strokeWidth={sw}
          />
          <path d="M6 -11 L2 -2 L8 4 L3 11" fill="none" stroke="#fff" strokeWidth="1.5" />
          <text x="-2" y="4" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#fff">
            3.14f
          </text>
          <path d="M-18 -14 L-15 -18 L-12 -14 M12 14 L15 18 L18 14" fill="none" stroke={pal.glow} strokeWidth="1.7" />
        </g>
      );
    }

    case 'ability-sigil': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Flowing energy wings */}
          <path
            d="M-13 -4 Q-25 -13 -26 -3 Q-23 6 -11 7 Z"
            fill={pal.light}
            stroke={stroke}
            strokeWidth={sw}
          />
          <path
            d="M13 -4 Q25 -13 26 -3 Q23 6 11 7 Z"
            fill={pal.shade}
            stroke={stroke}
            strokeWidth={sw}
          />
          {/* Octagonal central spell crest */}
          <polygon
            points="0,-20 13,-12 15,4 0,18 -15,4 -13,-12"
            fill={pal.base}
            stroke={stroke}
            strokeWidth={sw}
          />
          <polygon points="0,-20 13,-12 15,4 0,18" fill={pal.shade} opacity="0.4" />
          <circle cx="0" cy="-1" r="8.5" fill={pal.deep} />
          {/* 4-point ability star */}
          <path
            d="M0 -9 L2.2 -2.8 L8.5 -0.8 L2.2 1.2 L0 7.5 L-2.2 1.2 L-8.5 -0.8 L-2.2 -2.8 Z"
            fill={pal.glow}
          />
        </g>
      );
    }

    case 'fireball': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Swirling outer flame envelope */}
          <path
            d="M-24 12 C-20 -6, -8 -22, 6 -21 C18 -20, 23 -6, 17 7 C11 19, -8 21, -24 12 Z"
            fill={pal.base}
            stroke={stroke}
            strokeWidth={sw}
          />
          <path
            d="M-14 10 C-11 -3, -2 -14, 7 -13 C15 -12, 17 -2, 12 6 C7 14, -4 15, -14 10 Z"
            fill={pal.glow}
          />
          <circle cx="5" cy="-1" r="8" fill={pal.light} />
          <circle cx="6.5" cy="-2" r="3.8" fill="#fff" opacity="0.9" />
          <circle cx="-22" cy="-5" r="2.2" fill={pal.glow} />
          <circle cx="-17" cy="-15" r="1.8" fill={pal.light} />
        </g>
      );
    }

    case 'sprint-wing': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Speed motion lines */}
          <line x1="-26" y1="-8" x2="-13" y2="-8" stroke={pal.glow} strokeWidth="2.2" />
          <line x1="-28" y1="0" x2="-16" y2="0" stroke={pal.light} strokeWidth="2.2" />
          <line x1="-24" y1="8" x2="-12" y2="8" stroke={pal.glow} strokeWidth="2.2" />
          {/* Winged double chevrons */}
          <path d="M-10 -14 L6 0 L-10 14 L-3 14 L13 0 L-3 -14 Z" fill={pal.light} stroke={stroke} strokeWidth={sw} />
          <path d="M3 -14 L19 0 L3 14 L10 14 L26 0 L10 -14 Z" fill={pal.base} stroke={stroke} strokeWidth={sw} />
        </g>
      );
    }

    case 'death-skull': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M-13 -4 C-13 -16, 13 -16, 13 -4 C13 3, 9 6, 8 10 V15 H-8 V10 C-9 6, -13 3, -13 -4 Z"
            fill={pal.light}
            stroke={stroke}
            strokeWidth={sw}
          />
          <circle cx="-5" cy="-3" r="3.2" fill={pal.deep} />
          <circle cx="5" cy="-3" r="3.2" fill={pal.deep} />
          <polygon points="0,1 -2,5 2,5" fill={pal.deep} />
          <line x1="-3.5" y1="10.5" x2="-3.5" y2="15" stroke={stroke} strokeWidth="1.2" />
          <line x1="0" y1="10.5" x2="0" y2="15" stroke={stroke} strokeWidth="1.2" />
          <line x1="3.5" y1="10.5" x2="3.5" y2="15" stroke={stroke} strokeWidth="1.2" />
        </g>
      );
    }

    case 'charged-shot': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Charged orb & reticle */}
          <circle cx="-9" cy="0" r="12" fill={pal.base} stroke={stroke} strokeWidth={sw} />
          <circle cx="-9" cy="0" r="7" fill={pal.glow} />
          <circle cx="-9" cy="0" r="3" fill="#fff" />
          {/* Plasma beam */}
          <path d="M3 -4 L26 0 L3 4 Z" fill="#fde047" stroke={stroke} strokeWidth="1" />
          <line x1="-9" y1="-16" x2="-9" y2="-11" stroke={pal.light} strokeWidth="2" />
          <line x1="-9" y1="11" x2="-9" y2="16" stroke={pal.light} strokeWidth="2" />
        </g>
      );
    }

    case 'single-instance': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="0" cy="1" rx="22" ry="9" fill="none" stroke={pal.glow} strokeWidth="1.6" strokeDasharray="4 3" />
          <polygon points="0,-19 13,-2 0,17 -13,-2" fill={pal.base} stroke={stroke} strokeWidth={sw} />
          <polygon points="0,-19 13,-2 0,-2" fill={pal.light} />
          <polygon points="0,-2 13,-2 0,17" fill={pal.shade} />
          <circle cx="0" cy="-2" r="3.5" fill="#fff" opacity="0.85" />
        </g>
      );
    }

    case 'multi-instance': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {[
            { x: -12, y: -4, fill: pal.shade, op: 0.7 },
            { x: 0, y: 0, fill: pal.base, op: 0.9 },
            { x: 12, y: 4, fill: pal.light, op: 1 }
          ].map((c, idx) => (
            <polygon
              key={idx}
              points={`${c.x},${c.y - 14} ${c.x + 9},${c.y} ${c.x},${c.y + 14} ${c.x - 9},${c.y}`}
              fill={c.fill}
              opacity={c.op}
              stroke={stroke}
              strokeWidth={sw}
            />
          ))}
        </g>
      );
    }

    case 'ge-crystal': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <polygon points="0,-20 16,-4 10,16 -10,16 -16,-4" fill={pal.base} stroke={stroke} strokeWidth={sw} />
          <polygon points="0,-20 16,-4 0,-2 -16,-4" fill={pal.light} />
          <polygon points="0,-2 16,-4 10,16 0,16" fill={pal.shade} opacity="0.6" />
          {/* Upward + modifier sparkles */}
          <path d="M17 -16 H23 M20 -19 V-13" stroke={pal.glow} strokeWidth="2.2" />
          <circle cx="-18" cy="-14" r="2.2" fill={pal.glow} />
        </g>
      );
    }

    case 'potion-heal': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Cork */}
          <rect x="-4.5" y="-21" width="9" height="5" rx="1.5" fill="#c79563" stroke={stroke} strokeWidth="1.2" />
          {/* Bottle neck & rounded flask */}
          <path
            d="M-6 -16 H6 L5 -9 C14 -6, 17 4, 15 12 C13 18, -13 18, -15 12 C-17 4, -14 -6, -5 -9 Z"
            fill={pal.light}
            stroke={stroke}
            strokeWidth={sw}
          />
          {/* Glowing healing liquid inside */}
          <path
            d="M-13 2 C-6 0, 6 4, 13 2 C14 9, 11 15, 0 15 C-11 15, -14 9, -13 2 Z"
            fill={pal.base}
          />
          {/* Crisp white + cross */}
          <path d="M0 3 V11 M-4 7 H4" stroke="#fff" strokeWidth="2.6" />
          {/* Glass shine */}
          <path d="M-10 -2 Q-12 3 -10 8" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.8" />
        </g>
      );
    }

    case 'potion-poison': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Bubbles rising */}
          <circle cx="-3" cy="-21" r="2" fill="#a3e635" />
          <circle cx="4" cy="-24" r="2.6" fill={pal.glow} />
          {/* Conical flask */}
          <rect x="-5" y="-17" width="10" height="4" rx="1.2" fill={pal.shade} stroke={stroke} strokeWidth="1.2" />
          <path
            d="M-4 -13 H4 L16 12 C17 16, 13 18, 0 18 C-13 18, -17 16, -16 12 Z"
            fill={pal.light}
            stroke={stroke}
            strokeWidth={sw}
          />
          <path
            d="M-10 3 Q0 6 10 3 L14.5 12 C15 15, 10 16.5, 0 16.5 C-10 16.5, -15 15, -14.5 12 Z"
            fill={pal.base}
          />
          <circle cx="-4" cy="10" r="2" fill="#a3e635" />
          <circle cx="4" cy="12" r="1.5" fill="#fff" opacity="0.85" />
        </g>
      );
    }

    case 'ice-rune': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <polygon points="0,-20 17,-10 17,10 0,20 -17,10 -17,-10" fill={pal.base} fillOpacity="0.28" stroke={pal.light} strokeWidth="1.5" />
          {[0, 60, 120].map((deg) => (
            <g key={deg} transform={`rotate(${deg})`}>
              <line x1="0" y1="-17" x2="0" y2="17" stroke={pal.light} strokeWidth="2.4" />
              <polyline points="-4,-11 0,-14 4,-11" fill="none" stroke="#fff" strokeWidth="1.4" />
              <polyline points="-4,11 0,14 4,11" fill="none" stroke="#fff" strokeWidth="1.4" />
            </g>
          ))}
          <circle cx="0" cy="0" r="4.5" fill="#fff" stroke={pal.glow} strokeWidth="1.5" />
        </g>
      );
    }

    case 'flame-aura': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M0 -21 C9 -11, 18 -3, 15 9 C13 16, 6 19, 0 19 C-7 19, -15 15, -15 7 C-15 -3, -6 -9, -4 -14 C-1 -11, 0 -17, 0 -21 Z"
            fill="#ef4444"
            stroke={stroke}
            strokeWidth={sw}
          />
          <path
            d="M0 -11 C6 -4, 10 2, 8 10 C6 15, 2 17, 0 17 C-4 17, -9 14, -9 8 C-9 2, -3 -3, 0 -11 Z"
            fill="#f59e0b"
          />
          <path d="M0 1 C3 5, 4 10, 0 14 C-4 10, -3 5, 0 1 Z" fill="#fef08a" />
        </g>
      );
    }

    case 'grenade-blast': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Radial blast arcs */}
          <path d="M-22 -10 Q-26 0 -22 10" fill="none" stroke="#f97316" strokeWidth="2" />
          <path d="M22 -10 Q26 0 22 10" fill="none" stroke="#f97316" strokeWidth="2" />
          {/* Grenade cap & pin */}
          <rect x="-5" y="-18" width="10" height="5" rx="1.5" fill={pal.shade} stroke={stroke} strokeWidth="1.2" />
          <circle cx="10" cy="-14" r="4" fill="none" stroke={pal.light} strokeWidth="1.8" />
          {/* Body */}
          <ellipse cx="0" cy="2" rx="13" ry="15" fill={pal.base} stroke={stroke} strokeWidth={sw} />
          <line x1="-12" y1="-2" x2="12" y2="-2" stroke={pal.deep} strokeWidth="1.3" />
          <line x1="-12" y1="6" x2="12" y2="6" stroke={pal.deep} strokeWidth="1.3" />
          <line x1="0" y1="-13" x2="0" y2="17" stroke={pal.deep} strokeWidth="1.3" />
        </g>
      );
    }

    case 'ge-modular': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* 4 modular component chips docked around central host */}
          {[
            { x: -16, y: -11, col: '#4ade80' },
            { x: 16, y: -11, col: '#a855f7' },
            { x: -16, y: 11, col: '#60a5fa' },
            { x: 16, y: 11, col: '#2dd4bf' }
          ].map((c, idx) => (
            <g key={idx}>
              <line x1="0" y1="0" x2={c.x} y2={c.y} stroke={pal.light} strokeWidth="2" />
              <rect
                x={c.x - 6.5}
                y={c.y - 5}
                width="13"
                height="10"
                rx="5"
                fill={c.col}
                stroke={stroke}
                strokeWidth="1.15"
              />
            </g>
          ))}
          <polygon points="0,-14 13,0 0,14 -13,0" fill={pal.base} stroke={stroke} strokeWidth={sw} />
          <circle cx="0" cy="0" r="4" fill={pal.light} />
        </g>
      );
    }

    case 'ge-spec': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Curved blueprint scroll */}
          <path
            d="M-16 -17 H12 L18 -11 V17 Q0 20 -16 17 Z"
            fill={pal.light}
            stroke={stroke}
            strokeWidth={sw}
          />
          <path d="M12 -17 V-11 H18 Z" fill={pal.shade} stroke={stroke} strokeWidth="1.1" />
          <line x1="-10" y1="-8" x2="8" y2="-8" stroke={pal.deep} strokeWidth="2.1" />
          <line x1="-10" y1="-1" x2="10" y2="-1" stroke={pal.deep} strokeWidth="1.8" />
          <line x1="-10" y1="6" x2="4" y2="6" stroke={pal.deep} strokeWidth="1.8" />
          {/* Wax / Spec seal */}
          <circle cx="11" cy="11" r="6.5" fill={pal.glow} stroke={stroke} strokeWidth="1.2" />
          <circle cx="11" cy="11" r="2.5" fill="#fff" />
        </g>
      );
    }

    case 'math-prism': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <line x1="-26" y1="0" x2="-15" y2="0" stroke={pal.light} strokeWidth="2.2" />
          <line x1="15" y1="0" x2="26" y2="0" stroke={pal.glow} strokeWidth="3" />
          <polygon points="0,-19 18,0 0,19 -18,0" fill={pal.base} stroke={stroke} strokeWidth={sw} />
          <polygon points="0,-19 18,0 0,0" fill={pal.light} opacity="0.65" />
          <path d="M-5 -5 L5 5 M5 -5 L-5 5" stroke="#fff" strokeWidth="2.8" />
        </g>
      );
    }

    case 'sword-slash':
    case 'sword-broken': {
      const broken = kind === 'sword-broken';
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {!broken && (
            <path
              d="M-18 14 C-22 -8, -4 -22, 20 -15 C4 -12, -8 -2, -10 14 Z"
              fill={pal.glow}
              opacity="0.32"
            />
          )}
          {/* Blade */}
          {broken ? (
            <>
              <polygon points="-2,-2 17,-21 21,-17 3,2" fill={pal.light} stroke={stroke} strokeWidth={sw} />
              <polygon points="-14,10 -5,1 -1,5 -10,14" fill={pal.base} stroke={stroke} strokeWidth={sw} />
              <path d="M-7 -6 L2 3 M1 -7 L-6 2" stroke="#ef4444" strokeWidth="2.4" />
            </>
          ) : (
            <>
              <polygon
                points="-11,7 14,-18 22,-20 20,-12 -5,13"
                fill={pal.light}
                stroke={stroke}
                strokeWidth={sw}
              />
              <polygon points="-8,10 22,-20 20,-12 -5,13" fill={pal.shade} opacity="0.45" />
            </>
          )}
          {/* Crossguard & Hilt */}
          <line x1="-15" y1="3" x2="-3" y2="15" stroke={pal.base} strokeWidth="4" />
          <line x1="-15" y1="3" x2="-3" y2="15" stroke={stroke} strokeWidth="1.2" />
          <line x1="-11" y1="11" x2="-19" y2="19" stroke={pal.deep} strokeWidth="3.5" />
          <circle cx="-20" cy="20" r="2.8" fill={pal.glow} stroke={stroke} strokeWidth="1.1" />
        </g>
      );
    }

    case 'aegis-shield':
    case 'shield-clamp':
    case 'security-gate': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {kind === 'shield-clamp' && (
            <g stroke={pal.glow} strokeWidth="2.5" fill="none">
              <path d="M-19 -14 H-25 V14 H-19" />
              <path d="M19 -14 H25 V14 H19" />
            </g>
          )}
          {/* Kite Shield */}
          <path
            d="M0 -19 L17 -13 V1 C17 11, 0 20, 0 20 C0 20, -17 11, -17 1 V-13 Z"
            fill={pal.base}
            stroke={stroke}
            strokeWidth={sw}
          />
          <path
            d="M0 -19 L17 -13 V1 C17 11, 0 20, 0 20 Z"
            fill={pal.shade}
            opacity="0.45"
          />
          <path
            d="M0 -13 L11 -9 V1 C11 7.5, 0 13.5, 0 13.5 C0 13.5, -11 7.5, -11 1 V-9 Z"
            fill={pal.deep}
          />
          {kind === 'security-gate' ? (
            <polyline points="-4.5,0.5 -1,4 5.5,-3.5" fill="none" stroke="#4ade80" strokeWidth="2.6" />
          ) : (
            <polygon points="0,-6 5,0 0,6 -5,0" fill={pal.glow} />
          )}
        </g>
      );
    }

    case 'defense-tower': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Stone Tower Base */}
          <path d="M-14 18 L-10 -4 H10 L14 18 Q0 21 -14 18 Z" fill={pal.base} stroke={stroke} strokeWidth={sw} />
          <path d="M0 -4 H10 L14 18 Q7 20 0 19.5 Z" fill={pal.shade} opacity="0.5" />
          {/* Crenellated Rim */}
          <path d="M-13 -4 V-10 H-7 V-6 H-2 V-10 H2 V-6 H7 V-10 H13 V-4 Z" fill={pal.light} stroke={stroke} strokeWidth={sw} />
          {/* Floating Arcane Crystal Turret */}
          <polygon points="0,-24 7,-16 0,-11 -7,-16" fill={pal.glow} stroke={stroke} strokeWidth="1.2" />
        </g>
      );
    }

    case 'mech-pawn': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Shoulder weapon pods */}
          <rect x="-21" y="-12" width="8" height="10" rx="2.5" fill={pal.shade} stroke={stroke} strokeWidth={sw} />
          <rect x="13" y="-12" width="8" height="10" rx="2.5" fill={pal.shade} stroke={stroke} strokeWidth={sw} />
          {/* Armored Cockpit Chassis */}
          <path
            d="M-13 -14 H13 L17 4 L10 15 H-10 L-17 4 Z"
            fill={pal.base}
            stroke={stroke}
            strokeWidth={sw}
          />
          <polygon points="0,-14 13,-14 17,4 10,15 0,15" fill={pal.shade} opacity="0.45" />
          {/* Glowing Canopy Visor */}
          <polygon points="-7,-9 7,-9 9,-1 0,3 -9,-1" fill={pal.glow} stroke={stroke} strokeWidth="1.1" />
          {/* Thruster legs */}
          <rect x="-11" y="14" width="6" height="6" rx="1.5" fill={pal.deep} />
          <rect x="5" y="14" width="6" height="6" rx="1.5" fill={pal.deep} />
        </g>
      );
    }

    case 'handle-pouch': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Glowing key/handle tags peeking out */}
          <rect x="-11" y="-20" width="7" height="11" rx="2" fill="#4ade80" stroke={stroke} strokeWidth="1.1" transform="rotate(-12 -7 -14)" />
          <rect x="-2" y="-22" width="7" height="12" rx="2" fill="#60a5fa" stroke={stroke} strokeWidth="1.1" />
          <rect x="6" y="-20" width="7" height="11" rx="2" fill="#fbbf24" stroke={stroke} strokeWidth="1.1" transform="rotate(12 9 -14)" />
          {/* Satchel / Pouch Body */}
          <path
            d="M-14 -7 H14 C20 0, 21 15, 11 18 H-11 C-21 15, -20 0, -14 -7 Z"
            fill={pal.base}
            stroke={stroke}
            strokeWidth={sw}
          />
          <path d="M-15 -7 Q0 -1 15 -7 L12 3 Q0 7 -12 3 Z" fill={pal.light} stroke={stroke} strokeWidth={sw} />
          <circle cx="0" cy="4" r="3" fill={pal.glow} stroke={stroke} strokeWidth="1" />
        </g>
      );
    }

    case 'tag-tree':
    case 'tag-stun':
    case 'tag-freeze':
    case 'tag-cooldown':
    case 'tag-counter':
    case 'tag-combo': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {kind === 'tag-counter' && (
            <path
              d="M-19 -13 L-4 -17 L18 5 L3 19 L-19 -3 Z"
              fill={pal.shade}
              stroke={stroke}
              strokeWidth={sw}
              transform="translate(5, -4)"
            />
          )}
          {/* Main Notched Luggage / Metadata Tag */}
          <path
            d="M-19 -14 L-3 -17 L19 4 L4 19 L-18 -2 Z"
            fill={pal.base}
            stroke={stroke}
            strokeWidth={sw}
          />
          <circle cx="-11" cy="-8.5" r="2.8" fill={pal.deep} stroke={pal.light} strokeWidth="1.2" />
          {kind === 'tag-tree' && (
            <g stroke="#fff" strokeWidth="1.6">
              <circle cx="-2" cy="-3" r="2.2" fill={pal.glow} />
              <line x1="0" y1="-1" x2="6" y2="5" />
              <circle cx="6" cy="5" r="2.2" fill="#fff" />
              <line x1="-1" y1="-1" x2="0" y2="7" />
              <circle cx="0" cy="8" r="2" fill={pal.light} />
            </g>
          )}
          {kind === 'tag-stun' && (
            <g transform="translate(3, 2)">
              <ellipse cx="0" cy="0" rx="9" ry="4" fill="none" stroke="#fde047" strokeWidth="1.4" transform="rotate(-25)" />
              <circle cx="-6" cy="-2" r="2" fill="#fde047" />
              <circle cx="6" cy="2" r="2" fill="#fde047" />
            </g>
          )}
          {kind === 'tag-freeze' && (
            <g transform="translate(2, 2)" stroke="#e0f2fe" strokeWidth="1.7">
              <line x1="-5" y1="0" x2="5" y2="0" />
              <line x1="0" y1="-5" x2="0" y2="5" />
              <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5" />
            </g>
          )}
          {kind === 'tag-cooldown' && (
            <g transform="translate(15, -10)">
              <circle cx="0" cy="0" r="8" fill={pal.deep} stroke={stroke} strokeWidth="1.2" />
              <path d="M-3.5 -4 H3.5 L0 0 L3.5 4 H-3.5 L0 0 Z" fill="#fbbf24" />
            </g>
          )}
          {kind === 'tag-counter' && (
            <g transform="translate(15, -12)">
              <circle cx="0" cy="0" r="7.5" fill={pal.glow} stroke={stroke} strokeWidth="1.2" />
              <text x="0" y="3" textAnchor="middle" fontSize="8.5" fontWeight="900" fill="#fff">
                ×2
              </text>
            </g>
          )}
          {kind === 'tag-combo' && (
            <path d="M-4 6 Q4 -4 11 2" fill="none" stroke="#fde047" strokeWidth="2.4" />
          )}
        </g>
      );
    }

    case 'cue-spark': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Starburst VFX */}
          <path
            d="M-6 -18 L-2.5 -6 L9 -2.5 L-2.5 1 L-6 13 L-9.5 1 L-21 -2.5 L-9.5 -6 Z"
            fill={pal.glow}
            stroke={stroke}
            strokeWidth={sw}
          />
          <circle cx="-6" cy="-2.5" r="3.5" fill="#fff" />
          {/* Acoustic soundwaves */}
          <path d="M10 -9 Q16 -2.5 10 4" fill="none" stroke={pal.light} strokeWidth="2" />
          <path d="M15 -14 Q24 -2.5 15 9" fill="none" stroke={pal.base} strokeWidth="2" />
          <circle cx="14" cy="14" r="2.4" fill={pal.light} />
          <circle cx="-18" cy="13" r="2" fill={pal.glow} />
        </g>
      );
    }

    case 'vfx-burst': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <polygon
            points="0,-21 5,-7 19,-14 10,-1 23,6 8,7 12,20 1,10 -10,19 -7,6 -22,3 -9,-4 -16,-16 -3,-8"
            fill={pal.base}
            stroke={stroke}
            strokeWidth={sw}
          />
          <polygon
            points="0,-12 3,-4 11,-7 5,0 12,4 4,4 6,11 0,6 -6,11 -4,4 -12,2 -5,-2 -9,-9 -2,-4"
            fill="#fde047"
          />
          <circle cx="0" cy="0" r="3.5" fill="#fff" />
        </g>
      );
    }

    case 'cleanse-halo': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <circle cx="0" cy="0" r="18" fill={pal.base} fillOpacity="0.22" stroke={pal.light} strokeWidth="1.8" strokeDasharray="5 3" />
          <circle cx="0" cy="0" r="11.5" fill={pal.glow} fillOpacity="0.25" stroke={pal.glow} strokeWidth="2" />
          <path d="M0 -14 L2.6 -3 L13 0 L2.6 3 L0 14 L-2.6 3 L-13 0 L-2.6 -3 Z" fill="#fff" stroke={stroke} strokeWidth="1" />
          <circle cx="-14" cy="-12" r="2" fill="#fff" />
          <circle cx="14" cy="12" r="2" fill="#fff" />
        </g>
      );
    }

    case 'ice-shatter': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <polygon points="0,-20 7,-7 0,-2 -7,-7" fill={pal.light} stroke={stroke} strokeWidth="1.1" />
          <polygon points="20,-4 8,3 4,-3 12,-9" fill={pal.base} stroke={stroke} strokeWidth="1.1" />
          <polygon points="-20,-4 -8,3 -4,-3 -12,-9" fill={pal.base} stroke={stroke} strokeWidth="1.1" />
          <polygon points="12,17 2,7 7,2 16,10" fill={pal.glow} stroke={stroke} strokeWidth="1.1" />
          <polygon points="-12,17 -2,7 -7,2 -16,10" fill={pal.glow} stroke={stroke} strokeWidth="1.1" />
          <circle cx="0" cy="0" r="4" fill="#fff" />
        </g>
      );
    }

    case 'cue-pool': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M-24 6 Q0 20 24 6" fill="none" stroke={pal.light} strokeWidth="2.4" />
          {[
            { x: -13, y: 1, r: 7.5, f: pal.base },
            { x: 13, y: 1, r: 7.5, f: pal.shade },
            { x: 0, y: -6, r: 8.5, f: pal.light }
          ].map((o, idx) => (
            <g key={idx}>
              <circle cx={o.x} cy={o.y} r={o.r} fill={o.f} stroke={stroke} strokeWidth={sw} />
              <circle cx={o.x - 2} cy={o.y - 2.5} r={o.r * 0.28} fill="#fff" opacity="0.75" />
            </g>
          ))}
        </g>
      );
    }

    case 'crit-popup': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round" transform="rotate(-6)">
          <polygon
            points="-22,-10 18,-13 24,-2 17,11 -20,12 -25,1"
            fill={pal.base}
            stroke={stroke}
            strokeWidth={sw}
          />
          <text x="0" y="3.5" textAnchor="middle" fontSize="11" fontWeight="900" fill="#fde047">
            CRIT!
          </text>
          <circle cx="22" cy="-14" r="2.2" fill="#fde047" />
          <circle cx="-22" cy="-13" r="1.8" fill="#fff" />
        </g>
      );
    }

    case 'task-clock': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <circle cx="0" cy="1" r="17" fill={pal.base} stroke={stroke} strokeWidth={sw} />
          <circle cx="0" cy="1" r="12.5" fill={pal.deep} />
          {/* Progress arc */}
          <path d="M0 -11.5 A12.5 12.5 0 1 1 -10.5 7.5" fill="none" stroke={pal.glow} strokeWidth="2.8" />
          <polyline points="0,-6 0,1 6,4" fill="none" stroke="#fff" strokeWidth="2.1" />
          {/* Top crown button */}
          <rect x="-4" y="-20" width="8" height="4" rx="1.5" fill={pal.light} stroke={stroke} strokeWidth="1.1" />
        </g>
      );
    }

    case 'task-montage': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Filmstrip ribbon */}
          <path
            d="M-23 -11 Q0 -16 23 -11 V11 Q0 16 -23 11 Z"
            fill={pal.base}
            stroke={stroke}
            strokeWidth={sw}
          />
          <rect x="-17" y="-7.5" width="34" height="15" rx="2.5" fill={pal.deep} />
          {/* Sprocket dots */}
          {[-14, -7, 0, 7, 14].map((sx) => (
            <g key={sx} fill={pal.light}>
              <circle cx={sx} cy="-10.5" r="1.2" />
              <circle cx={sx} cy="10.5" r="1.2" />
            </g>
          ))}
          {/* Playhead triangle */}
          <polygon points="-4,-5 7,0 -4,5" fill={pal.glow} />
        </g>
      );
    }

    case 'task-radar': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Sonar arcs */}
          <path d="M-2 -14 Q11 -16 14 -2" fill="none" stroke={pal.glow} strokeWidth="2" />
          <path d="M-4 -20 Q16 -22 20 -2" fill="none" stroke={pal.light} strokeWidth="1.6" strokeDasharray="4 3" />
          {/* Dish */}
          <path d="M-18 -6 C-18 10, -2 18, 12 10 Z" fill={pal.base} stroke={stroke} strokeWidth={sw} />
          <line x1="-10" y1="12" x2="-14" y2="20" stroke={pal.shade} strokeWidth="2.6" />
          <line x1="-3" y1="2" x2="4" y2="-5" stroke={pal.light} strokeWidth="2" />
          <circle cx="5" cy="-6" r="2.6" fill={pal.glow} />
        </g>
      );
    }

    case 'task-bomb': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 -13 Q8 -20 14 -18" fill="none" stroke={pal.light} strokeWidth="2" />
          <circle cx="16" cy="-18" r="3.2" fill="#fbbf24" />
          <circle cx="16" cy="-18" r="1.5" fill="#ef4444" />
          <circle cx="-1" cy="3" r="15.5" fill={pal.base} stroke={stroke} strokeWidth={sw} />
          <circle cx="-1" cy="3" r="10.5" fill={pal.deep} />
          <polyline points="-1,-3 -1,3 4,6" fill="none" stroke="#ef4444" strokeWidth="2.2" />
        </g>
      );
    }

    case 'code-gear': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Curled Blueprint Document */}
          <path
            d="M-20 -17 H7 L14 -10 V14 Q-3 18 -20 14 Z"
            fill={pal.light}
            stroke={stroke}
            strokeWidth={sw}
          />
          <path d="M7 -17 V-10 H14 Z" fill={pal.shade} stroke={stroke} strokeWidth="1.1" />
          <polyline points="-9,-4 -14,1 -9,6" fill="none" stroke={pal.deep} strokeWidth="2.2" />
          <polyline points="1,-4 6,1 1,6" fill="none" stroke={pal.deep} strokeWidth="2.2" />
          <line x1="-2" y1="-6" x2="-6" y2="8" stroke={pal.glow} strokeWidth="2" />
          {/* Precision 8-tooth Gear overlapping bottom-right */}
          <g transform="translate(14, 11)">
            {[0, 45, 90, 135].map((deg) => (
              <rect
                key={deg}
                x="-2"
                y="-10.5"
                width="4"
                height="21"
                rx="1"
                fill={pal.base}
                stroke={stroke}
                strokeWidth="1"
                transform={`rotate(${deg})`}
              />
            ))}
            <circle cx="0" cy="0" r="7.5" fill={pal.base} stroke={stroke} strokeWidth="1.2" />
            <circle cx="0" cy="0" r="3" fill={pal.deep} />
          </g>
        </g>
      );
    }

    case 'data-envelope': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Aero wings */}
          <path d="M-24 -6 L-18 -2 L-23 3 Z" fill={pal.light} stroke={stroke} strokeWidth="1" />
          <path d="M24 -6 L18 -2 L23 3 Z" fill={pal.light} stroke={stroke} strokeWidth="1" />
          {/* Sealed Data Envelope */}
          <path d="M-19 -12 Q0 -15 19 -12 L17 11 Q0 14 -17 11 Z" fill={pal.base} stroke={stroke} strokeWidth={sw} />
          <path d="M-19 -12 L0 2 L19 -12" fill={pal.light} stroke={stroke} strokeWidth={sw} />
          <circle cx="0" cy="2" r="4.8" fill={pal.glow} stroke={stroke} strokeWidth="1.1" />
          <circle cx="0" cy="2" r="1.9" fill="#fff" />
        </g>
      );
    }

    case 'set-filter': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Duplicate dots caught above */}
          <circle cx="-8" cy="-18" r="2.6" fill="#ef4444" />
          <circle cx="1" cy="-20" r="2.6" fill="#4ade80" />
          <circle cx="9" cy="-18" r="2.6" fill="#ef4444" />
          {/* Sieve Funnel */}
          <path d="M-19 -11 H19 L6 4 V16 H-6 V4 Z" fill={pal.base} stroke={stroke} strokeWidth={sw} />
          <line x1="-11" y1="-4" x2="11" y2="-4" stroke={pal.deep} strokeWidth="1.5" strokeDasharray="3 2" />
          <circle cx="0" cy="20" r="3" fill="#4ade80" />
        </g>
      );
    }

    case 'ability-loadout': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Open-top Loadout Cassette */}
          <path
            d="M-21 -5 L-17 -14 H17 L21 -5 V14 Q0 18 -21 14 Z"
            fill={pal.base}
            stroke={stroke}
            strokeWidth={sw}
          />
          <rect x="-15" y="-17" width="8" height="10" rx="2" fill="#60a5fa" stroke={stroke} strokeWidth="1.1" />
          <rect x="-4" y="-19" width="8" height="12" rx="2" fill="#fbbf24" stroke={stroke} strokeWidth="1.1" />
          <rect x="7" y="-17" width="8" height="10" rx="2" fill="#2dd4bf" stroke={stroke} strokeWidth="1.1" />
          <rect x="-15" y="0" width="30" height="9" rx="3" fill={pal.deep} />
          <circle cx="-7" cy="4.5" r="2" fill={pal.glow} />
          <line x1="-1" y1="4.5" x2="10" y2="4.5" stroke={pal.light} strokeWidth="2" />
        </g>
      );
    }

    case 'mmc-lens': {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <line x1="-25" y1="-7" x2="-12" y2="-2" stroke="#60a5fa" strokeWidth="2" />
          <line x1="-25" y1="7" x2="-12" y2="2" stroke="#a855f7" strokeWidth="2" />
          <line x1="12" y1="0" x2="26" y2="0" stroke={pal.glow} strokeWidth="2.8" />
          <circle cx="0" cy="0" r="14" fill={pal.base} stroke={stroke} strokeWidth={sw} />
          <circle cx="0" cy="0" r="8.5" fill={pal.light} opacity="0.7" />
          <text x="0" y="3.5" textAnchor="middle" fontSize="10" fontWeight="900" fill={pal.deep}>
            fx
          </text>
        </g>
      );
    }
  }
}

export const NodeIllustration: React.FC<NodeIllustrationProps> = ({ node, theme }) => {
  const isCrashed = node.state === 'crashed';
  const isDisabled = node.state === 'disabled';
  const palettes = theme === 'dark' ? DARK_ART_PALETTES : LIGHT_ART_PALETTES;
  const pal = isCrashed || isDisabled ? palettes.slate : palettes[node.color];
  const scale = node.size === 'lg' ? 1.26 : node.size === 'sm' ? 0.90 : 1.10;
  const kind = resolveVisualKind(node);

  return (
    <g transform={`scale(${scale})`} opacity={isDisabled ? 0.48 : isCrashed ? 0.82 : 1}>
      {/* Soft Ground Shadow Ellipse (no cuboid box!) */}
      <ellipse
        cx="0"
        cy="21"
        rx="21"
        ry="6.5"
        fill={theme === 'dark' ? 'rgba(0,0,0,0.38)' : 'rgba(29,27,24,0.13)'}
      />

      {/* Active / Predicted Ground Floor Aura */}
      {node.state === 'active' && (
        <>
          <ellipse cx="0" cy="20" rx="26" ry="9" fill="rgba(94, 196, 86, 0.16)" />
          <ellipse
            cx="0"
            cy="20"
            rx="28"
            ry="10"
            fill="none"
            stroke="#5cc456"
            strokeWidth="1.7"
            strokeDasharray="5 3.5"
          />
        </>
      )}
      {node.state === 'predicted' && (
        <>
          <ellipse cx="0" cy="20" rx="26" ry="9" fill="rgba(168, 126, 230, 0.17)" />
          <ellipse
            cx="0"
            cy="20"
            rx="28"
            ry="10"
            fill="none"
            stroke="#a87ee6"
            strokeWidth="1.7"
            strokeDasharray="4.5 3.5"
          />
        </>
      )}

      {/* Bespoke Semantic SVG Illustration */}
      {renderArtwork(kind, pal, theme)}

      {/* Crashed / Error Fracture Stamp */}
      {isCrashed && (
        <g>
          <path d="M-10 -12 L10 10" stroke="#e5534b" strokeWidth="2.4" strokeLinecap="round" opacity="0.85" />
          <g transform="translate(17, -15)">
            <circle cx="0" cy="0" r="8" fill="#e5534b" stroke={pal.ink} strokeWidth="1.3" />
            <path
              d="M-3 -3 L3 3 M3 -3 L-3 3"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        </g>
      )}
    </g>
  );
};
