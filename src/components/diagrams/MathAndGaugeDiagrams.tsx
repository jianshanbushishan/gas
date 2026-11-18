import React from 'react';
import { DiagramHeader, DiagramProps, FlowDot, getDiagramPalette } from './types';

/**
 * 5. BaseValue vs CurrentValue Dual-Tank Gauge & REPNOTIFY_Always Diagram
 */
export const BaseVsCurrentGaugeDiagram: React.FC<DiagramProps> = ({ stepId, phase, theme }) => {
  const pal = getDiagramPalette(theme);

  return (
    <g>
      <DiagramHeader
        pal={pal}
        category="VALUE GAUGE · BaseValue 与 CurrentValue 双轨容器与同步图解"
        title="单 float 混算漂移 vs FGameplayAttributeData 双轨无损重算 + REPNOTIFY_Always 预测对齐"
        rightBadge={`当前步骤：${stepId.toUpperCase()}`}
      />

      {/* Top Left: Single Float Pollution Trap (x=24, y=106, w=345, h=228) */}
      <g transform="translate(24, 106)">
        <rect
          x="0"
          y="0"
          width="345"
          height="228"
          rx="10"
          fill={pal.card}
          stroke={stepId === 's1' ? pal.red : pal.lineStrong}
          strokeWidth={stepId === 's1' ? '2.2' : '1.3'}
        />
        <text x="14" y="21" fontSize="11" fontWeight="800" fill={pal.red}>
          ❌ 反面：单 float MoveSpeed 混算导致不可逆污染
        </text>

        {[
          { y: 34, step: '1. 初始移速', math: 'MoveSpeed = 600.0', val: '600.0', tone: pal.chip },
          { y: 78, step: '2. 踩加速阵 (+20%)', math: '600 × 1.2 = 720.0', val: '720.0', tone: pal.amberBg },
          { y: 122, step: '3. 期间升级 (+50永久)', math: '720 + 50 = 770.0', val: '770.0', tone: pal.greenBg },
          {
            y: 166,
            step: '4. 加速阵结束 (÷1.2)',
            math: '770 ÷ 1.2 = 641.67 ❌ (应为 650!)',
            val: '641.67',
            tone: pal.redBg
          }
        ].map((r, i) => (
          <g key={i} transform={`translate(14, ${r.y})`}>
            <rect x="0" y="0" width="317" height="36" rx="6" fill={r.tone} stroke={pal.ink} strokeWidth="1.1" />
            <text x="10" y="15" fontSize="9.5" fontWeight="800" fill={pal.ink}>
              {r.step}
            </text>
            <text x="10" y="29" fontSize="9" fontWeight="600" fill={pal.ink2}>
              {r.math}
            </text>
            <text x="305" y="23" textAnchor="end" fontSize="11.5" fontWeight="800" fill={i === 3 ? pal.red : pal.ink}>
              {r.val}
            </text>
          </g>
        ))}
      </g>

      {/* Top Right: FGameplayAttributeData Dual-Tank Model (x=381, y=106, w=445, h=228) */}
      <g transform="translate(381, 106)">
        <rect
          x="0"
          y="0"
          width="445"
          height="228"
          rx="10"
          fill={pal.card}
          stroke={stepId === 's2' ? pal.green : pal.lineStrong}
          strokeWidth={stepId === 's2' ? '2.2' : '1.3'}
        />
        <text x="14" y="21" fontSize="11" fontWeight="800" fill={pal.green}>
          ✅ 正解：FGameplayAttributeData 永久底数与实时聚合值彻底分离
        </text>

        {/* Tank 1: BaseValue */}
        <g transform="translate(18, 36)">
          <rect x="0" y="0" width="132" height="176" rx="8" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.4" />
          <text x="66" y="20" textAnchor="middle" fontSize="10.2" fontWeight="800" fill={pal.greenInk}>
            BaseValue 容器
          </text>
          <text x="66" y="34" textAnchor="middle" fontSize="8.8" fontWeight="600" fill={pal.muted}>
            (仅 Instant/周期跳改)
          </text>
          <rect x="14" y="46" width="104" height="82" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.2" />
          <rect x="16" y="72" width="100" height="54" rx="4" fill={pal.green} opacity="0.35" />
          <text x="66" y="72" textAnchor="middle" fontSize="9.2" fontWeight="700" fill={pal.ink2}>
            +50 升级永久加成
          </text>
          <text x="66" y="106" textAnchor="middle" fontSize="15" fontWeight="800" fill={pal.ink}>
            650.0
          </text>
          <text x="66" y="148" textAnchor="middle" fontSize="9" fontWeight="800" fill={pal.greenInk}>
            GetHealthAttribute()
          </text>
          <text x="66" y="164" textAnchor="middle" fontSize="8.8" fontWeight="700" fill={pal.ink2}>
            SetBaseValue(650)
          </text>
        </g>

        {/* Center: FAggregator Live Pipe */}
        <g transform="translate(164, 72)">
          <line x1="-14" y1="54" x2="130" y2="54" stroke={pal.ink} strokeWidth="2" markerEnd="url(#arrow-ink)" />
          <FlowDot x1={-14} y1={54} x2={130} y2={54} phase={phase} color={pal.violet} stroke={pal.ink} />
          <rect x="6" y="10" width="104" height="88" rx="8" fill={pal.violetBg} stroke={pal.ink} strokeWidth="1.3" />
          <text x="58" y="29" textAnchor="middle" fontSize="10" fontWeight="800" fill={pal.violetInk}>
            FAggregator
          </text>
          <text x="58" y="45" textAnchor="middle" fontSize="8.8" fontWeight="700" fill={pal.ink}>
            活跃 Duration Buff:
          </text>
          <text x="58" y="62" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={pal.violet}>
            × 1.20 (+20%)
          </text>
          <text x="58" y="84" textAnchor="middle" fontSize="8.5" fontWeight="600" fill={pal.muted}>
            到期移除即重算!
          </text>
        </g>

        {/* Tank 2: CurrentValue */}
        <g transform="translate(295, 36)">
          <rect x="0" y="0" width="132" height="176" rx="8" fill={pal.blueBg} stroke={pal.ink} strokeWidth="1.4" />
          <text x="66" y="20" textAnchor="middle" fontSize="10.2" fontWeight="800" fill={pal.blueInk}>
            CurrentValue 输出
          </text>
          <text x="66" y="34" textAnchor="middle" fontSize="8.8" fontWeight="600" fill={pal.muted}>
            (实时重算·零累积误差)
          </text>
          <rect x="14" y="46" width="104" height="82" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.2" />
          <text x="66" y="68" textAnchor="middle" fontSize="9.2" fontWeight="700" fill={pal.violet}>
            Buff 期: 780.0
          </text>
          <text x="66" y="90" textAnchor="middle" fontSize="10" fontWeight="800" fill={pal.muted}>
            ⬇ Buff 到期重算
          </text>
          <text x="66" y="114" textAnchor="middle" fontSize="14.5" fontWeight="800" fill={pal.green}>
            650.0 ✅
          </text>
          <text x="66" y="148" textAnchor="middle" fontSize="9" fontWeight="800" fill={pal.blueInk}>
            GetMoveSpeed()
          </text>
          <text x="66" y="164" textAnchor="middle" fontSize="8.8" fontWeight="700" fill={pal.ink2}>
            精确还原 0 误差!
          </text>
        </g>
      </g>

      {/* Bottom Panel: Accessor Macros + REPNOTIFY_Always Prediction Alignment (y=342..494) */}
      <g transform="translate(24, 342)">
        <rect
          x="0"
          y="0"
          width="802"
          height="152"
          rx="10"
          fill={pal.card}
          stroke={stepId === 's4' || stepId === 's3' ? pal.violet : pal.lineStrong}
          strokeWidth={stepId === 's4' || stepId === 's3' ? '2.2' : '1.3'}
        />

        {/* Left: ATTRIBUTE_ACCESSORS */}
        <g transform="translate(14, 12)">
          <rect x="0" y="0" width="290" height="128" rx="8" fill={pal.amberBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="12" y="20" fontSize="9.8" fontWeight="800" fill={pal.amberInk}>
            🛠️ ATTRIBUTE_ACCESSORS 宏展开四件套：
          </text>
          <text x="12" y="42" fontSize="8.2" fontWeight="700" fill={pal.ink}>
            1. GetHealthAttribute() ➔ 属性反射句柄
          </text>
          <text x="12" y="62" fontSize="8.5" fontWeight="700" fill={pal.ink}>
            2. GetHealth() ➔ 读 CurrentValue (面板值)
          </text>
          <text x="12" y="82" fontSize="8.5" fontWeight="700" fill={pal.ink}>
            3. SetHealth(Val) ➔ 改 BaseValue
          </text>
          <text x="12" y="102" fontSize="8.5" fontWeight="700" fill={pal.ink}>
            4. InitHealth(Val) ➔ 同时初始化 Base/Cur
          </text>
        </g>

        {/* Right: Why REPNOTIFY_Always is mandatory */}
        <g transform="translate(318, 12)">
          <rect x="0" y="0" width="470" height="128" rx="8" fill={pal.violetBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="14" y="20" fontSize="9.8" fontWeight="800" fill={pal.violetInk}>
            🔄 为什么属性复制必须配 REPNOTIFY_Always + GAMEPLAYATTRIBUTE_REPNOTIFY？
          </text>

          <rect x="14" y="30" width="214" height="86" rx="6" fill={pal.redBg} stroke={pal.ink} strokeWidth="1.1" />
          <text x="20" y="47" fontSize="9" fontWeight="800" fill={pal.redInk}>
            ❌ 若用默认 REPNOTIFY_OnChanged：
          </text>
          <text x="20" y="64" fontSize="7.9" fontWeight="600" fill={pal.ink}>
            1. Client 预测扣蓝: 100➔70 (临时修改器)
          </text>
          <text x="20" y="80" fontSize="7.9" fontWeight="600" fill={pal.ink}>
            2. Server 权威下发: 70 (与本地同值!)
          </text>
          <text x="20" y="96" fontSize="8" fontWeight="800" fill={pal.red}>
            3. 引擎跳过 OnRep ➔ 未更新权威底数，
          </text>
          <text x="20" y="110" fontSize="8" fontWeight="800" fill={pal.red}>
            预测核销后蓝量错误弹回 100！
          </text>

          <rect x="240" y="30" width="216" height="86" rx="6" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.1" />
          <text x="246" y="47" fontSize="9" fontWeight="800" fill={pal.greenInk}>
            ✅ 使用 REPNOTIFY_Always：
          </text>
          <text x="246" y="64" fontSize="7.9" fontWeight="600" fill={pal.ink}>
            1. 即使下发 70 与本地预测 70 相同，
          </text>
          <text x="246" y="80" fontSize="7.9" fontWeight="600" fill={pal.ink}>
            2. 仍强制进 OnRep_Mana 触发宏内部：
          </text>
          <text x="246" y="96" fontSize="7.8" fontWeight="800" fill={pal.green}>
            SetBaseAttributeValueFromReplication(70)
          </text>
          <text x="246" y="110" fontSize="8.2" fontWeight="800" fill={pal.greenInk}>
            3. 预测核销后稳稳停在 70！
          </text>
        </g>
      </g>
    </g>
  );
};

/**
 * 6. Attribute Clamping Dual-Scale Gauge & 5-Hook Pipeline Diagram
 */
export const ClampingDualGaugeDiagram: React.FC<DiagramProps> = ({ stepId, phase, theme }) => {
  const pal = getDiagramPalette(theme);

  return (
    <g>
      <DiagramHeader
        pal={pal}
        category="CLAMPING GAUGE & HOOKS · 负血量幽灵刻度尺与 AttributeSet 五大钩子拦截图"
        title="[-30, 0, 100] 双轨血槽对比（揭秘喝药不回血真相）与五大回调函数触发流水线"
        rightBadge={`当前步骤：${stepId.toUpperCase()}`}
      />

      {/* Top Left: Buggy PreAttributeChange Only Scale (x=24, y=106, w=394, h=206) */}
      <g transform="translate(24, 106)">
        <rect
          x="0"
          y="0"
          width="394"
          height="206"
          rx="10"
          fill={pal.card}
          stroke={stepId === 's1' || stepId === 's2' ? pal.red : pal.lineStrong}
          strokeWidth={stepId === 's1' || stepId === 's2' ? '2.2' : '1.3'}
        />
        <text x="14" y="21" fontSize="10.8" fontWeight="800" fill={pal.red}>
          ❌ 踩坑：只在 PreAttributeChange 中 Clamp（治标不治本）
        </text>
        <text x="14" y="37" fontSize="9.2" fontWeight="600" fill={pal.muted}>
          场景：100 满血吃 -130 重击 ➔ 再喝 +20 治疗药水
        </text>

        {/* Scale Ruler [-40 .. 0 .. 100] */}
        <g transform="translate(20, 52)">
          <rect x="0" y="0" width="354" height="140" rx="8" fill={pal.card2} stroke={pal.lineStrong} />
          {/* Zero Line */}
          <line x1="125" y1="8" x2="125" y2="132" stroke={pal.ink} strokeWidth="2" strokeDasharray="4 2" />
          <text x="125" y="20" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={pal.ink}>
            0 刻度线
          </text>
          <text x="62" y="20" textAnchor="middle" fontSize="9" fontWeight="800" fill={pal.red}>
            负值深渊 (-30)
          </text>
          <text x="240" y="20" textAnchor="middle" fontSize="9" fontWeight="800" fill={pal.green}>
            合法生命区间 (0 ~ 100)
          </text>

          {/* Bar 1: UI CurrentValue */}
          <text x="12" y="48" fontSize="9.2" fontWeight="800" fill={pal.ink}>
            表面 CurrentValue:
          </text>
          <rect x="125" y="54" width="200" height="16" rx="4" fill={pal.chip} stroke={pal.ink} strokeWidth="1.1" />
          <circle cx="125" cy="62" r="6" fill={pal.amber} stroke={pal.ink} strokeWidth="1.4" />
          <text x="225" y="66" textAnchor="middle" fontSize="9" fontWeight="800" fill={pal.amberInk}>
            被临时挡在 0（UI 假象）
          </text>

          {/* Bar 2: Real BaseValue */}
          <text x="12" y="88" fontSize="9.2" fontWeight="800" fill={pal.red}>
            底层 BaseValue:
          </text>
          <rect x="45" y="94" width="280" height="22" rx="4" fill={pal.chip} stroke={pal.ink} strokeWidth="1.1" />
          {/* Red negative pollution bar from x=45 (-30) to x=125 (0) */}
          <rect x="45" y="95" width="80" height="20" rx="3" fill={pal.red} />
          <text x="85" y="109" textAnchor="middle" fontSize="9.2" fontWeight="800" fill="#fff">
            跌至 -30!
          </text>
          <text x="225" y="109" textAnchor="middle" fontSize="8.3" fontWeight="800" fill={pal.redInk}>
            喝 +20 药: -30+20 = -10 (UI仍为0!)
          </text>
        </g>
      </g>

      {/* Top Right: Safe Dual Clamp Scale (x=432, y=106, w=394, h=206) */}
      <g transform="translate(432, 106)">
        <rect
          x="0"
          y="0"
          width="394"
          height="206"
          rx="10"
          fill={pal.card}
          stroke={stepId === 's5' ? pal.green : pal.lineStrong}
          strokeWidth={stepId === 's5' ? '2.2' : '1.3'}
        />
        <text x="14" y="21" fontSize="10.8" fontWeight="800" fill={pal.green}>
          ✅ 正解：PreAttributeBaseChange + PostGEExecute 双重锁死
        </text>
        <text x="14" y="37" fontSize="9.2" fontWeight="600" fill={pal.muted}>
          真实 BaseValue 永不越界，并配合 PostAttributeChange 处理上限缩水
        </text>

        <g transform="translate(20, 52)">
          <rect x="0" y="0" width="354" height="140" rx="8" fill={pal.card2} stroke={pal.lineStrong} />
          <line x1="125" y1="8" x2="125" y2="132" stroke={pal.green} strokeWidth="2.2" />
          <text x="125" y="20" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={pal.green}>
            🛡️ 0 钢铁防线
          </text>

          <rect x="16" y="36" width="98" height="84" rx="6" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.1" />
          <text x="65" y="58" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={pal.greenInk}>
            负数禁区已封死
          </text>
          <text x="65" y="76" textAnchor="middle" fontSize="8.8" fontWeight="600" fill={pal.ink2}>
            100 - 130 写入前
          </text>
          <text x="65" y="92" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={pal.green}>
            即被 Clamp 为 0!
          </text>

          {/* Bar after +20 Heal */}
          <text x="136" y="52" fontSize="9.2" fontWeight="800" fill={pal.greenInk}>
            承受 -130 后再喝 +20 药水：
          </text>
          <rect x="136" y="60" width="202" height="24" rx="5" fill={pal.chip} stroke={pal.ink} strokeWidth="1.2" />
          <rect x="138" y="62" width="52" height="20" rx="4" fill={pal.green} />
          <text x="164" y="76" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#fff">
            +20 HP
          </text>
          <text x="262" y="76" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={pal.greenInk}>
            0 + 20 = 20 立即回血!
          </text>

          <rect x="136" y="94" width="202" height="32" rx="5" fill={pal.violetBg} stroke={pal.ink} strokeWidth="1.1" />
          <text x="237" y="108" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={pal.violetInk}>
            联动：MaxHealth 从 150 降到 100 时
          </text>
          <text x="237" y="121" textAnchor="middle" fontSize="7.9" fontWeight="600" fill={pal.ink2}>
            PostAttributeChange 下压 Health ≤ 100
          </text>
        </g>
      </g>

      {/* Bottom Panel: 5 AttributeSet Lifecycle Hooks Execution Map (y=320..494) */}
      <g transform="translate(24, 320)">
        <rect
          x="0"
          y="0"
          width="802"
          height="174"
          rx="10"
          fill={pal.card}
          stroke={stepId === 's3' || stepId === 's4' ? pal.violet : pal.lineStrong}
          strokeWidth={stepId === 's3' || stepId === 's4' ? '2.2' : '1.3'}
        />
        <text x="16" y="21" fontSize="11.2" fontWeight="800" fill={pal.ink}>
          🧭 AttributeSet 五大生命周期回调精确拦截位置流水线（注意 Duration Buff 的盲区！）：
        </text>

        {[
          {
            x: 14,
            step: '① PreGEExecute',
            target: 'Instant/周期执行前',
            role: '返回 false 一票否决',
            use: '无敌 / 伤害免疫拦截',
            bg: pal.violetBg
          },
          {
            x: 170,
            step: '② PreAttrBaseChange',
            target: 'BaseValue 修改前',
            role: '改 float& NewBase',
            use: '锁死 Base ∈ [0, Max]',
            bg: pal.greenBg
          },
          {
            x: 326,
            step: '③ PreAttributeChange',
            target: 'CurrentValue 改变前',
            role: '改 float& NewValue',
            use: '限制临时 Buff 当前值',
            bg: pal.amberBg
          },
          {
            x: 482,
            step: '④ PostGEExecute',
            target: 'Instant/周期改Base后',
            role: '带 Spec/Source/Ctx',
            use: '元属性拆盾 · 判死主战场',
            bg: pal.blueBg
          },
          {
            x: 638,
            step: '⑤ PostAttributeChange',
            target: 'CurrentValue 落定后',
            role: '传 OldVal / NewVal',
            use: 'MaxHP 缩水下压当前HP',
            bg: pal.greenBg
          }
        ].map((h, idx) => (
          <g key={idx} transform={`translate(${h.x}, 32)`}>
            <rect x="0" y="0" width="148" height="98" rx="7" fill={h.bg} stroke={pal.ink} strokeWidth="1.2" />
            <text x="8" y="18" fontSize="9.2" fontWeight="800" fill={pal.ink}>
              {h.step}
            </text>
            <text x="8" y="36" fontSize="8.3" fontWeight="700" fill={pal.muted}>
              时机: {h.target}
            </text>
            <text x="8" y="56" fontSize="8.3" fontWeight="700" fill={pal.ink2}>
              能力: {h.role}
            </text>
            <rect x="6" y="68" width="136" height="22" rx="4" fill={pal.chip} stroke={pal.ink} strokeWidth="1" />
            <text x="74" y="82.5" textAnchor="middle" fontSize="8.3" fontWeight="800" fill={pal.ink}>
              {h.use}
            </text>
            {idx < 4 && (
              <FlowDot x1={148} y1={49} x2={156} y2={49} phase={phase} offset={idx * 0.2} color={pal.green} stroke={pal.ink} r={3.5} />
            )}
          </g>
        ))}

        {/* Bottom Warning Strip on Duration GE */}
        <rect x="14" y="138" width="772" height="26" rx="6" fill={pal.redBg} stroke={pal.red} strokeWidth="1.2" />
        <text x="400" y="155" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={pal.redInk}>
          ⚠️ 盲区：非周期 Duration / Infinite GE（如 +50 MaxHP 装备 Buff）只改 Current，绝不触发 ① 与 ④ (PostGEExecute)！
        </text>
      </g>
    </g>
  );
};

/**
 * 7. Meta Attribute IncomingDamage Funnel Pipeline Diagram
 */
export const MetaDamageFunnelDiagram: React.FC<DiagramProps> = ({ stepId, phase, theme }) => {
  const pal = getDiagramPalette(theme);

  return (
    <g>
      <DiagramHeader
        pal={pal}
        category="DAMAGE FUNNEL · 元属性 IncomingDamage 伤害分流漏斗图"
        title="IncomingDamage 临时漏斗接收 ➔ 读取即清零 ➔ 优先抵扣护盾 (Shield) ➔ 溢出扣减生命 (Health)"
        rightBadge={`当前步骤：${stepId.toUpperCase()}`}
      />

      {/* Main Funnel Stage (x=24, y=106, w=802, h=388) */}
      <g transform="translate(24, 106)">
        <rect x="0" y="0" width="802" height="388" rx="10" fill={pal.card} stroke={pal.lineStrong} strokeWidth="1.3" />

        {/* Stage 1: Input Sources */}
        <g transform="translate(20, 24)">
          <rect x="0" y="0" width="166" height="104" rx="8" fill={pal.violetBg} stroke={pal.ink} strokeWidth="1.3" />
          <text x="83" y="22" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={pal.violetInk}>
            ① 伤害源统一出口
          </text>
          <text x="83" y="44" textAnchor="middle" fontSize="9.2" fontWeight="700" fill={pal.ink}>
            • ExecCalc 暴击破甲结算
          </text>
          <text x="83" y="64" textAnchor="middle" fontSize="9.2" fontWeight="700" fill={pal.ink}>
            • SetByCaller 动态注入
          </text>
          <text x="83" y="88" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={pal.violet}>
            绝不直接改 Health!
          </text>
        </g>

        <line x1="186" y1="76" x2="238" y2="76" stroke={pal.ink} strokeWidth="2.2" markerEnd="url(#arrow-ink)" />
        <FlowDot x1={186} y1={76} x2={238} y2={76} phase={phase} color={pal.amber} stroke={pal.ink} r={5} />

        {/* Stage 2: IncomingDamage Funnel */}
        <g transform="translate(242, 18)">
          <polygon
            points="0,0 190,0 152,116 38,116"
            fill={pal.amberBg}
            stroke={pal.ink}
            strokeWidth="1.6"
          />
          <text x="95" y="24" textAnchor="middle" fontSize="11" fontWeight="800" fill={pal.amberInk}>
            ② 元属性 IncomingDamage
          </text>
          <text x="95" y="42" textAnchor="middle" fontSize="9" fontWeight="700" fill={pal.muted}>
            (仅在 Server 存在 · 不开启网络复制)
          </text>
          <rect x="40" y="52" width="110" height="24" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.2" />
          <text x="95" y="68" textAnchor="middle" fontSize="11.5" fontWeight="800" fill={pal.red}>
            注入伤害: 120.0
          </text>
          <text x="95" y="102" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={pal.greenInk}>
            读入 LocalDmg 后立即清零 = 0.0f!
          </text>
        </g>

        {/* Pipe Down & Right into Shield and Health */}
        <line x1="337" y1="134" x2="337" y2="182" stroke={pal.ink} strokeWidth="2.2" markerEnd="url(#arrow-ink)" />
        <FlowDot x1={337} y1={134} x2={337} y2={182} phase={phase} offset={0.2} color={pal.red} stroke={pal.ink} r={5} />

        {/* Stage 3: PostGameplayEffectExecute Splitter Box */}
        <g transform="translate(180, 186)">
          <rect x="0" y="0" width="314" height="58" rx="8" fill={pal.chip} stroke={pal.ink} strokeWidth="1.5" />
          <text x="157" y="22" textAnchor="middle" fontSize="10.8" fontWeight="800" fill={pal.ink}>
            ③ PostGameplayEffectExecute 伤害分流器
          </text>
          <text x="157" y="42" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={pal.ink2}>
            LocalDmg (120) ➔ 护盾吸收 50 + 剩余溢出伤害 70
          </text>
        </g>

        {/* Left Branch: Shield Absorption */}
        <line x1="250" y1="244" x2="155" y2="280" stroke={pal.blue} strokeWidth="2.2" markerEnd="url(#arrow-ink)" />
        <FlowDot x1={250} y1={244} x2={155} y2={280} phase={phase} offset={0.45} color={pal.blue} stroke={pal.ink} />

        <g transform="translate(26, 282)">
          <rect x="0" y="0" width="245" height="90" rx="8" fill={pal.blueBg} stroke={pal.ink} strokeWidth="1.3" />
          <text x="12" y="22" fontSize="10" fontWeight="800" fill={pal.blueInk}>
            🛡️ 第一站：优先抵扣 Shield (护盾)
          </text>
          <text x="12" y="44" fontSize="8.2" fontWeight="700" fill={pal.ink}>
            • 吸收 = min(Shield 50, Dmg 120) = 50
          </text>
          <text x="12" y="62" fontSize="8.8" fontWeight="800" fill={pal.blue}>
            • SetShield(50 - 50) = 0.0f (护盾击碎!)
          </text>
          <text x="12" y="80" fontSize="8.4" fontWeight="600" fill={pal.muted}>
            • 通过 ReplicatedUsing 同步客户端护盾条
          </text>
        </g>

        {/* Right Branch: Health Deduction */}
        <line x1="410" y1="244" x2="485" y2="280" stroke={pal.red} strokeWidth="2.2" markerEnd="url(#arrow-ink)" />
        <FlowDot x1={410} y1={244} x2={485} y2={280} phase={phase} offset={0.45} color={pal.red} stroke={pal.ink} />

        <g transform="translate(300, 282)">
          <rect x="0" y="0" width="255" height="90" rx="8" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.3" />
          <text x="12" y="22" fontSize="10" fontWeight="800" fill={pal.greenInk}>
            ❤️ 第二站：余伤扣减 Health (真实生命)
          </text>
          <text x="12" y="44" fontSize="8.5" fontWeight="700" fill={pal.ink}>
            • 溢出伤害 AfterShield = 120 - 50 = 70
          </text>
          <text x="12" y="62" fontSize="8.2" fontWeight="800" fill={pal.green}>
            • SetHealth(Clamp(100-70, 0, MaxHP)) = 30
          </text>
          <text x="12" y="80" fontSize="8.4" fontWeight="600" fill={pal.muted}>
            • 同步最终真实血量，客户端零算术分歧
          </text>
        </g>

        {/* Right Column: Reactions & Death Closed-Loop */}
        <g transform="translate(572, 24)">
          <rect x="0" y="0" width="210" height="348" rx="8" fill={pal.card2} stroke={pal.ink} strokeWidth="1.3" />
          <text x="105" y="24" textAnchor="middle" fontSize="10.8" fontWeight="800" fill={pal.ink}>
            ④ 结算后派发表现与死亡闭环
          </text>

          <rect x="14" y="40" width="182" height="84" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.1" />
          <text x="24" y="60" fontSize="9.8" fontWeight="800" fill={pal.amber}>
            💥 1. 触发飘字 GameplayCue
          </text>
          <text x="24" y="78" fontSize="9" fontWeight="600" fill={pal.ink2}>
            ExecuteGameplayCue(
          </text>
          <text x="24" y="93" fontSize="9" fontWeight="600" fill={pal.ink2}>
            &nbsp; GameplayCue.Damage, Context)
          </text>
          <text x="24" y="110" fontSize="8.8" fontWeight="700" fill={pal.muted}>
            携暴击标记与实际扣血量下发
          </text>

          <rect x="14" y="138" width="182" height="84" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.1" />
          <text x="24" y="158" fontSize="9.8" fontWeight="800" fill={pal.violet}>
            ⚡ 2. 发送受击 GameplayEvent
          </text>
          <text x="24" y="176" fontSize="9" fontWeight="600" fill={pal.ink2}>
            SendGameplayEventToActor(
          </text>
          <text x="24" y="191" fontSize="9" fontWeight="600" fill={pal.ink2}>
            &nbsp; Event.Montage.HitReact)
          </text>
          <text x="24" y="208" fontSize="8.8" fontWeight="700" fill={pal.muted}>
            唤醒被动反击技或受击硬直 GA
          </text>

          <rect x="14" y="236" width="182" height="96" rx="6" fill={pal.redBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="22" y="256" fontSize="8.8" fontWeight="800" fill={pal.redInk}>
            💀 3. 归零死亡裁决 (HP ≤ 0)
          </text>
          <text x="24" y="274" fontSize="9" fontWeight="600" fill={pal.ink}>
            • 加上 State.Dead 状态标签
          </text>
          <text x="24" y="291" fontSize="9" fontWeight="600" fill={pal.ink}>
            • 激活 GA_Death 播放死亡演出
          </text>
          <text x="24" y="308" fontSize="9" fontWeight="600" fill={pal.ink}>
            • 广播 OnOutOfHealth 委托
          </text>
        </g>

        <line x1="494" y1="215" x2="572" y2="215" stroke={pal.ink} strokeWidth="2" markerEnd="url(#arrow-ink)" />
        <FlowDot x1={494} y1={215} x2={572} y2={215} phase={phase} offset={0.7} color={pal.green} stroke={pal.ink} />
      </g>
    </g>
  );
};

/**
 * 8. UE 5.5 FAggregator 5-Stage Math Pipeline Diagram
 */
export const Aggregator55PipelineDiagram: React.FC<DiagramProps> = ({ phase, theme }) => {
  const pal = getDiagramPalette(theme);

  const stages = [
    {
      x: 34,
      tag: 'STAGE 1 · 基础加区',
      name: 'Base + AddBase',
      formula: '100 (裸装) + 50 (武器)',
      result: '= 150.0',
      note: '传统 Additive 修改器入此池',
      bg: pal.blueBg
    },
    {
      x: 192,
      tag: 'STAGE 2 · 同池乘区',
      name: 'MultiplyAdditive',
      formula: '× (1 + (1.2-1) + (1.2-1))',
      result: '× 1.40 ➔ 210.0',
      note: '多个 +20% 先减 1 相加，防膨胀',
      bg: pal.greenBg
    },
    {
      x: 350,
      tag: 'STAGE 3 · UE 5.5 连乘',
      name: 'MultiplyCompound',
      formula: '× 1.20 × 1.20 (独立乘区)',
      result: '× 1.44 ➔ 302.4',
      note: '5.5 新增！真正的独立连乘放大',
      bg: pal.violetBg
    },
    {
      x: 508,
      tag: 'STAGE 4 · UE 5.5 尾加',
      name: 'AddFinal',
      formula: '302.4 + 30 (平坦追伤)',
      result: '= 332.4',
      note: '5.5 新增！不吃任何百分比放大',
      bg: pal.amberBg
    },
    {
      x: 666,
      tag: 'STAGE 5 · 通道短路',
      name: 'Override 覆盖门',
      formula: '若存在 Override = 999',
      result: '本通道输出 = 999',
      note: '仅覆盖当前 Evaluation Channel',
      bg: pal.redBg
    }
  ];

  return (
    <g>
      <DiagramHeader
        pal={pal}
        category="UE 5.5 MATH PIPELINE · FAggregatorModChannel::EvaluateWithBase 五段算式流水线"
        title="((Base + AddBase) × MultiplyAdditive [同池相加] × MultiplyCompound [独立连乘]) + AddFinal"
        rightBadge="UE 5.5 源码级公式"
      />

      {/* Top Conveyor Pipeline (y=106..328) */}
      <g transform="translate(24, 106)">
        <rect x="0" y="0" width="802" height="222" rx="10" fill={pal.card} stroke={pal.lineStrong} strokeWidth="1.3" />
        <text x="16" y="22" fontSize="11.2" fontWeight="800" fill={pal.ink}>
          ⚙️ 单一求值通道 (Evaluation Channel 0) 内部修改器求值顺序：
        </text>

        {stages.map((st, idx) => (
          <g key={idx}>
            <g transform={`translate(${st.x - 24}, 36)`}>
              <rect x="0" y="0" width="146" height="168" rx="8" fill={st.bg} stroke={pal.ink} strokeWidth="1.3" />
              <rect x="8" y="8" width="130" height="18" rx="4" fill={pal.chip} stroke={pal.ink} strokeWidth="1" />
              <text x="73" y="20.5" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={pal.ink}>
                {st.tag}
              </text>
              <text x="73" y="46" textAnchor="middle" fontSize="11" fontWeight="800" fill={pal.ink}>
                {st.name}
              </text>
              <text x="73" y="70" textAnchor="middle" fontSize="9.2" fontWeight="700" fill={pal.ink2}>
                {st.formula}
              </text>
              <rect x="10" y="86" width="126" height="28" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.2" />
              <text x="73" y="104" textAnchor="middle" fontSize="10.8" fontWeight="800" fill={pal.ink}>
                {st.result}
              </text>
              <text x="73" y="142" textAnchor="middle" fontSize="8.6" fontWeight="600" fill={pal.muted}>
                {st.note}
              </text>
            </g>
            {idx < 4 && (
              <g>
                <line
                  x1={st.x - 24 + 146}
                  y1={120}
                  x2={stages[idx + 1].x - 24}
                  y2={120}
                  stroke={pal.ink}
                  strokeWidth="2"
                />
                <FlowDot
                  x1={st.x - 24 + 146}
                  y1={120}
                  x2={stages[idx + 1].x - 24}
                  y2={120}
                  phase={phase}
                  offset={idx * 0.22}
                  color={pal.violet}
                  stroke={pal.ink}
                  r={4}
                />
              </g>
            )}
          </g>
        ))}
      </g>

      {/* Bottom Comparison & Multi-Channel Cascade (y=336..494) */}
      <g transform="translate(24, 336)">
        <rect x="0" y="0" width="802" height="158" rx="10" fill={pal.card} stroke={pal.lineStrong} strokeWidth="1.3" />

        {/* Left: Why +20% in MultiplyAdditive must be entered as 1.2 */}
        <g transform="translate(16, 14)">
          <rect x="0" y="0" width="386" height="130" rx="8" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="12" y="22" fontSize="9.2" fontWeight="800" fill={pal.greenInk}>
            📐 必背细节：为什么 MultiplyAdditive +20% 要填 1.2 而非 0.2？
          </text>
          <text x="12" y="44" fontSize="9" fontWeight="700" fill={pal.ink}>
            • 源码公式：1.0f + Σ(Mod.Value - 1.0f)
          </text>
          <text x="12" y="64" fontSize="8.8" fontWeight="600" fill={pal.ink2}>
            • 填 1.2 时：引擎先算 (1.2 - 1.0) = +0.20 放入加法池 ➔ 提升 20% ✅
          </text>
          <text x="12" y="84" fontSize="8.8" fontWeight="800" fill={pal.red}>
            • 若误填 0.2：引擎算 (0.2 - 1.0) = -0.80 ➔ 攻击力缩水 80% ❌！
          </text>
          <text x="12" y="108" fontSize="8.2" fontWeight="700" fill={pal.violetInk}>
            • 而 UE 5.5 MultiplyCompound：填 1.2 直接 × 1.2 累乘，不再减 1。
          </text>
        </g>

        {/* Right: Multi Evaluation Channel Cascade */}
        <g transform="translate(416, 14)">
          <rect x="0" y="0" width="370" height="130" rx="8" fill={pal.violetBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="14" y="22" fontSize="10.5" fontWeight="800" fill={pal.violetInk}>
            🔗 多求值通道级联 (Evaluation Channels 0 ➔ 1 ➔ 2)
          </text>
          <text x="14" y="44" fontSize="9.2" fontWeight="600" fill={pal.ink}>
            FAggregatorModChannelContainer 按通道编号顺序依次求值：
          </text>
          <rect x="14" y="56" width="154" height="56" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.1" />
          <text x="91" y="76" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={pal.ink}>
            Channel 0 (装备/常规Buff)
          </text>
          <text x="91" y="96" textAnchor="middle" fontSize="9" fontWeight="700" fill={pal.green}>
            输出 = 332.4 (或 Override)
          </text>

          <line x1="168" y1="84" x2="198" y2="84" stroke={pal.ink} strokeWidth="1.8" markerEnd="url(#arrow-ink)" />

          <rect x="202" y="56" width="154" height="56" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.1" />
          <text x="279" y="76" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={pal.ink}>
            Channel 1 (全局法则修正)
          </text>
          <text x="279" y="96" textAnchor="middle" fontSize="9" fontWeight="700" fill={pal.violet}>
            以 Ch0 输出作为新 Base!
          </text>
        </g>
      </g>
    </g>
  );
};

/**
 * 9. GE Duration Types & Periodic Tick Timeline Diagram
 */
export const PeriodicTickTimelineDiagram: React.FC<DiagramProps> = ({ phase, theme }) => {
  const pal = getDiagramPalette(theme);
  const playheadX = 150 + ((phase * 560) % 560);

  return (
    <g>
      <DiagramHeader
        pal={pal}
        category="PERIODIC TIMELINE · 三大时效对比与 Periodic 周期跳刻度尺"
        title="Instant / Duration / Infinite 职责分界 + bExecutePeriodicEffectOnApplication 首跳时间轴"
        rightBadge="周期跳本质 = Instant"
      />

      {/* Top Panel: 3 Duration Policies Comparison (y=106..250) */}
      <g transform="translate(24, 106)">
        <rect x="0" y="0" width="802" height="142" rx="10" fill={pal.card} stroke={pal.lineStrong} strokeWidth="1.3" />
        {[
          {
            x: 16,
            title: '⚡ Instant (瞬发)',
            target: '永久改 BaseValue',
            hook: '触发 PostGEExecute ✅',
            life: '0 秒即刻销毁，不进 ActiveGE 容器',
            use: '扣血 / 治疗 / 扣蓝 / 经验获取',
            bg: pal.amberBg
          },
          {
            x: 278,
            title: '⏳ HasDuration / Infinite (非周期)',
            target: '临时改 CurrentValue',
            hook: '绝不触发 PostGEExecute ❌',
            life: '驻留 ActiveGE 容器，移除后自动还原',
            use: '+20% 移速 Buff / 穿戴光环装备',
            bg: pal.blueBg
          },
          {
            x: 540,
            title: '🩸 Periodic (带 Period > 0 的持续GE)',
            target: '每跳永久改 BaseValue!',
            hook: '每一跳都触发 PostGEExecute ✅',
            life: '持续期驻留容器，到期不回退已跳值',
            use: '流血 DOT / 持续回春 HOT',
            bg: pal.greenBg
          }
        ].map((card, i) => (
          <g key={i} transform={`translate(${card.x}, 14)`}>
            <rect x="0" y="0" width="246" height="114" rx="8" fill={card.bg} stroke={pal.ink} strokeWidth="1.2" />
            <text x="12" y="21" fontSize="10.2" fontWeight="800" fill={pal.ink}>
              {card.title}
            </text>
            <text x="12" y="42" fontSize="9.3" fontWeight="800" fill={pal.ink}>
              • 作用目标：{card.target}
            </text>
            <text x="12" y="60" fontSize="9" fontWeight="700" fill={pal.ink2}>
              • 回调钩子：{card.hook}
            </text>
            <text x="12" y="78" fontSize="9" fontWeight="600" fill={pal.ink2}>
              • 生命周期：{card.life}
            </text>
            <text x="12" y="98" fontSize="9" fontWeight="800" fill={pal.violetInk}>
              • 场景：{card.use}
            </text>
          </g>
        ))}
      </g>

      {/* Bottom Panel: Periodic Tick Timeline Scale (Duration = 3.0s, Period = 1.0s) (y=258..494) */}
      <g transform="translate(24, 258)">
        <rect x="0" y="0" width="802" height="236" rx="10" fill={pal.card} stroke={pal.lineStrong} strokeWidth="1.3" />
        <text x="16" y="24" fontSize="11.2" fontWeight="800" fill={pal.ink}>
          ⏱️ 周期性 GE 时间轴对比（配置：Duration = 3.0s，Period = 1.0s，每跳 -10 HP）：
        </text>

        {/* Moving Playhead */}
        <line x1={playheadX} y1="40" x2={playheadX} y2="215" stroke={pal.violet} strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Time Ruler */}
        <line x1="150" y1="54" x2="710" y2="54" stroke={pal.ink} strokeWidth="1.6" />
        {[
          { x: 150, t: 't = 0.0s (施加瞬间)' },
          { x: 336, t: 't = 1.0s' },
          { x: 523, t: 't = 2.0s' },
          { x: 710, t: 't = 3.0s (到期瞬间)' }
        ].map((m, idx) => (
          <g key={idx} transform={`translate(${m.x}, 54)`}>
            <line x1="0" y1="-5" x2="0" y2="155" stroke={pal.lineStrong} strokeDasharray="3 3" />
            <circle cx="0" cy="0" r="4" fill={pal.ink} />
            <text x="0" y="-10" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={pal.ink}>
              {m.t}
            </text>
          </g>
        ))}

        {/* Track A: bExecutePeriodicEffectOnApplication = TRUE */}
        <g transform="translate(16, 76)">
          <rect x="0" y="0" width="122" height="56" rx="6" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.1" />
          <text x="61" y="20" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={pal.greenInk}>
            ExecuteOnApp
          </text>
          <text x="61" y="35" textAnchor="middle" fontSize="9.8" fontWeight="800" fill={pal.green}>
            = TRUE (默认)
          </text>
          <text x="61" y="49" textAnchor="middle" fontSize="8.8" fontWeight="700" fill={pal.ink}>
            共跳 4 次 (-40 HP)
          </text>

          {[150, 336, 523, 710].map((tx, i) => (
            <g key={i} transform={`translate(${tx - 16}, 28)`}>
              <rect x="-38" y="-18" width="76" height="36" rx="6" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.3" />
              <text x="0" y="-2" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={pal.greenInk}>
                第 {i + 1} 跳 (-10)
              </text>
              <text x="0" y="12" textAnchor="middle" fontSize="8.5" fontWeight="700" fill={pal.ink2}>
                HP: {100 - (i + 1) * 10}
              </text>
            </g>
          ))}
        </g>

        {/* Track B: bExecutePeriodicEffectOnApplication = FALSE */}
        <g transform="translate(16, 152)">
          <rect x="0" y="0" width="122" height="56" rx="6" fill={pal.amberBg} stroke={pal.ink} strokeWidth="1.1" />
          <text x="61" y="20" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={pal.amberInk}>
            ExecuteOnApp
          </text>
          <text x="61" y="35" textAnchor="middle" fontSize="9.8" fontWeight="800" fill={pal.amber}>
            = FALSE
          </text>
          <text x="61" y="49" textAnchor="middle" fontSize="8.8" fontWeight="700" fill={pal.ink}>
            共跳 3 次 (-30 HP)
          </text>

          <g transform="translate(134, 28)">
            <rect x="-42" y="-16" width="84" height="32" rx="6" fill={pal.chip} stroke={pal.lineStrong} strokeDasharray="3 2" />
            <text x="0" y="4" textAnchor="middle" fontSize="8.8" fontWeight="700" fill={pal.muted}>
              0s 仅挂状态不跳
            </text>
          </g>

          {[336, 523, 710].map((tx, i) => (
            <g key={i} transform={`translate(${tx - 16}, 28)`}>
              <rect x="-38" y="-18" width="76" height="36" rx="6" fill={pal.amberBg} stroke={pal.ink} strokeWidth="1.3" />
              <text x="0" y="-2" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={pal.amberInk}>
                第 {i + 1} 跳 (-10)
              </text>
              <text x="0" y="12" textAnchor="middle" fontSize="8.5" fontWeight="700" fill={pal.ink2}>
                HP: {100 - (i + 1) * 10}
              </text>
            </g>
          ))}
        </g>
      </g>
    </g>
  );
};

/**
 * 10. GE Stacking Pool & Expiration Decay Bar Chart Diagram
 */
export const GeStackingBarsDiagram: React.FC<DiagramProps> = ({ stepId, theme }) => {
  const pal = getDiagramPalette(theme);

  return (
    <g>
      <DiagramHeader
        pal={pal}
        category="STACKING & OVERFLOW · GE 叠层归属池与到期退栈阶梯图"
        title="AggregateByTarget (共享叠层池) vs AggregateBySource (按施法者独立池) + 到期降层与溢出引爆"
        rightBadge={`当前步骤：${stepId.toUpperCase()}`}
      />

      {/* Left Panel: AggregateByTarget vs AggregateBySource (x=24, y=106, w=388, h=388) */}
      <g transform="translate(24, 106)">
        <rect x="0" y="0" width="388" height="388" rx="10" fill={pal.card} stroke={pal.lineStrong} strokeWidth="1.3" />
        <text x="16" y="22" fontSize="11.2" fontWeight="800" fill={pal.ink}>
          🎯 叠层归属模式对比（假设毒箭上限 StackLimitCount = 3）：
        </text>

        {/* Mode 1: AggregateByTarget */}
        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="356" height="156" rx="8" fill={pal.amberBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="14" y="22" fontSize="10.5" fontWeight="800" fill={pal.amberInk}>
            1. AggregateByTarget（按受击目标共享池）
          </text>
          <text x="14" y="40" fontSize="9" fontWeight="600" fill={pal.ink2}>
            无论几个玩家射向 Boss，Boss 身上总共只有 1 个 GE 实例（最多 3 层）：
          </text>
          <g transform="translate(14, 52)">
            <rect x="0" y="0" width="96" height="36" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.1" />
            <text x="48" y="22" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={pal.ink}>
              猎人 A 射 2 箭
            </text>
            <rect x="0" y="44" width="96" height="36" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.1" />
            <text x="48" y="66" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={pal.ink}>
              猎人 B 射 2 箭
            </text>

            <line x1="96" y1="18" x2="142" y2="36" stroke={pal.ink} strokeWidth="1.5" />
            <line x1="96" y1="62" x2="142" y2="44" stroke={pal.ink} strokeWidth="1.5" />

            <rect x="144" y="6" width="184" height="76" rx="7" fill={pal.chip} stroke={pal.ink} strokeWidth="1.3" />
            <text x="236" y="24" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={pal.amberInk}>
              Boss 共享叠层槽 (上限 3/3)
            </text>
            {[0, 1, 2].map((s) => (
              <rect key={s} x={158 + s * 52} y="34" width="46" height="22" rx="4" fill={pal.amber} stroke={pal.ink} strokeWidth="1" />
            ))}
            <text x="236" y="72" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={pal.red}>
              第 4 箭触发 OverflowEffects!
            </text>
          </g>
        </g>

        {/* Mode 2: AggregateBySource */}
        <g transform="translate(16, 206)">
          <rect x="0" y="0" width="356" height="166" rx="8" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="14" y="22" fontSize="10.5" fontWeight="800" fill={pal.greenInk}>
            2. AggregateBySource（按施法者各自独立池）
          </text>
          <text x="14" y="40" fontSize="9" fontWeight="600" fill={pal.ink2}>
            每个猎人在 Boss 身上拥有独立的 3 层毒液槽，互不抢层数、互不顶掉：
          </text>

          <g transform="translate(14, 52)">
            <rect x="0" y="0" width="328" height="44" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.1" />
            <text x="12" y="26" fontSize="9.5" fontWeight="800" fill={pal.ink}>
              猎人 A 专属槽 (3/3):
            </text>
            {[0, 1, 2].map((s) => (
              <rect key={s} x={140 + s * 56} y="11" width="48" height="22" rx="4" fill={pal.green} stroke={pal.ink} strokeWidth="1" />
            ))}

            <rect x="0" y="54" width="328" height="44" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.1" />
            <text x="12" y="80" fontSize="9.5" fontWeight="800" fill={pal.ink}>
              猎人 B 专属槽 (3/3):
            </text>
            {[0, 1, 2].map((s) => (
              <rect key={s} x={140 + s * 56} y="65" width="48" height="22" rx="4" fill={pal.blue} stroke={pal.ink} strokeWidth="1" />
            ))}
          </g>
        </g>
      </g>

      {/* Right Panel: Expiration Staircase & Overflow Explosion (x=424, y=106, w=402, h=388) */}
      <g transform="translate(424, 106)">
        <rect x="0" y="0" width="402" height="388" rx="10" fill={pal.card} stroke={pal.lineStrong} strokeWidth="1.3" />
        <text x="16" y="22" fontSize="11.2" fontWeight="800" fill={pal.ink}>
          📉 到期退栈策略 (StackExpirationPolicy) 阶梯曲线对比：
        </text>

        {/* Chart 1: ClearEntireStack */}
        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="370" height="106" rx="8" fill={pal.redBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="12" y="20" fontSize="10" fontWeight="800" fill={pal.redInk}>
            策略 A：ClearEntireStack（时间一到，3 层瞬间归零）
          </text>
          <rect x="16" y="32" width="180" height="44" rx="5" fill={pal.red} stroke={pal.ink} strokeWidth="1.2" />
          <text x="106" y="58" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#fff">
            3 层满栈 (Duration 5s)
          </text>
          <text x="206" y="58" fontSize="12.2" fontWeight="800" fill={pal.red}>
            ➔ 0 层! (悬崖式断档)
          </text>
          <text x="16" y="94" fontSize="8.8" fontWeight="600" fill={pal.ink2}>
            适用：断档惩罚型连击 Buff（5 秒内不续击则全部层数作废）
          </text>
        </g>

        {/* Chart 2: RemoveSingleStackAndRefreshDuration */}
        <g transform="translate(16, 154)">
          <rect x="0" y="0" width="370" height="122" rx="8" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="12" y="20" fontSize="10" fontWeight="800" fill={pal.greenInk}>
            策略 B：RemoveSingleStackAndRefreshDuration（阶梯式平滑退栈）
          </text>
          {/* Staircase bars: 3 -> 2 -> 1 -> 0 */}
          <rect x="16" y="30" width="84" height="54" rx="4" fill={pal.green} stroke={pal.ink} strokeWidth="1.1" />
          <text x="58" y="61" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff">
            3 层 (5s)
          </text>
          <rect x="108" y="46" width="84" height="38" rx="4" fill={pal.green} opacity="0.85" stroke={pal.ink} strokeWidth="1.1" />
          <text x="150" y="69" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff">
            2 层 (5s)
          </text>
          <rect x="200" y="62" width="84" height="22" rx="4" fill={pal.green} opacity="0.7" stroke={pal.ink} strokeWidth="1.1" />
          <text x="242" y="77" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#fff">
            1 层 (5s)
          </text>
          <text x="324" y="77" textAnchor="middle" fontSize="10" fontWeight="800" fill={pal.greenInk}>
            ➔ 0 层
          </text>
          <text x="16" y="106" fontSize="8.8" fontWeight="600" fill={pal.ink2}>
            适用：狂暴/破甲层数逐层衰减，给玩家极其友好的保层体验
          </text>
        </g>

        {/* Box 3: OverflowEffects */}
        <g transform="translate(16, 288)">
          <rect x="0" y="0" width="370" height="84" rx="8" fill={pal.violetBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="12" y="20" fontSize="10" fontWeight="800" fill={pal.violetInk}>
            💥 叠层溢出联动：GE 本体 Stacking 栏的 OverflowEffects
          </text>
          <text x="12" y="40" fontSize="9.2" fontWeight="600" fill={pal.ink}>
            • 当目标已满 3 层寒冰，第 4 次施加时自动派发 GE_IceShatter（冰爆高伤）
          </text>
          <text x="12" y="58" fontSize="8.6" fontWeight="600" fill={pal.ink}>
            • 配合 bClearStackOnOverflow=true 可“满 4 层引爆并清零”！
          </text>
          <text x="12" y="74" fontSize="7.9" fontWeight="800" fill={pal.amberInk}>
            注：OverflowEffects 在 GE 本体 Stacking 栏，不在 AdditionalEffects
          </text>
        </g>
      </g>
    </g>
  );
};
