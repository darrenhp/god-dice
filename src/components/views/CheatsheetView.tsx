import React, { useState } from 'react';
import { MINDMAP_RULES, MindmapRule } from '../../data/cheatsheet';
import { VERIFICATION_LIST } from '../../lib/verification';
import { LatexFormula } from '../common/LatexFormula';
import { Compass, BookMarked, Filter } from 'lucide-react';

export const CheatsheetView: React.FC = () => {
  const [activeToolFilter, setActiveToolFilter] = useState<'全部' | '拆' | '守恒' | '对称' | '倒放'>('全部');
  const [activeTab, setActiveTab] = useState<'mindmap' | 'formulas'>('mindmap');

  const filteredRules = MINDMAP_RULES.filter((rule) => {
    if (activeToolFilter === '全部') return true;
    return rule.godTool === activeToolFilter;
  });

  const toolColorMap = {
    拆: 'text-sky-400 border-sky-800 bg-sky-950/40',
    守恒: 'text-emerald-400 border-emerald-800 bg-emerald-950/40',
    对称: 'text-amber-400 border-amber-800 bg-amber-950/40',
    倒放: 'text-purple-400 border-purple-800 bg-purple-950/40',
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white sm:text-3xl tracking-tight">
            速查手册与题型识别指南
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            “看到什么，想到什么” · 四大上帝视角武器分类导图与高频闭式速查
          </p>
        </div>

        <div className="flex rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-xs">
          <button
            onClick={() => setActiveTab('mindmap')}
            className={`flex items-center gap-1.5 rounded px-3 py-1.5 font-medium transition-colors ${
              activeTab === 'mindmap'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>题型识别表 (看到什么想到什么)</span>
          </button>
          <button
            onClick={() => setActiveTab('formulas')}
            className={`flex items-center gap-1.5 rounded px-3 py-1.5 font-medium transition-colors ${
              activeTab === 'formulas'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookMarked className="h-3.5 w-3.5" />
            <span>核心常数与公式表</span>
          </button>
        </div>
      </div>

      {activeTab === 'mindmap' ? (
        <div className="space-y-6">
          {/* Tool filter bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 mr-2 flex items-center gap-1">
              <Filter className="h-3 w-3" /> 按上帝武器筛选：
            </span>
            {(['全部', '拆', '守恒', '对称', '倒放'] as const).map((tool) => (
              <button
                key={tool}
                onClick={() => setActiveToolFilter(tool)}
                className={`rounded-lg px-3 py-1.5 font-semibold transition-all ${
                  activeToolFilter === tool
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {tool === '全部' ? '全部武器' : `武器：${tool}`}
              </button>
            ))}
          </div>

          {/* Recognition Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 p-2 sm:p-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3">题意特征 (看到什么)</th>
                  <th className="py-2.5 px-3">降维武器</th>
                  <th className="py-2.5 px-3">突破路径 (想到什么)</th>
                  <th className="py-2.5 px-3">经典闭式 / 结论</th>
                  <th className="py-2.5 px-3">代表题 / 章节</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredRules.map((rule, idx) => (
                  <tr key={idx} className="transition-colors hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-medium text-white max-w-xs">
                      {rule.triggerPattern}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block rounded border px-2 py-0.5 text-[10px] font-bold ${
                          toolColorMap[rule.godTool]
                        }`}
                      >
                        {rule.godTool}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 max-w-sm">
                      {rule.recommendedMethod}
                    </td>
                    <td className="py-3 px-3 font-mono text-emerald-400">
                      <LatexFormula math={rule.closedFormLatex} />
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {rule.representativeProblem}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Canonical Formulas and Constants */
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VERIFICATION_LIST.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-colors hover:border-slate-700"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-white">{item.name}</span>
                  <span>{item.chapter}</span>
                </div>

                <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950/80 p-2.5 text-center">
                  <LatexFormula math={item.targetExpr} block />
                </div>

                <p className="mt-3 text-xs leading-relaxed text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
