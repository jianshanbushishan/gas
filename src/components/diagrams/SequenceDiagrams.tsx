import React from 'react';
import { DiagramHeader, DiagramProps, FlowDot, getDiagramPalette } from './types';

/**
 * 1. ASC Dual-End Init & Respawn Sequence + 1Hz vs 100Hz Replication Bar
 */
export const AscInitSequenceDiagram: React.FC<DiagramProps> = ({ stepId, phase, theme }) => {
  const pal = getDiagramPalette(theme);
  const focusStep = stepId; // s4 = dual init, s5 = 1Hz pitfall, s6 = respawn loop
  const scanY = 138 + ((phase * 220) % 220);

  return (
    <g>
      <DiagramHeader
        pal={pal}
        category="SEQUENCE SWIMLANE · 双端初始化与换壳时序泳道图"
        title="PossessedBy (Server) vs OnRep_PlayerState (Client) 异步时序与同步率对比"
        rightBadge={
          focusStep === 's5'
            ? '当前聚焦：1Hz 节流陷阱'
            : focusStep === 's6'
            ? '当前聚焦：死亡换壳闭环'
            : '当前聚焦：双端黄金时机'
        }
      />

      {/* Main Swimlane Panel (Top: y=106..372) */}
      <rect
        x="24"
        y="106"
        width="802"
        height="268"
        rx="10"
        fill={pal.card}
        stroke={pal.lineStrong}
        strokeWidth="1.3"
      />

      {/* Swimlane Column Headers */}
      <g transform="translate(24, 106)">
        <rect x="12" y="8" width="250" height="26" rx="6" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.2" />
        <text x="137" y="25" textAnchor="middle" fontSize="11" fontWeight="800" fill={pal.greenInk}>
          🖥️ Dedicated Server (Authority)
        </text>

        <rect x="276" y="8" width="250" height="26" rx="6" fill={pal.amberBg} stroke={pal.ink} strokeWidth="1.2" />
        <text x="401" y="25" textAnchor="middle" fontSize="11" fontWeight="800" fill={pal.amberInk}>
          🌐 Network Replication Channel
        </text>

        <rect x="540" y="8" width="250" height="26" rx="6" fill={pal.blueBg} stroke={pal.ink} strokeWidth="1.2" />
        <text x="665" y="25" textAnchor="middle" fontSize="11" fontWeight="800" fill={pal.blueInk}>
          🎮 Autonomous Client (本地客户端)
        </text>

        {/* Vertical Lifeline Dashed Guides */}
        <line x1="137" y1="36" x2="137" y2="260" stroke={pal.lineStrong} strokeDasharray="4 4" />
        <line x1="401" y1="36" x2="401" y2="260" stroke={pal.lineStrong} strokeDasharray="4 4" />
        <line x1="665" y1="36" x2="665" y2="260" stroke={pal.lineStrong} strokeDasharray="4 4" />
      </g>

      {/* Moving Time Scanline */}
      <line
        x1="36"
        y1={scanY}
        x2="814"
        y2={scanY}
        stroke={pal.violet}
        strokeWidth="1.2"
        strokeDasharray="3 3"
        opacity="0.55"
      />

      {/* Row 1 (t = 0ms): Server PossessedBy */}
      <g transform="translate(36, 148)">
        <rect
          x="0"
          y="0"
          width="250"
          height="54"
          rx="7"
          fill={pal.chip}
          stroke={focusStep === 's4' ? pal.green : pal.ink}
          strokeWidth={focusStep === 's4' ? '2.2' : '1.3'}
        />
        <text x="10" y="16" fontSize="10.5" fontWeight="800" fill={pal.green}>
          [t1 · Server] ACharacter::PossessedBy
        </text>
        <text x="10" y="31" fontSize="9.6" fontWeight="700" fill={pal.ink}>
          1. ASC-&gt;InitAbilityActorInfo(PS, this)
        </text>
        <text x="10" y="45" fontSize="8.3" fontWeight="600" fill={pal.muted}>
          2. 仅首次 (!bStartupAbilitiesGiven) GiveAbility
        </text>

        {/* Diagonal Replication Arrow to Client OnRep_PlayerState */}
        <line
          x1="250"
          y1="27"
          x2="528"
          y2="66"
          stroke={pal.ink}
          strokeWidth="1.7"
          markerEnd="url(#arrow-ink)"
        />
        <FlowDot x1={250} y1={27} x2={528} y2={66} phase={phase} color={pal.green} stroke={pal.ink} />
        <rect x="290" y="28" width="200" height="20" rx="10" fill={pal.amberBg} stroke={pal.ink} strokeWidth="1.1" />
        <text x="390" y="41.5" textAnchor="middle" fontSize="9" fontWeight="800" fill={pal.amberInk}>
          属性复制：PlayerState + Spec 句柄
        </text>
      </g>

      {/* Row 2 (t = +RTT/2): Client OnRep_PlayerState */}
      <g transform="translate(564, 186)">
        <rect
          x="0"
          y="0"
          width="250"
          height="52"
          rx="7"
          fill={pal.chip}
          stroke={focusStep === 's4' ? pal.blue : pal.ink}
          strokeWidth={focusStep === 's4' ? '2.2' : '1.3'}
        />
        <text x="10" y="16" fontSize="10.2" fontWeight="800" fill={pal.blue}>
          [t2 · Client] OnRep_PlayerState()
        </text>
        <text x="10" y="31" fontSize="9.6" fontWeight="700" fill={pal.ink}>
          1. ASC-&gt;InitAbilityActorInfo(PS, this)
        </text>
        <text x="10" y="45" fontSize="8.5" fontWeight="600" fill={pal.muted}>
          2. 绑定 HUD 血条委托 (严禁 GiveAbility!)
        </text>
      </g>

      {/* Warning Note on Race Condition */}
      <g transform="translate(36, 214)">
        <rect x="0" y="0" width="250" height="36" rx="6" fill={pal.violetBg} stroke={pal.violet} strokeWidth="1.2" />
        <text x="12" y="15" fontSize="9.5" fontWeight="800" fill={pal.violetInk}>
          ⚠️ 为什么不用 BeginPlay 初始化？
        </text>
        <text x="12" y="29" fontSize="8.3" fontWeight="600" fill={pal.ink2}>
          Client BeginPlay 时 PS 往往仍为 nullptr!
        </text>
      </g>

      {/* Row 3 (t3): Respawn & Avatar Swap Closed-Loop */}
      <g transform="translate(36, 260)">
        <rect
          x="0"
          y="0"
          width="778"
          height="102"
          rx="8"
          fill={focusStep === 's6' ? pal.greenBg : pal.card2}
          stroke={focusStep === 's6' ? pal.green : pal.lineStrong}
          strokeWidth={focusStep === 's6' ? '2' : '1.2'}
        />
        <text x="14" y="19" fontSize="10.8" fontWeight="800" fill={pal.ink}>
          🔄 [t3 · 角色阵亡与重生换壳闭环] 灵魂 (PlayerState + ASC) 永驻，肉体 (AvatarActor) 动态解绑与重绑：
        </text>

        {/* 4 Steps inside Respawn Box */}
        {[
          {
            x: 14,
            tag: '① 死亡清理 GE',
            title: '移除死亡清除型 Buff',
            desc: '保留大招 CD / 永久天赋层数',
            tone: pal.amberBg
          },
          {
            x: 205,
            tag: '② 销毁旧肉体前',
            title: 'ASC->ClearActorInfo()',
            desc: '安全解绑旧 Character 悬空指针',
            tone: pal.redBg
          },
          {
            x: 396,
            tag: '③ Server PossessedBy',
            title: 'Init(PS, NewPawn #2)',
            desc: 'bGiven 守卫阻止重复授予!',
            tone: pal.greenBg
          },
          {
            x: 587,
            tag: '④ Client OnRep',
            title: '双端刷新 AvatarActor',
            desc: '蒙太奇与 Cue 立即无缝指向新肉体',
            tone: pal.blueBg
          }
        ].map((item, idx) => (
          <g key={idx} transform={`translate(${item.x}, 28)`}>
            <rect x="0" y="0" width="177" height="64" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.2" />
            <rect x="6" y="6" width="165" height="17" rx="4" fill={item.tone} />
            <text x="88" y="18" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={pal.ink}>
              {item.tag}
            </text>
            <text x="10" y="38" fontSize="10" fontWeight="800" fill={pal.ink}>
              {item.title}
            </text>
            <text x="10" y="53" fontSize="9.2" fontWeight="600" fill={pal.muted}>
              {item.desc}
            </text>
          </g>
        ))}
      </g>

      {/* Bottom Panel (y=382..494): 1Hz vs 100Hz NetUpdateFrequency Scale */}
      <g transform="translate(24, 382)">
        <rect
          x="0"
          y="0"
          width="802"
          height="112"
          rx="10"
          fill={pal.card}
          stroke={focusStep === 's5' ? pal.amber : pal.lineStrong}
          strokeWidth={focusStep === 's5' ? '2.2' : '1.3'}
        />
        <text x="16" y="21" fontSize="11.2" fontWeight="800" fill={pal.ink}>
          ⏱️ APlayerState::NetUpdateFrequency 属性复制资格刻度对比（1000ms 时间窗内下发次数）：
        </text>
        <text x="786" y="21" textAnchor="end" fontSize="10" fontWeight="700" fill={pal.muted}>
          注：RPC 独立发送，但属性与 ActiveGE 受此频率直接节流
        </text>

        {/* Track 1: 1Hz Default */}
        <text x="16" y="48" fontSize="10.2" fontWeight="800" fill={pal.red}>
          引擎默认 (1 Hz)
        </text>
        <rect x="135" y="34" width="510" height="20" rx="5" fill={pal.redBg} stroke={pal.ink} strokeWidth="1.1" />
        <rect x="138" y="36" width="10" height="16" rx="2" fill={pal.red} />
        <rect x="632" y="36" width="10" height="16" rx="2" fill={pal.red} />
        <text x="390" y="48" textAnchor="middle" fontSize="9.8" fontWeight="800" fill={pal.redInk}>
          长达 ~1000ms 的属性同步真空期！（血条一顿一顿、预测密钥追赶严重滞后）
        </text>
        <text x="656" y="48" fontSize="10" fontWeight="800" fill={pal.red}>
          ❌ 1 次 / 秒
        </text>

        {/* Track 2: 100Hz Lyra Standard */}
        <text x="16" y="84" fontSize="10.2" fontWeight="800" fill={pal.green}>
          Lyra 标准 (100 Hz)
        </text>
        <rect x="135" y="70" width="510" height="20" rx="5" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.1" />
        {Array.from({ length: 32 }).map((_, i) => (
          <rect
            key={i}
            x={140 + i * 15.8}
            y="73"
            width="6"
            height="14"
            rx="1.5"
            fill={pal.green}
            opacity={((Math.floor(phase * 32) - i + 32) % 32) < 5 ? 1 : 0.45}
          />
        ))}
        <text x="656" y="84" fontSize="10" fontWeight="800" fill={pal.green}>
          ✅ 最快 10ms / 次
        </text>
        <text x="135" y="104" fontSize="9.5" fontWeight="700" fill={pal.muted}>
          必配代码：SetNetUpdateFrequency(100.0f); &nbsp; MinNetUpdateFrequency = 33.0f; （Lyra 英雄 PlayerState 标配）
        </text>
      </g>
    </g>
  );
};

/**
 * 2. Client Prediction Key Dual-Track Swimlane & Rollback Ledger Diagram
 */
export const PredictionKeySwimlaneDiagram: React.FC<DiagramProps> = ({ stepId, phase, theme }) => {
  const pal = getDiagramPalette(theme);

  return (
    <g>
      <DiagramHeader
        pal={pal}
        category="PREDICTION SWIMLANE · 客户端预测双轨时序与拒绝回滚账本"
        title="FPredictionKey 同步栈签发 ➔ 轨道 A (RPC 确认) vs 轨道 B (属性复制 CatchUpTo) ➔ 冲突回滚边界"
        rightBadge={`当前步骤：${stepId.toUpperCase()}`}
      />

      {/* Top Strip: 4 NetExecutionPolicies + Security Fence (y=104..156) */}
      <g transform="translate(24, 104)">
        <rect
          x="0"
          y="0"
          width="802"
          height="50"
          rx="8"
          fill={pal.card}
          stroke={stepId === 's1' ? pal.green : pal.lineStrong}
          strokeWidth={stepId === 's1' ? '2.2' : '1.2'}
        />
        {[
          {
            x: 10,
            w: 222,
            name: 'LocalPredicted (主角主力)',
            sub: 'Client 0ms 抢跑 + Server 权威仲裁',
            bg: pal.greenBg
          },
          {
            x: 240,
            w: 180,
            name: 'ServerInitiated',
            sub: 'Server 先跑 ➔ 通知 Client 跟跑',
            bg: pal.blueBg
          },
          {
            x: 428,
            w: 170,
            name: 'ServerOnly / LocalOnly',
            sub: '纯后台结算 / 纯本地镜头表现',
            bg: pal.amberBg
          },
          {
            x: 606,
            w: 186,
            name: 'NetSecurityPolicy 围栏',
            sub: 'ServerOnlyExecution / Termination',
            bg: pal.violetBg
          }
        ].map((item, i) => (
          <g key={i} transform={`translate(${item.x}, 6)`}>
            <rect x="0" y="0" width={item.w} height="38" rx="6" fill={item.bg} stroke={pal.ink} strokeWidth="1.1" />
            <text x="10" y="15" fontSize="9.8" fontWeight="800" fill={pal.ink}>
              {item.name}
            </text>
            <text x="10" y="30" fontSize="8.2" fontWeight="600" fill={pal.ink2}>
              {item.sub}
            </text>
          </g>
        ))}
      </g>

      {/* Left Main Card: Dual-Track Approval Swimlane (x=24, y=162, w=486, h=222) */}
      <g transform="translate(24, 162)">
        <rect
          x="0"
          y="0"
          width="486"
          height="222"
          rx="10"
          fill={pal.card}
          stroke={stepId === 's2' ? pal.violet : pal.lineStrong}
          strokeWidth={stepId === 's2' ? '2.2' : '1.3'}
        />
        <text x="14" y="20" fontSize="11.2" fontWeight="800" fill={pal.ink}>
          ✅ 路径一：预测获批的“双轨异步回程”（避免提前撤除预测态导致闪烁）
        </text>

        {/* Client Timeline Bar */}
        <rect x="14" y="32" width="145" height="22" rx="5" fill={pal.violetBg} stroke={pal.ink} strokeWidth="1.1" />
        <text x="86" y="47" textAnchor="middle" fontSize="10" fontWeight="800" fill={pal.violetInk}>
          Client 同步激活栈
        </text>

        {/* Server Timeline Bar */}
        <rect x="326" y="32" width="145" height="22" rx="5" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.1" />
        <text x="398" y="47" textAnchor="middle" fontSize="10" fontWeight="800" fill={pal.greenInk}>
          Server 权威执行
        </text>

        <line x1="86" y1="56" x2="86" y2="210" stroke={pal.lineStrong} strokeDasharray="3 3" />
        <line x1="398" y1="56" x2="398" y2="210" stroke={pal.lineStrong} strokeDasharray="3 3" />

        {/* Step 1: t=0ms Client issues Key #42 */}
        <rect x="14" y="62" width="164" height="40" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.2" />
        <text x="20" y="77" fontSize="8.4" fontWeight="800" fill={pal.violet}>
          [t=0ms] 签发 Key #42 (仅同步栈)
        </text>
        <text x="20" y="92" fontSize="8.2" fontWeight="600" fill={pal.ink2}>
          播蒙太奇 · 预测GE(-30蓝) · Cue
        </text>

        {/* Arrow 1: ServerTryActivateAbility */}
        <line x1="178" y1="78" x2="320" y2="95" stroke={pal.blue} strokeWidth="1.8" markerEnd="url(#arrow-ink)" />
        <FlowDot x1={178} y1={78} x2={320} y2={95} phase={phase} color={pal.blue} stroke={pal.ink} />
        <text x="249" y="78" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={pal.blue}>
          ServerTryActivate(#42)
        </text>

        {/* Server Box */}
        <rect x="322" y="78" width="150" height="44" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.2" />
        <text x="328" y="94" fontSize="9.2" fontWeight="800" fill={pal.green}>
          [t=50ms] 校验通过并执行
        </text>
        <text x="328" y="109" fontSize="8.2" fontWeight="600" fill={pal.ink2}>
          写权威 ActiveGE + 标脏 #42
        </text>

        {/* Return Track A: Fast RPC */}
        <line x1="322" y1="112" x2="178" y2="136" stroke={pal.blue} strokeWidth="1.7" strokeDasharray="4 3" markerEnd="url(#arrow-ink)" />
        <FlowDot x1={322} y1={112} x2={178} y2={136} phase={phase} offset={0.25} color={pal.blue} stroke={pal.ink} />
        <text x="252" y="138" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={pal.blue}>
          轨道A：Succeed RPC (~1 RTT)
        </text>

        <rect x="14" y="118" width="164" height="36" rx="6" fill={pal.blueBg} stroke={pal.ink} strokeWidth="1.1" />
        <text x="20" y="133" fontSize="8.2" fontWeight="800" fill={pal.blueInk}>
          [t=100ms] 确认激活 (不受1Hz影响)
        </text>
        <text x="20" y="147" fontSize="8.4" fontWeight="600" fill={pal.ink2}>
          预测态保留，等待权威属性追上
        </text>

        {/* Return Track B: Property Replication CatchUpTo */}
        <line x1="398" y1="122" x2="178" y2="184" stroke={pal.green} strokeWidth="2" markerEnd="url(#arrow-ink)" />
        <FlowDot x1={398} y1={122} x2={178} y2={184} phase={phase} offset={0.55} color={pal.green} stroke={pal.ink} />
        <text x="305" y="174" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={pal.green}>
          轨道B：ReplicatedKey #42 + 权威GE复制
        </text>

        <rect x="14" y="166" width="164" height="44" rx="6" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.2" />
        <text x="20" y="182" fontSize="8.4" fontWeight="800" fill={pal.greenInk}>
          [t=115ms] CatchUpTo(#42) 核销
        </text>
        <text x="20" y="197" fontSize="8.5" fontWeight="600" fill={pal.ink2}>
          撤 #42 临时预测修饰，无缝交接!
        </text>
      </g>

      {/* Right Card: Server Rejection & Rollback Ledger (x=518, y=162, w=308, h=222) */}
      <g transform="translate(518, 162)">
        <rect
          x="0"
          y="0"
          width="308"
          height="222"
          rx="10"
          fill={pal.card}
          stroke={stepId === 's3' ? pal.red : pal.lineStrong}
          strokeWidth={stepId === 's3' ? '2.2' : '1.3'}
        />
        <text x="14" y="20" fontSize="11" fontWeight="800" fill={pal.red}>
          ❌ 路径二：服务端拒绝与账本回滚边界
        </text>

        <rect x="14" y="30" width="280" height="34" rx="6" fill={pal.redBg} stroke={pal.ink} strokeWidth="1.1" />
        <text x="22" y="45" fontSize="8.6" fontWeight="800" fill={pal.redInk}>
          Server 判 State.Rooted ➔ 下发 Failed(#43)
        </text>
        <text x="22" y="58" fontSize="8.1" fontWeight="600" fill={pal.ink2}>
          BroadcastRejectedDelegate(#43) 通知客户端回滚
        </text>

        {/* Auto Rollback Ledger */}
        <rect x="14" y="72" width="280" height="72" rx="6" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.2" />
        <text x="22" y="88" fontSize="9.4" fontWeight="800" fill={pal.greenInk}>
          ✅ GAS 预测账本自动回滚项（绑定 Key #43）：
        </text>
        <text x="22" y="104" fontSize="8.4" fontWeight="600" fill={pal.ink}>
          • 撤销预测 ActiveGE（退 -50 蓝预扣与假 CD）
        </text>
        <text x="22" y="119" fontSize="8.4" fontWeight="600" fill={pal.ink}>
          • 打断回退 PlayMontageAndWait 预测蒙太奇
        </text>
        <text x="22" y="134" fontSize="8.4" fontWeight="600" fill={pal.ink}>
          • 移除预测期 GameplayTag 与持续型 Cue
        </text>

        {/* Manual Cleanup Boundary */}
        <rect x="14" y="152" width="280" height="60" rx="6" fill={pal.amberBg} stroke={pal.ink} strokeWidth="1.2" />
        <text x="22" y="168" fontSize="9.4" fontWeight="800" fill={pal.amberInk}>
          ⚠️ 引擎无法倒带、需项目自理的边界：
        </text>
        <text x="22" y="184" fontSize="8.4" fontWeight="600" fill={pal.ink}>
          • 已播出口的一次性 Burst 音效/粒子无法收回
        </text>
        <text x="22" y="199" fontSize="8.4" fontWeight="600" fill={pal.ink}>
          • 自定义 C++ 变量或本地 Actor 需在 EndAbility 自清
        </text>
      </g>

      {/* Bottom Traffic Light Matrix: What Can / Cannot Be Predicted (y=392..494) */}
      <g transform="translate(24, 392)">
        <rect
          x="0"
          y="0"
          width="802"
          height="102"
          rx="10"
          fill={pal.card}
          stroke={stepId === 's4' ? pal.amber : pal.lineStrong}
          strokeWidth={stepId === 's4' ? '2.2' : '1.3'}
        />
        <text x="16" y="20" fontSize="11" fontWeight="800" fill={pal.ink}>
          🚦 GAS 客户端预测能力红绿灯边界清单（设计联机技能前必查）：
        </text>

        <g transform="translate(16, 28)">
          <rect x="0" y="0" width="380" height="64" rx="7" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="12" y="18" fontSize="10" fontWeight="800" fill={pal.greenInk}>
            🟢 原生完美支持预测（LocalPredicted 同步栈内安全运行）
          </text>
          <text x="12" y="35" fontSize="9" fontWeight="600" fill={pal.ink}>
            ✓ 蒙太奇 (PlayMontage) · 蓝耗与冷却 (Cost / Cooldown GE)
          </text>
          <text x="12" y="51" fontSize="8.3" fontWeight="600" fill={pal.ink}>
            ✓ 普通修改器/MMC · GE 授予标签 · Cues · CMC 根运动位移
          </text>
        </g>

        <g transform="translate(408, 28)">
          <rect x="0" y="0" width="378" height="64" rx="7" fill={pal.redBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="12" y="18" fontSize="10" fontWeight="800" fill={pal.redInk}>
            🔴 严禁预测 / 仅限 HasAuthority() 服务端权威分支执行
          </text>
          <text x="12" y="35" fontSize="9" fontWeight="600" fill={pal.ink}>
            ✗ SpawnActor 生成联网投射物（客户端只用 Cue 播假枪口焰）
          </text>
          <text x="12" y="51" fontSize="8.4" fontWeight="600" fill={pal.ink}>
            ✗ ExecCalc 复杂暴击伤害 · 驱散已存权威 GE · 角色死亡裁决
          </text>
        </g>
      </g>
    </g>
  );
};

/**
 * 3. RPC Batcher & UE 5.1+ SubObject Replication List Timeline Diagram
 */
export const RpcBatcherTimelineDiagram: React.FC<DiagramProps> = ({ stepId, phase, theme }) => {
  const pal = getDiagramPalette(theme);

  return (
    <g>
      <DiagramHeader
        pal={pal}
        category="NETWORK OPTIMIZATION · 高并发 RPC 合批与子对象注册列表对比图"
        title="常规瞬发技能 3 次独立 RPC vs FScopedServerAbilityRPCBatcher 单帧 1 包合成 + 子对象推送同步"
        rightBadge={`当前步骤：${stepId.toUpperCase()}`}
      />

      {/* Top Panel: Unbatched vs Batched Hitscan RPC Timeline (y=106..328) */}
      <g transform="translate(24, 106)">
        <rect
          x="0"
          y="0"
          width="802"
          height="220"
          rx="10"
          fill={pal.card}
          stroke={stepId === 's2' ? pal.green : pal.lineStrong}
          strokeWidth={stepId === 's2' ? '2.2' : '1.3'}
        />

        {/* Left Half: Unbatched 3 RPCs */}
        <g transform="translate(16, 14)">
          <rect x="0" y="0" width="376" height="192" rx="8" fill={pal.redBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="14" y="22" fontSize="11" fontWeight="800" fill={pal.redInk}>
            ❌ 未合批常规瞬发 Hitscan（每开一枪连发 3 个独立 RPC 包）
          </text>

          <rect x="16" y="36" width="96" height="140" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.1" />
          <text x="64" y="54" textAnchor="middle" fontSize="10" fontWeight="800" fill={pal.ink}>
            Client 开火帧
          </text>
          <text x="64" y="82" textAnchor="middle" fontSize="9.2" fontWeight="700" fill={pal.ink2}>
            1. TryActivate
          </text>
          <text x="64" y="118" textAnchor="middle" fontSize="9.2" fontWeight="700" fill={pal.ink2}>
            2. TargetData
          </text>
          <text x="64" y="154" textAnchor="middle" fontSize="9.2" fontWeight="700" fill={pal.ink2}>
            3. EndAbility
          </text>

          <rect x="268" y="36" width="92" height="140" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.1" />
          <text x="314" y="54" textAnchor="middle" fontSize="10" fontWeight="800" fill={pal.ink}>
            Server 接收
          </text>
          <text x="314" y="116" textAnchor="middle" fontSize="9.2" fontWeight="700" fill={pal.red}>
            3 倍包头开销
          </text>
          <text x="314" y="134" textAnchor="middle" fontSize="9" fontWeight="600" fill={pal.muted}>
            高频连射易拥塞
          </text>

          {[80, 116, 152].map((y, idx) => (
            <g key={idx}>
              <line x1="112" y1={y} x2="264" y2={y} stroke={pal.red} strokeWidth="1.8" markerEnd="url(#arrow-error)" />
              <FlowDot x1={112} y1={y} x2={264} y2={y} phase={phase} offset={idx * 0.28} color={pal.red} stroke={pal.ink} />
              <rect x="135" y={y - 11} width="110" height="17" rx="8.5" fill={pal.chip} stroke={pal.ink} strokeWidth="1" />
              <text x="190" y={y + 1} textAnchor="middle" fontSize="8.8" fontWeight="800" fill={pal.ink}>
                {idx === 0 ? 'RPC #1: Activate' : idx === 1 ? 'RPC #2: TargetData' : 'RPC #3: EndAbility'}
              </text>
            </g>
          ))}
        </g>

        {/* Right Half: FScopedServerAbilityRPCBatcher 1 RPC */}
        <g transform="translate(410, 14)">
          <rect x="0" y="0" width="376" height="192" rx="8" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="12" y="22" fontSize="9.4" fontWeight="800" fill={pal.greenInk}>
            ✅ FScopedServerAbilityRPCBatcher（单帧合批为 1 包）
          </text>

          <rect x="14" y="36" width="136" height="140" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.2" />
          <text x="82" y="54" textAnchor="middle" fontSize="9.4" fontWeight="800" fill={pal.green}>
            Batcher 作用域内
          </text>
          <text x="82" y="76" textAnchor="middle" fontSize="8.6" fontWeight="700" fill={pal.ink}>
            ShouldDoBatch()=true
          </text>
          <rect x="20" y="86" width="124" height="78" rx="5" fill={pal.violetBg} stroke={pal.violet} strokeWidth="1.1" />
          <text x="82" y="104" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={pal.violetInk}>
            单帧同步完成三步：
          </text>
          <text x="82" y="121" textAnchor="middle" fontSize="7.8" fontWeight="600" fill={pal.ink2}>
            • TryActivateAbility
          </text>
          <text x="82" y="136" textAnchor="middle" fontSize="7.6" fontWeight="600" fill={pal.ink2}>
            • CallServerSetTargetData
          </text>
          <text x="82" y="151" textAnchor="middle" fontSize="7.8" fontWeight="600" fill={pal.ink2}>
            • EndAbility (同帧结束!)
          </text>

          {/* Single Fat Merged Pipe */}
          <line x1="150" y1="115" x2="254" y2="115" stroke={pal.green} strokeWidth="4" markerEnd="url(#arrow-ink)" />
          <FlowDot x1={150} y1={115} x2={254} y2={115} phase={phase} color={pal.green} stroke={pal.ink} r={6} />
          <rect x="154" y="84" width="96" height="22" rx="11" fill={pal.chip} stroke={pal.ink} strokeWidth="1.2" />
          <text x="202" y="98.5" textAnchor="middle" fontSize="9" fontWeight="800" fill={pal.green}>
            仅 1 次复合 RPC!
          </text>

          <rect x="258" y="36" width="104" height="140" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.2" />
          <text x="310" y="56" textAnchor="middle" fontSize="9.8" fontWeight="800" fill={pal.ink}>
            Server 原子解包
          </text>
          <text x="310" y="84" textAnchor="middle" fontSize="9" fontWeight="700" fill={pal.green}>
            ✓ 激活+数据+结束
          </text>
          <text x="310" y="102" textAnchor="middle" fontSize="9" fontWeight="700" fill={pal.green}>
            一次顺序执行完毕
          </text>
          <text x="310" y="132" textAnchor="middle" fontSize="9" fontWeight="800" fill={pal.amber}>
            节省 66% RPC 数量
          </text>
          <text x="310" y="150" textAnchor="middle" fontSize="8.8" fontWeight="600" fill={pal.muted}>
            零乱序到达风险
          </text>
        </g>
      </g>

      {/* Bottom Panel: GA Replication Ban + UE 5.1+ SubObject List (y=336..494) */}
      <g transform="translate(24, 336)">
        <rect
          x="0"
          y="0"
          width="802"
          height="158"
          rx="10"
          fill={pal.card}
          stroke={stepId === 's3' || stepId === 's1' ? pal.violet : pal.lineStrong}
          strokeWidth={stepId === 's3' || stepId === 's1' ? '2.2' : '1.3'}
        />

        {/* Left Box: Why Never Replicate UGameplayAbility */}
        <g transform="translate(16, 14)">
          <rect x="0" y="0" width="340" height="130" rx="8" fill={pal.amberBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="12" y="22" fontSize="10.4" fontWeight="800" fill={pal.amberInk}>
            🚫 铁律一：严禁开启 GA 的 ReplicationPolicy
          </text>
          <text x="12" y="44" fontSize="8.4" fontWeight="600" fill={pal.ink}>
            • UGameplayAbility::ReplicationPolicy 保持 ReplicateNo
          </text>
          <text x="12" y="64" fontSize="8.8" fontWeight="600" fill={pal.ink}>
            • 原因：激活、TargetData 与预测全走 ASC 自身 RPC 通道
          </text>
          <text x="12" y="84" fontSize="8.8" fontWeight="600" fill={pal.ink}>
            • 若给 GA 单独开复制，属性同步与激活 RPC 无顺序保证
          </text>
          <text x="12" y="106" fontSize="8.4" fontWeight="800" fill={pal.red}>
            • UE 5.5 已废弃 ReplicationPolicy，勿在 GA 写复制变量!
          </text>
        </g>

        {/* Right Box: UE 5.1+ Registered SubObject List */}
        <g transform="translate(370, 14)">
          <rect x="0" y="0" width="416" height="130" rx="8" fill={pal.blueBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="12" y="22" fontSize="9.6" fontWeight="800" fill={pal.blueInk}>
            ⚡ 铁律二：UE 5.1+ 开启 bReplicateUsingRegisteredSubObjectList
          </text>
          <rect x="14" y="34" width="188" height="82" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.1" />
          <text x="22" y="52" fontSize="9.5" fontWeight="800" fill={pal.red}>
            旧版轮询：ReplicateSubobjects
          </text>
          <text x="22" y="70" fontSize="8.8" fontWeight="600" fill={pal.ink2}>
            每个网络 Tick 遍历所有 Actor 的
          </text>
          <text x="22" y="85" fontSize="8.2" fontWeight="600" fill={pal.ink2}>
            ASC 与 AttributeSet (CPU 昂贵)
          </text>
          <text x="22" y="103" fontSize="8.6" fontWeight="800" fill={pal.red}>
            100 个单位 = 每帧数百次空轮询
          </text>

          <rect x="214" y="34" width="188" height="82" rx="6" fill={pal.chip} stroke={pal.ink} strokeWidth="1.1" />
          <text x="222" y="52" fontSize="9.5" fontWeight="800" fill={pal.green}>
            现代推送：AddReplicatedSubObject
          </text>
          <text x="222" y="70" fontSize="9" fontWeight="600" fill={pal.ink2}>
            仅在注册/卸载 AttributeSet 时登记，
          </text>
          <text x="222" y="85" fontSize="9" fontWeight="600" fill={pal.ink2}>
            平时 0 遍历开销，脏数据事件驱动下发!
          </text>
          <text x="222" y="103" fontSize="9" fontWeight="800" fill={pal.green}>
            ✓ ASC 与宿主 Actor 同步开启即可
          </text>
        </g>
      </g>
    </g>
  );
};

/**
 * 4. GameplayCue NetCullDistance Relevancy & WhileActive Timeline Diagram
 */
export const CueRelevancyTimelineDiagram: React.FC<DiagramProps> = ({ phase, theme }) => {
  const pal = getDiagramPalette(theme);
  // Animate Player B walking from outside circle (x=305) into circle (x=215)
  const playerBX = 305 - ((phase * 110) % 110);
  const isInside = playerBX < 245;

  return (
    <g>
      <DiagramHeader
        pal={pal}
        category="RELEVANCY TIMELINE · 视野相关性圆圈与 WhileActive 补播时序图"
        title="为什么远方跑过来的玩家看不到 Boss 身上的火焰？（OnActive 瞬发错过 vs WhileActive 状态驱动）"
        rightBadge="NetCullDistance 视野边界"
      />

      {/* Left Panel: Spatial Relevancy Circle (x=24, y=106, w=340, h=388) */}
      <g transform="translate(24, 106)">
        <rect x="0" y="0" width="340" height="388" rx="10" fill={pal.card} stroke={pal.lineStrong} strokeWidth="1.3" />
        <text x="14" y="22" fontSize="9.8" fontWeight="800" fill={pal.ink}>
          🗺️ 空间俯视图：Boss 相关性半径 (NetCullDistance)
        </text>

        {/* Outer Irrelevant Zone */}
        <rect x="16" y="34" width="308" height="240" rx="8" fill={pal.card2} stroke={pal.line} />
        <text x="26" y="52" fontSize="9.5" fontWeight="700" fill={pal.muted}>
          视野外区域 (&gt;100m · 网络不向该客户端同步 Boss)
        </text>

        {/* NetCullDistance Circle */}
        <circle
          cx="145"
          cy="160"
          r="96"
          fill={pal.greenBg}
          stroke={pal.green}
          strokeWidth="2"
          strokeDasharray="6 4"
        />
        <text x="145" y="84" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={pal.greenInk}>
          NetCullDistance 同步圈 (&lt;100m)
        </text>

        {/* Boss in Center */}
        <circle cx="145" cy="160" r="24" fill={pal.redBg} stroke={pal.ink} strokeWidth="1.6" />
        <text x="145" y="157" textAnchor="middle" fontSize="10" fontWeight="800" fill={pal.redInk}>
          🔥 BOSS
        </text>
        <text x="145" y="171" textAnchor="middle" fontSize="8.5" fontWeight="700" fill={pal.ink}>
          GE_Burn (10s)
        </text>

        {/* Player A (Always Inside) */}
        <circle cx="88" cy="195" r="14" fill={pal.blueBg} stroke={pal.ink} strokeWidth="1.3" />
        <text x="88" y="199" textAnchor="middle" fontSize="9" fontWeight="800" fill={pal.blueInk}>
          玩家A
        </text>
        <text x="88" y="222" textAnchor="middle" fontSize="8.8" fontWeight="700" fill={pal.greenInk}>
          t=0s 在圈内
        </text>

        {/* Animated Player B walking in */}
        <line x1="305" y1="160" x2="195" y2="160" stroke={pal.ink} strokeWidth="1.3" strokeDasharray="3 3" />
        <g transform={`translate(${playerBX}, 160)`}>
          <circle cx="0" cy="0" r="15" fill={isInside ? pal.green : pal.amberBg} stroke={pal.ink} strokeWidth="1.5" />
          <text x="0" y="3.5" textAnchor="middle" fontSize="9" fontWeight="800" fill={pal.ink}>
            玩家B
          </text>
          <rect x="-44" y="-32" width="88" height="18" rx="9" fill={pal.chip} stroke={pal.ink} strokeWidth="1.1" />
          <text x="0" y="-20" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={isInside ? pal.green : pal.amber}>
            {isInside ? '进圈! 触发WhileActive' : '圈外: 错过OnActive'}
          </text>
        </g>

        {/* Bottom Summary inside Left Card */}
        <rect x="16" y="284" width="308" height="90" rx="7" fill={pal.amberBg} stroke={pal.ink} strokeWidth="1.2" />
        <text x="26" y="303" fontSize="10" fontWeight="800" fill={pal.amberInk}>
          💡 核心结论：为什么持续特效绝不能绑在 OnActive？
        </text>
        <text x="26" y="321" fontSize="9.2" fontWeight="600" fill={pal.ink}>
          • OnActive 只在 GE 刚施加那一刻 (t=0s) 广播一次；
        </text>
        <text x="24" y="338" fontSize="8.3" fontWeight="600" fill={pal.ink}>
          • 玩家 B 在 t=3.5s 跑进圈时，只收到存续状态，
        </text>
        <text x="24" y="355" fontSize="8.3" fontWeight="800" fill={pal.redInk}>
          引擎对中途进圈者仅调 WhileActive，不补 OnActive!
        </text>
      </g>

      {/* Right Panel: Event Timeline Comparison (x=376, y=106, w=450, h=388) */}
      <g transform="translate(376, 106)">
        <rect x="0" y="0" width="450" height="388" rx="10" fill={pal.card} stroke={pal.lineStrong} strokeWidth="1.3" />
        <text x="16" y="22" fontSize="11.2" fontWeight="800" fill={pal.ink}>
          ⏱️ GCN_Actor 四大回调触发时机对比时间轴 (t = 0s ➔ 10s)
        </text>

        {/* Time Scale Ruler */}
        <line x1="30" y1="52" x2="420" y2="52" stroke={pal.ink} strokeWidth="1.5" />
        {[
          { x: 36, t: 't = 0.0s', desc: 'Boss 挂上灼烧' },
          { x: 170, t: 't = 3.5s', desc: '玩家 B 跑进视野圈' },
          { x: 304, t: 't = 7.5s', desc: '玩家 B 跑出视野圈' },
          { x: 410, t: 't = 10.0s', desc: 'GE 到期移除' }
        ].map((mark, i) => (
          <g key={i} transform={`translate(${mark.x}, 52)`}>
            <line x1="0" y1="-5" x2="0" y2="225" stroke={pal.lineStrong} strokeDasharray="3 3" />
            <circle cx="0" cy="0" r="4" fill={pal.ink} />
            <text x="0" y="-10" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={pal.ink}>
              {mark.t}
            </text>
            <text x="0" y="16" textAnchor="middle" fontSize="8.8" fontWeight="600" fill={pal.muted}>
              {mark.desc}
            </text>
          </g>
        ))}

        {/* Track 1: Player A (Always in range) */}
        <g transform="translate(20, 86)">
          <rect x="0" y="0" width="410" height="82" rx="7" fill={pal.blueBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="12" y="18" fontSize="10" fontWeight="800" fill={pal.blueInk}>
            视角 1：全程在场的玩家 A (t=0s ~ 10s)
          </text>
          <rect x="16" y="28" width="94" height="22" rx="5" fill={pal.amberBg} stroke={pal.ink} strokeWidth="1" />
          <text x="63" y="42.5" textAnchor="middle" fontSize="9" fontWeight="800" fill={pal.amberInk}>
            OnActive (轰燃声)
          </text>
          <rect x="16" y="54" width="374" height="20" rx="5" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.1" />
          <text x="203" y="67.5" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={pal.greenInk}>
            WhileActive 持续燃烧粒子 (t=0s 挂载 ➔ t=10s OnRemove 熄灭)
          </text>
        </g>

        {/* Track 2: Player B (Enters at 3.5s, leaves at 7.5s) */}
        <g transform="translate(20, 182)">
          <rect x="0" y="0" width="410" height="94" rx="7" fill={pal.greenBg} stroke={pal.ink} strokeWidth="1.2" />
          <text x="12" y="18" fontSize="10" fontWeight="800" fill={pal.greenInk}>
            视角 2：中途进出视野的玩家 B (t=3.5s 进圈 ➔ t=7.5s 出圈)
          </text>
          <rect x="16" y="28" width="124" height="22" rx="5" fill={pal.redBg} stroke={pal.red} strokeDasharray="3 2" />
          <text x="78" y="42.5" textAnchor="middle" fontSize="9" fontWeight="800" fill={pal.redInk}>
            ❌ 未收到 OnActive
          </text>
          <rect x="150" y="54" width="134" height="28" rx="5" fill={pal.chip} stroke={pal.ink} strokeWidth="1.3" />
          <text x="217" y="67" textAnchor="middle" fontSize="8.4" fontWeight="800" fill={pal.green}>
            ✅ t=3.5s 触发 WhileActive
          </text>
          <text x="217" y="79" textAnchor="middle" fontSize="8.5" fontWeight="600" fill={pal.muted}>
            t=7.5s 出圈自动调 OnRemove
          </text>
        </g>

        {/* Bottom Golden Rule Table */}
        <g transform="translate(20, 290)">
          <rect x="0" y="0" width="410" height="84" rx="7" fill={pal.chip} stroke={pal.ink} strokeWidth="1.2" />
          <text x="12" y="19" fontSize="10" fontWeight="800" fill={pal.ink}>
            📌 GameplayCue 四大函数分工铁律：
          </text>
          <text x="12" y="38" fontSize="9.2" fontWeight="600" fill={pal.ink2}>
            • Execute：瞬发 GE (Instant) 专用，播受击火花/飘字（不可靠多播）
          </text>
          <text x="12" y="54" fontSize="9.2" fontWeight="600" fill={pal.ink2}>
            • OnActive：持续 GE 刚挂上那一瞬间的起手爆发表现（迟到者看不到）
          </text>
          <text x="12" y="70" fontSize="9.2" fontWeight="800" fill={pal.green}>
            • WhileActive / OnRemove：所有循环粒子/持续音效必须放这里！
          </text>
        </g>
      </g>
    </g>
  );
};
