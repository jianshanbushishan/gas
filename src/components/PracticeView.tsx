import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowUpRight, RotateCcw } from 'lucide-react';
import { PRACTICE_QUESTIONS } from '../data';

interface PracticeViewProps {
  solvedIds: string[];
  onMarkSolved: (qId: string) => void;
  onResetSolved: () => void;
  onJumpToLesson: (slug: string) => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  solvedIds,
  onMarkSolved,
  onResetSolved,
  onJumpToLesson
}) => {
  const [selectedChoice, setSelectedChoice] = useState<Record<string, string>>({});
  const [filterDiff, setFilterDiff] = useState<'全部' | '入门' | '进阶' | '高阶'>('全部');

  const filtered = PRACTICE_QUESTIONS.filter(
    (q) => filterDiff === '全部' || q.difficulty === filterDiff
  );

  return (
    <div className="alt-view">
      <div className="alt-container">
        <div
          className="alt-hero"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: 14
          }}
        >
          <div>
            <div className="breadcrumb">DIAGNOSTIC WORKBENCH · 生产环境排错实战</div>
            <h1>UE5 GAS 线上疑难 Bug 实战诊断</h1>
            <p>
              全部取材自真实多人项目的典型踩坑现场（UE 5.8 & Lyra 标准）。选出根因并查看引擎源码级解析。
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span className="meta-pill meta-pill--green">
              已攻克 {solvedIds.length} / {PRACTICE_QUESTIONS.length}
            </span>
            {(['全部', '入门', '进阶', '高阶'] as const).map((d) => (
              <button
                key={d}
                className={`btn-pop ${filterDiff === d ? 'btn-pop--green' : ''}`}
                onClick={() => setFilterDiff(d)}
              >
                {d}
              </button>
            ))}
            {solvedIds.length > 0 && (
              <button
                className="btn-pop"
                onClick={() => {
                  setSelectedChoice({});
                  onResetSolved();
                }}
              >
                <RotateCcw size={13} /> 重置记录
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map((q) => {
            const pickedId = selectedChoice[q.id];
            const pickedOpt = q.options.find((o) => o.id === pickedId);

            return (
              <div key={q.id} className="panel-card">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                    gap: 8,
                    flexWrap: 'wrap'
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)' }}>
                    {q.moduleTag}
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span className="meta-pill meta-pill--amber">{q.difficulty}</span>
                    {solvedIds.includes(q.id) && (
                      <span className="meta-pill meta-pill--green">✓ 已诊断正确</span>
                    )}
                  </div>
                </div>

                <h3 style={{ fontSize: 16.5, marginBottom: 8 }}>{q.title}</h3>
                <p style={{ margin: '0 0 12px', lineHeight: 1.65, color: 'var(--ink-2)' }}>
                  {q.scenario}
                </p>

                {q.codeContext && (
                  <div className="code-card" style={{ marginBottom: 12 }}>
                    <div className="code-card__head">
                      <span>问题代码上下文 (C++)</span>
                    </div>
                    <pre>{q.codeContext}</pre>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {q.options.map((opt) => {
                    const isPicked = pickedId === opt.id;
                    let borderColor = 'var(--line-strong)';
                    let bg = 'var(--chip-bg)';
                    if (isPicked) {
                      borderColor = opt.isCorrect ? 'var(--status-good)' : 'var(--status-bad)';
                      bg = opt.isCorrect ? 'var(--green-tile)' : 'var(--red-tile)';
                    }
                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setSelectedChoice((prev) => ({ ...prev, [q.id]: opt.id }));
                          if (opt.isCorrect) onMarkSolved(q.id);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 10,
                          padding: '10px 12px',
                          borderRadius: 9,
                          border: `1.5px solid ${borderColor}`,
                          background: bg,
                          textAlign: 'left',
                          cursor: 'pointer',
                          lineHeight: 1.5
                        }}
                      >
                        <span
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            border: '1.4px solid var(--ink)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: 11,
                            flexShrink: 0,
                            background: isPicked ? 'var(--card)' : 'transparent'
                          }}
                        >
                          {opt.id.toUpperCase()}
                        </span>
                        <span style={{ flex: 1, fontWeight: isPicked ? 700 : 500 }}>
                          {opt.text}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {pickedOpt && (
                  <div
                    className={`callout ${pickedOpt.isCorrect ? 'callout--tip' : 'callout--warn'}`}
                    style={{ marginTop: 12, marginBottom: 0 }}
                  >
                    <div className="callout__icon">
                      {pickedOpt.isCorrect ? (
                        <CheckCircle2 size={16} color="#3d9942" />
                      ) : (
                        <XCircle size={16} color="#d9443b" />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="callout__label">
                        {pickedOpt.isCorrect ? '诊断正确 · 源码机理解析' : '再想一想 · 排除原因'}
                      </div>
                      <div style={{ marginBottom: 8 }}>{pickedOpt.explanation}</div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: 8,
                          paddingTop: 6,
                          borderTop: '1px dashed var(--line-strong)'
                        }}
                      >
                        <span style={{ fontWeight: 700, fontSize: 11.5 }}>
                          💡 核心铁律：{q.takeaway}
                        </span>
                        <button
                          className="btn-pop"
                          onClick={() => onJumpToLesson(q.relatedLessonSlug)}
                        >
                          查看对应图解章节 <ArrowUpRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
