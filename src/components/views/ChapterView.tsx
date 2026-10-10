import React, { useState } from 'react';
import { CHAPTERS_DATA, ChapterData } from '../../data/curriculum';
import { PROBLEMS_DATA, Problem } from '../../data/problems';
import { WidgetRenderer } from '../widgets/WidgetRenderer';
import { LatexFormula } from '../common/LatexFormula';
import { ArrowLeft, ArrowRight, BookOpen, ChevronRight, HelpCircle, ExternalLink } from 'lucide-react';

interface ChapterViewProps {
  currentChapterId: string;
  onSelectChapter: (id: string) => void;
}

export const ChapterView: React.FC<ChapterViewProps> = ({
  currentChapterId,
  onSelectChapter,
}) => {
  const currentChapter =
    CHAPTERS_DATA.find((c) => c.id === currentChapterId) || CHAPTERS_DATA[0];

  const currentIndex = CHAPTERS_DATA.findIndex((c) => c.id === currentChapter.id);
  const prevChapter = currentIndex > 0 ? CHAPTERS_DATA[currentIndex - 1] : null;
  const nextChapter =
    currentIndex < CHAPTERS_DATA.length - 1 ? CHAPTERS_DATA[currentIndex + 1] : null;

  // Filter problems for this chapter
  const chapterProblems = PROBLEMS_DATA.filter((p) =>
    currentChapter.recommendedProblems.includes(p.id)
  );

  const [expandedProblemId, setExpandedProblemId] = useState<string | null>(null);

  const toolColorMap = {
    拆: 'text-sky-400 border-sky-800 bg-sky-950/40',
    守恒: 'text-emerald-400 border-emerald-800 bg-emerald-950/40',
    对称: 'text-amber-400 border-amber-800 bg-amber-950/40',
    倒放: 'text-purple-400 border-purple-800 bg-purple-950/40',
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* 2-Column Layout: Chapter Nav Sidebar on Desktop + Content Main Zone */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Drawer / Nav Index */}
        <aside className="lg:col-span-3">
          <div className="sticky top-20 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-400">
              <BookOpen className="h-4 w-4 text-emerald-400" />
              <span>章节全景图 (12 讲)</span>
            </div>

            <nav className="space-y-1 text-xs">
              {CHAPTERS_DATA.map((ch) => {
                const isActive = ch.id === currentChapter.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => onSelectChapter(ch.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-all ${
                      isActive
                        ? 'border border-emerald-500/40 bg-emerald-950/60 text-emerald-300 font-semibold'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <span className="truncate">
                      {ch.number === 'preface' ? '序章' : `第 ${ch.number} 章`}: {ch.title.split('：')[1] || ch.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans ml-1 shrink-0">
                      {ch.tier}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Right Main Editorial Content */}
        <main className="lg:col-span-9 space-y-8">
          {/* Chapter Header */}
          <section className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span>{currentChapter.tier}</span>
              <span aria-hidden="true">·</span>
              <span>
                {currentChapter.number === 'preface' ? '引导篇' : `第 ${currentChapter.number} 讲`}
              </span>
              <span aria-hidden="true">·</span>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">上帝工具:</span>
                {currentChapter.toolUsed.map((tool) => (
                  <span
                    key={tool}
                    className={`rounded border px-1.5 py-0.5 text-[10px] font-bold ${toolColorMap[tool]}`}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <h1 className="mt-3 text-2xl font-black text-white sm:text-3xl tracking-tight">
              {currentChapter.title}
            </h1>
            <p className="mt-2 text-sm text-slate-300 font-medium">
              {currentChapter.subtitle}
            </p>

            <p className="mt-4 text-xs leading-relaxed text-slate-400">
              {currentChapter.summary}
            </p>

            {/* Key Formula Spotlight */}
            <div className="mt-6 rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-4">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                本章降维核武器公式
              </span>
              <div className="mt-1">
                <LatexFormula math={currentChapter.keyFormulaLatex} block />
              </div>
            </div>
          </section>

          {/* Interactive Simulation Stage */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                互动实验台 (Interactive Sandbox)
              </span>
              <span className="text-[11px] text-slate-400">
                可调参数 · 支持种子复现 · 实时对比理论闭式
              </span>
            </div>
            <WidgetRenderer widgetName={currentChapter.primaryWidget} />
          </section>

          {/* Detailed Editorial Sections */}
          <section className="space-y-6">
            {currentChapter.sections.map((sec, idx) => (
              <article
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 transition-colors hover:border-slate-700"
              >
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-emerald-400 font-mono text-sm">{idx + 1}.</span>
                  {sec.heading}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {sec.content}
                </p>
                {sec.latexFormula && (
                  <div className="mt-4 rounded-md border border-slate-800 bg-slate-950/80 p-3">
                    <LatexFormula math={sec.latexFormula} block />
                  </div>
                )}
              </article>
            ))}
          </section>

          {/* Recommended Problem List */}
          {chapterProblems.length > 0 && (
            <section className="rounded-xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">本章经典题单与解题透镜</h3>
                  <p className="text-xs text-slate-400">
                    实战落地：不转载原题面，只提炼降维突破口与核心洞察
                  </p>
                </div>
                <span className="font-mono text-xs text-slate-400">
                  共 {chapterProblems.length} 题
                </span>
              </div>

              <div className="space-y-3">
                {chapterProblems.map((prob) => {
                  const isExpanded = expandedProblemId === prob.id;
                  return (
                    <div
                      key={prob.id}
                      className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">
                            {prob.title}
                          </span>
                          {prob.problemId && (
                            <span className="text-[11px] font-mono text-slate-400">
                              ({prob.platform} {prob.problemId})
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400">
                            · {prob.difficulty}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {prob.link && (
                            <a
                              href={prob.link}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-[11px] text-emerald-400 hover:underline"
                            >
                              <span>原题链接</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                          <button
                            onClick={() =>
                              setExpandedProblemId(isExpanded ? null : prob.id)
                            }
                            className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300 hover:text-white"
                          >
                            {isExpanded ? '收起解析' : '查看降维解析'}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Solution Deck */}
                      {isExpanded && (
                        <div className="mt-3 space-y-2 border-t border-slate-800/80 pt-3 text-xs">
                          {prob.answer && (
                            <div className="font-mono text-emerald-400">
                              <span className="text-slate-400 font-sans">闭式答案: </span>
                              <LatexFormula math={prob.answer} />
                            </div>
                          )}
                          <div>
                            <span className="font-semibold text-slate-300">核心洞察：</span>
                            <p className="mt-0.5 text-slate-400 leading-relaxed">
                              {prob.coreInsight}
                            </p>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-300">降维题解：</span>
                            <p className="mt-0.5 text-slate-400 leading-relaxed">
                              {prob.solutionSummary}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Next / Previous Chapter Navigation Bar */}
          <nav className="flex items-center justify-between border-t border-slate-800 pt-6">
            {prevChapter ? (
              <button
                onClick={() => onSelectChapter(prevChapter.id)}
                className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:border-slate-700 hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>上一讲: {prevChapter.title.split('：')[0]}</span>
              </button>
            ) : (
              <div />
            )}

            {nextChapter && (
              <button
                onClick={() => onSelectChapter(nextChapter.id)}
                className="flex items-center gap-2 rounded-lg border border-emerald-600/40 bg-emerald-950/40 px-4 py-2 text-xs font-semibold text-emerald-300 hover:border-emerald-500 hover:bg-emerald-900/50"
              >
                <span>下一讲: {nextChapter.title.split('：')[0]}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </nav>
        </main>
      </div>
    </div>
  );
};
