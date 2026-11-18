import React from 'react';
import { DiagramHeader, DiagramProps, FlowDot, getDiagramPalette } from './types';

/**
 * 21. Replication Modes (Full / Mixed / Minimal) Cross-Section Matrix Diagram
 */
export const ReplicationModeMatrixDiagram: React.FC<DiagramProps> = ({ stepId, phase, theme }) => {
  const pal = getDiagramPalette(theme);

  const modes = [
    {
      x: 16,
      name: 'Full 模式 (全量广播)',
      target: '单机 / 特需全员检视完整 Buff',
      autoClient: '✅ 完整 ActiveGE 结构体',
      simClient: '⚠️ 完整 ActiveGE 结构体 (全员!)',
      attrSync: '✅ AttributeSet 独立复制',
      cost: '❌ 20人团战 O(N²) 带宽爆炸 (~420KB/s)',
      bg: pal.amberBg,
      border: stepId === 's2' ? pal.amber : pal.ink
    },
    {
      x: 278,
      name: 'Mixed 模式 (玩家英雄黄金标准)',
      target: '所有由玩家控制的英雄 / 主角',
      autoClient: '✅ 完整 ActiveGE (供本地预测/CD条)',
      simClient: '✅ 仅复制 Tag 计数 + GameplayCues',
      attrSync: '✅ AttributeSet 独立复制',
      cost: '🟢 兼顾本地丝滑预测与低带宽 (~48KB/s)',
      bg: pal.greenBg,
      border: stepId === 's3' ? pal.green : pal.ink
    },
    {
      x: 540,
      name: 'Minimal 模式 (AI / 海量小兵)',
      target: '所有多人 AI 怪物 / 召唤物 / BOSS',
      autoClient: '— (AI 无本地拥有客户端)',
      simClient: '✅ 仅复制 Tag 计数 + GameplayCues',
      attrSync: '✅ AttributeSet 血条仍正常同步!',
      cost: '🟢 极致省流，同屏百怪毫无压力 (~14KB/s)',
      bg: pal.blueBg,
      border: stepId === 's5' ? pal.blue : pal.ink
    }
  ];

  return (
    <g>
      <DiagramHeader
        pal={pal}
        category="REPLICATION CROSS-SECTION · Full / Mixed / Minimal 三端网络下发剖面矩阵"
        title="Server 权威数据流向 AutonomousProxy (拥有者客户端) 与 SimulatedProxy (旁观客户端) 的精确分流"
        rightBadge={`当前步骤：${stepId.toUpperCase()}`}
      />

      {/* Top 3-Column Mode Cards (y=106..366) */}
      <g transform="translate(24, 106)">
        <rect x="0" y="0" width="802" height="258" rx="10" fill={pal.card} stroke={pal.lineStrong} strokeWidth="1.3" />

        {modes.map((m, idx) => (
          <g key={idx} transform={`translate(${m.x}, 14)`}>
            <rect x="0" y="0" width="246" height="230" rx="8" fill={m.bg} stroke={m.border} strokeWidth="1.4" />
            <text x="12" y="21" fontSize="10.4" fontWeight="800" fill={pal.ink}>
              {m.name}
            </text>
            <text x="12" y="38" fontSize="8.8" fontWeight="700" fill={pal.muted}>
              适用：{m.target}
            </text>

            {/* Stream to AutonomousProxy */}
            <rect x="10" y="48" width="226" height="44" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.1" />
            <text x="18" y="64" fontSize="8.8" fontWeight="800" fill={pal.violet}>
              ➔ 发往拥有者 (AutonomousProxy):
            </text>
            <text x="18" y="81" fontSize="9" fontWeight="800" fill={pal.ink}>
              {m.autoClient}
            </text>

            {/* Stream to SimulatedProxy */}
            <rect x="10" y="100" width="226" height="44" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.1" />
            <text x="18" y="116" fontSize="8.8" fontWeight="800" fill={pal.blue}>
              ➔ 发往其他玩家 (SimulatedProxy):
            </text>
            <text x="18" y="133" fontSize="9" fontWeight="800" fill={pal.ink}>
              {m.simClient}
            </text>

            {/* AttributeSet note */}
            <rect x="10" y="152" width="226" height="32" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1" />
            <text x="123" y="172" textAnchor="middle" fontSize="9" fontWeight="800" fill={pal.greenInk}>
              {m.attrSync}
            </text>

            <text x="123" y="212" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={pal.ink}>
              {m.cost}
            </text>
          </g>
        ))}
      </g>

      {/* Bottom Panel: The Mixed Mode Owner Chain Trap (y=372..494) */}
      <g transform="translate(24, 372)">
        <rect
          x="0"
          y="0"
          width="802"
          height="122"
          rx="10"
          fill={pal.card}
          stroke={stepId === 's4' ? pal.red : pal.lineStrong}
          strokeWidth={stepId === 's4' ? '2.2' : '1.3'}
        />
        <text x="16" y="22" fontSize="11" fontWeight="800" fill={pal.red}>
          ⚠️ Mixed 模式头号深坑：OwnerActor 的 GetOwner() 拥有链必须通向 APlayerController！
        </text>

        <g transform="translate(16, 32)">
          <rect x="0" y="0" width="430" height="76" rx="7" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="12" y="19" fontSize="9.6" fontWeight="800" fill={pal.greenInk}>
            ✅ 合法拥有链（GetNetConnection() 非空 ➔ 成功下发完整 ActiveGE）：
          </text>
          <text x="12" y="42" fontSize="8.4" fontWeight="800" fill={pal.ink}>
            ASC ➔ Owner (PlayerState / Pawn) ➔ Owner (PlayerController)
          </text>
          <FlowDot x1={30} y1={56} x2={400} y2={56} phase={phase} color={pal.green} stroke={pal.ink} r={4} />
          <line x1="30" y1="56" x2="400" y2="56" stroke={pal.green} strokeWidth="1.6" />
        </g>

        <g transform="translate(460, 32)">
          <rect x="0" y="0" width="326" height="76" rx="7" fill={pal.redBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="12" y="19" fontSize="9.6" fontWeight="800" fill={pal.redInk}>
            ❌ 断裂拥有链（AI 怪误设 Mixed 或载具未 SetOwner）：
          </text>
          <text x="12" y="40" fontSize="9" fontWeight="600" fill={pal.ink}>
            • AI 由 AIController 控制，没有 UNetConnection；
          </text>
          <text x="12" y="58" fontSize="9" fontWeight="800" fill={pal.red}>
            • 导致没有任何客户端被判定为 Owner，退化为只发 Tag！
          </text>
        </g>
      </g>
    </g>
  );
};

/**
 * 22. 5 GE Magnitude Calculators Decision Tree & Snapshot Timeline Diagram
 */
export const GeCalculatorDecisionTreeDiagram: React.FC<DiagramProps> = ({ stepId, phase, theme }) => {
  const pal = getDiagramPalette(theme);

  return (
    <g>
      <DiagramHeader
        pal={pal}
        category="DECISION FLOWCHART · 五种 GE 数值计算器选型决策树与快照对比"
        title="ScalableFloat / AttributeBased / SetByCaller / MMC / ExecCalc 选型路径图"
        rightBadge={`当前步骤：${stepId.toUpperCase()}`}
      />

      {/* Top Panel: Decision Flowchart (y=106..342) */}
      <g transform="translate(24, 106)">
        <rect x="0" y="0" width="802" height="236" rx="10" fill={pal.card} stroke={pal.lineStrong} strokeWidth="1.3" />
        <text x="16" y="21" fontSize="11" fontWeight="800" fill={pal.ink}>
          🧭 实战选型四步决策流（从左向右按问题筛选）：
        </text>

        {/* Q1 -> ExecCalc */}
        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="175" height="68" rx="7" fill={pal.card2} stroke={pal.ink} strokeWidth="1.3" />
          <text x="87" y="20" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={pal.ink}>
            Q1: 需同时捕获攻防双方
          </text>
          <text x="87" y="36" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={pal.ink}>
            多属性且改多个输出属性？
          </text>
          <text x="87" y="54" textAnchor="middle" fontSize="8.5" fontWeight="600" fill={pal.muted}>
            (如暴击/破甲/抗性综合结算)
          </text>

          <line x1="87" y1="68" x2="87" y2="108" stroke={pal.red} strokeWidth="1.8" markerEnd="url(#arrow-ink)" />
          <text x="95" y="92" fontSize="8.8" fontWeight="800" fill={pal.red}>
            是 YES
          </text>

          <rect x="0" y="110" width="175" height="76" rx="7" fill={pal.redBg} stroke={pal.ink} strokeWidth="1.4" />
          <text x="87" y="130" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={pal.redInk}>
            ⑤ ExecCalc (核武器)
          </text>
          <text x="87" y="148" textAnchor="middle" fontSize="8.6" fontWeight="700" fill={pal.ink}>
            仅支持 Instant / 周期跳
          </text>
          <text x="87" y="166" textAnchor="middle" fontSize="8.6" fontWeight="800" fill={pal.red}>
            ❌ 不支持客户端预测 (仅Server)
          </text>
        </g>

        <line x1="191" y1="70" x2="218" y2="70" stroke={pal.ink} strokeWidth="1.8" markerEnd="url(#arrow-ink)" />
        <FlowDot x1={191} y1={70} x2={218} y2={70} phase={phase} color={pal.green} stroke={pal.ink} r={3.5} />

        {/* Q2 -> SetByCaller */}
        <g transform="translate(220, 36)">
          <rect x="0" y="0" width="175" height="68" rx="7" fill={pal.card2} stroke={pal.ink} strokeWidth="1.3" />
          <text x="87" y="20" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={pal.ink}>
            Q2: 数值由外部代码/蓄力
          </text>
          <text x="87" y="36" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={pal.ink}>
            时长在运行时动态注入？
          </text>
          <text x="87" y="54" textAnchor="middle" fontSize="8.5" fontWeight="600" fill={pal.muted}>
            (如拉弓蓄力比/武器面板伤)
          </text>

          <line x1="87" y1="68" x2="87" y2="108" stroke={pal.amber} strokeWidth="1.8" markerEnd="url(#arrow-ink)" />
          <text x="95" y="92" fontSize="8.8" fontWeight="800" fill={pal.amberInk}>
            是 YES
          </text>

          <rect x="0" y="110" width="175" height="76" rx="7" fill={pal.amberBg} stroke={pal.ink} strokeWidth="1.4" />
          <text x="87" y="130" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={pal.amberInk}>
            ③ SetByCaller
          </text>
          <text x="87" y="148" textAnchor="middle" fontSize="8.6" fontWeight="700" fill={pal.ink}>
            AssignTagSetByCallerMagnitude
          </text>
          <text x="87" y="166" textAnchor="middle" fontSize="8.6" fontWeight="800" fill={pal.greenInk}>
            ✅ 支持全时效与客户端预测
          </text>
        </g>

        <line x1="395" y1="70" x2="422" y2="70" stroke={pal.ink} strokeWidth="1.8" markerEnd="url(#arrow-ink)" />
        <FlowDot x1={395} y1={70} x2={422} y2={70} phase={phase} offset={0.3} color={pal.green} stroke={pal.ink} r={3.5} />

        {/* Q3 -> MMC */}
        <g transform="translate(424, 36)">
          <rect x="0" y="0" width="175" height="68" rx="7" fill={pal.card2} stroke={pal.ink} strokeWidth="1.3" />
          <text x="87" y="20" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={pal.ink}>
            Q3: 需捕获多个属性做自定义
          </text>
          <text x="87" y="36" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={pal.ink}>
            公式，且用于 Duration/预测？
          </text>
          <text x="87" y="54" textAnchor="middle" fontSize="8.5" fontWeight="600" fill={pal.muted}>
            (如动态冷却时长/智力转护盾)
          </text>

          <line x1="87" y1="68" x2="87" y2="108" stroke={pal.violet} strokeWidth="1.8" markerEnd="url(#arrow-ink)" />
          <text x="95" y="92" fontSize="8.8" fontWeight="800" fill={pal.violetInk}>
            是 YES
          </text>

          <rect x="0" y="110" width="175" height="76" rx="7" fill={pal.violetBg} stroke={pal.ink} strokeWidth="1.4" />
          <text x="87" y="130" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={pal.violetInk}>
            ④ MMC (自定义单输出)
          </text>
          <text x="87" y="148" textAnchor="middle" fontSize="8.6" fontWeight="700" fill={pal.ink}>
            CalculateBaseMagnitude_Impl
          </text>
          <text x="87" y="166" textAnchor="middle" fontSize="8.6" fontWeight="800" fill={pal.greenInk}>
            ✅ 支持全时效、实时重算与预测
          </text>
        </g>

        <line x1="599" y1="70" x2="624" y2="70" stroke={pal.ink} strokeWidth="1.8" markerEnd="url(#arrow-ink)" />

        {/* Leaf: AttributeBased & ScalableFloat */}
        <g transform="translate(626, 36)">
          <rect x="0" y="0" width="160" height="86" rx="7" fill={pal.blueBg} stroke={pal.ink} strokeWidth="1.3" />
          <text x="80" y="20" textAnchor="middle" fontSize="9.8" fontWeight="800" fill={pal.blueInk}>
            ② AttributeBased
          </text>
          <text x="80" y="38" textAnchor="middle" fontSize="8.6" fontWeight="700" fill={pal.ink}>
            单属性线性换算 (免写 C++)
          </text>
          <text x="80" y="56" textAnchor="middle" fontSize="8.4" fontWeight="600" fill={pal.ink2}>
            Coeff × (PreAdd + Attr) + Post
          </text>
          <text x="80" y="74" textAnchor="middle" fontSize="8.6" fontWeight="800" fill={pal.greenInk}>
            ✅ 支持预测与全时效
          </text>

          <rect x="0" y="100" width="160" height="86" rx="7" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.3" />
          <text x="80" y="120" textAnchor="middle" fontSize="9.8" fontWeight="800" fill={pal.greenInk}>
            ① ScalableFloat
          </text>
          <text x="80" y="138" textAnchor="middle" fontSize="8.6" fontWeight="700" fill={pal.ink}>
            固定常数 × CurveTable 曲线
          </text>
          <text x="80" y="156" textAnchor="middle" fontSize="8.4" fontWeight="600" fill={pal.ink2}>
            按技能 Level 自动查表缩放
          </text>
          <text x="80" y="174" textAnchor="middle" fontSize="8.6" fontWeight="800" fill={pal.greenInk}>
            ✅ 最轻量、首选默认方案
          </text>
        </g>
      </g>

      {/* Bottom Panel: Snapshot vs Non-Snapshot Attribute Capture Timeline (y=350..494) */}
      <g transform="translate(24, 350)">
        <rect
          x="0"
          y="0"
          width="802"
          height="144"
          rx="10"
          fill={pal.card}
          stroke={stepId === 's2' ? pal.violet : pal.lineStrong}
          strokeWidth={stepId === 's2' ? '2.2' : '1.3'}
        />
        <text x="16" y="22" fontSize="11" fontWeight="800" fill={pal.ink}>
          📸 属性捕获快照时机对比（FGameplayEffectAttributeCaptureDefinition::bSnapshot）：
        </text>

        <g transform="translate(16, 32)">
          <rect x="0" y="0" width="380" height="98" rx="7" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="12" y="20" fontSize="9.8" fontWeight="800" fill={pal.greenInk}>
            📷 bSnapshot = TRUE（在 MakeOutgoingSpec 创建瞬间拍照锁死）
          </text>
          <text x="12" y="42" fontSize="9" fontWeight="700" fill={pal.ink}>
            • 典型案例：脱手火球脱手时施法者法强 AP = 200；
          </text>
          <text x="12" y="60" fontSize="9" fontWeight="600" fill={pal.ink2}>
            • 火球飞行途中施法者法强 Buff 到期跌回 100；
          </text>
          <text x="12" y="78" fontSize="9" fontWeight="800" fill={pal.green}>
            • 命中时仍按出手快照的 200 AP 结算！（常用于 Source 攻击属性）
          </text>
        </g>

        <g transform="translate(408, 32)">
          <rect x="0" y="0" width="378" height="98" rx="7" fill={pal.blueBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="12" y="20" fontSize="9.8" fontWeight="800" fill={pal.blueInk}>
            🔄 bSnapshot = FALSE（在命中执行或持续期实时读取最新值）
          </text>
          <text x="12" y="42" fontSize="9" fontWeight="700" fill={pal.ink}>
            • 典型案例：捕获受击目标 Target 的 Armor（护甲）；
          </text>
          <text x="12" y="60" fontSize="9" fontWeight="600" fill={pal.ink2}>
            • 火球飞行途中目标及时开启了 +500 铁壁护盾；
          </text>
          <text x="12" y="78" fontSize="9" fontWeight="800" fill={pal.blue}>
            • 命中时实时读取目标当下最新的高护甲进行减伤！（常用于 Target 防御属性）
          </text>
        </g>
      </g>
    </g>
  );
};

/**
 * 23. GameplayAbility Full Lifecycle State Machine & UE 5.5 Instancing Rule Diagram
 */
export const GaLifecycleStateMachineDiagram: React.FC<DiagramProps> = ({ stepId, phase, theme }) => {
  const pal = getDiagramPalette(theme);

  return (
    <g>
      <DiagramHeader
        pal={pal}
        category="ABILITY LIFECYCLE · GA 授予激活状态机与 UE 5.5 InstancedPerActor 内存图"
        title="Authority 授予 ➔ TryActivate ➔ CommitAbility (Cost/CD) ➔ AbilityTasks ➔ EndAbility 强制闭环"
        rightBadge={`当前步骤：${stepId.toUpperCase()}`}
      />

      {/* Top State Machine Pipeline (y=106..296) */}
      <g transform="translate(24, 106)">
        <rect x="0" y="0" width="802" height="190" rx="10" fill={pal.card} stroke={pal.lineStrong} strokeWidth="1.3" />
        <text x="16" y="21" fontSize="11" fontWeight="800" fill={pal.ink}>
          🔄 UGameplayAbility 标准五阶段生死闭环（漏调 EndAbility = 技能永远卡死在 IsActive 态！）：
        </text>

        {[
          {
            x: 16,
            title: '① GiveAbility',
            sub1: '仅 Server Authority 调用',
            sub2: '生成 AbilitySpec',
            sub3: '复制到 Client 激活列表',
            bg: pal.violetBg
          },
          {
            x: 174,
            title: '② TryActivate',
            sub1: '校验 CanActivateAbility',
            sub2: '查标签槽 + Cost + CD',
            sub3: '通过进 ActivateAbility',
            bg: pal.blueBg
          },
          {
            x: 332,
            title: '③ CommitAbility',
            sub1: '再次复核 CheckCost / CD',
            sub2: '应用 GE_Cost 瞬发扣蓝',
            sub3: '挂 GE_Cooldown 冷却Tag',
            bg: pal.amberBg
          },
          {
            x: 490,
            title: '④ 异步任务执行期',
            sub1: 'PlayMontageAndWait',
            sub2: 'WaitEvent / TargetData',
            sub3: '技能处于 IsActive = true',
            bg: pal.greenBg
          },
          {
            x: 648,
            title: '⑤ EndAbility 闭环',
            sub1: '正常完成或被 Cancel 打断',
            sub2: '卸下 OwnedTags',
            sub3: '销毁名下全部 AbilityTask',
            bg: pal.redBg
          }
        ].map((st, idx) => (
          <g key={idx}>
            <g transform={`translate(${st.x}, 34)`}>
              <rect x="0" y="0" width="138" height="138" rx="8" fill={st.bg} stroke={pal.ink} strokeWidth="1.3" />
              <text x="69" y="24" textAnchor="middle" fontSize="10.2" fontWeight="800" fill={pal.ink}>
                {st.title}
              </text>
              <rect x="8" y="36" width="122" height="88" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1" />
              <text x="69" y="56" textAnchor="middle" fontSize="8" fontWeight="700" fill={pal.ink}>
                {st.sub1}
              </text>
              <text x="69" y="78" textAnchor="middle" fontSize="8" fontWeight="700" fill={pal.ink2}>
                {st.sub2}
              </text>
              <text x="69" y="102" textAnchor="middle" fontSize="8" fontWeight="800" fill={pal.violetInk}>
                {st.sub3}
              </text>
            </g>
            {idx < 4 && (
              <FlowDot
                x1={st.x + 138}
                y1={103}
                x2={st.x + 158}
                y2={103}
                phase={phase}
                offset={idx * 0.22}
                color={pal.green}
                stroke={pal.ink}
                r={4}
              />
            )}
          </g>
        ))}
      </g>

      {/* Bottom Panel: UE 5.5 InstancedPerActor Rule + EnhancedInput Routing (y=304..494) */}
      <g transform="translate(24, 304)">
        <rect x="0" y="0" width="802" height="190" rx="10" fill={pal.card} stroke={pal.lineStrong} strokeWidth="1.3" />

        {/* Left: UE 5.5 Instancing Policy Rule */}
        <g transform="translate(16, 14)">
          <rect
            x="0"
            y="0"
            width="400"
            height="162"
            rx="8"
            fill={pal.violetBg}
            stroke={stepId === 's3' ? pal.violet : pal.ink}
            strokeWidth={stepId === 's3' ? '2.2' : '1.2'}
          />
          <text x="14" y="22" fontSize="10.5" fontWeight="800" fill={pal.violetInk}>
            🆕 UE 5.5 重大新规：InstancedPerActor 成为唯一工业标准！
          </text>
          <text x="14" y="44" fontSize="9.2" fontWeight="700" fill={pal.ink}>
            • ✅ InstancedPerActor（推荐默认）：每个拥有该技能的角色在 GiveAbility 时
          </text>
          <text x="14" y="60" fontSize="9" fontWeight="600" fill={pal.ink2}>
            &nbsp; 只创建 1 个 GA 实例常驻复用，零 GC 抖动，且支持保存技能内成员状态。
          </text>
          <text x="12" y="82" fontSize="8.3" fontWeight="800" fill={pal.red}>
            • ⚠️ 复用注意：同实例反复激活，Activate 开头必重置变量！
          </text>
          <text x="12" y="104" fontSize="8" fontWeight="700" fill={pal.muted}>
            • ❌ NonInstanced（UE 5.5 正式废弃）：跑在 CDO 不支持预测；
          </text>
          <text x="12" y="122" fontSize="8.1" fontWeight="700" fill={pal.muted}>
            • ⚠️ InstancedPerExecution：每次按键 NewObject，GC 压力大。
          </text>
        </g>

        {/* Right: EnhancedInput DynamicSpecSourceTags Routing */}
        <g transform="translate(430, 14)">
          <rect
            x="0"
            y="0"
            width="356"
            height="162"
            rx="8"
            fill={pal.greenBg}
            stroke={stepId === 's4' ? pal.green : pal.ink}
            strokeWidth={stepId === 's4' ? '2.2' : '1.2'}
          />
          <text x="14" y="22" fontSize="10.5" fontWeight="800" fill={pal.greenInk}>
            🎮 Lyra 现代输入路由：告别旧版枚举 InputID
          </text>
          <rect x="14" y="34" width="328" height="52" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.1" />
          <text x="24" y="53" fontSize="9.2" fontWeight="800" fill={pal.ink}>
            1. 授予时贴入动态输入签：
          </text>
          <text x="24" y="72" fontSize="8.8" fontWeight="700" fill={pal.violet}>
            Spec.GetDynamicSpecSourceTags().AddTag(InputTag_Q);
          </text>

          <rect x="14" y="94" width="328" height="54" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.1" />
          <text x="24" y="113" fontSize="9.2" fontWeight="800" fill={pal.ink}>
            2. EnhancedInput 按下时遍历 ActivatableAbilities：
          </text>
          <text x="24" y="132" fontSize="8.8" fontWeight="700" fill={pal.green}>
            匹配 HasTagExact(InputTag_Q) ➔ TryActivateAbility(Handle)
          </text>
        </g>
      </g>
    </g>
  );
};

/**
 * 24. AbilityTask Scoped Lifecycle & ReadyForActivation Call-Stack Diagram
 */
export const AbilityTaskLifecycleDiagram: React.FC<DiagramProps> = ({ stepId, phase, theme }) => {
  const pal = getDiagramPalette(theme);

  return (
    <g>
      <DiagramHeader
        pal={pal}
        category="ABILITY TASK LIFECYCLE · 异步任务作用域生命周期与 ReadyForActivation 激活时序"
        title="为什么严禁在 GA 里裸写 FTimerManager？以及为什么必须在绑定委托之后才能调 ReadyForActivation？"
        rightBadge={`当前步骤：${stepId.toUpperCase()}`}
      />

      {/* Top Panel: Raw Timer Crash vs UAbilityTask Auto Cleanup (y=106..278) */}
      <g transform="translate(24, 106)">
        <rect x="0" y="0" width="802" height="172" rx="10" fill={pal.card} stroke={pal.lineStrong} strokeWidth="1.3" />

        {/* Left: Raw Timer Crash */}
        <g transform="translate(16, 14)">
          <rect x="0" y="0" width="376" height="144" rx="8" fill={pal.redBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="14" y="21" fontSize="10.2" fontWeight="800" fill={pal.redInk}>
            ❌ 裸写 GetWorldTimerManager().SetTimer 的悬空灾难
          </text>
          <line x1="20" y1="54" x2="350" y2="54" stroke={pal.ink} strokeWidth="1.5" />
          <rect x="20" y="38" width="130" height="28" rx="5" fill={pal.chip} stroke={pal.ink} strokeWidth="1.1" />
          <text x="85" y="56" textAnchor="middle" fontSize="9" fontWeight="800" fill={pal.ink}>
            t=0s 启动 1.0s Timer
          </text>
          <rect x="160" y="38" width="100" height="28" rx="5" fill={pal.amberBg} stroke={pal.ink} strokeWidth="1.1" />
          <text x="210" y="56" textAnchor="middle" fontSize="9" fontWeight="800" fill={pal.amberInk}>
            t=0.4s 被眩晕打断!
          </text>
          <rect x="270" y="38" width="94" height="28" rx="5" fill={pal.red} stroke={pal.ink} strokeWidth="1.2" />
          <text x="317" y="56" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff">
            t=1.0s 幽灵触发💥
          </text>

          <text x="14" y="92" fontSize="9" fontWeight="600" fill={pal.ink}>
            • 技能早在 t=0.4s 就调了 EndAbility，甚至角色已阵亡销毁；
          </text>
          <text x="14" y="110" fontSize="9" fontWeight="800" fill={pal.red}>
            • t=1.0s Timer 照常触发：躺尸角色突然射出火球或空指针 Crash！
          </text>
          <text x="14" y="128" fontSize="8.8" fontWeight="600" fill={pal.muted}>
            • 且裸 Timer 完全无法感知客户端预测回滚。
          </text>
        </g>

        {/* Right: UAbilityTask Scoped Lifecycle */}
        <g transform="translate(410, 14)">
          <rect x="0" y="0" width="376" height="144" rx="8" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="14" y="21" fontSize="10.2" fontWeight="800" fill={pal.greenInk}>
            ✅ UAbilityTask_WaitDelay（与所属 GA 同生共死）
          </text>
          <line x1="20" y1="54" x2="260" y2="54" stroke={pal.green} strokeWidth="2" />
          <rect x="20" y="38" width="130" height="28" rx="5" fill={pal.chip} stroke={pal.ink} strokeWidth="1.1" />
          <text x="85" y="56" textAnchor="middle" fontSize="9" fontWeight="800" fill={pal.green}>
            t=0s 创建 WaitDelay
          </text>
          <rect x="165" y="38" width="190" height="28" rx="5" fill={pal.chip} stroke={pal.ink} strokeWidth="1.2" />
          <text x="260" y="56" textAnchor="middle" fontSize="9" fontWeight="800" fill={pal.greenInk}>
            t=0.4s EndAbility ➔ Task 自动销毁!
          </text>

          <text x="14" y="92" fontSize="9" fontWeight="600" fill={pal.ink}>
            • 所有 UAbilityTask 实例都登记在所属 GA 的 ActiveTasks 列表中；
          </text>
          <text x="14" y="110" fontSize="9" fontWeight="800" fill={pal.green}>
            • 一旦 GA 结束或被 Cancel，引擎自动遍历调用 Task-&gt;OnDestroy()！
          </text>
          <text x="14" y="128" fontSize="8.8" fontWeight="700" fill={pal.ink2}>
            • 零悬空回调、零内存泄漏，且完美对接预测回滚体系。
          </text>
        </g>
      </g>

      {/* Bottom Panel: 3-Step C++ Activation Order & ShouldBroadcastAbilityTaskDelegates (y=286..494) */}
      <g transform="translate(24, 286)">
        <rect
          x="0"
          y="0"
          width="802"
          height="208"
          rx="10"
          fill={pal.card}
          stroke={stepId === 's3' || stepId === 's4' ? pal.violet : pal.lineStrong}
          strokeWidth={stepId === 's3' || stepId === 's4' ? '2.2' : '1.3'}
        />
        <text x="16" y="22" fontSize="11.2" fontWeight="800" fill={pal.ink}>
          ⚙️ C++ 调用与编写 AbilityTask 的黄金三步曲（顺序错一步 = 回调永远收不到！）：
        </text>

        {[
          {
            x: 18,
            step: '第一步：静态工厂仅实例化',
            code: 'Task = NewAbilityTask<UMyTask>(this);',
            rule: '⚠️ 工厂函数内严禁直接调 Activate()！此时外部还没机会绑委托！',
            bg: pal.blueBg
          },
          {
            x: 282,
            step: '第二步：挂载完成/中断委托',
            code: 'Task->OnCompleted.AddDynamic(...);',
            rule: '✅ 必须在启动前先把所有输出引脚回调绑好！',
            bg: pal.violetBg
          },
          {
            x: 546,
            step: '第三步：正式点火启动任务',
            code: 'Task->ReadyForActivation();',
            rule: '🔥 内部调用 Task::Activate()，即使当帧同步完成也能收到回调！',
            bg: pal.greenBg
          }
        ].map((box, idx) => (
          <g key={idx}>
            <g transform={`translate(${box.x}, 34)`}>
              <rect x="0" y="0" width="238" height="114" rx="8" fill={box.bg} stroke={pal.ink} strokeWidth="1.3" />
              <text x="12" y="21" fontSize="10" fontWeight="800" fill={pal.ink}>
                {box.step}
              </text>
              <rect x="10" y="30" width="218" height="28" rx="5" fill={pal.chip} stroke={pal.ink} strokeWidth="1" />
              <text x="119" y="48" textAnchor="middle" fontSize="8.6" fontWeight="800" fill={pal.violet}>
                {box.code}
              </text>
              <text x="12" y="78" fontSize="8.8" fontWeight="700" fill={pal.ink2}>
                {box.rule.slice(0, 20)}
              </text>
              <text x="12" y="96" fontSize="8.8" fontWeight="700" fill={pal.ink2}>
                {box.rule.slice(20)}
              </text>
            </g>
            {idx < 2 && (
              <FlowDot
                x1={box.x + 238}
                y1={91}
                x2={box.x + 264}
                y2={91}
                phase={phase}
                offset={idx * 0.35}
                color={pal.green}
                stroke={pal.ink}
              />
            )}
          </g>
        ))}

        {/* Bottom Guard Strip */}
        <rect x="18" y="158" width="766" height="36" rx="6" fill={pal.amberBg} stroke={pal.ink} strokeWidth="1.2" />
        <text x="401" y="180" textAnchor="middle" fontSize="9.6" fontWeight="800" fill={pal.amberInk}>
          🛡️ 自定义 Task 内部铁律：广播委托前必查 if (ShouldBroadcastAbilityTaskDelegates())；并在 OnDestroy(bInOwnerFinished) 中解绑外部事件！
        </text>
      </g>
    </g>
  );
};

/**
 * 25. GameplayCue Static vs Actor Carrier & Object Pool Dirty-State Ring Diagram
 */
export const CuePoolingRingDiagram: React.FC<DiagramProps> = ({ stepId, phase, theme }) => {
  const pal = getDiagramPalette(theme);

  return (
    <g>
      <DiagramHeader
        pal={pal}
        category="CUE CARRIERS & POOLING · Static/Actor 双载体选型与对象池脏数据环形状态机"
        title="瞬发特效用 GCN_Static (CDO零开销) · 持续特效用 GCN_Actor (对象池复用必清脏状态)"
        rightBadge={`当前步骤：${stepId.toUpperCase()}`}
      />

      {/* Left Panel: Static vs Actor Comparison (x=24, y=106, w=366, h=388) */}
      <g transform="translate(24, 106)">
        <rect x="0" y="0" width="366" height="388" rx="10" fill={pal.card} stroke={pal.lineStrong} strokeWidth="1.3" />
        <text x="16" y="22" fontSize="11.2" fontWeight="800" fill={pal.ink}>
          ⚖️ 两类 GameplayCue 蓝图基类选型对照：
        </text>

        {/* Card 1: GCN_Static */}
        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="334" height="156" rx="8" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.3" />
          <text x="14" y="22" fontSize="10.5" fontWeight="800" fill={pal.greenInk}>
            ⚡ UGameplayCueNotify_Static / Burst
          </text>
          <text x="14" y="42" fontSize="8.3" fontWeight="800" fill={pal.ink}>
            • 内存形态：UObject CDO 单例（全服仅 1 份，0 Spawn！）
          </text>
          <text x="14" y="62" fontSize="9.2" fontWeight="600" fill={pal.ink2}>
            • 支持回调：OnExecute / OnActive / WhileActive / OnRemove
          </text>
          <text x="14" y="82" fontSize="9.2" fontWeight="800" fill={pal.red}>
            • 限制：不能保存任何实例变量，不能 Tick，不能挂载持久组件
          </text>
          <rect x="14" y="98" width="306" height="44" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.1" />
          <text x="167" y="117" textAnchor="middle" fontSize="8.4" fontWeight="800" fill={pal.greenInk}>
            🎯 适用 80% 瞬发表现：刀光火花、受击音效、暴击飘字
          </text>
          <text x="167" y="133" textAnchor="middle" fontSize="8.6" fontWeight="600" fill={pal.muted}>
            (Lyra 推荐优先使用 UGameplayCueNotify_Burst)
          </text>
        </g>

        {/* Card 2: GCN_Actor */}
        <g transform="translate(16, 206)">
          <rect x="0" y="0" width="334" height="166" rx="8" fill={pal.blueBg} stroke={pal.ink} strokeWidth="1.3" />
          <text x="14" y="22" fontSize="10.5" fontWeight="800" fill={pal.blueInk}>
            🔄 AGameplayCueNotify_Actor / Looping
          </text>
          <text x="14" y="42" fontSize="8.2" fontWeight="800" fill={pal.ink}>
            • 内存形态：真实生成 AActor（GameplayCueManager 池化）
          </text>
          <text x="14" y="62" fontSize="8" fontWeight="600" fill={pal.ink2}>
            • 优势：可挂 Niagara 持续组件、Audio、Timeline 与 Tick
          </text>
          <text x="14" y="82" fontSize="9.2" fontWeight="800" fill={pal.amberInk}>
            • 必开配置：bAutoDestroyOnRemove = true（触发自动归还对象池）
          </text>
          <rect x="14" y="98" width="306" height="54" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.1" />
          <text x="167" y="118" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={pal.blueInk}>
            🎯 适用持续性状态表现：全身烈焰燃烧、寒冰护盾球、毒雾环绕光环
          </text>
          <text x="167" y="136" textAnchor="middle" fontSize="8.6" fontWeight="600" fill={pal.muted}>
            (Lyra 推荐优先使用 AGameplayCueNotify_Looping)
          </text>
        </g>
      </g>

      {/* Right Panel: GCN_Actor Object Pool Ring & Dirty State Trap (x=402, y=106, w=424, h=388) */}
      <g transform="translate(402, 106)">
        <rect
          x="0"
          y="0"
          width="424"
          height="388"
          rx="10"
          fill={pal.card}
          stroke={stepId === 's4' ? pal.red : pal.lineStrong}
          strokeWidth={stepId === 's4' ? '2.2' : '1.3'}
        />
        <text x="16" y="22" fontSize="11.2" fontWeight="800" fill={pal.ink}>
          ♻️ GCN_Actor 对象池借还环形状态机（揭秘“第二次触发坏掉”之谜）：
        </text>

        {/* Node 1: Pool Idle (Top) */}
        <g transform="translate(110, 38)">
          <rect x="0" y="0" width="204" height="56" rx="8" fill={pal.violetBg} stroke={pal.ink} strokeWidth="1.3" />
          <text x="102" y="22" textAnchor="middle" fontSize="9.4" fontWeight="800" fill={pal.violetInk}>
            ① 对象池休眠区 (Preallocated Pool)
          </text>
          <text x="102" y="40" textAnchor="middle" fontSize="8.8" fontWeight="600" fill={pal.ink2}>
            Actor 隐藏休眠 · 不走构造函数!
          </text>
        </g>

        {/* Right Node: Borrow & Mutate */}
        <g transform="translate(218, 122)">
          <rect x="0" y="0" width="190" height="86" rx="8" fill={pal.amberBg} stroke={pal.ink} strokeWidth="1.3" />
          <text x="95" y="20" textAnchor="middle" fontSize="9.8" fontWeight="800" fill={pal.amberInk}>
            ② 出池激活 (WhileActive)
          </text>
          <text x="12" y="40" fontSize="8.8" fontWeight="700" fill={pal.ink}>
            运行期修改了自身状态：
          </text>
          <text x="12" y="56" fontSize="8.8" fontWeight="800" fill={pal.red}>
            • bHasExploded = true;
          </text>
          <text x="12" y="72" fontSize="8.8" fontWeight="800" fill={pal.red}>
            • SetActorScale3D(3.0f);
          </text>
        </g>

        {/* Left Node: Return to Pool & Reset */}
        <g transform="translate(16, 122)">
          <rect x="0" y="0" width="186" height="86" rx="8" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.3" />
          <text x="93" y="20" textAnchor="middle" fontSize="9.8" fontWeight="800" fill={pal.greenInk}>
            ③ 归还前清洗 (OnRemove)
          </text>
          <text x="12" y="40" fontSize="8.8" fontWeight="700" fill={pal.ink}>
            必须在回池前手动复原：
          </text>
          <text x="12" y="56" fontSize="8.8" fontWeight="800" fill={pal.green}>
            • bHasExploded = false;
          </text>
          <text x="12" y="72" fontSize="8.8" fontWeight="800" fill={pal.green}>
            • Deactivate 粒子 + 还原缩放!
          </text>
        </g>

        {/* Ring Arrows */}
        <line x1="280" y1="94" x2="310" y2="122" stroke={pal.ink} strokeWidth="1.8" markerEnd="url(#arrow-ink)" />
        <FlowDot x1={280} y1={94} x2={310} y2={122} phase={phase} color={pal.amber} stroke={pal.ink} />
        <line x1="218" y1="165" x2="202" y2="165" stroke={pal.ink} strokeWidth="1.8" markerEnd="url(#arrow-ink)" />
        <line x1="110" y1="122" x2="145" y2="94" stroke={pal.ink} strokeWidth="1.8" markerEnd="url(#arrow-ink)" />
        <FlowDot x1={110} y1={122} x2={145} y2={94} phase={phase} offset={0.5} color={pal.green} stroke={pal.ink} />

        {/* Bottom Checklist Box */}
        <g transform="translate(16, 224)">
          <rect x="0" y="0" width="392" height="148" rx="8" fill={pal.redBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="14" y="22" fontSize="10.2" fontWeight="800" fill={pal.redInk}>
            🚨 为什么 GCN_Actor 第一次放正常、第二次放特效不见了？
          </text>
          <text x="12" y="44" fontSize="8.4" fontWeight="600" fill={pal.ink}>
            1. 对象池复用 Actor 时不会重新执行构造函数，上次修改的成员变量原封不动保留；
          </text>
          <text x="12" y="64" fontSize="8.1" fontWeight="600" fill={pal.ink}>
            2. 若在蓝图重写 Recycle()/OnRemove() 漏调 Super 或 FinishedCallback，
          </text>
          <text x="12" y="82" fontSize="8.1" fontWeight="800" fill={pal.red}>
            &nbsp; 会导致无法回收，或带着脏标志位 (bTriggered=true) 再次出池！
          </text>
          <rect x="14" y="96" width="364" height="40" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.1" />
          <text x="196" y="114" textAnchor="middle" fontSize="8.4" fontWeight="800" fill={pal.greenInk}>
            ✅ 黄金准则：WhileActive 做的状态变更，必须在 OnRemove 逆向还原！
          </text>
          <text x="196" y="129" textAnchor="middle" fontSize="8.6" fontWeight="700" fill={pal.muted}>
            或直接使用 UE5 封装好组件生命周期的 AGameplayCueNotify_Looping 基类
          </text>
        </g>
      </g>
    </g>
  );
};

/**
 * 26. Melee 3-Hit Combo Montage Timeline & Blade Multi-Frame Sweep TSet Diagram
 */
export const MeleeComboMontageSweepDiagram: React.FC<DiagramProps> = ({ stepId, phase, theme }) => {
  const pal = getDiagramPalette(theme);
  const animCursorX = 130 + ((phase * 640) % 640);

  return (
    <g>
      <DiagramHeader
        pal={pal}
        category="MONTAGE & HITBOX SWEEP · 连招蒙太奇轨道窗口与刀刃多帧扫掠 TSet 去重图"
        title="MontageSetNextSectionName 零闪断切段 + 单刀 TSet<AActor*> 命中去重与 DS 骨骼刷新铁律"
        rightBadge={`当前步骤：${stepId.toUpperCase()}`}
      />

      {/* Top Panel: UE5 Animation Montage Multi-Track Timeline (y=106..278) */}
      <g transform="translate(24, 106)">
        <rect
          x="0"
          y="0"
          width="802"
          height="172"
          rx="10"
          fill={pal.card}
          stroke={stepId === 's2' ? pal.green : pal.lineStrong}
          strokeWidth={stepId === 's2' ? '2.2' : '1.3'}
        />
        <text x="16" y="21" fontSize="11" fontWeight="800" fill={pal.ink}>
          🎬 AM_MeleeCombo 三段斩动画蒙太奇轨道剖析（单 GA 实例内无缝推进，避免销毁重建闪断）：
        </text>

        {/* Moving Montage Playhead */}
        <line x1={animCursorX} y1="30" x2={animCursorX} y2="158" stroke={pal.red} strokeWidth="1.6" />

        {/* Track 1: Montage Sections */}
        <text x="16" y="52" fontSize="9.5" fontWeight="800" fill={pal.ink}>
          Sections 轨道
        </text>
        <rect x="130" y="36" width="210" height="26" rx="5" fill={pal.blueBg} stroke={pal.ink} strokeWidth="1.2" />
        <text x="235" y="53" textAnchor="middle" fontSize="9.6" fontWeight="800" fill={pal.blueInk}>
          Slash_01 (一段横斩 0.0~0.8s)
        </text>
        <rect x="344" y="36" width="210" height="26" rx="5" fill={pal.violetBg} stroke={pal.ink} strokeWidth="1.2" />
        <text x="449" y="53" textAnchor="middle" fontSize="9.6" fontWeight="800" fill={pal.violetInk}>
          Slash_02 (二段上挑 0.8~1.6s)
        </text>
        <rect x="558" y="36" width="214" height="26" rx="5" fill={pal.amberBg} stroke={pal.ink} strokeWidth="1.2" />
        <text x="665" y="53" textAnchor="middle" fontSize="9.6" fontWeight="800" fill={pal.amberInk}>
          Slash_03 (三段重劈 1.6~2.6s)
        </text>

        {/* Track 2: ANS_WeaponSweep Hitbox Windows */}
        <text x="16" y="88" fontSize="9.5" fontWeight="800" fill={pal.red}>
          刀刃判定轨
        </text>
        {[170, 385, 610].map((wx, idx) => (
          <g key={idx} transform={`translate(${wx}, 72)`}>
            <rect x="0" y="0" width="96" height="24" rx="5" fill={pal.redBg} stroke={pal.ink} strokeWidth="1.1" />
            <text x="48" y="15.5" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={pal.redInk}>
              🗡️ Sweep 窗口 #{idx + 1}
            </text>
          </g>
        ))}

        {/* Track 3: ANS_ComboWindow Input Windows */}
        <text x="16" y="124" fontSize="9.5" fontWeight="800" fill={pal.green}>
          连招输入窗口
        </text>
        <rect x="235" y="108" width="95" height="24" rx="5" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.2" />
        <text x="282" y="124" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={pal.greenInk}>
          ComboWindow #1
        </text>
        <rect x="450" y="108" width="95" height="24" rx="5" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.2" />
        <text x="497" y="124" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={pal.greenInk}>
          ComboWindow #2
        </text>

        <text x="130" y="152" fontSize="9.2" fontWeight="800" fill={pal.greenInk}>
          ⚡ 窗口内再次按下普攻 ➔ 调用 MontageSetNextSectionName(&quot;Slash_01&quot;, &quot;Slash_02&quot;) ➔ 动画当前段播完零闪断丝滑切入下一段！
        </text>
      </g>

      {/* Bottom Left: Multi-Frame Blade Sweep & TSet<AActor*> Deduplication (x=24, y=286, w=476, h=208) */}
      <g transform="translate(24, 286)">
        <rect
          x="0"
          y="0"
          width="476"
          height="208"
          rx="10"
          fill={pal.card}
          stroke={stepId === 's3' ? pal.amber : pal.lineStrong}
          strokeWidth={stepId === 's3' ? '2.2' : '1.3'}
        />
        <text x="16" y="22" fontSize="11" fontWeight="800" fill={pal.ink}>
          🛡️ 俯视几何图：为什么一刀挥过 4 帧必须用 TSet&lt;AActor*&gt; 去重？
        </text>

        {/* Top-down Sword Sweep Fan */}
        <g transform="translate(20, 34)">
          <rect x="0" y="0" width="216" height="158" rx="8" fill={pal.card2} stroke={pal.lineStrong} />
          {/* Attacker Pivot */}
          <circle cx="42" cy="126" r="14" fill={pal.blueBg} stroke={pal.ink} strokeWidth="1.4" />
          <text x="42" y="130" textAnchor="middle" fontSize="8.5" fontWeight="800" fill={pal.blueInk}>
            挥刀者
          </text>

          {/* Boss Target Capsule */}
          <circle cx="136" cy="68" r="28" fill={pal.redBg} stroke={pal.red} strokeWidth="1.8" strokeDasharray="4 2" />
          <text x="136" y="65" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={pal.redInk}>
            BOSS 胶囊体
          </text>
          <text x="136" y="79" textAnchor="middle" fontSize="8" fontWeight="700" fill={pal.ink}>
            (被扫中 4 帧)
          </text>

          {/* 4 Blade Positions across frames */}
          {[
            { x2: 105, y2: 32, label: 'F1 (首帧命中 ✅)', color: pal.green },
            { x2: 142, y2: 46, label: 'F2 (TSet过滤 🛡️)', color: pal.muted },
            { x2: 168, y2: 74, label: 'F3 (TSet过滤 🛡️)', color: pal.muted },
            { x2: 178, y2: 108, label: 'F4 (TSet过滤 🛡️)', color: pal.muted }
          ].map((b, i) => (
            <g key={i}>
              <line x1="42" y1="126" x2={b.x2} y2={b.y2} stroke={b.color} strokeWidth={i === 0 ? '3' : '1.6'} />
              <circle cx={b.x2} cy={b.y2} r="4" fill={b.color} />
            </g>
          ))}
        </g>

        {/* Explanation on Right of Sweep Fan */}
        <g transform="translate(248, 34)">
          <rect x="0" y="0" width="212" height="72" rx="6" fill={pal.redBg} stroke={pal.ink} strokeWidth="1.1" />
          <text x="10" y="18" fontSize="9.3" fontWeight="800" fill={pal.redInk}>
            ❌ 未加 TSet 去重：
          </text>
          <text x="10" y="36" fontSize="8.6" fontWeight="600" fill={pal.ink}>
            0.2 秒挥刀窗口历经 12 帧，球体扫掠
          </text>
          <text x="10" y="51" fontSize="8.6" fontWeight="800" fill={pal.red}>
            连续碰到 Boss 4 次 = 瞬间扣 4 倍血秒杀!
          </text>

          <rect x="0" y="82" width="212" height="76" rx="6" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.1" />
          <text x="10" y="100" fontSize="9.3" fontWeight="800" fill={pal.greenInk}>
            ✅ 单次挥刀周期维护 HitActors：
          </text>
          <text x="10" y="118" fontSize="8.6" fontWeight="600" fill={pal.ink}>
            • F1 命中：加入 TSet 并结算出伤 ✅
          </text>
          <text x="10" y="134" fontSize="8.6" fontWeight="600" fill={pal.ink}>
            • F2~F4：HitActors.Contains 跳过 🛡️
          </text>
          <text x="10" y="150" fontSize="8.6" fontWeight="800" fill={pal.violetInk}>
            • 进入下一段 Slash_02 时 Empty() 清空!
          </text>
        </g>
      </g>

      {/* Bottom Right: Dedicated Server Bone Refresh Rule (x=512, y=286, w=314, h=208) */}
      <g transform="translate(512, 286)">
        <rect
          x="0"
          y="0"
          width="314"
          height="208"
          rx="10"
          fill={pal.card}
          stroke={stepId === 's3' ? pal.red : pal.lineStrong}
          strokeWidth={stepId === 's3' ? '2.2' : '1.3'}
        />
        <text x="14" y="22" fontSize="10.8" fontWeight="800" fill={pal.red}>
          🖥️ Dedicated Server 刀刃判定全空之谜
        </text>

        <rect x="14" y="34" width="286" height="74" rx="7" fill={pal.redBg} stroke={pal.ink} strokeWidth="1.1" />
        <text x="24" y="52" fontSize="9.2" fontWeight="800" fill={pal.redInk}>
          ❌ 线上故障：PIE 单机刀刀命中，上 DS 服务器全砍空！
        </text>
        <text x="24" y="70" fontSize="8.6" fontWeight="600" fill={pal.ink}>
          原因：Dedicated Server 没有显示器（没人渲染角色），
        </text>
        <text x="20" y="86" fontSize="7.8" fontWeight="800" fill={pal.red}>
          SkeletalMesh 默认不刷新骨骼，武器插槽焊死原地!
        </text>

        <rect x="14" y="118" width="286" height="76" rx="7" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.2" />
        <text x="20" y="136" fontSize="9" fontWeight="800" fill={pal.greenInk}>
          ✅ 服务端刀刃扫掠必配项 (Mesh 组件)：
        </text>
        <text x="20" y="156" fontSize="8.4" fontWeight="800" fill={pal.ink}>
          Mesh-&gt;VisibilityBasedAnimTickOption =
        </text>
        <text x="20" y="172" fontSize="7.4" fontWeight="800" fill={pal.green}>
          EVisibilityBasedAnimTickOption::AlwaysTickPoseAndRefreshBones
        </text>
      </g>
    </g>
  );
};
