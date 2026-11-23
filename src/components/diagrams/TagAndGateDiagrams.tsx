import React from 'react';
import { DiagramHeader, DiagramProps, FlowDot, getDiagramPalette } from './types';

/**
 * 11. Overlapping Stun RefCount Staircase Waveform & Loose Tag Rule Diagram
 */
export const TagRefcountWaveformDiagram: React.FC<DiagramProps> = ({ stepId, phase, theme }) => {
  const pal = getDiagramPalette(theme);
  const cursorX = 150 + ((phase * 580) % 580);

  return (
    <g>
      <DiagramHeader
        pal={pal}
        category="REFCOUNT WAVEFORM · 标签引用计数阶梯波形与 Loose Tag 配对铁律"
        title="两个 3 秒眩晕重叠 (0~3s 与 1~4s)：布尔变量提前失效 vs FGameplayTagCountContainer 阶梯波"
        rightBadge={`当前步骤：${stepId.toUpperCase()}`}
      />

      {/* Top Waveform Comparison Panel (y=106..356) */}
      <g transform="translate(24, 106)">
        <rect x="0" y="0" width="802" height="250" rx="10" fill={pal.card} stroke={pal.lineStrong} strokeWidth="1.3" />

        {/* Time Axis Header */}
        {[
          { x: 150, t: 't = 0s', desc: '眩晕 A 施加 (+1)' },
          { x: 295, t: 't = 1s', desc: '眩晕 B 叠加 (+1)' },
          { x: 585, t: 't = 3s', desc: '眩晕 A 到期 (-1)' },
          { x: 730, t: 't = 4s', desc: '眩晕 B 到期 (-1)' }
        ].map((m, idx) => (
          <g key={idx} transform={`translate(${m.x}, 24)`}>
            <line x1="0" y1="14" x2="0" y2="215" stroke={pal.lineStrong} strokeDasharray="3 3" />
            <text x="0" y="0" textAnchor="middle" fontSize="10" fontWeight="800" fill={pal.ink}>
              {m.t}
            </text>
            <text x="0" y="12" textAnchor="middle" fontSize="8.8" fontWeight="600" fill={pal.muted}>
              {m.desc}
            </text>
          </g>
        ))}

        {/* Moving Time Playhead */}
        <line x1={cursorX} y1="36" x2={cursorX} y2="240" stroke={pal.violet} strokeWidth="1.6" />

        {/* Input Bars: Stun A (0~3s) and Stun B (1~4s) */}
        <text x="16" y="56" fontSize="9.8" fontWeight="800" fill={pal.ink}>
          输入源 GE：
        </text>
        <rect x="150" y="42" width="435" height="16" rx="4" fill={pal.amberBg} stroke={pal.ink} strokeWidth="1.1" />
        <text x="367" y="53.5" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={pal.amberInk}>
          GE_Stun_A (t = 0s ➔ 3s)
        </text>
        <rect x="295" y="62" width="435" height="16" rx="4" fill={pal.violetBg} stroke={pal.ink} strokeWidth="1.1" />
        <text x="512" y="73.5" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={pal.violetInk}>
          GE_Stun_B (t = 1s ➔ 4s)
        </text>

        {/* Waveform 1: Naive bool bIsStunned */}
        <text x="16" y="106" fontSize="9.8" fontWeight="800" fill={pal.red}>
          ❌ bool bIsStunned
        </text>
        <rect x="150" y="90" width="435" height="24" rx="4" fill={pal.redBg} stroke={pal.red} strokeWidth="1.4" />
        <text x="367" y="106" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={pal.redInk}>
          true (1)
        </text>
        <rect x="585" y="90" width="145" height="24" rx="4" fill={pal.chip} stroke={pal.red} strokeDasharray="4 2" />
        <text x="657" y="105.5" textAnchor="middle" fontSize="8" fontWeight="800" fill={pal.red}>
          t=3s 被A误置false! (早醒1s!)
        </text>

        {/* Waveform 2: FGameplayTagCountContainer Staircase */}
        <text x="16" y="162" fontSize="9.8" fontWeight="800" fill={pal.green}>
          ✅ Tag 引用计数
        </text>
        <text x="16" y="177" fontSize="8.8" fontWeight="600" fill={pal.muted}>
          (Count &gt; 0 即眩晕)
        </text>

        {/* Step 1: 0~1s Count = 1 */}
        <rect x="150" y="166" width="145" height="32" rx="3" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.3" />
        <text x="222" y="186" textAnchor="middle" fontSize="10" fontWeight="800" fill={pal.greenInk}>
          Count = 1
        </text>

        {/* Step 2: 1~3s Count = 2 (Taller bar) */}
        <rect x="295" y="138" width="290" height="60" rx="3" fill={pal.green} stroke={pal.ink} strokeWidth="1.3" />
        <text x="440" y="172" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff">
          Count = 2 (双眩晕叠加)
        </text>

        {/* Step 3: 3~4s Count = 1 */}
        <rect x="585" y="166" width="145" height="32" rx="3" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.3" />
        <text x="657" y="186" textAnchor="middle" fontSize="10" fontWeight="800" fill={pal.greenInk}>
          Count = 1 (仍眩晕!)
        </text>

        {/* Event Triggers Callout Dots */}
        <circle cx="150" cy="198" r="5" fill={pal.blue} stroke={pal.ink} strokeWidth="1.2" />
        <text x="150" y="216" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={pal.blue}>
          0➔1 触发 NewOrRemoved
        </text>

        <circle cx="295" cy="138" r="5" fill={pal.amber} stroke={pal.ink} strokeWidth="1.2" />
        <text x="440" y="216" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={pal.amberInk}>
          1➔2 与 2➔1 仅触发 AnyCountChange (不触发 NewOrRemoved!)
        </text>

        <circle cx="730" cy="198" r="5" fill={pal.blue} stroke={pal.ink} strokeWidth="1.2" />
        <text x="730" y="216" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={pal.blue}>
          1➔0 触发 NewOrRemoved
        </text>
      </g>

      {/* Bottom Panel: Loose Gameplay Tag Iron Law (y=364..494) */}
      <g transform="translate(24, 364)">
        <rect
          x="0"
          y="0"
          width="802"
          height="130"
          rx="10"
          fill={pal.card}
          stroke={stepId === 's4' ? pal.amber : pal.lineStrong}
          strokeWidth={stepId === 's4' ? '2.2' : '1.3'}
        />
        <text x="16" y="22" fontSize="11" fontWeight="800" fill={pal.ink}>
          ⚠️ Loose Gameplay Tag（松散标签）手动增减配对铁律与网络同步：
        </text>

        <g transform="translate(16, 32)">
          <rect x="0" y="0" width="380" height="84" rx="7" fill={pal.redBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="12" y="19" fontSize="9.8" fontWeight="800" fill={pal.redInk}>
            ❌ 致命隐患：AddLooseGameplayTag 没有自动生命周期！
          </text>
          <text x="12" y="38" fontSize="9.2" fontWeight="600" fill={pal.ink}>
            • 如果调了 2 次 AddLooseGameplayTag，中途被打断只调了 1 次 Remove，
          </text>
          <text x="12" y="55" fontSize="9.2" fontWeight="800" fill={pal.red}>
            • 剩余 Count = 1 会永远残留在角色身上，导致角色一辈子无法行动！
          </text>
          <text x="12" y="73" fontSize="9" fontWeight="700" fill={pal.ink2}>
            • 推荐优先用 GE 或 GA 的 ActivationOwnedTags 自动托管标签生命周期。
          </text>
        </g>

        <g transform="translate(408, 32)">
          <rect x="0" y="0" width="378" height="84" rx="7" fill={pal.blueBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="12" y="19" fontSize="9.8" fontWeight="800" fill={pal.blueInk}>
            🌐 UE 5.8 网络差异：EGameplayTagReplicationState
          </text>
          <text x="12" y="38" fontSize="9.0" fontWeight="600" fill={pal.ink}>
            • AddLooseGameplayTag(Tag)：默认 None，仅本地生效绝不复制！
          </text>
          <text x="12" y="55" fontSize="9.0" fontWeight="800" fill={pal.blue}>
            • 传 TagOnly / CountToOwner / TagAndCountToAll 统一走
          </text>
          <text x="12" y="73" fontSize="8.3" fontWeight="700" fill={pal.ink2}>
            GameplayTagCountContainer 复制 (旧 AddReplicatedLoose 已移除)。
          </text>
        </g>
      </g>
    </g>
  );
};

/**
 * 12. Hierarchical GameplayTag Tree & MatchesTag vs MatchesTagExact Scope Diagram
 */
export const TagHierarchyTreeDiagram: React.FC<DiagramProps> = ({ stepId, theme }) => {
  const pal = getDiagramPalette(theme);

  return (
    <g>
      <DiagramHeader
        pal={pal}
        category="TAG HIERARCHY TREE · 层级字典树匹配范围与 C++ 原生标签宏"
        title="MatchesTag (父级前缀包含整棵子树) vs MatchesTagExact (仅精确单节点) 作用域对比"
        rightBadge={`当前步骤：${stepId.toUpperCase()}`}
      />

      {/* Left Panel: Visual Tag Tree & Bounding Zones (x=24, y=106, w=470, h=388) */}
      <g transform="translate(24, 106)">
        <rect x="0" y="0" width="470" height="388" rx="10" fill={pal.card} stroke={pal.lineStrong} strokeWidth="1.3" />
        <text x="16" y="22" fontSize="11.2" fontWeight="800" fill={pal.ink}>
          🌳 角色当前持有标签：State.Debuff.Stun.Electric
        </text>

        {/* Subtree Highlight Zone for HasMatchingGameplayTag("State.Debuff") */}
        <rect
          x="22"
          y="88"
          width="332"
          height="228"
          rx="12"
          fill={pal.greenBg}
          stroke={pal.green}
          strokeWidth="2"
          strokeDasharray="6 4"
        />
        <text x="32" y="107" fontSize="8.3" fontWeight="800" fill={pal.greenInk}>
          🟢 HasMatchingGameplayTag(&quot;State.Debuff&quot;) = TRUE（整棵子树命中!）
        </text>

        {/* Root: State */}
        <rect x="190" y="38" width="90" height="30" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.3" />
        <text x="235" y="57" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={pal.ink}>
          State
        </text>

        <line x1="215" y1="68" x2="155" y2="120" stroke={pal.ink} strokeWidth="1.6" />
        <line x1="255" y1="68" x2="380" y2="120" stroke={pal.ink} strokeWidth="1.6" />

        {/* Level 2: State.Debuff & State.Buff */}
        <rect x="95" y="120" width="120" height="32" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.4" />
        <text x="155" y="140" textAnchor="middle" fontSize="10.2" fontWeight="800" fill={pal.ink}>
          State.Debuff
        </text>

        <rect x="335" y="120" width="110" height="32" rx="6" fill={pal.chip} stroke={pal.lineStrong} strokeWidth="1.2" />
        <text x="390" y="140" textAnchor="middle" fontSize="10" fontWeight="700" fill={pal.muted}>
          State.Buff
        </text>

        <line x1="155" y1="152" x2="155" y2="188" stroke={pal.ink} strokeWidth="1.6" />

        {/* Level 3: State.Debuff.Stun (Exact Match Target Comparison) */}
        <rect
          x="70"
          y="188"
          width="170"
          height="36"
          rx="6"
          fill={pal.amberBg}
          stroke={pal.amber}
          strokeWidth="2"
        />
        <text x="155" y="205" textAnchor="middle" fontSize="10" fontWeight="800" fill={pal.amberInk}>
          State.Debuff.Stun
        </text>
        <text x="155" y="219" textAnchor="middle" fontSize="8" fontWeight="800" fill={pal.red}>
          MatchesTagExact(&quot;...Stun&quot;) = FALSE!
        </text>

        <line x1="130" y1="224" x2="95" y2="262" stroke={pal.ink} strokeWidth="1.6" />
        <line x1="180" y1="224" x2="235" y2="262" stroke={pal.ink} strokeWidth="1.6" />

        {/* Level 4 Leaf: Electric (Active Tag on Character) & Physical */}
        <rect x="34" y="262" width="142" height="40" rx="6" fill={pal.violetBg} stroke={pal.ink} strokeWidth="1.8" />
        <text x="105" y="280" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={pal.violetInk}>
          ...Stun.Electric ⚡
        </text>
        <text x="105" y="295" textAnchor="middle" fontSize="8.5" fontWeight="800" fill={pal.green}>
          [角色实际持有的叶子标签]
        </text>

        <rect x="188" y="262" width="130" height="40" rx="6" fill={pal.chip} stroke={pal.lineStrong} strokeWidth="1.1" />
        <text x="253" y="286" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={pal.muted}>
          ...Stun.Physical
        </text>

        {/* Bottom Comparison Summary */}
        <rect x="22" y="324" width="426" height="52" rx="7" fill={pal.chip} stroke={pal.ink} strokeWidth="1.2" />
        <text x="32" y="343" fontSize="8.5" fontWeight="800" fill={pal.green}>
          ✓ HasMatchingGameplayTag(&quot;State.Debuff.Stun&quot;) ➔ TRUE (父子前缀匹配)
        </text>
        <text x="32" y="363" fontSize="8.3" fontWeight="800" fill={pal.red}>
          ✗ HasMatchingGameplayTagExact(&quot;State.Debuff.Stun&quot;) ➔ FALSE (需完全相等)
        </text>
      </g>

      {/* Right Panel: C++ Native Gameplay Tags vs FName String Lookup (x=506, y=106, w=320, h=388) */}
      <g transform="translate(506, 106)">
        <rect x="0" y="0" width="320" height="388" rx="10" fill={pal.card} stroke={pal.lineStrong} strokeWidth="1.3" />
        <text x="16" y="22" fontSize="11.2" fontWeight="800" fill={pal.ink}>
          💻 C++ 原生标签宏 vs 硬编码字符串查找
        </text>

        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="288" height="122" rx="8" fill={pal.redBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="12" y="20" fontSize="10" fontWeight="800" fill={pal.redInk}>
            ❌ 反面：运行时 RequestGameplayTag(FName)
          </text>
          <text x="12" y="42" fontSize="9" fontWeight="600" fill={pal.ink}>
            FGameplayTag::RequestGameplayTag(
          </text>
          <text x="12" y="58" fontSize="9" fontWeight="800" fill={pal.red}>
            &nbsp; FName(&quot;State.Debuf.Stun&quot;) // 拼写少个 f!
          </text>
          <text x="12" y="74" fontSize="9" fontWeight="600" fill={pal.ink}>
            );
          </text>
          <text x="12" y="96" fontSize="9" fontWeight="700" fill={pal.redInk}>
            • 编译期 0 报错，运行时静默返回空 Tag
          </text>
          <text x="12" y="112" fontSize="9" fontWeight="700" fill={pal.redInk}>
            • 散落在各处的魔法字符串极难重构
          </text>
        </g>

        <g transform="translate(16, 172)">
          <rect x="0" y="0" width="288" height="200" rx="8" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="12" y="20" fontSize="10" fontWeight="800" fill={pal.greenInk}>
            ✅ 现代标准：NativeGameplayTags.h 宏
          </text>
          <rect x="12" y="30" width="264" height="54" rx="5" fill={pal.chip} stroke={pal.ink} strokeWidth="1.1" />
          <text x="20" y="46" fontSize="8.8" fontWeight="800" fill={pal.violet}>
            // MyGameplayTags.h
          </text>
          <text x="20" y="62" fontSize="8.6" fontWeight="700" fill={pal.ink}>
            UE_DECLARE_GAMEPLAY_TAG_EXTERN(
          </text>
          <text x="20" y="76" fontSize="8.6" fontWeight="700" fill={pal.ink}>
            &nbsp; TAG_State_Debuff_Stun);
          </text>

          <rect x="12" y="92" width="264" height="54" rx="5" fill={pal.chip} stroke={pal.ink} strokeWidth="1.1" />
          <text x="20" y="108" fontSize="8.8" fontWeight="800" fill={pal.green}>
            // MyGameplayTags.cpp
          </text>
          <text x="20" y="124" fontSize="8.6" fontWeight="700" fill={pal.ink}>
            UE_DEFINE_GAMEPLAY_TAG(
          </text>
          <text x="20" y="138" fontSize="8.6" fontWeight="700" fill={pal.ink}>
            &nbsp; TAG_State_Debuff_Stun, &quot;State.Debuff.Stun&quot;);
          </text>

          <text x="12" y="166" fontSize="9" fontWeight="800" fill={pal.greenInk}>
            ✓ 引擎启动自动注册进 TagsManager（免配 ini）
          </text>
          <text x="12" y="184" fontSize="9" fontWeight="800" fill={pal.greenInk}>
            ✓ C++ 全局强类型符号引用，拼错直接编译报错！
          </text>
        </g>
      </g>
    </g>
  );
};

/**
 * 13. UGameplayAbility 6 Tag Slots Security Gate & Action Matrix Diagram
 */
export const GaSixTagGatesDiagram: React.FC<DiagramProps> = ({ stepId, phase, theme }) => {
  const pal = getDiagramPalette(theme);

  return (
    <g>
      <DiagramHeader
        pal={pal}
        category="6-SLOT TAG MATRIX · 技能六大标签槽位安检闸门与打断封锁矩阵图"
        title="TryActivateAbility 准入双闸门 ➔ 激活期挂载同步 (ActivationOwned) ➔ 打断与封锁双武器"
        rightBadge={`当前步骤：${stepId.toUpperCase()}`}
      />

      {/* Main Schematic Panel (y=106..396) */}
      <g transform="translate(24, 106)">
        <rect x="0" y="0" width="802" height="286" rx="10" fill={pal.card} stroke={pal.lineStrong} strokeWidth="1.3" />

        {/* Left Column: Gate 1 & Gate 2 (Activation Check) */}
        <g transform="translate(18, 20)">
          <rect x="0" y="0" width="218" height="246" rx="8" fill={pal.card2} stroke={pal.ink} strokeWidth="1.3" />
          <text x="109" y="22" textAnchor="middle" fontSize="10.8" fontWeight="800" fill={pal.ink}>
            🚪 第一关：CanActivate 准入安检门
          </text>

          {/* Slot 1: ActivationRequiredTags */}
          <rect x="12" y="34" width="194" height="92" rx="6" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="22" y="52" fontSize="9.8" fontWeight="800" fill={pal.greenInk}>
            ① ActivationRequiredTags
          </text>
          <text x="22" y="68" fontSize="8.8" fontWeight="700" fill={pal.ink}>
            [绿灯全亮才放行 · AND 逻辑]
          </text>
          <text x="22" y="86" fontSize="8.8" fontWeight="600" fill={pal.ink2}>
            例：要求持有 State.Grounded
          </text>
          <text x="22" y="102" fontSize="8.8" fontWeight="600" fill={pal.ink2}>
            缺任何一个标签 ➔ 拒绝激活!
          </text>

          {/* Slot 2: ActivationBlockedTags */}
          <rect x="12" y="138" width="194" height="96" rx="6" fill={pal.redBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="22" y="156" fontSize="9.8" fontWeight="800" fill={pal.redInk}>
            ② ActivationBlockedTags
          </text>
          <text x="22" y="172" fontSize="8.8" fontWeight="700" fill={pal.ink}>
            [红灯亮一个即拦截 · OR 逻辑]
          </text>
          <text x="22" y="190" fontSize="8.8" fontWeight="600" fill={pal.ink2}>
            例：State.Debuff.Stun / Silenced
          </text>
          <text x="22" y="206" fontSize="8.8" fontWeight="800" fill={pal.red}>
            中了子标签 Stun.Electric 同样拦截!
          </text>
        </g>

        <line x1="236" y1="143" x2="278" y2="143" stroke={pal.ink} strokeWidth="2.2" markerEnd="url(#arrow-ink)" />
        <FlowDot x1={236} y1={143} x2={278} y2={143} phase={phase} color={pal.green} stroke={pal.ink} />

        {/* Center Column: Active Ability Chamber (Slot 3 & Slot 4) */}
        <g transform="translate(282, 20)">
          <rect x="0" y="0" width="238" height="246" rx="8" fill={pal.violetBg} stroke={pal.ink} strokeWidth="1.5" />
          <text x="119" y="22" textAnchor="middle" fontSize="10.8" fontWeight="800" fill={pal.violetInk}>
            ⚡ 第二关：技能激活运行腔室
          </text>

          {/* Slot 3: AbilityTags / AssetTags */}
          <rect x="14" y="34" width="210" height="86" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.2" />
          <text x="20" y="52" fontSize="9.3" fontWeight="800" fill={pal.ink}>
            ③ AbilityTags (5.5 称 AssetTags)
          </text>
          <text x="20" y="68" fontSize="8.1" fontWeight="700" fill={pal.muted}>
            [技能身份证: Ability.Skill.Fireball]
          </text>
          <text x="20" y="86" fontSize="8.6" fontWeight="800" fill={pal.red}>
            ⚠️ 绝不会自动挂到角色 ASC 身上！
          </text>
          <text x="20" y="102" fontSize="8.4" fontWeight="600" fill={pal.ink2}>
            仅供其他技能 Cancel / Block 匹配检索
          </text>

          {/* Slot 4: ActivationOwnedTags */}
          <rect
            x="14"
            y="132"
            width="210"
            height="102"
            rx="6"
            fill={pal.blueBg}
            stroke={stepId === 's3' ? pal.blue : pal.ink}
            strokeWidth={stepId === 's3' ? '2.2' : '1.3'}
          />
          <text x="20" y="150" fontSize="9.4" fontWeight="800" fill={pal.blueInk}>
            ④ ActivationOwnedTags 🌐
          </text>
          <text x="20" y="166" fontSize="8" fontWeight="800" fill={pal.greenInk}>
            [激活期自动挂给 ASC · 结束自动卸下]
          </text>
          <text x="24" y="184" fontSize="8.8" fontWeight="700" fill={pal.ink}>
            • 例：State.Casting / State.Aiming
          </text>
          <text x="24" y="200" fontSize="8.8" fontWeight="800" fill={pal.blue}>
            • 唯一会自动跨网复制到客户端的 GA 标签槽！
          </text>
          <text x="24" y="216" fontSize="8.6" fontWeight="600" fill={pal.ink2}>
            • 蓝图动画状态机应监听此槽标签切换姿势
          </text>
        </g>

        <line x1="520" y1="143" x2="562" y2="143" stroke={pal.ink} strokeWidth="2.2" markerEnd="url(#arrow-ink)" />
        <FlowDot x1={520} y1={143} x2={562} y2={143} phase={phase} offset={0.4} color={pal.amber} stroke={pal.ink} />

        {/* Right Column: Outgoing Weapons (Slot 5 & Slot 6) */}
        <g transform="translate(566, 20)">
          <rect x="0" y="0" width="218" height="246" rx="8" fill={pal.card2} stroke={pal.ink} strokeWidth="1.3" />
          <text x="109" y="22" textAnchor="middle" fontSize="10.8" fontWeight="800" fill={pal.ink}>
            ⚔️ 第三关：对外打断与压制武器
          </text>

          {/* Slot 5: CancelAbilitiesWithTag */}
          <rect x="12" y="34" width="194" height="94" rx="6" fill={pal.amberBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="22" y="52" fontSize="9.8" fontWeight="800" fill={pal.amberInk}>
            ⑤ CancelAbilitiesWithTag ✂️
          </text>
          <text x="22" y="68" fontSize="8.8" fontWeight="700" fill={pal.ink}>
            [激活瞬间：斩断正在运行的同类技能]
          </text>
          <text x="20" y="86" fontSize="8.4" fontWeight="600" fill={pal.ink2}>
            例：按下闪避 ➔ 立即 Cancel 读条中的
          </text>
          <text x="22" y="102" fontSize="8.8" fontWeight="700" fill={pal.amberInk}>
            Ability.Skill.Channeling 技能!
          </text>

          {/* Slot 6: BlockAbilitiesWithTag */}
          <rect x="12" y="140" width="194" height="94" rx="6" fill={pal.redBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="22" y="158" fontSize="9.8" fontWeight="800" fill={pal.redInk}>
            ⑥ BlockAbilitiesWithTag 🔒
          </text>
          <text x="22" y="174" fontSize="8.8" fontWeight="700" fill={pal.ink}>
            [存续期间：持续封锁其他技能激活]
          </text>
          <text x="22" y="192" fontSize="8.8" fontWeight="600" fill={pal.ink2}>
            例：旋风斩转圈期间 ➔ 封锁所有带
          </text>
          <text x="22" y="208" fontSize="8.8" fontWeight="700" fill={pal.redInk}>
            Ability.Skill.BasicAttack 的普攻!
          </text>
        </g>
      </g>

      {/* Bottom Panel: Cleanse / Purify Bypass Design (y=400..494) */}
      <g transform="translate(24, 400)">
        <rect
          x="0"
          y="0"
          width="802"
          height="94"
          rx="10"
          fill={pal.greenBg}
          stroke={stepId === 's4' ? pal.green : pal.ink}
          strokeWidth={stepId === 's4' ? '2.2' : '1.3'}
        />
        <text x="16" y="22" fontSize="10.8" fontWeight="800" fill={pal.greenInk}>
          🛡️ 实战设计范式：如何制作一个“被眩晕时也能按出来”的解控净化技能 (GA_Cleanse)？
        </text>
        <text x="16" y="44" fontSize="8.7" fontWeight="700" fill={pal.ink}>
          1. 准入豁免：GA_Cleanse 的 ActivationBlockedTags 剔除 Stun（仅留 Dead），且眩晕 GE 不封锁 Ability.Cleanse；
        </text>
        <text x="16" y="64" fontSize="9.5" fontWeight="700" fill={pal.ink}>
          2. 一键驱散：在 ActivateAbility 中调用 ASC-&gt;RemoveActiveEffectsWithGrantedTags(FGameplayTagContainer(TAG_State_Debuff))；
        </text>
        <text x="16" y="82" fontSize="9.2" fontWeight="800" fill={pal.violetInk}>
          3. 结果：所有赋予了 State.Debuff.* 子标签的负面 ActiveGE 被连根拔起，引用计数归零，眩晕蒙太奇与特效自动终止！
        </text>
      </g>
    </g>
  );
};
