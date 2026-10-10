import React, { useState } from 'react';
import { PROBLEMS_DATA, Problem } from '../../data/problems';
import { LatexFormula, MathText } from '../common/LatexFormula';
import { Search, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

export const ProblemBankView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('全部');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredProblems = PROBLEMS_DATA.filter((p) => {
    if (selectedCategory !== '全部' && p.category !== selectedCategory) return false;
    if (selectedDifficulty !== '全部' && p.difficulty !== selectedDifficulty) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchInsight = p.coreInsight.toLowerCase().includes(q);
      const matchTechniques = p.techniques.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchInsight && !matchTechniques) return false;
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Page Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white sm:text-3xl tracking-tight">
            题库中心 (Problem Archive)
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            涵盖 OI/ACM 竞赛、Quant 绿皮书、经典智力悖论 · 拒绝照抄原题，精炼降维突破点
          </p>
        </div>

        <span className="font-mono text-xs text-slate-400">
          收录题目：{PROBLEMS_DATA.length} 道 | 筛选结果：{filteredProblems.length} 道
        </span>
      </div>

      {/* Filter bar */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="搜索题名、技巧标签 (如指示变量、停时)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/90 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/90 p-1 text-xs">
          {(['全部', 'OI/算法', 'Quant/绿皮书', '智力/经典'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-1 rounded-md py-1 font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Difficulty filter */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/90 p-1 text-xs">
          {(['全部', '入门', '进阶', '核心', '挑战'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`flex-1 rounded-md py-1 font-medium transition-colors ${
                selectedDifficulty === diff
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Problem Cards List */}
      <div className="space-y-4">
        {filteredProblems.map((prob) => {
          const isExpanded = expandedId === prob.id;
          return (
            <div
              key={prob.id}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition-colors hover:border-slate-700"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">
                      {prob.category}
                    </span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <h3 className="text-sm font-bold text-white">
                      {prob.title}
                    </h3>
                    {prob.problemId && (
                      <span className="font-mono text-xs text-emerald-400">
                        [{prob.platform} {prob.problemId}]
                      </span>
                    )}
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-[11px] text-slate-400">
                      {prob.difficulty}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-400">
                    <span>所属章节: {prob.chapter}</span>
                    <span aria-hidden="true">·</span>
                    <span>技巧: {prob.techniques.join(' / ')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {prob.link && (
                    <a
                      href={prob.link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 rounded bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      <span>原题</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : prob.id)}
                    className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1 text-xs font-semibold text-slate-200 hover:border-emerald-500 hover:text-white"
                  >
                    <span>{isExpanded ? '收起题解' : '查看降维题解'}</span>
                    {isExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Collapsed short hint */}
              {!isExpanded && (
                <div className="mt-3 text-xs text-slate-400 line-clamp-1">
                  💡 核心洞察：<MathText text={prob.coreInsight} />
                </div>
              )}

              {/* Expanded details */}
              {isExpanded && (
                <div className="mt-4 space-y-3 border-t border-slate-800/80 pt-4 text-xs">
                  {prob.answer && (
                    <div className="rounded-lg border border-emerald-950 bg-emerald-950/20 p-2.5 font-mono text-emerald-300">
                      <span className="font-sans text-slate-400">闭式答案 / 复杂度：</span>
                      <LatexFormula math={prob.answer} />
                    </div>
                  )}

                  <div>
                    <h4 className="font-bold text-white">【上帝视角核心洞察】</h4>
                    <div className="mt-1 leading-relaxed text-slate-300">
                      <MathText text={prob.coreInsight} />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-white">【原创降维解法提要】</h4>
                    <div className="mt-1 leading-relaxed text-slate-400">
                      <MathText text={prob.solutionSummary} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredProblems.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-800 p-12 text-center text-xs text-slate-500">
            未找到符合筛选条件的题目，请尝试更换搜索词或筛选标签。
          </div>
        )}
      </div>
    </div>
  );
};
