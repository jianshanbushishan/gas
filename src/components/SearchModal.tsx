import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { FLAT_LESSONS, GLOSSARY_CONCEPTS } from '../data';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLessonStep: (lessonSlug: string, stepIndex: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectLessonStep
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [isOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        concepts: GLOSSARY_CONCEPTS.slice(0, 8),
        steps: FLAT_LESSONS.slice(0, 6).map((item) => ({
          lessonSlug: item.lesson.slug,
          lessonTitle: item.lesson.title,
          moduleTitle: item.module.title,
          stepIndex: 1,
          stepTitle: item.lesson.summary,
          phase: 'LESSON'
        }))
      };
    }

    const concepts = GLOSSARY_CONCEPTS.filter(
      (c) =>
        c.term.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    ).slice(0, 8);

    const steps: Array<{
      lessonSlug: string;
      lessonTitle: string;
      moduleTitle: string;
      stepIndex: number;
      stepTitle: string;
      phase: string;
    }> = [];

    for (const entry of FLAT_LESSONS) {
      entry.lesson.steps.forEach((st, idx) => {
        const hay = `${entry.lesson.title} ${entry.lesson.titleEn} ${st.title} ${st.paragraphs.join(
          ' '
        )} ${st.codeSnippet?.code || ''}`.toLowerCase();
        if (hay.includes(q)) {
          steps.push({
            lessonSlug: entry.lesson.slug,
            lessonTitle: entry.lesson.title,
            moduleTitle: entry.module.title,
            stepIndex: idx + 1,
            stepTitle: st.title,
            phase: st.phase
          });
        }
      });
      if (steps.length >= 12) break;
    }

    return { concepts, steps: steps.slice(0, 12) };
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal__input-row">
          <Search size={17} style={{ color: 'var(--muted)' }} />
          <input
            ref={inputRef}
            className="search-modal__input"
            placeholder="搜索 GAS 概念、C++ 类名、易错坑点 (如 Mixed, Clamp, ExecCalc, UE 5.5)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
            }}
          />
          <span className="kbd">ESC</span>
        </div>

        <div className="search-modal__results">
          {results.concepts.length > 0 && (
            <>
              <div className="search-group-title">核心概念与源码类 (Concepts)</div>
              {results.concepts.map((c, idx) => (
                <button
                  key={idx}
                  className="search-hit"
                  onClick={() => {
                    onSelectLessonStep(c.lessonSlug, c.stepIndex);
                    onClose();
                  }}
                >
                  <div>
                    <div className="search-hit__title">
                      {c.term}{' '}
                      <span
                        style={{
                          fontSize: 10,
                          padding: '1px 6px',
                          borderRadius: 99,
                          background: 'var(--violet)',
                          color: 'var(--violet-ink)',
                          marginLeft: 6
                        }}
                      >
                        {c.category}
                      </span>
                    </div>
                    <div className="search-hit__sub">{c.summary}</div>
                  </div>
                  <ArrowRight size={14} style={{ flexShrink: 0, color: 'var(--muted)' }} />
                </button>
              ))}
            </>
          )}

          {results.steps.length > 0 && (
            <>
              <div className="search-group-title" style={{ marginTop: 8 }}>
                匹配的图解步骤 (Lessons & Steps)
              </div>
              {results.steps.map((s, idx) => (
                <button
                  key={idx}
                  className="search-hit"
                  onClick={() => {
                    onSelectLessonStep(s.lessonSlug, s.stepIndex);
                    onClose();
                  }}
                >
                  <div>
                    <div className="search-hit__title">
                      {s.stepTitle}
                    </div>
                    <div className="search-hit__sub">
                      {s.moduleTitle} · {s.lessonTitle} · Step {s.stepIndex}
                    </div>
                  </div>
                  <ArrowRight size={14} style={{ flexShrink: 0, color: 'var(--muted)' }} />
                </button>
              ))}
            </>
          )}

          {results.concepts.length === 0 && results.steps.length === 0 && (
            <div style={{ padding: '24px 12px', textAlign: 'center', color: 'var(--muted)' }}>
              未找到与 “{query}” 相关的章节，试试搜索 <code>ASC</code>、<code>Clamp</code>、
              <code>Mixed</code> 或 <code>PredictionKey</code>。
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
