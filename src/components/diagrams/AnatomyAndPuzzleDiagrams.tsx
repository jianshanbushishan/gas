import React from 'react';
import { DiagramHeader, DiagramProps, FlowDot, getDiagramPalette } from './types';

/**
 * 14. Coupled Spaghetti vs GAS Data-Driven Bus + Multiplayer Dilemma Diagram
 */
export const CoupledVsGasDiagram: React.FC<DiagramProps> = ({ stepId, phase, theme }) => {
  const pal = getDiagramPalette(theme);

  return (
    <g>
      <DiagramHeader
        pal={pal}
        category="ARCHITECTURE CONTRAST · 硬编码网状耦合 vs GAS 总线解耦与联机两难对比"
        title="为什么传统 if-else 状态分支与手写 RPC 会在技能满 20 个时彻底崩盘？"
        rightBadge={`当前步骤：${stepId.toUpperCase()}`}
      />

      {/* Top Left: N x M Hardcoded State Matrix (x=24, y=106, w=392, h=218) */}
      <g transform="translate(24, 106)">
        <rect
          x="0"
          y="0"
          width="392"
          height="218"
          rx="10"
          fill={pal.card}
          stroke={stepId === 's1' ? pal.red : pal.lineStrong}
          strokeWidth={stepId === 's1' ? '2.2' : '1.3'}
        />
        <text x="14" y="21" fontSize="10.8" fontWeight="800" fill={pal.red}>
          ❌ 痛点一：硬编码技能与状态呈 N × M 网状交叉爆炸
        </text>

        {/* Left Skills, Right States with tangled red lines */}
        {['CastFireball()', 'DashEvade()', 'DrinkPotion()', 'HeavySlash()'].map((sk, i) => (
          <g key={i} transform={`translate(16, ${36 + i * 42})`}>
            <rect x="0" y="0" width="118" height="32" rx="6" fill={pal.redBg} stroke={pal.ink} strokeWidth="1.1" />
            <text x="59" y="20" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={pal.redInk}>
              {sk}
            </text>
          </g>
        ))}

        {['bIsStunned', 'bIsSilenced', 'bIsRooted', 'bIsChanneling'].map((st, j) => (
          <g key={j} transform={`translate(258, ${36 + j * 42})`}>
            <rect x="0" y="0" width="118" height="32" rx="6" fill={pal.amberBg} stroke={pal.ink} strokeWidth="1.1" />
            <text x="59" y="20" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={pal.amberInk}>
              {st}
            </text>
          </g>
        ))}

        {/* Tangled Web Lines */}
        {[0, 1, 2, 3].map((i) =>
          [0, 1, 2, 3].map((j) => (
            <line
              key={`${i}-${j}`}
              x1="134"
              y1={52 + i * 42}
              x2="258"
              y2={52 + j * 42}
              stroke={pal.red}
              strokeWidth="1.1"
              opacity="0.55"
            />
          ))
        )}
        <rect x="148" y="96" width="96" height="44" rx="6" fill={pal.chip} stroke={pal.red} strokeWidth="1.4" />
        <text x="196" y="114" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={pal.red}>
          每加 1 个新状态
        </text>
        <text x="196" y="130" textAnchor="middle" fontSize="8.8" fontWeight="700" fill={pal.ink}>
          全员改 if-else!
        </text>
      </g>

      {/* Top Right: GAS Decoupled Tag & ASC Bus (x=430, y=106, w=396, h=218) */}
      <g transform="translate(430, 106)">
        <rect x="0" y="0" width="396" height="218" rx="10" fill={pal.card} stroke={pal.green} strokeWidth="1.6" />
        <text x="14" y="21" fontSize="10.8" fontWeight="800" fill={pal.green}>
          ✅ 正解：通过 ASC 与 GameplayTag 容器实现 0 引用解耦
        </text>

        <g transform="translate(16, 40)">
          <rect x="0" y="0" width="116" height="160" rx="7" fill={pal.blueBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="58" y="22" textAnchor="middle" fontSize="9.8" fontWeight="800" fill={pal.blueInk}>
            任意技能 (GA)
          </text>
          <text x="58" y="54" textAnchor="middle" fontSize="8.8" fontWeight="600" fill={pal.ink2}>
            只声明标签规则：
          </text>
          <rect x="10" y="66" width="96" height="36" rx="5" fill={pal.chip} stroke={pal.ink} strokeWidth="1" />
          <text x="58" y="82" textAnchor="middle" fontSize="8.5" fontWeight="800" fill={pal.red}>
            BlockedBy:
          </text>
          <text x="58" y="95" textAnchor="middle" fontSize="8.5" fontWeight="700" fill={pal.ink}>
            State.Debuff.Stun
          </text>
          <text x="58" y="132" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={pal.greenInk}>
            不認識任何具體 Buff!
          </text>
        </g>

        <g transform="translate(152, 56)">
          <rect x="0" y="0" width="94" height="128" rx="8" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.5" />
          <text x="47" y="28" textAnchor="middle" fontSize="10.2" fontWeight="800" fill={pal.greenInk}>
            ASC 中枢
          </text>
          <text x="47" y="48" textAnchor="middle" fontSize="8.8" fontWeight="700" fill={pal.ink}>
            TagCount 表
          </text>
          <text x="47" y="76" textAnchor="middle" fontSize="8.8" fontWeight="700" fill={pal.violet}>
            FAggregator
          </text>
          <text x="47" y="104" textAnchor="middle" fontSize="8.8" fontWeight="700" fill={pal.blue}>
            PredictionKey
          </text>
        </g>

        <g transform="translate(266, 40)">
          <rect x="0" y="0" width="114" height="160" rx="7" fill={pal.amberBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="57" y="22" textAnchor="middle" fontSize="9.8" fontWeight="800" fill={pal.amberInk}>
            任意效果 (GE)
          </text>
          <text x="57" y="54" textAnchor="middle" fontSize="8.8" fontWeight="600" fill={pal.ink2}>
            只负责注入标签：
          </text>
          <rect x="9" y="66" width="96" height="36" rx="5" fill={pal.chip} stroke={pal.ink} strokeWidth="1" />
          <text x="57" y="82" textAnchor="middle" fontSize="8.5" fontWeight="800" fill={pal.green}>
            GrantToTarget:
          </text>
          <text x="57" y="95" textAnchor="middle" fontSize="8.5" fontWeight="700" fill={pal.ink}>
            State.Debuff.Stun
          </text>
          <text x="57" y="132" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={pal.amberInk}>
            策划改表即生效!
          </text>
        </g>

        <line x1="132" y1="120" x2="152" y2="120" stroke={pal.ink} strokeWidth="1.8" />
        <line x1="266" y1="120" x2="246" y2="120" stroke={pal.ink} strokeWidth="1.8" />
      </g>

      {/* Bottom Panel: Multiplayer 3-Way Comparison (y=332..494) */}
      <g transform="translate(24, 332)">
        <rect
          x="0"
          y="0"
          width="802"
          height="162"
          rx="10"
          fill={pal.card}
          stroke={stepId === 's2' ? pal.amber : pal.lineStrong}
          strokeWidth={stepId === 's2' ? '2.2' : '1.3'}
        />
        <text x="16" y="22" fontSize="11" fontWeight="800" fill={pal.ink}>
          🌐 痛点二：多人联机架构的三岔路口（为什么手写 RPC 难以兼顾手感与安全）：
        </text>

        {[
          {
            x: 16,
            title: '方案 A：纯客户端先行并说了算',
            lag: '手感延迟：0 ms ⚡',
            sec: '防作弊：0 分 ❌（内存修改器一秒秒杀全服）',
            verdict: '正式联机游戏严禁采用',
            bg: pal.redBg
          },
          {
            x: 278,
            title: '方案 B：纯请求服务端批准后再播动画',
            lag: '手感延迟：100~200 ms 🐢（按键像踩泥巴）',
            sec: '防作弊：100 分 ✅（全由 Server 裁决）',
            verdict: '仅适合慢节奏回合制，动作/射击不可接受',
            bg: pal.amberBg
          },
          {
            x: 540,
            title: '方案 C：GAS LocalPredicted + 预测密钥',
            lag: '手感延迟：0 ms ⚡（本地同步栈抢跑）',
            sec: '防作弊：100 分 ✅（Server 仲裁+回滚）',
            verdict: '3A 联机动作/射击黄金标准！',
            bg: pal.greenBg
          }
        ].map((c, idx) => (
          <g key={idx} transform={`translate(${c.x}, 32)`}>
            <rect x="0" y="0" width="246" height="116" rx="8" fill={c.bg} stroke={pal.ink} strokeWidth="1.2" />
            <text x="12" y="20" fontSize="10" fontWeight="800" fill={pal.ink}>
              {c.title}
            </text>
            <text x="12" y="44" fontSize="9.2" fontWeight="700" fill={pal.ink}>
              • {c.lag}
            </text>
            <text x="12" y="66" fontSize="9.2" fontWeight="700" fill={pal.ink}>
              • {c.sec}
            </text>
            <rect x="10" y="82" width="226" height="24" rx="5" fill={pal.chip} stroke={pal.ink} strokeWidth="1" />
            <text x="123" y="98" textAnchor="middle" fontSize="9" fontWeight="800" fill={pal.ink}>
              {c.verdict}
            </text>
          </g>
        ))}
      </g>
    </g>
  );
};

/**
 * 15. GAS 5 Pillars Master Blueprint & End-to-End Fireball Journey Diagram
 */
export const GasFivePillarsBlueprintDiagram: React.FC<DiagramProps> = ({ phase, theme }) => {
  const pal = getDiagramPalette(theme);

  const pillars = [
    {
      x: 16,
      num: '支柱 ①',
      name: 'GameplayTags',
      cls: 'FGameplayTagCountContainer',
      lines: ['树状语义字典 + 引用计数表', '充当全系统的解耦神经信号', '支持前缀匹配与原生宏'],
      bg: pal.amberBg
    },
    {
      x: 172,
      num: '支柱 ②',
      name: 'AttributeSet',
      cls: 'FGameplayAttributeData',
      lines: ['Base + Current 双轨数值容器', '承载生命/法力与元属性漏斗', '支持双层 Clamp 与预测复制'],
      bg: pal.blueBg
    },
    {
      x: 328,
      num: '支柱 ③',
      name: 'GameplayAbility',
      cls: 'UGameplayAbility + Task',
      lines: ['封装技能激活与异步任务流', '(PlayMontage / WaitEvent)', '管理预测窗口与六大标签槽'],
      bg: pal.greenBg
    },
    {
      x: 484,
      num: '支柱 ④',
      name: 'GameplayEffect',
      cls: 'UGameplayEffect (5.3 组件)',
      lines: ['纯数据修改器指令单：驱动', 'Instant/Duration/Periodic', '与 UE 5.5 五段乘区公式'],
      bg: pal.violetBg
    },
    {
      x: 640,
      num: '支柱 ⑤',
      name: 'GameplayCue',
      cls: 'GCN_Static / GCN_Actor',
      lines: ['纯客户端表现层：靠标签触发', '粒子 / 音效 / 相机震动反馈', 'Burst 瞬发与 Looping 对象池'],
      bg: pal.redBg
    }
  ];

  return (
    <g>
      <DiagramHeader
        pal={pal}
        category="MASTER BLUEPRINT · UE 5.3–5.5 GAS 五大支柱与端到端战斗全链路总览图"
        title="UAbilitySystemComponent 核心大脑协同五大子系统 + 一发火球术从按键到飘字的 7 步旅程"
        rightBadge="全教程核心蓝图"
      />

      {/* Top 5 Pillars Row (y=106..244) */}
      <g transform="translate(24, 106)">
        <rect x="0" y="0" width="802" height="138" rx="10" fill={pal.card} stroke={pal.lineStrong} strokeWidth="1.3" />
        {pillars.map((p, i) => (
          <g key={i} transform={`translate(${p.x}, 12)`}>
            <rect x="0" y="0" width="146" height="114" rx="8" fill={p.bg} stroke={pal.ink} strokeWidth="1.2" />
            <text x="10" y="18" fontSize="9" fontWeight="800" fill={pal.muted}>
              {p.num}
            </text>
            <text x="10" y="36" fontSize="11" fontWeight="800" fill={pal.ink}>
              {p.name}
            </text>
            <text x="10" y="52" fontSize="8.5" fontWeight="700" fill={pal.violetInk}>
              {p.cls}
            </text>
            <text x="10" y="72" fontSize="8.2" fontWeight="600" fill={pal.ink2}>
              {p.lines[0]}
            </text>
            <text x="10" y="86" fontSize="8.2" fontWeight="600" fill={pal.ink2}>
              {p.lines[1]}
            </text>
            <text x="10" y="100" fontSize="8.2" fontWeight="600" fill={pal.ink2}>
              {p.lines[2]}
            </text>
          </g>
        ))}
      </g>

      {/* Bottom 7-Step End-to-End Fireball Pipeline (y=252..494) */}
      <g transform="translate(24, 252)">
        <rect x="0" y="0" width="802" height="242" rx="10" fill={pal.card} stroke={pal.lineStrong} strokeWidth="1.3" />
        <text x="16" y="22" fontSize="11.2" fontWeight="800" fill={pal.ink}>
          🔥 实战全链路：一发联机《火球术 (GA_Fireball)》在五大支柱间的标准流转闭环：
        </text>

        {[
          {
            x: 16,
            y: 36,
            step: '1. 输入路由',
            title: 'EnhancedInput',
            sub: 'InputTag 触发 TryActivate',
            bg: pal.amberBg
          },
          {
            x: 214,
            y: 36,
            step: '2. 预测激活 & 闸门',
            title: 'GA_Fireball (Predicted)',
            sub: '签发 Key #42 · 校验标签槽',
            bg: pal.greenBg
          },
          {
            x: 412,
            y: 36,
            step: '3. 提交消耗与冷却',
            title: 'CommitAbility()',
            sub: 'GE_Cost(-30蓝) + GE_CD(5s)',
            bg: pal.violetBg
          },
          {
            x: 610,
            y: 36,
            step: '4. 异步动画与事件',
            title: 'PlayMontage + WaitEvent',
            sub: '第15帧收 Event.Spawn 事件',
            bg: pal.blueBg
          },
          {
            x: 610,
            y: 136,
            step: '5. 权威生成飞弹',
            title: 'HasAuthority() Spawn',
            sub: 'Server 生成火球并命中敌人',
            bg: pal.greenBg
          },
          {
            x: 320,
            y: 136,
            step: '6. 伤害结算与漏斗',
            title: 'ExecCalc ➔ IncomingDamage',
            sub: '算暴击破甲 ➔ PostGEExecute 先扣盾再扣血',
            bg: pal.redBg
          },
          {
            x: 16,
            y: 136,
            step: '7. 表现同步与收尾',
            title: 'GameplayCue + EndAbility',
            sub: '多播爆炸特效与暴击飘字，安全回收任务',
            bg: pal.amberBg
          }
        ].map((node, idx) => (
          <g key={idx} transform={`translate(${node.x}, ${node.y})`}>
            <rect
              x="0"
              y="0"
              width={idx === 5 ? 270 : idx === 6 ? 284 : 176}
              height="82"
              rx="8"
              fill={node.bg}
              stroke={pal.ink}
              strokeWidth="1.3"
            />
            <text x="12" y="20" fontSize="9.2" fontWeight="800" fill={pal.muted}>
              {node.step}
            </text>
            <text x="12" y="42" fontSize="9.8" fontWeight="800" fill={pal.ink}>
              {node.title}
            </text>
            <text x="12" y="64" fontSize="8.6" fontWeight="600" fill={pal.ink2}>
              {node.sub}
            </text>
          </g>
        ))}

        {/* Animated Flow Dots along the U-shaped path */}
        <FlowDot x1={192} y1={77} x2={214} y2={77} phase={phase} color={pal.green} stroke={pal.ink} />
        <FlowDot x1={390} y1={77} x2={412} y2={77} phase={phase} offset={0.2} color={pal.violet} stroke={pal.ink} />
        <FlowDot x1={588} y1={77} x2={610} y2={77} phase={phase} offset={0.4} color={pal.blue} stroke={pal.ink} />
        <FlowDot x1={698} y1={118} x2={698} y2={136} phase={phase} offset={0.55} color={pal.green} stroke={pal.ink} />
        <FlowDot x1={610} y1={177} x2={590} y2={177} phase={phase} offset={0.7} color={pal.red} stroke={pal.ink} />
        <FlowDot x1={320} y1={177} x2={300} y2={177} phase={phase} offset={0.85} color={pal.amber} stroke={pal.ink} />
      </g>
    </g>
  );
};

/**
 * 16. OwnerActor (PlayerState) vs AvatarActor (Character) Anatomy Diagram
 */
export const OwnerAvatarAnatomyDiagram: React.FC<DiagramProps> = ({ stepId, phase, theme }) => {
  const pal = getDiagramPalette(theme);

  return (
    <g>
      <DiagramHeader
        pal={pal}
        category="ACTOR ANATOMY · OwnerActor (灵魂) 与 AvatarActor (肉体) 分离架构图"
        title="为什么多人玩家英雄必须把 ASC 挂在 APlayerState 上，并由 ACharacter 转发接口？"
        rightBadge={`当前步骤：${stepId.toUpperCase()}`}
      />

      {/* Left Panel: Soul vs Body Separation (x=24, y=106, w=500, h=388) */}
      <g transform="translate(24, 106)">
        <rect x="0" y="0" width="500" height="388" rx="10" fill={pal.card} stroke={pal.lineStrong} strokeWidth="1.3" />
        <text x="16" y="22" fontSize="11.2" fontWeight="800" fill={pal.ink}>
          🧬 核心架构：持久化数据中枢 (OwnerActor) vs 物理世界替身 (AvatarActor)
        </text>

        {/* Top Box: APlayerState (OwnerActor) */}
        <g transform="translate(18, 36)">
          <rect x="0" y="0" width="464" height="142" rx="9" fill={pal.violetBg} stroke={pal.ink} strokeWidth="1.5" />
          <text x="16" y="24" fontSize="11" fontWeight="800" fill={pal.violetInk}>
            👻 OwnerActor = AMyPlayerState（持久灵魂 · 跨死亡重生永不销毁）
          </text>
          <rect x="16" y="36" width="212" height="90" rx="7" fill={pal.chip} stroke={pal.ink} strokeWidth="1.2" />
          <text x="122" y="56" textAnchor="middle" fontSize="10" fontWeight="800" fill={pal.green}>
            UAbilitySystemComponent
          </text>
          <text x="122" y="76" textAnchor="middle" fontSize="9" fontWeight="600" fill={pal.ink2}>
            • ActivatableAbilities (已授予技能表)
          </text>
          <text x="122" y="94" textAnchor="middle" fontSize="9" fontWeight="600" fill={pal.ink2}>
            • ActiveGameplayEffects (大招CD/Buff)
          </text>
          <text x="122" y="112" textAnchor="middle" fontSize="9" fontWeight="600" fill={pal.ink2}>
            • GameplayTagCountContainer
          </text>

          <rect x="240" y="36" width="208" height="90" rx="7" fill={pal.chip} stroke={pal.ink} strokeWidth="1.2" />
          <text x="344" y="56" textAnchor="middle" fontSize="10" fontWeight="800" fill={pal.blue}>
            UMyAttributeSet
          </text>
          <text x="344" y="76" textAnchor="middle" fontSize="9" fontWeight="600" fill={pal.ink2}>
            • Health / MaxHealth
          </text>
          <text x="344" y="94" textAnchor="middle" fontSize="9" fontWeight="600" fill={pal.ink2}>
            • Mana / Gold / Level
          </text>
          <text x="344" y="112" textAnchor="middle" fontSize="9" fontWeight="800" fill={pal.greenInk}>
            肉体阵亡 Destroy 时毫发无损!
          </text>
        </g>

        {/* Bidirectional Pointer Bridge */}
        <line x1="205" y1="178" x2="205" y2="218" stroke={pal.ink} strokeWidth="2" markerEnd="url(#arrow-ink)" />
        <FlowDot x1={205} y1={178} x2={205} y2={218} phase={phase} color={pal.violet} stroke={pal.ink} />
        <text x="195" y="202" textAnchor="end" fontSize="8.6" fontWeight="800" fill={pal.violet}>
          InitAbilityActorInfo(PS, Char)
        </text>

        <line x1="295" y1="218" x2="295" y2="178" stroke={pal.green} strokeWidth="2" markerEnd="url(#arrow-ink)" />
        <FlowDot x1={295} y1={218} x2={295} y2={178} phase={phase} offset={0.5} color={pal.green} stroke={pal.ink} />
        <text x="305" y="202" fontSize="8.6" fontWeight="800" fill={pal.green}>
          GetAbilitySystemComponent() 转发!
        </text>

        {/* Bottom Box: ACharacter (AvatarActor) */}
        <g transform="translate(18, 220)">
          <rect
            x="0"
            y="0"
            width="464"
            height="152"
            rx="9"
            fill={pal.blueBg}
            stroke={stepId === 's3' ? pal.green : pal.ink}
            strokeWidth={stepId === 's3' ? '2.2' : '1.5'}
          />
          <text x="16" y="24" fontSize="11" fontWeight="800" fill={pal.blueInk}>
            🧍 AvatarActor = AMyHeroCharacter（物理肉体 · 死亡可随时销毁重建）
          </text>
          <text x="16" y="46" fontSize="8.5" fontWeight="700" fill={pal.ink}>
            • 承载：SkeletalMesh 蒙太奇、Capsule 碰撞、RootMotion、武器 Socket
          </text>
          <rect x="16" y="58" width="432" height="80" rx="7" fill={pal.chip} stroke={pal.ink} strokeWidth="1.2" />
          <text x="24" y="78" fontSize="8.8" fontWeight="800" fill={pal.red}>
            ⚠️ 极易漏写的一步：AMyHeroCharacter 必须实现 IAbilitySystemInterface！
          </text>
          <text x="24" y="98" fontSize="8.1" fontWeight="600" fill={pal.ink2}>
            火球炸中 Character 时，引擎调 GetAbilitySystemComponentFromActor(HitChar)；
          </text>
          <text x="24" y="116" fontSize="8" fontWeight="800" fill={pal.greenInk}>
            若未转发给 GetPlayerState&lt;AMyPS&gt;()-&gt;GetASC()，返回 nullptr 全技能失灵!
          </text>
        </g>
      </g>

      {/* Right Panel: Placement Decision Matrix (x=536, y=106, w=290, h=388) */}
      <g transform="translate(536, 106)">
        <rect x="0" y="0" width="290" height="388" rx="10" fill={pal.card} stroke={pal.lineStrong} strokeWidth="1.3" />
        <text x="16" y="22" fontSize="11.2" fontWeight="800" fill={pal.ink}>
          📋 ASC 挂载位置选型指南
        </text>

        {[
          {
            y: 36,
            title: '1. MOBA / 射击多人玩家英雄',
            host: 'Owner: PlayerState | Avatar: Character',
            why: '死亡重生保留大招 CD、金币、等级与永久层数；换载具/变身只需重绑 AvatarActor。',
            tone: pal.greenBg
          },
          {
            y: 152,
            title: '2. 野外小兵 / Boss / 召唤物 AI',
            host: 'Owner & Avatar 同为: ACharacter',
            why: 'AI 默认不生成 PlayerState（节省内存开销），且死后直接销毁无需跨重生保留数据。',
            tone: pal.amberBg
          },
          {
            y: 268,
            title: '3. 纯单机动作游戏主角',
            host: '可直接放 ACharacter (或 PlayerState)',
            why: '若死亡即读档重开，放 Character 最简单；若有频繁换身体/机甲玩法，仍推荐放 PS。',
            tone: pal.blueBg
          }
        ].map((item, idx) => (
          <g key={idx} transform={`translate(14, ${item.y})`}>
            <rect x="0" y="0" width="262" height="104" rx="8" fill={item.tone} stroke={pal.ink} strokeWidth="1.2" />
            <text x="12" y="20" fontSize="10" fontWeight="800" fill={pal.ink}>
              {item.title}
            </text>
            <rect x="10" y="28" width="242" height="22" rx="4" fill={pal.chip} stroke={pal.ink} strokeWidth="1" />
            <text x="131" y="43" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={pal.ink}>
              {item.host}
            </text>
            <text x="12" y="68" fontSize="8.8" fontWeight="600" fill={pal.ink2}>
              {item.why.slice(0, 22)}
            </text>
            <text x="12" y="84" fontSize="8.8" fontWeight="600" fill={pal.ink2}>
              {item.why.slice(22)}
            </text>
          </g>
        ))}
      </g>
    </g>
  );
};

/**
 * 17. UE 5.3+ GE Component Puzzle & AssetTags vs TargetTags Anatomy Diagram
 */
export const Ge53ComponentPuzzleDiagram: React.FC<DiagramProps> = ({ stepId, phase, theme }) => {
  const pal = getDiagramPalette(theme);

  return (
    <g>
      <DiagramHeader
        pal={pal}
        category="UE 5.3+ GE COMPONENTS · 模块化组件拼图与 AssetTags vs TargetTags 归属解剖"
        title="告别 UE 5.2 臃肿单表：按需插拔 GEComponents + 一张图分清头号易混点（药水瓶标签 vs 受击者标签）"
        rightBadge={`当前步骤：${stepId.toUpperCase()}`}
      />

      {/* Top Panel: Modular GEComponents Puzzle Slots (y=106..268) */}
      <g transform="translate(24, 106)">
        <rect
          x="0"
          y="0"
          width="802"
          height="160"
          rx="10"
          fill={pal.card}
          stroke={stepId === 's1' ? pal.violet : pal.lineStrong}
          strokeWidth={stepId === 's1' ? '2.2' : '1.3'}
        />
        <text x="16" y="21" fontSize="11" fontWeight="800" fill={pal.ink}>
          🧩 UE 5.3–5.5 UGameplayEffect::GEComponents 模块化插槽映射（点击 Details 面板 + 号按需添加）：
        </text>

        {[
          {
            x: 14,
            y: 32,
            cls: 'UTargetTags...Component',
            ui: 'Grant Tags to Target Actor',
            role: '给受击目标挂标签 (眩晕/冷却)',
            bg: pal.greenBg
          },
          {
            x: 210,
            y: 32,
            cls: 'UAssetTags...Component',
            ui: 'Tags This Effect Has',
            role: '描述 GE 自身属性 (火伤/魔法)',
            bg: pal.amberBg
          },
          {
            x: 406,
            y: 32,
            cls: 'UTargetTagRequirements...',
            ui: 'Application / Ongoing / Removal',
            role: '准入条件 · 动态暂停 · 满条件驱散',
            bg: pal.blueBg
          },
          {
            x: 602,
            y: 32,
            cls: 'UImmunity...Component',
            ui: 'GrantedApplicationImmunity',
            role: '存续期免疫指定标签的其他 GE',
            bg: pal.violetBg
          },
          {
            x: 14,
            y: 96,
            cls: 'UAbilities...Component',
            ui: 'Grant Abilities',
            role: 'Buff 期间临时授予技能',
            bg: pal.blueBg
          },
          {
            x: 210,
            y: 96,
            cls: 'URemoveOther...Component',
            ui: 'Remove Other Gameplay Effects',
            role: '施加瞬间驱散目标身上的旧 GE',
            bg: pal.redBg
          },
          {
            x: 406,
            y: 96,
            cls: 'UBlockAbilityTags...',
            ui: 'Block Ability Tags',
            role: 'Debuff 期间封锁目标特定技能',
            bg: pal.amberBg
          },
          {
            x: 602,
            y: 96,
            cls: 'UAdditionalEffects...',
            ui: 'OnApplication / OnComplete',
            role: '施加或到期时派生子 GE 链',
            bg: pal.greenBg
          }
        ].map((slot, idx) => (
          <g key={idx} transform={`translate(${slot.x}, ${slot.y})`}>
            <rect x="0" y="0" width="186" height="54" rx="6" fill={slot.bg} stroke={pal.ink} strokeWidth="1.1" />
            <text x="8" y="16" fontSize="8.8" fontWeight="800" fill={pal.ink}>
              {slot.cls}
            </text>
            <text x="8" y="31" fontSize="7.8" fontWeight="700" fill={pal.violetInk}>
              面板: {slot.ui}
            </text>
            <text x="8" y="46" fontSize="8.6" fontWeight="800" fill={pal.ink2}>
              ➔ {slot.role}
            </text>
          </g>
        ))}
      </g>

      {/* Bottom Left: AssetTags vs TargetTags Anatomy (x=24, y=274, w=504, h=220) */}
      <g transform="translate(24, 274)">
        <rect
          x="0"
          y="0"
          width="504"
          height="220"
          rx="10"
          fill={pal.card}
          stroke={stepId === 's2' ? pal.green : pal.lineStrong}
          strokeWidth={stepId === 's2' ? '2.2' : '1.3'}
        />
        <text x="16" y="22" fontSize="11.2" fontWeight="800" fill={pal.ink}>
          🔍 头号易混点解剖：为什么把 Stun 配进 AssetTags 里角色根本不会眩晕？
        </text>

        {/* Bottle: AssetTags */}
        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="224" height="168" rx="8" fill={pal.amberBg} stroke={pal.ink} strokeWidth="1.3" />
          <text x="112" y="22" textAnchor="middle" fontSize="10.2" fontWeight="800" fill={pal.amberInk}>
            🧪 UAssetTagsComponent
          </text>
          <text x="112" y="38" textAnchor="middle" fontSize="8.8" fontWeight="700" fill={pal.muted}>
            (贴在“药水瓶自身”上的商品分类签)
          </text>
          <rect x="14" y="48" width="196" height="54" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.2" />
          <text x="112" y="68" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={pal.amber}>
            Damage.Type.Fire / Debuff.Poison
          </text>
          <text x="112" y="88" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={pal.red}>
            🚫 绝不会加进受击者 ASC 标签表！
          </text>
          <text x="14" y="122" fontSize="8.8" fontWeight="700" fill={pal.ink}>
            • 正确用途：供护盾免疫组件检查“这是不
          </text>
          <text x="14" y="138" fontSize="8.8" fontWeight="700" fill={pal.ink}>
            &nbsp; 是毒药？”，或供净化技能按类型驱散。
          </text>
        </g>

        <line x1="240" y1="120" x2="264" y2="120" stroke={pal.ink} strokeWidth="2" markerEnd="url(#arrow-ink)" />
        <FlowDot x1={240} y1={120} x2={264} y2={120} phase={phase} color={pal.green} stroke={pal.ink} />

        {/* Victim: TargetTags */}
        <g transform="translate(266, 36)">
          <rect x="0" y="0" width="222" height="168" rx="8" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.3" />
          <text x="111" y="22" textAnchor="middle" fontSize="10.2" fontWeight="800" fill={pal.greenInk}>
            🎯 UTargetTagsComponent
          </text>
          <text x="111" y="38" textAnchor="middle" fontSize="8.8" fontWeight="700" fill={pal.muted}>
            (真正注入到“受击角色身上”的状态签)
          </text>
          <rect x="14" y="48" width="194" height="54" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.2" />
          <text x="111" y="68" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={pal.green}>
            State.Debuff.Stun / Cooldown.Fire
          </text>
          <text x="111" y="88" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={pal.greenInk}>
            ✅ 存续期间挂入目标 ASC 引用计数表!
          </text>
          <text x="14" y="122" fontSize="8.8" fontWeight="700" fill={pal.ink}>
            • 正确用途：眩晕封锁目标技能、赋予无敌、
          </text>
          <text x="14" y="138" fontSize="8.8" fontWeight="700" fill={pal.ink}>
            &nbsp; 挂载技能冷却 Tag（GE 到期自动卸下）。
          </text>
        </g>
      </g>

      {/* Bottom Right: OngoingTagRequirements Dynamic Pause/Resume (x=540, y=274, w=286, h=220) */}
      <g transform="translate(540, 274)">
        <rect
          x="0"
          y="0"
          width="286"
          height="220"
          rx="10"
          fill={pal.card}
          stroke={stepId === 's3' ? pal.blue : pal.lineStrong}
          strokeWidth={stepId === 's3' ? '2.2' : '1.3'}
        />
        <text x="14" y="22" fontSize="10.8" fontWeight="800" fill={pal.blue}>
          ⏸️ OngoingTagRequirements 动态暂停
        </text>
        <text x="14" y="40" fontSize="8.2" fontWeight="600" fill={pal.muted}>
          案例：脱战回血（InCombat 即暂停，脱战自动恢复）
        </text>

        <g transform="translate(14, 52)">
          <rect x="0" y="0" width="258" height="44" rx="6" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.1" />
          <text x="12" y="18" fontSize="9.2" fontWeight="800" fill={pal.greenInk}>
            t = 0~4s (无 InCombat 标签)：
          </text>
          <text x="12" y="34" fontSize="9" fontWeight="700" fill={pal.ink}>
            🟢 光环激活生效 (+50 HP/s · 修改器参与聚合)
          </text>

          <rect x="0" y="52" width="258" height="48" rx="6" fill={pal.amberBg} stroke={pal.ink} strokeWidth="1.1" />
          <text x="12" y="70" fontSize="9.2" fontWeight="800" fill={pal.amberInk}>
            t = 4~9s (受击挂上 State.InCombat)：
          </text>
          <text x="12" y="88" fontSize="8" fontWeight="700" fill={pal.ink}>
            ⏸️ Ongoing 不满足 ➔ 临时抑制 (GE 不销毁!)
          </text>

          <rect x="0" y="108" width="258" height="44" rx="6" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.1" />
          <text x="12" y="126" fontSize="9.2" fontWeight="800" fill={pal.greenInk}>
            t = 9s+ (InCombat 到期移除)：
          </text>
          <text x="12" y="142" fontSize="8" fontWeight="700" fill={pal.ink}>
            🟢 自动恢复生效！（无需重施 ApplyGE）
          </text>
        </g>
      </g>
    </g>
  );
};

/**
 * 18. TargetData Polymorphic Pipeline & Server Anti-Cheat Validation Diagram
 */
export const TargetDataPipelineDiagram: React.FC<DiagramProps> = ({ stepId, phase, theme }) => {
  const pal = getDiagramPalette(theme);

  return (
    <g>
      <DiagramHeader
        pal={pal}
        category="TARGET DATA & ANTI-CHEAT · 多态目标数据跨网打包与服务端三重防外挂安检"
        title="客户端准星采样打包 ➔ FGameplayAbilityTargetDataHandle 序列化 ➔ Server WaitTargetData 严格复核"
        rightBadge={`当前步骤：${stepId.toUpperCase()}`}
      />

      {/* Main Pipeline (y=106..494) */}
      <g transform="translate(24, 106)">
        <rect x="0" y="0" width="802" height="388" rx="10" fill={pal.card} stroke={pal.lineStrong} strokeWidth="1.3" />

        {/* Column 1: Client Trace & Polymorphic Structs */}
        <g transform="translate(18, 22)">
          <rect x="0" y="0" width="236" height="344" rx="8" fill={pal.blueBg} stroke={pal.ink} strokeWidth="1.3" />
          <text x="118" y="24" textAnchor="middle" fontSize="10.8" fontWeight="800" fill={pal.blueInk}>
            🎮 1. Client 准星采样与多态封装
          </text>

          <rect x="14" y="38" width="208" height="68" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.1" />
          <text x="24" y="56" fontSize="9.5" fontWeight="800" fill={pal.ink}>
            为什么要在 Client 采样？
          </text>
          <text x="24" y="74" fontSize="8.8" fontWeight="600" fill={pal.ink2}>
            摄像机朝向、屏幕射线与鼠标选点在
          </text>
          <text x="24" y="90" fontSize="8.8" fontWeight="600" fill={pal.ink2}>
            本地最准，免受 100ms 延迟偏移。
          </text>

          <text x="14" y="128" fontSize="9" fontWeight="800" fill={pal.blueInk}>
            📦 TargetData 派生族：
          </text>

          {[
            {
              y: 138,
              name: 'SingleTargetHit',
              desc: '包装 FHitResult (弹孔/爆头骨骼)'
            },
            {
              y: 198,
              name: 'ActorArray',
              desc: '包装 TWeakObjectPtr<AActor> 数组'
            },
            {
              y: 258,
              name: '自定义派生 TargetData',
              desc: '重写 GetScriptStruct + NetSerialize'
            }
          ].map((td, i) => (
            <g key={i} transform={`translate(14, ${td.y})`}>
              <rect x="0" y="0" width="208" height="52" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.1" />
              <text x="10" y="19" fontSize="9.5" fontWeight="800" fill={pal.violet}>
                • {td.name}
              </text>
              <text x="10" y="38" fontSize="8.1" fontWeight="600" fill={pal.ink2}>
                {td.desc}
              </text>
            </g>
          ))}
        </g>

        {/* Network Arrow */}
        <line x1="254" y1="194" x2="306" y2="194" stroke={pal.ink} strokeWidth="2.2" markerEnd="url(#arrow-ink)" />
        <FlowDot x1={254} y1={194} x2={306} y2={194} phase={phase} color={pal.blue} stroke={pal.ink} r={5} />
        <text x="280" y="182" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={pal.blue}>
          RPC 上传
        </text>

        {/* Column 2: Server 3-Stage Anti-Cheat Funnel */}
        <g transform="translate(310, 22)">
          <rect
            x="0"
            y="0"
            width="264"
            height="344"
            rx="8"
            fill={pal.amberBg}
            stroke={stepId === 's3' ? pal.red : pal.ink}
            strokeWidth={stepId === 's3' ? '2.2' : '1.4'}
          />
          <text x="132" y="24" textAnchor="middle" fontSize="10.8" fontWeight="800" fill={pal.amberInk}>
            🛡️ 2. Server WaitTargetData 防外挂三道关
          </text>
          <text x="132" y="42" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={pal.red}>
            铁律：绝不盲信客户端传来的 HitResult / Actor!
          </text>

          {[
            {
              y: 56,
              gate: '安检门 ①：最大射程距离校验 (MaxRange)',
              rule: 'DistSq(Muzzle, HitPoint) <= MaxRange²',
              hack: '拦截“全图吸怪 / 千米外隔空刀人”外挂',
              tone: pal.chip
            },
            {
              y: 146,
              gate: '安检门 ②：朝向视锥角校验 (View Cone)',
              rule: 'Dot(Fwd, DirToTarget) >= Cos(MaxAng)',
              hack: '拦截“背身 180° 锁头 / 暴力自瞄篡改”',
              tone: pal.chip
            },
            {
              y: 236,
              gate: '安检门 ③：服务端射线遮挡复核 (LoS Check)',
              rule: 'Server World->LineTraceSingleByChannel(...)',
              hack: '拦截“穿墙透视打人 / 伪造空气碰撞点”',
              tone: pal.chip
            }
          ].map((g, idx) => (
            <g key={idx} transform={`translate(14, ${g.y})`}>
              <rect x="0" y="0" width="236" height="78" rx="6" fill={g.tone} stroke={pal.ink} strokeWidth="1.2" />
              <text x="10" y="19" fontSize="9.2" fontWeight="800" fill={pal.ink}>
                {g.gate}
              </text>
              <text x="10" y="39" fontSize="8" fontWeight="700" fill={pal.violet}>
                {g.rule}
              </text>
              <rect x="8" y="48" width="220" height="22" rx="4" fill={pal.redBg} />
              <text x="118" y="63" textAnchor="middle" fontSize="8.6" fontWeight="800" fill={pal.redInk}>
                🚫 {g.hack}
              </text>
            </g>
          ))}
        </g>

        <line x1="574" y1="194" x2="614" y2="194" stroke={pal.ink} strokeWidth="2.2" markerEnd="url(#arrow-ink)" />
        <FlowDot x1={574} y1={194} x2={614} y2={194} phase={phase} offset={0.5} color={pal.green} stroke={pal.ink} r={5} />

        {/* Column 3: Verdict Outcome */}
        <g transform="translate(618, 22)">
          <rect x="0" y="0" width="166" height="162" rx="8" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.3" />
          <text x="83" y="24" textAnchor="middle" fontSize="10.2" fontWeight="800" fill={pal.greenInk}>
            ✅ 校验通过 (ValidData)
          </text>
          <text x="83" y="54" textAnchor="middle" fontSize="9" fontWeight="700" fill={pal.ink}>
            • CommitAbility 扣蓝/CD
          </text>
          <text x="83" y="78" textAnchor="middle" fontSize="9" fontWeight="700" fill={pal.ink}>
            • ApplyGameplayEffectToTarget
          </text>
          <text x="83" y="102" textAnchor="middle" fontSize="9" fontWeight="700" fill={pal.ink}>
            • 触发受击爆血 Cue
          </text>
          <text x="83" y="132" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={pal.green}>
            权威伤害正式落库!
          </text>

          <rect x="0" y="182" width="166" height="162" rx="8" fill={pal.redBg} stroke={pal.ink} strokeWidth="1.3" />
          <text x="83" y="206" textAnchor="middle" fontSize="10.2" fontWeight="800" fill={pal.redInk}>
            ❌ 校验异常 (Rejected)
          </text>
          <text x="83" y="236" textAnchor="middle" fontSize="9" fontWeight="700" fill={pal.ink}>
            • 丢弃伪造 TargetData
          </text>
          <text x="83" y="260" textAnchor="middle" fontSize="9" fontWeight="700" fill={pal.ink}>
            • 调用 CancelAbility
          </text>
          <text x="83" y="284" textAnchor="middle" fontSize="9" fontWeight="700" fill={pal.ink}>
            • 拒绝客户端预测请求
          </text>
          <text x="83" y="314" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={pal.red}>
            外挂伤害 0 生效!
          </text>
        </g>
      </g>
    </g>
  );
};

/**
 * 19. GameplayCue AOE Optimization & Custom FGameplayEffectContext Bitstream Diagram
 */
export const CueContextBitstreamDiagram: React.FC<DiagramProps> = ({ stepId, phase, theme }) => {
  const pal = getDiagramPalette(theme);

  return (
    <g>
      <DiagramHeader
        pal={pal}
        category="CUE NETWORKING & CONTEXT · AOE 多播节流与自定义 EffectContext 位掩码序列化"
        title="手雷炸 20 个怪的 RPC 洪泛优化 + 派生 FMyGameplayEffectContext 跨网传递暴击/弱点飘字"
        rightBadge={`当前步骤：${stepId.toUpperCase()}`}
      />

      {/* Top Panel: Unreliable Multicast & AOE 20-Minion Optimization (y=106..268) */}
      <g transform="translate(24, 106)">
        <rect x="0" y="0" width="802" height="160" rx="10" fill={pal.card} stroke={pal.lineStrong} strokeWidth="1.3" />

        {/* Left: Bad 20 RPC Flood */}
        <g transform="translate(16, 14)">
          <rect x="0" y="0" width="376" height="132" rx="8" fill={pal.redBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="14" y="20" fontSize="10.2" fontWeight="800" fill={pal.redInk}>
            ❌ 灾难做法：在伤害 GE 上直接绑大爆炸音效 Cue
          </text>
          <text x="14" y="42" fontSize="9.2" fontWeight="600" fill={pal.ink}>
            • 手雷炸中 20 个小兵 = 循环 ApplyGameplayEffect 20 次
          </text>
          <text x="14" y="62" fontSize="9.2" fontWeight="800" fill={pal.red}>
            • 瞬间向全场多播 20 条 NetMulticast_InvokeGameplayCueExecuted!
          </text>
          <text x="14" y="82" fontSize="9.2" fontWeight="600" fill={pal.ink}>
            • 20 个爆炸音效同帧叠加破音 + 20 份重叠粒子卡爆 GPU + 挤占带宽
          </text>
          <text x="12" y="106" fontSize="8" fontWeight="700" fill={pal.amberInk}>
            ⚠️ ExecuteGameplayCue 是不可靠多播，绝不可写扣血逻辑！
          </text>
        </g>

        {/* Right: Good 1 Aggregated Burst Cue */}
        <g transform="translate(410, 14)">
          <rect x="0" y="0" width="376" height="132" rx="8" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="12" y="20" fontSize="9.2" fontWeight="800" fill={pal.greenInk}>
            ✅ 团战标准：静默伤害 GE + 单次 ExecuteCueWithParams
          </text>
          <text x="12" y="42" fontSize="9" fontWeight="600" fill={pal.ink}>
            • 1. 伤害 GE 本体不挂重型爆炸 Cue（只静默扣 20 个小兵血）
          </text>
          <text x="12" y="62" fontSize="8.8" fontWeight="800" fill={pal.green}>
            • 2. 手雷逻辑在爆心坐标只调 1 次 ExecuteGameplayCueWithParams!
          </text>
          <text x="12" y="82" fontSize="8.6" fontWeight="600" fill={pal.ink}>
            • 3. 仅发 1 个多播包（省 95% RPC），小兵靠轻量化材质闪烁反馈
          </text>
          <text x="14" y="106" fontSize="8.8" fontWeight="800" fill={pal.greenInk}>
            ✓ 带宽、音效通道与 Niagara 粒子数全部控制在常数 O(1) 级别！
          </text>
        </g>
      </g>

      {/* Bottom Panel: Custom FMyGameplayEffectContext Bitstream Anatomy (y=276..494) */}
      <g transform="translate(24, 276)">
        <rect
          x="0"
          y="0"
          width="802"
          height="218"
          rx="10"
          fill={pal.card}
          stroke={stepId === 's3' ? pal.violet : pal.lineStrong}
          strokeWidth={stepId === 's3' ? '2.2' : '1.3'}
        />
        <text x="16" y="22" fontSize="11.2" fontWeight="800" fill={pal.ink}>
          🧬 自定义 FMyGameplayEffectContext 内存继承与 NetSerialize 位掩码跨网解剖：
        </text>

        {/* Step 1: Server ExecCalc populates Custom Context */}
        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="234" height="166" rx="8" fill={pal.violetBg} stroke={pal.ink} strokeWidth="1.3" />
          <text x="12" y="20" fontSize="10" fontWeight="800" fill={pal.violetInk}>
            ① Server ExecCalc 写入扩展字段
          </text>
          <rect x="12" y="30" width="210" height="52" rx="5" fill={pal.chip} stroke={pal.ink} strokeWidth="1" />
          <text x="20" y="47" fontSize="8.8" fontWeight="700" fill={pal.muted}>
            基类 FGameplayEffectContext:
          </text>
          <text x="20" y="64" fontSize="8.8" fontWeight="700" fill={pal.ink}>
            Instigator · EffectCauser · HitResult
          </text>

          <rect x="12" y="90" width="210" height="64" rx="5" fill={pal.amberBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="20" y="107" fontSize="9.2" fontWeight="800" fill={pal.amberInk}>
            子类新增 FMyGameplayEffectContext:
          </text>
          <text x="20" y="124" fontSize="8.8" fontWeight="800" fill={pal.red}>
            • bool bIsCriticalHit = true; (暴击!)
          </text>
          <text x="20" y="140" fontSize="8.8" fontWeight="800" fill={pal.violet}>
            • bool bIsWeakSpot = true; (弱点爆头!)
          </text>
        </g>

        <line x1="250" y1="119" x2="290" y2="119" stroke={pal.ink} strokeWidth="2" markerEnd="url(#arrow-ink)" />
        <FlowDot x1={250} y1={119} x2={290} y2={119} phase={phase} color={pal.violet} stroke={pal.ink} />

        {/* Step 2: NetSerialize Bitstream Box */}
        <g transform="translate(294, 36)">
          <rect x="0" y="0" width="246" height="166" rx="8" fill={pal.blueBg} stroke={pal.ink} strokeWidth="1.3" />
          <text x="12" y="20" fontSize="10" fontWeight="800" fill={pal.blueInk}>
            ② NetSerialize 位掩码压缩打包
          </text>
          <text x="12" y="38" fontSize="7.7" fontWeight="600" fill={pal.ink2}>
            重写：GetScriptStruct + Duplicate + NetSerialize
          </text>

          {/* 8-bit Byte Visualization */}
          <g transform="translate(12, 48)">
            <rect x="0" y="0" width="222" height="54" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.1" />
            <text x="111" y="16" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={pal.ink}>
              Ar &lt;&lt; CustomBits (仅占 1 字节位掩码!)
            </text>
            {['Bit0:Crit', 'Bit1:Weak', 'Bit2:Elem', '0', '0', '0', '0', '0'].map((b, idx) => (
              <g key={idx} transform={`translate(${8 + idx * 26}, 24)`}>
                <rect
                  x="0"
                  y="0"
                  width="24"
                  height="22"
                  rx="3"
                  fill={idx < 3 ? pal.green : pal.card2}
                  stroke={pal.ink}
                  strokeWidth="1"
                />
                <text x="12" y="14" textAnchor="middle" fontSize="7.2" fontWeight="800" fill={idx < 3 ? '#fff' : pal.muted}>
                  {idx < 3 ? `B${idx}` : '0'}
                </text>
              </g>
            ))}
          </g>

          <text x="12" y="122" fontSize="7.9" fontWeight="700" fill={pal.ink}>
            • 必配：StructOpsTypeTraits 开 WithNetSerializer
          </text>
          <text x="12" y="140" fontSize="7.5" fontWeight="700" fill={pal.ink}>
            • 必配：ASGlobals 重写 AllocGameplayEffectContext
          </text>
        </g>

        <line x1="540" y1="119" x2="580" y2="119" stroke={pal.ink} strokeWidth="2" markerEnd="url(#arrow-ink)" />
        <FlowDot x1={540} y1={119} x2={580} y2={119} phase={phase} offset={0.5} color={pal.green} stroke={pal.ink} />

        {/* Step 3: Client GameplayCue Unpack */}
        <g transform="translate(584, 36)">
          <rect x="0" y="0" width="202" height="166" rx="8" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.3" />
          <text x="101" y="20" textAnchor="middle" fontSize="10" fontWeight="800" fill={pal.greenInk}>
            ③ Client Cue 拆包渲染飘字
          </text>
          <rect x="14" y="34" width="174" height="72" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.2" />
          <text x="101" y="58" textAnchor="middle" fontSize="15" fontWeight="800" fill={pal.red}>
            💥 暴击! -288
          </text>
          <text x="101" y="80" textAnchor="middle" fontSize="9" fontWeight="800" fill={pal.amber}>
            [弱点命中 · 金色放大字号]
          </text>
          <text x="14" y="128" fontSize="8.8" fontWeight="600" fill={pal.ink2}>
            从 Parameters.EffectContext 强转
          </text>
          <text x="14" y="144" fontSize="8.8" fontWeight="700" fill={pal.greenInk}>
            FMyGameplayEffectContext 即可读取！
          </text>
        </g>
      </g>
    </g>
  );
};

/**
 * 20. Lyra AbilitySet DataAsset Injection & GrantedHandles Receipt Bag Diagram
 */
export const LyraAbilitySetAnatomyDiagram: React.FC<DiagramProps> = ({ stepId, phase, theme }) => {
  const pal = getDiagramPalette(theme);

  return (
    <g>
      <DiagramHeader
        pal={pal}
        category="LYRA ABILITYSET · 模块化装备技能包注入与 GrantedHandles 凭证袋无损卸载图"
        title="拾取武器：ULyraAbilitySet::GiveToAbilitySystem ➔ 丢弃武器：GrantedHandles::TakeFromAbilitySystem"
        rightBadge={`当前步骤：${stepId.toUpperCase()}`}
      />

      <g transform="translate(24, 106)">
        <rect x="0" y="0" width="802" height="388" rx="10" fill={pal.card} stroke={pal.lineStrong} strokeWidth="1.3" />

        {/* Left: ULyraAbilitySet DataAsset */}
        <g transform="translate(20, 24)">
          <rect x="0" y="0" width="234" height="340" rx="9" fill={pal.violetBg} stroke={pal.ink} strokeWidth="1.4" />
          <text x="117" y="24" textAnchor="middle" fontSize="9.8" fontWeight="800" fill={pal.violetInk}>
            📦 ULyraAbilitySet (PrimaryDataAsset)
          </text>
          <text x="117" y="42" textAnchor="middle" fontSize="9" fontWeight="600" fill={pal.muted}>
            资产示例：DA_Weapon_Rifle_AbilitySet
          </text>

          {[
            {
              y: 56,
              title: '抽屉 ①：GrantedGameplayAbilities',
              item1: '• GA_Weapon_Fire (InputTag.Fire)',
              item2: '• GA_Weapon_Reload (InputTag.Reload)',
              item3: '• GA_Weapon_ADS (InputTag.ADS)',
              bg: pal.greenBg
            },
            {
              y: 150,
              title: '抽屉 ②：GrantedGameplayEffects',
              item1: '• GE_Rifle_SpeedPenalty (-10%移速)',
              item2: '• GE_Rifle_PassiveCrit (+15%暴击率)',
              item3: '  (Infinite 随装备常驻生效)',
              bg: pal.amberBg
            },
            {
              y: 244,
              title: '抽屉 ③：GrantedAttributes',
              item1: '• ULyraAmmoAttributeSet',
              item2: '  (MagazineAmmo / ReserveAmmo)',
              item3: '  按需动态挂载弹药属性集',
              bg: pal.blueBg
            }
          ].map((dr, idx) => (
            <g key={idx} transform={`translate(14, ${dr.y})`}>
              <rect x="0" y="0" width="206" height="82" rx="6" fill={dr.bg} stroke={pal.ink} strokeWidth="1.2" />
              <text x="10" y="18" fontSize="9.3" fontWeight="800" fill={pal.ink}>
                {dr.title}
              </text>
              <text x="10" y="38" fontSize="8.8" fontWeight="600" fill={pal.ink2}>
                {dr.item1}
              </text>
              <text x="10" y="54" fontSize="8.8" fontWeight="600" fill={pal.ink2}>
                {dr.item2}
              </text>
              <text x="10" y="70" fontSize="8.6" fontWeight="600" fill={pal.muted}>
                {dr.item3}
              </text>
            </g>
          ))}
        </g>

        {/* Center Arrows: GiveToAbilitySystem & Receipt Bag */}
        <line x1="254" y1="115" x2="314" y2="115" stroke={pal.green} strokeWidth="2.2" markerEnd="url(#arrow-ink)" />
        <FlowDot x1={254} y1={115} x2={314} y2={115} phase={phase} color={pal.green} stroke={pal.ink} />
        <text x="284" y="102" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={pal.green}>
          穿戴注入
        </text>

        {/* Center: Target ASC */}
        <g transform="translate(318, 24)">
          <rect x="0" y="0" width="206" height="190" rx="9" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.4" />
          <text x="103" y="24" textAnchor="middle" fontSize="10.8" fontWeight="800" fill={pal.greenInk}>
            🧠 角色 ASC (Authority)
          </text>
          <text x="103" y="44" textAnchor="middle" fontSize="9" fontWeight="700" fill={pal.ink}>
            GiveToAbilitySystem(ASC, &amp;Handles)
          </text>
          <rect x="14" y="56" width="178" height="118" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.1" />
          <text x="20" y="78" fontSize="8.1" fontWeight="700" fill={pal.ink}>
            1. GiveAbility ➔ SpecHandle
          </text>
          <text x="20" y="102" fontSize="8.1" fontWeight="700" fill={pal.ink}>
            2. ApplyGE ➔ ActiveGEHandle
          </text>
          <text x="20" y="126" fontSize="8" fontWeight="700" fill={pal.ink}>
            3. NewAttrSet ➔ AddSpawned
          </text>
          <text x="20" y="152" fontSize="8.5" fontWeight="800" fill={pal.green}>
            全部句柄自动装入右侧凭证袋!
          </text>
        </g>

        <line x1="524" y1="115" x2="564" y2="115" stroke={pal.ink} strokeWidth="2.2" markerEnd="url(#arrow-ink)" />
        <FlowDot x1={524} y1={115} x2={564} y2={115} phase={phase} offset={0.35} color={pal.amber} stroke={pal.ink} />

        {/* Right: FLyraAbilitySet_GrantedHandles Receipt Bag */}
        <g transform="translate(568, 24)">
          <rect
            x="0"
            y="0"
            width="214"
            height="340"
            rx="9"
            fill={pal.amberBg}
            stroke={stepId === 's3' ? pal.amber : pal.ink}
            strokeWidth={stepId === 's3' ? '2.2' : '1.4'}
          />
          <text x="107" y="24" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={pal.amberInk}>
            🧾 FLyraAbilitySet_GrantedHandles
          </text>
          <text x="107" y="42" textAnchor="middle" fontSize="8.8" fontWeight="700" fill={pal.muted}>
            (由装备实例持有的“存包小票凭证袋”)
          </text>

          <rect x="14" y="54" width="186" height="114" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.2" />
          <text x="24" y="74" fontSize="9.2" fontWeight="800" fill={pal.ink}>
            内部精确记录三大句柄数组：
          </text>
          <text x="24" y="96" fontSize="8.8" fontWeight="700" fill={pal.green}>
            • AbilitySpecHandles[]
          </text>
          <text x="24" y="116" fontSize="8.8" fontWeight="700" fill={pal.violet}>
            • GameplayEffectHandles[]
          </text>
          <text x="24" y="136" fontSize="8.8" fontWeight="700" fill={pal.blue}>
            • GrantedAttributeSets[]
          </text>
          <text x="20" y="156" fontSize="7.8" fontWeight="600" fill={pal.muted}>
            不按 Class 盲删，防误删同款天赋!
          </text>

          <rect x="14" y="182" width="186" height="144" rx="6" fill={pal.redBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="20" y="202" fontSize="8.4" fontWeight="800" fill={pal.redInk}>
            🗑️ 卸载：TakeFromAbilitySystem
          </text>
          <text x="24" y="222" fontSize="8.8" fontWeight="600" fill={pal.ink}>
            • 逐个 ClearAbility(Handle)
          </text>
          <text x="24" y="242" fontSize="8.8" fontWeight="600" fill={pal.ink}>
            • 逐个 RemoveActiveGameplayEffect
          </text>
          <text x="24" y="262" fontSize="8.8" fontWeight="600" fill={pal.ink}>
            • 逐个 RemoveSpawnedAttribute
          </text>
          <text x="24" y="286" fontSize="8.6" fontWeight="800" fill={pal.red}>
            ⚠️ 共享叠层池注意：RemoveActiveGE
          </text>
          <text x="24" y="302" fontSize="8.6" fontWeight="800" fill={pal.red}>
            默认 StacksToRemove=-1 会清光整池，
          </text>
          <text x="24" y="316" fontSize="8.6" fontWeight="800" fill={pal.red}>
            多装备叠层需传 StacksToRemove=1！
          </text>
        </g>

        {/* Bottom Center Note */}
        <g transform="translate(318, 228)">
          <rect x="0" y="0" width="236" height="136" rx="8" fill={pal.card2} stroke={pal.ink} strokeWidth="1.2" />
          <text x="14" y="22" fontSize="9.8" fontWeight="800" fill={pal.ink}>
            💡 为什么不能按技能类名卸载？
          </text>
          <text x="14" y="44" fontSize="8.8" fontWeight="600" fill={pal.ink2}>
            假设玩家左手戒指和右手项链都授予了
          </text>
          <text x="14" y="62" fontSize="8.8" fontWeight="600" fill={pal.ink2}>
            GA_Blink 或同款加速 GE；
          </text>
          <text x="14" y="82" fontSize="8.8" fontWeight="700" fill={pal.ink}>
            如果脱掉戒指时按 Class 删除，会把项链
          </text>
          <text x="14" y="100" fontSize="8.8" fontWeight="700" fill={pal.ink}>
            赋予的能力也一并误杀！凭唯一 Handle 回收
          </text>
          <text x="14" y="118" fontSize="8.8" fontWeight="800" fill={pal.greenInk}>
            才是工业级零残留方案。
          </text>
        </g>
      </g>
    </g>
  );
};
