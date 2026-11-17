import React, { useState } from 'react';
import { Zap, ShieldAlert, RotateCcw } from 'lucide-react';

export const DesignLabView: React.FC = () => {
  // === Sandbox 1: UE 5.5 FAggregator Modifier Pipeline ===
  const [baseAtk, setBaseAtk] = useState(100);
  const [addBase, setAddBase] = useState(50);
  const [mulAdd1, setMulAdd1] = useState(true); // +20% (1.2)
  const [mulAdd2, setMulAdd2] = useState(true); // +20% (1.2)
  const [mulComp1, setMulComp1] = useState(false); // x1.2 compound
  const [mulComp2, setMulComp2] = useState(false); // x1.2 compound
  const [addFinal, setAddFinal] = useState(0);
  const [overrideOn, setOverrideOn] = useState(false);

  const mulAddPool = 1.0 + (mulAdd1 ? 0.2 : 0) + (mulAdd2 ? 0.2 : 0);
  const mulCompFactor = (mulComp1 ? 1.2 : 1.0) * (mulComp2 ? 1.2 : 1.0);
  const finalAtk = overrideOn
    ? 999
    : +(((baseAtk + addBase) * mulAddPool * mulCompFactor) + addFinal).toFixed(2);

  // === Sandbox 2: Clamping Trap Simulator (PreAttributeChange vs Dual Clamp) ===
  const [clampMode, setClampMode] = useState<'buggy' | 'safe'>('buggy');
  const [hpBase, setHpBase] = useState(100);
  const [maxHp] = useState(100);
  const [combatLog, setCombatLog] = useState<string[]>([
    '初始状态：Health BaseValue = 100, CurrentValue = 100'
  ]);

  const displayedCurHp = Math.max(0, Math.min(maxHp, hpBase));

  const applyDamage = (dmg: number) => {
    const rawNext = hpBase - dmg;
    const nextBase = clampMode === 'safe' ? Math.max(0, Math.min(maxHp, rawNext)) : rawNext;
    setHpBase(nextBase);
    setCombatLog((prev) => [
      clampMode === 'buggy'
        ? `💥 承受 -${dmg} 伤害 (仅 PreAttributeChange)：UI 表面显示 0，但底层 BaseValue 已变成 ${nextBase}！`
        : `🛡️ 承受 -${dmg} 伤害 (双层 Clamp)：底层 BaseValue 被安全锁死在 ${nextBase}！`,
      ...prev.slice(0, 5)
    ]);
  };

  const applyHeal = (heal: number) => {
    const rawNext = hpBase + heal;
    const nextBase =
      clampMode === 'safe' ? Math.max(0, Math.min(maxHp, rawNext)) : rawNext; // 仅 PreAttributeChange 时上溢同样会污染 BaseValue
    setHpBase(nextBase);
    setCombatLog((prev) => [
      `🧪 饮用 +${heal} 生命药水：BaseValue 变为 ${nextBase} → UI 血条显示 ${Math.max(
        0,
        Math.min(maxHp, nextBase)
      )}！`,
      ...prev.slice(0, 5)
    ]);
  };

  const resetHpSim = (newMode?: 'buggy' | 'safe') => {
    if (newMode) setClampMode(newMode);
    setHpBase(100);
    setCombatLog(['状态已重置：Health BaseValue = 100, CurrentValue = 100']);
  };

  // === Sandbox 3: Multiplayer Replication & Prediction Simulator ===
  const [repMode, setRepMode] = useState<'Full' | 'Mixed' | 'Minimal'>('Mixed');
  const [psFreq, setPsFreq] = useState<1 | 100>(100);
  const [rttMs, setRttMs] = useState(110);
  const [serverReject, setServerReject] = useState(false);
  const [predKey, setPredKey] = useState(10);
  const [netTrace, setNetTrace] = useState<string[]>([
    '就绪：点击下方按钮模拟一次 LocalPredicted 技能释放...'
  ]);

  // 演示假设（非实测）：20 人 × 12 个 ActiveGE 的相对带宽量级示意，仅用于对比三种模式的数量级差异
  const estBandwidthKbps =
    repMode === 'Full' ? 420 : repMode === 'Mixed' ? 48 : 14;

  const firePredictedAbility = () => {
    const nextKey = predKey + 1;
    setPredKey(nextKey);
    // 轨道 A：激活结果 RPC（ClientActivateAbilitySucceed / Failed）走 RPC 通道，约 1 个 RTT，不受 NetUpdateFrequency 节流
    const rpcArrive = rttMs;
    // 轨道 B：权威 ActiveGE / 属性 / ReplicatedPredictionKey 经属性复制到达，受复制资格间隔影响（演示假设：1Hz 平均额外等待 ~500ms）
    const repInterval = psFreq === 1 ? 1000 : 10;
    const repArrive = Math.round(rttMs / 2 + repInterval / 2 + rttMs / 2);
    const lines: string[] = [];
    if (serverReject) {
      lines.push(
        `[t≈${rpcArrive}ms · RPC 轨道] ❌ Server 判定眩晕，ClientActivateAbilityFailed(Key #${nextKey}) 到达 → 回滚账本内预测 GE / 30 蓝预扣 / 蒙太奇 / 持续 Cue（已播出的一次性音效与自定义状态需项目自理）`
      );
    } else {
      lines.push(
        `[t≈${repArrive}ms · 复制轨道] 🔁 权威 ActiveGE 与 ReplicatedPredictionKey #${nextKey} 追上 → CatchUpTo 清理临时预测效果${
          psFreq === 1 ? '（受 1Hz 复制资格节流明显滞后!）' : ''
        }`
      );
      lines.push(
        `[t≈${rpcArrive}ms · RPC 轨道] ✅ ClientActivateAbilitySucceed(Key #${nextKey}) 到达：激活获批（RPC 不受 NetUpdateFrequency 影响），预测效果暂时保留`
      );
    }
    lines.push(
      `[t=0ms] ⚡ Client 在同步激活栈内签发 PredictionKey #${nextKey}：立即播放挥剑蒙太奇并挂预测 GE（-30 Mana），同时发出 ServerTryActivateAbility`
    );
    setNetTrace((prev) => [...lines, ...prev.slice(0, 4)]);
  };

  return (
    <div className="alt-view">
      <div className="alt-container">
        <div className="alt-hero">
          <div className="breadcrumb">INTERACTIVE DESIGN LAB · 实时数值与联机沙盒</div>
          <h1>UE5 GAS 运行时交互实验台</h1>
          <p>
            亲手拨动 UE 5.5 聚合器乘区开关、复现著名的负血量截断幽灵 Bug，并对比激活 RPC 与属性复制两条网络时间线（数值为演示假设）。
          </p>
        </div>

        <div className="card-grid">
          {/* Simulator 1: UE 5.5 FAggregator */}
          <div className="panel-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>① UE 5.5 FAggregator 乘区计算器</h3>
              <span className="meta-pill meta-pill--violet">UE 5.5 公式</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 0 }}>
              对比传统 <code>MultiplyAdditive</code>（同池相加）与 5.5 新增{' '}
              <code>MultiplyCompound</code>（独立连乘）的真实算式结果：
            </p>

            <div className="lab-row">
              <span>
                <strong>BaseValue</strong> (基础裸装攻击力)
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="range"
                  className="lab-slider"
                  min={50}
                  max={300}
                  step={10}
                  value={baseAtk}
                  onChange={(e) => setBaseAtk(Number(e.target.value))}
                />
                <strong style={{ minWidth: 36, textAlign: 'right' }}>{baseAtk}</strong>
              </div>
            </div>

            <div className="lab-row">
              <span>
                <strong>AddBase</strong> (武器固定攻击词条)
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="range"
                  className="lab-slider"
                  min={0}
                  max={150}
                  step={10}
                  value={addBase}
                  onChange={(e) => setAddBase(Number(e.target.value))}
                />
                <strong style={{ minWidth: 36, textAlign: 'right' }}>+{addBase}</strong>
              </div>
            </div>

            <div className="lab-row">
              <label style={{ cursor: 'pointer', flex: 1 }}>
                <input
                  type="checkbox"
                  checked={mulAdd1}
                  onChange={(e) => setMulAdd1(e.target.checked)}
                />{' '}
                <strong>MultiplyAdditive #1</strong> (+20% 同池词条 · 填 1.2)
              </label>
              <code>+0.20</code>
            </div>

            <div className="lab-row">
              <label style={{ cursor: 'pointer', flex: 1 }}>
                <input
                  type="checkbox"
                  checked={mulAdd2}
                  onChange={(e) => setMulAdd2(e.target.checked)}
                />{' '}
                <strong>MultiplyAdditive #2</strong> (+20% 同池词条 · 填 1.2)
              </label>
              <code>+0.20</code>
            </div>

            <div className="lab-row">
              <label style={{ cursor: 'pointer', flex: 1 }}>
                <input
                  type="checkbox"
                  checked={mulComp1}
                  onChange={(e) => setMulComp1(e.target.checked)}
                />{' '}
                <strong>MultiplyCompound #1</strong> (UE 5.5 独立乘区 ×1.2)
              </label>
              <code>×1.20</code>
            </div>

            <div className="lab-row">
              <label style={{ cursor: 'pointer', flex: 1 }}>
                <input
                  type="checkbox"
                  checked={mulComp2}
                  onChange={(e) => setMulComp2(e.target.checked)}
                />{' '}
                <strong>MultiplyCompound #2</strong> (UE 5.5 独立乘区 ×1.2)
              </label>
              <code>×1.20</code>
            </div>

            <div className="lab-row">
              <span>
                <strong>AddFinal</strong> (UE 5.5 最终平坦固伤追加)
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="range"
                  className="lab-slider"
                  min={0}
                  max={100}
                  step={5}
                  value={addFinal}
                  onChange={(e) => setAddFinal(Number(e.target.value))}
                />
                <strong style={{ minWidth: 36, textAlign: 'right' }}>+{addFinal}</strong>
              </div>
            </div>

            <div className="lab-row">
              <label style={{ cursor: 'pointer', flex: 1 }}>
                <input
                  type="checkbox"
                  checked={overrideOn}
                  onChange={(e) => setOverrideOn(e.target.checked)}
                />{' '}
                <strong>Override</strong> (覆盖本通道输出 = 999 · 演示仅单通道)
              </label>
              <code>= 999</code>
            </div>

            <div className="code-card" style={{ marginTop: 10, marginBottom: 0 }}>
              <div className="code-card__head">
                <span>FAggregatorModChannel::EvaluateWithBase 演算（单一 Channel0）</span>
                <strong style={{ color: 'var(--status-good)' }}>CurrentValue = {finalAtk}</strong>
              </div>
              <pre>
                {overrideOn
                  ? `Override 生效 → 覆盖 Channel0 的输出为 999（若存在后续 Evaluation Channel，仍会以 999 为基底继续求值）`
                  : `((${baseAtk} + ${addBase}) × ${mulAddPool.toFixed(
                      2
                    )} [同池] × ${mulCompFactor.toFixed(2)} [连乘]) + ${addFinal} = ${finalAtk}`}
              </pre>
            </div>
          </div>

          {/* Simulator 2: Ghost Negative BaseValue Bug */}
          <div className="panel-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>② 负血量幽灵 Bug 亲手复现实验</h3>
              <button className="btn-pop" onClick={() => resetHpSim()}>
                <RotateCcw size={12} /> 满血重置
              </button>
            </div>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 0 }}>
              先点击 <strong>-130 重击</strong>，再点击 <strong>+25 喝药</strong>，对比两种代码写法的天壤之别：
            </p>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <button
                className={`btn-pop ${clampMode === 'buggy' ? 'btn-pop--green' : ''}`}
                style={{ flex: '1 1 210px' }}
                onClick={() => resetHpSim('buggy')}
              >
                <ShieldAlert size={13} /> 仅 PreAttributeChange 截断 (踩坑)
              </button>
              <button
                className={`btn-pop ${clampMode === 'safe' ? 'btn-pop--green' : ''}`}
                style={{ flex: '1 1 210px' }}
                onClick={() => resetHpSim('safe')}
              >
                ✓ 双层 Clamp (Base+Current 正解)
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div className={`chip ${hpBase < 0 || hpBase > maxHp ? 'chip--bad' : 'chip--good'}`}>
                <div className="chip__label">底层真实 Health.BaseValue</div>
                <div className="chip__value">{hpBase} / 100</div>
              </div>
              <div className="chip chip--good">
                <div className="chip__label">UI 表面 Health.CurrentValue</div>
                <div className="chip__value">{displayedCurHp} / 100</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <button className="btn-pop" style={{ flex: 1 }} onClick={() => applyDamage(130)}>
                💥 承受 -130 溢出伤害
              </button>
              <button
                className="btn-pop btn-pop--green"
                style={{ flex: 1 }}
                onClick={() => applyHeal(25)}
              >
                🧪 喝下 +25 治疗药水
              </button>
            </div>

            <div className="code-card" style={{ marginBottom: 0 }}>
              <div className="code-card__head">
                <span>AttributeSet 内部状态追踪日志</span>
              </div>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{combatLog.join('\n')}</pre>
            </div>
          </div>

          {/* Simulator 3: Replication & Client Prediction */}
          <div className="panel-card" style={{ gridColumn: '1 / -1' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 10,
                marginBottom: 8
              }}
            >
              <h3 style={{ margin: 0 }}>③ 多人网络复制模式与 PredictionKey 预测回滚仿真</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <span
                  className={`meta-pill ${
                    repMode === 'Full' ? 'meta-pill--amber' : 'meta-pill--green'
                  }`}
                >
                  20人团战 ActiveGE 带宽示意: ~{estBandwidthKbps} KB/s（演示假设值，非实测）
                </span>
                <span className="meta-pill meta-pill--violet">当前密钥 #{predKey}</span>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                gap: 10,
                marginBottom: 12
              }}
            >
              <div className="lab-row" style={{ marginBottom: 0 }}>
                <span>
                  <strong>ReplicationMode</strong>
                </span>
                <select
                  value={repMode}
                  onChange={(e) => setRepMode(e.target.value as 'Full' | 'Mixed' | 'Minimal')}
                  style={{
                    padding: '4px 8px',
                    borderRadius: 6,
                    border: '1px solid var(--ink)',
                    background: 'var(--card)'
                  }}
                >
                  <option value="Full">Full (单机 / 特需全量检视)</option>
                  <option value="Mixed">Mixed (有拥有连接的玩家)</option>
                  <option value="Minimal">Minimal (多人 AI 标准)</option>
                </select>
              </div>

              <div className="lab-row" style={{ marginBottom: 0 }}>
                <span>
                  <strong>PlayerState 同步率</strong>
                </span>
                <select
                  value={psFreq}
                  onChange={(e) => setPsFreq(Number(e.target.value) as 1 | 100)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: 6,
                    border: '1px solid var(--ink)',
                    background: 'var(--card)'
                  }}
                >
                  <option value={100}>100 Hz (Lyra 示例配置)</option>
                  <option value={1}>1 Hz (引擎默认 · 复制节流)</option>
                </select>
              </div>

              <div className="lab-row" style={{ marginBottom: 0 }}>
                <span>
                  <strong>网络 RTT 延迟: {rttMs}ms</strong>
                </span>
                <input
                  type="range"
                  className="lab-slider"
                  min={20}
                  max={250}
                  step={10}
                  value={rttMs}
                  onChange={(e) => setRttMs(Number(e.target.value))}
                />
              </div>

              <div className="lab-row" style={{ marginBottom: 0 }}>
                <label style={{ cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={serverReject}
                    onChange={(e) => setServerReject(e.target.checked)}
                  />{' '}
                  <strong>模拟服务端眩晕冲突拒绝</strong>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
              <button className="btn-pop btn-pop--green" onClick={firePredictedAbility}>
                <Zap size={14} /> 触发客户端 LocalPredicted 技能施放
              </button>
              <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>
                观察 RPC 确认/拒绝轨道（~RTT）与属性复制追赶轨道（受 NetUpdateFrequency 影响）的时序差异 · 时间为演示估算
              </span>
            </div>

            <div className="code-card" style={{ marginBottom: 0 }}>
              <div className="code-card__head">
                <span>跨端预测数据包时序追踪 (最新在最前)</span>
              </div>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{netTrace.join('\n')}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
