import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Compass,
  FlaskConical,
  FileSpreadsheet,
  Search,
  Moon,
  Sun,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  FileText,
  Check,
  Clock,
  BarChart2,
  ListOrdered,
  Lightbulb,
  AlertTriangle,
  Sparkles,
  Cpu,
  ArrowLeft,
  ArrowRight,
  Menu,
  Copy
} from 'lucide-react';
import { COURSE_MODULES, FLAT_LESSONS } from './data';
import { IsoStage } from './components/IsoStage';
import { RichText } from './components/RichText';
import { SearchModal } from './components/SearchModal';
import { PracticeView } from './components/PracticeView';
import { DesignLabView } from './components/DesignLabView';
import { CheatsheetsView } from './components/CheatsheetsView';
import { StepPhase } from './types/course';

type NavMode = 'learn' | 'practice' | 'lab' | 'cheatsheets';

const PHASE_LABELS: Record<StepPhase, { zh: string; en: string }> = {
  PROBLEM: { zh: 'PROBLEM · 痛点', en: 'PROBLEM' },
  ARCHITECTURE: { zh: 'ARCH · 架构', en: 'ARCHITECTURE' },
  TECHNIQUE: { zh: 'TECHNIQUE · 机制', en: 'TECHNIQUE' },
  PITFALL: { zh: 'PITFALL · 避坑', en: 'WATCH OUT' },
  UE5_NEW: { zh: 'UE 5.8 新规', en: 'UE 5.8' },
  SOLUTION: { zh: 'SOLUTION · 正解', en: 'SOLUTION' },
  RECAP: { zh: 'RECAP · 总结', en: 'RECAP' }
};

function parseHash(): { mode: NavMode; slug: string; step: number } {
  const raw = window.location.hash.replace(/^#\/?/, '');
  if (raw === 'practice') return { mode: 'practice', slug: FLAT_LESSONS[0].lesson.slug, step: 1 };
  if (raw === 'lab') return { mode: 'lab', slug: FLAT_LESSONS[0].lesson.slug, step: 1 };
  if (raw === 'cheatsheets')
    return { mode: 'cheatsheets', slug: FLAT_LESSONS[0].lesson.slug, step: 1 };

  const [slugPart, stepPart] = raw.split('/');
  const found = FLAT_LESSONS.find((e) => e.lesson.slug === slugPart) || FLAT_LESSONS[0];
  const parsedStep = Math.max(
    1,
    Math.min(found.lesson.steps.length, parseInt(stepPart || '1', 10) || 1)
  );
  return { mode: 'learn', slug: found.lesson.slug, step: parsedStep };
}

export const App: React.FC = () => {
  const initial = useMemo(() => parseHash(), []);
  const [mode, setMode] = useState<NavMode>(initial.mode);
  const [lessonSlug, setLessonSlug] = useState<string>(initial.slug);
  const [stepNum, setStepNum] = useState<number>(initial.step); // 1-based

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('gas_theme') as 'light' | 'dark') || 'light';
  });
  const [lang, setLang] = useState<'zh' | 'en'>(() => {
    return (localStorage.getItem('gas_lang') as 'zh' | 'en') || 'zh';
  });

  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('gas_completed_lessons') || '[]');
    } catch {
      return [];
    }
  });

  const [solvedPractice, setSolvedPractice] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('gas_solved_practice') || '[]');
    } catch {
      return [];
    }
  });

  const [openModuleId, setOpenModuleId] = useState<string>(() => {
    const found = FLAT_LESSONS.find((e) => e.lesson.slug === initial.slug);
    return found ? found.module.id : COURSE_MODULES[0].id;
  });

  const [progressDrawerOpen, setProgressDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [replayNonce, setReplayNonce] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  // Sync theme attribute on <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gas_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('gas_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('gas_completed_lessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem('gas_solved_practice', JSON.stringify(solvedPractice));
  }, [solvedPractice]);

  // Listen to browser hashchange
  useEffect(() => {
    const onHash = () => {
      const next = parseHash();
      setMode(next.mode);
      setLessonSlug(next.slug);
      setStepNum(next.step);
      const entry = FLAT_LESSONS.find((e) => e.lesson.slug === next.slug);
      if (entry) setOpenModuleId(entry.module.id);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigateToLessonStep = useCallback((slug: string, step = 1) => {
    window.location.hash = `#/${slug}/${step}`;
    setMode('learn');
    setLessonSlug(slug);
    setStepNum(step);
    const entry = FLAT_LESSONS.find((e) => e.lesson.slug === slug);
    if (entry) setOpenModuleId(entry.module.id);
    setMobileMenuOpen(false);
  }, []);

  const switchMode = (nextMode: NavMode) => {
    setMode(nextMode);
    if (nextMode === 'learn') {
      window.location.hash = `#/${lessonSlug}/${stepNum}`;
    } else {
      window.location.hash = `#/${nextMode}`;
    }
    setMobileMenuOpen(false);
  };

  const currentEntry = useMemo(() => {
    return FLAT_LESSONS.find((e) => e.lesson.slug === lessonSlug) || FLAT_LESSONS[0];
  }, [lessonSlug]);

  const { module: curModule, lesson: curLesson, lessonIndexInModule, globalIndex } = currentEntry;
  const safeStepIdx = Math.min(curLesson.steps.length - 1, Math.max(0, stepNum - 1));
  const curStep = curLesson.steps[safeStepIdx];
  const nextLessonEntry = FLAT_LESSONS[globalIndex + 1];
  const prevLessonEntry = FLAT_LESSONS[globalIndex - 1];

  // Reaching final step marks lesson completed
  useEffect(() => {
    if (mode === 'learn' && safeStepIdx === curLesson.steps.length - 1) {
      setCompletedLessons((prev) =>
        prev.includes(curLesson.slug) ? prev : [...prev, curLesson.slug]
      );
    }
  }, [mode, safeStepIdx, curLesson.steps.length, curLesson.slug]);

  const goNext = useCallback(() => {
    if (safeStepIdx < curLesson.steps.length - 1) {
      navigateToLessonStep(curLesson.slug, safeStepIdx + 2);
    } else if (nextLessonEntry) {
      navigateToLessonStep(nextLessonEntry.lesson.slug, 1);
    } else {
      switchMode('practice');
    }
  }, [safeStepIdx, curLesson, nextLessonEntry, navigateToLessonStep]);

  const goBack = useCallback(() => {
    if (safeStepIdx > 0) {
      navigateToLessonStep(curLesson.slug, safeStepIdx);
    } else if (prevLessonEntry) {
      navigateToLessonStep(
        prevLessonEntry.lesson.slug,
        prevLessonEntry.lesson.steps.length
      );
    }
  }, [safeStepIdx, curLesson.slug, prevLessonEntry, navigateToLessonStep]);

  // Global keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((o) => !o);
        return;
      }
      if (searchOpen) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (mode === 'learn') {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          goNext();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goBack();
        } else if (e.key === ' ') {
          e.preventDefault();
          setIsPaused((p) => !p);
        } else if (e.key.toLowerCase() === 'r') {
          e.preventDefault();
          setIsPaused(false);
          setReplayNonce((n) => n + 1);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mode, searchOpen, goNext, goBack]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1200);
  };

  return (
    <div className="window">
      {/* Topbar */}
      <header className="topbar">
        <div className="topbar__left">
          <button
            className="icon-btn mobile-menu-btn"
            onClick={() => setMobileMenuOpen((m) => !m)}
            aria-label="打开课程目录"
          >
            <Menu size={16} />
          </button>

          <button
            className="brand"
            onClick={() => navigateToLessonStep(FLAT_LESSONS[0].lesson.slug, 1)}
          >
            {/* Isometric Node-Cube Brand Icon */}
            <svg width="24" height="24" viewBox="0 0 26 26" fill="none">
              <polygon
                points="13,2 23,7.5 13,13 3,7.5"
                fill="var(--green)"
                stroke="var(--ink)"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <polygon
                points="3,7.5 13,13 13,23 3,17.5"
                fill="var(--amber)"
                stroke="var(--ink)"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <polygon
                points="23,7.5 13,13 13,23 23,17.5"
                fill="var(--blue)"
                stroke="var(--ink)"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
            <span className="brand__title">
              UE5 <span className="brand__hl">GAS</span>
            </span>
            <span className="brand__ver">5.8</span>
          </button>

          <nav className="nav">
            <button
              className={`nav__item ${mode === 'learn' ? 'is-active' : ''}`}
              onClick={() => switchMode('learn')}
            >
              <BookOpen size={14} />
              {lang === 'zh' ? '课程图解' : 'Learn'}
            </button>
            <button
              className={`nav__item ${mode === 'practice' ? 'is-active' : ''}`}
              onClick={() => switchMode('practice')}
            >
              <Compass size={14} />
              {lang === 'zh' ? '实战诊断' : 'Practice'}
            </button>
            <button
              className={`nav__item ${mode === 'lab' ? 'is-active' : ''}`}
              onClick={() => switchMode('lab')}
            >
              <FlaskConical size={14} />
              {lang === 'zh' ? '架构沙盒' : 'Design Lab'}
            </button>
            <button
              className={`nav__item ${mode === 'cheatsheets' ? 'is-active' : ''}`}
              onClick={() => switchMode('cheatsheets')}
            >
              <FileSpreadsheet size={14} />
              {lang === 'zh' ? '速查手册' : 'Cheatsheets'}
            </button>
          </nav>
        </div>

        <div className="topbar__right">
          <button className="search-trigger" onClick={() => setSearchOpen(true)}>
            <span className="search-trigger__left">
              <Search size={14} />
              <span>{lang === 'zh' ? '搜索 GAS 概念与 C++ 类...' : 'Search GAS concepts...'}</span>
            </span>
            <span className="kbd">Ctrl K</span>
          </button>

          <button
            className="icon-btn"
            onClick={() => setLang((l) => (l === 'zh' ? 'en' : 'zh'))}
            title="切换界面语言 / Switch UI Labels"
          >
            {lang === 'zh' ? '简' : 'EN'}
          </button>

          <button
            className="icon-btn"
            onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
            title="切换浅色纸感 / 深色浓咖主题"
          >
            {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
          </button>

          <div className="engine-badge" title="知识严格对齐 UE 5.8 源码与 Lyra Starter Game">
            <span>Engine</span>
            <strong>Lyra · UE 5.8</strong>
          </div>
        </div>
      </header>

      {/* Main Content Switch */}
      {mode === 'practice' && (
        <PracticeView
          solvedIds={solvedPractice}
          onMarkSolved={(qId) =>
            setSolvedPractice((prev) => (prev.includes(qId) ? prev : [...prev, qId]))
          }
          onResetSolved={() => setSolvedPractice([])}
          onJumpToLesson={(slug) => navigateToLessonStep(slug, 1)}
        />
      )}

      {mode === 'lab' && <DesignLabView />}

      {mode === 'cheatsheets' && <CheatsheetsView />}

      {mode === 'learn' && (
        <div className="body">
          {/* Left Curriculum Sidebar */}
          <aside className={`sidebar ${mobileMenuOpen ? 'is-mobile-open' : ''}`}>
            <div className="sidebar__header">
              <span className="sidebar__heading">
                <span className="folder-dot folder--sand" style={{ background: 'var(--ink)' }} />
                {lang === 'zh' ? '体系课程' : 'Course'}
              </span>
              <span className="sidebar__count">
                {FLAT_LESSONS.length} {lang === 'zh' ? '节核心课' : 'lessons'}
              </span>
            </div>

            <div className="sidebar__tree">
              {COURSE_MODULES.map((mod) => {
                const isOpen = openModuleId === mod.id;
                const doneInMod = mod.lessons.filter((l) =>
                  completedLessons.includes(l.slug)
                ).length;

                return (
                  <div key={mod.id} className="module-group">
                    <button
                      className="module-btn"
                      onClick={() => setOpenModuleId(isOpen ? '' : mod.id)}
                    >
                      <span className="module-btn__left">
                        {isOpen ? (
                          <ChevronDown size={13} style={{ flexShrink: 0, color: 'var(--muted)' }} />
                        ) : (
                          <ChevronRight size={13} style={{ flexShrink: 0, color: 'var(--muted)' }} />
                        )}
                        <span className={`folder-dot folder--${mod.folderColor}`} />
                        <span className="module-btn__title">
                          {lang === 'zh' ? mod.title : mod.titleEn}
                        </span>
                      </span>
                      <span className="module-btn__count">
                        {doneInMod}/{mod.lessons.length}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="lesson-list">
                        {mod.lessons.map((les) => {
                          const isActive = les.slug === curLesson.slug;
                          const isDone = completedLessons.includes(les.slug);
                          return (
                            <button
                              key={les.slug}
                              className={`lesson-item ${isActive ? 'is-active' : ''}`}
                              onClick={() => navigateToLessonStep(les.slug, 1)}
                            >
                              {isDone ? (
                                <Check
                                  size={13}
                                  style={{
                                    flexShrink: 0,
                                    color: isActive ? 'var(--green-ink)' : 'var(--status-good)'
                                  }}
                                />
                              ) : (
                                <FileText size={13} style={{ flexShrink: 0, opacity: 0.7 }} />
                              )}
                              <span className="lesson-item__title">
                                {lang === 'zh' ? les.title : les.titleEn}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Progress Drawer */}
            <div className="progress-box">
              <button
                className="progress-box__btn"
                onClick={() => setProgressDrawerOpen((p) => !p)}
              >
                <span>{lang === 'zh' ? 'PROGRESS · 学习进度' : 'PROGRESS'}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {completedLessons.length} / {FLAT_LESSONS.length}
                  {progressDrawerOpen ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
                </span>
              </button>
              <div className="progress-bar">
                <div
                  className="progress-bar__fill"
                  style={{
                    width: `${Math.round(
                      (completedLessons.length / FLAT_LESSONS.length) * 100
                    )}%`
                  }}
                />
              </div>

              {progressDrawerOpen && (
                <div className="progress-drawer">
                  {COURSE_MODULES.map((m) => {
                    const cnt = m.lessons.filter((l) => completedLessons.includes(l.slug)).length;
                    const allDone = cnt === m.lessons.length;
                    return (
                      <div key={m.id} className="progress-row">
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <span
                            className="goal-check"
                            style={{
                              width: 13,
                              height: 13,
                              background: allDone ? 'var(--green-3)' : 'var(--chip-bg)'
                            }}
                          >
                            {allDone && <Check size={10} color="#11220d" />}
                          </span>
                          {lang === 'zh' ? m.title : m.titleEn}
                        </span>
                        <span style={{ color: 'var(--muted)', fontWeight: 700 }}>
                          {cnt}/{m.lessons.length}
                        </span>
                      </div>
                    );
                  })}
                  {completedLessons.length > 0 && (
                    <button
                      className="btn-pop"
                      style={{ width: '100%', marginTop: 8, height: 27, fontSize: 11 }}
                      onClick={() => setCompletedLessons([])}
                    >
                      清空完成标记
                    </button>
                  )}
                </div>
              )}
            </div>
          </aside>

          {/* Center Interactive Stage Column */}
          <main className="center-main">
            <div className="lesson-head">
              <div className="breadcrumb">
                {lang === 'zh' ? curModule.title : curModule.titleEn} &nbsp;/&nbsp;{' '}
                {lang === 'zh'
                  ? `第 ${lessonIndexInModule + 1} 节（共 ${curModule.lessons.length} 节）`
                  : `Lesson ${lessonIndexInModule + 1} of ${curModule.lessons.length}`}
              </div>

              <div className="lesson-title-row">
                <h1 className="lesson-title">
                  {lang === 'zh' ? curLesson.title : curLesson.titleEn}
                </h1>

                <div className="meta-pills">
                  <span className="meta-pill meta-pill--amber">
                    <Clock size={12} /> {curLesson.durationMin} min
                  </span>
                  <span className="meta-pill meta-pill--green">
                    <BarChart2 size={12} /> {curLesson.difficulty}
                  </span>
                  <span className="meta-pill meta-pill--violet">
                    <ListOrdered size={12} /> {curLesson.steps.length} steps
                  </span>
                </div>
              </div>

              <p className="lesson-summary">{curLesson.summary}</p>
            </div>

            <IsoStage
              lessonSlug={curLesson.slug}
              stepId={curStep.id}
              hud={curStep.hud}
              scene={curStep.scene}
              theme={theme}
              isPaused={isPaused}
              onTogglePause={() => setIsPaused((p) => !p)}
              replayNonce={replayNonce}
              onReplay={() => {
                setIsPaused(false);
                setReplayNonce((n) => n + 1);
              }}
              lang={lang}
            />

            {/* Bottom Stepper Track */}
            <div className="timeline">
              <div className="timeline__head">
                <span>{lang === 'zh' ? 'IN THIS LESSON · 本节步骤' : 'IN THIS LESSON'}</span>
                <span>
                  Step {safeStepIdx + 1} of {curLesson.steps.length}
                </span>
              </div>
              <div
                className="timeline__track"
                style={{ '--n': curLesson.steps.length } as React.CSSProperties}
              >
                {curLesson.steps.map((st, idx) => {
                  const isCurrent = idx === safeStepIdx;
                  const isDone = idx < safeStepIdx;
                  return (
                    <button
                      key={st.id}
                      className={`step-node ${isCurrent ? 'is-current' : ''} ${
                        isDone ? 'is-done' : ''
                      }`}
                      onClick={() => navigateToLessonStep(curLesson.slug, idx + 1)}
                    >
                      <span className="step-node__circle">{idx + 1}</span>
                      <span className="step-node__label">{st.shortLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </main>

          {/* Right Narrative Rail */}
          <aside className="rail">
            <div className="guide">
              <div className="guide__meta">
                <span className="guide__step">
                  STEP {safeStepIdx + 1} / {curLesson.steps.length}
                </span>
                <span className={`phase-pill phase--${curStep.phase}`}>
                  {lang === 'zh'
                    ? PHASE_LABELS[curStep.phase].zh
                    : PHASE_LABELS[curStep.phase].en}
                </span>
              </div>

              <h2 className="guide__title">{curStep.title}</h2>

              <div className="guide__body">
                {curStep.paragraphs.map((p, idx) => (
                  <p key={idx}>
                    <RichText text={p} />
                  </p>
                ))}
              </div>

              {curStep.codeSnippet && (
                <div className="code-card">
                  <div className="code-card__head">
                    <span>{curStep.codeSnippet.title}</span>
                    <button
                      onClick={() => handleCopyCode(curStep.codeSnippet!.code)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: 'var(--ink)'
                      }}
                    >
                      <Copy size={11} /> {copiedCode ? '已复制' : '复制'}
                    </button>
                  </div>
                  <pre>{curStep.codeSnippet.code}</pre>
                </div>
              )}

              {curStep.callout && (
                <div className={`callout callout--${curStep.callout.kind}`}>
                  <div className="callout__icon">
                    {curStep.callout.kind === 'warn' ? (
                      <AlertTriangle size={14} color="#d9443b" />
                    ) : curStep.callout.kind === 'tip' ? (
                      <Lightbulb size={14} color="#3d9942" />
                    ) : curStep.callout.kind === 'ue5' ? (
                      <Cpu size={14} color="#764abc" />
                    ) : (
                      <Sparkles size={14} color="#764abc" />
                    )}
                  </div>
                  <div>
                    <div className="callout__label">
                      {curStep.callout.label ||
                        (curStep.callout.kind === 'warn'
                          ? 'WATCH OUT · 避坑指南'
                          : curStep.callout.kind === 'tip'
                          ? 'GOOD TO KNOW · 最佳实践'
                          : 'KEY IDEA · 核心机制')}
                    </div>
                    <div>
                      <RichText text={curStep.callout.text} />
                    </div>
                  </div>
                </div>
              )}

              {curStep.changes && curStep.changes.length > 0 && (
                <div className="changes">
                  <div className="changes__title">
                    {lang === 'zh' ? 'WHAT CHANGED · 本步架构变化' : 'WHAT CHANGED'}
                  </div>
                  {curStep.changes.map((chg, idx) => (
                    <div key={idx} className="change-item">
                      <span className={`change-op change-op--${chg.op}`}>
                        {chg.op === 'add' ? '+' : chg.op === 'mod' ? '~' : '−'}
                      </span>
                      <span>
                        <RichText text={chg.text} />
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="guide__nav">
                <button
                  className="btn-pop guide__back"
                  disabled={safeStepIdx === 0 && !prevLessonEntry}
                  onClick={goBack}
                >
                  <ArrowLeft size={14} /> {lang === 'zh' ? '上一步' : 'Back'}
                </button>

                <button className="btn-pop btn-pop--green guide__next" onClick={goNext}>
                  <span
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {safeStepIdx < curLesson.steps.length - 1
                      ? `${lang === 'zh' ? '下一步' : 'Next'}: ${
                          curLesson.steps[safeStepIdx + 1].shortLabel
                        }`
                      : nextLessonEntry
                      ? `${lang === 'zh' ? '下一节' : 'Next Lesson'}: ${
                          nextLessonEntry.lesson.title.split('：')[0]
                        }`
                      : lang === 'zh'
                      ? '进入实战诊断测验'
                      : 'Go to Practice'}
                  </span>
                  <ArrowRight size={14} style={{ flexShrink: 0 }} />
                </button>
              </div>

              <div className="kbd-hints">
                <span className="kbd">←</span>
                <span className="kbd">→</span> 步骤 &nbsp;·&nbsp;
                <span className="kbd">V</span> 原理图 &nbsp;·&nbsp;
                <span className="kbd">R</span> 重播 &nbsp;·&nbsp;
                <span className="kbd">Space</span> 暂停
              </div>
            </div>

            {/* YOU'LL LEARN Progressive Checklist */}
            <div className="goals">
              <div className="goals__title">
                {lang === 'zh' ? "YOU'LL LEARN · 本节你将掌握" : "YOU'LL LEARN"}
              </div>
              {curLesson.goals.map((g) => {
                const isDone =
                  safeStepIdx + 1 >= g.unlockAtStep ||
                  completedLessons.includes(curLesson.slug);
                return (
                  <div key={g.id} className={`goal-row ${isDone ? 'is-done' : ''}`}>
                    <span className="goal-check">
                      {isDone && <Check size={11} strokeWidth={3} />}
                    </span>
                    <span>{g.text}</span>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      )}

      {/* Command-Palette Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectLessonStep={(slug, step) => navigateToLessonStep(slug, step)}
      />
    </div>
  );
};
