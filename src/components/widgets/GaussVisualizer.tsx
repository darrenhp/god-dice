import React, { useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';

export const GaussVisualizer: React.FC = () => {
  // 3-state walk: State 0 -> (0.5 to 1, 0.5 to 2), State 1 -> (0.5 to 0, 0.5 to 2), State 2 is absorbing (End)
  // E_0 = 1 + 0.5 E_1 + 0.5 E_2
  // E_1 = 1 + 0.5 E_0 + 0.5 E_2
  // With E_2 = 0:
  // 1.0 E_0 - 0.5 E_1 = 1.0
  // -0.5 E_0 + 1.0 E_1 = 1.0

  interface MatrixStep {
    name: string;
    description: string;
    matrix: number[][]; // Augmented matrix [row][col] with last col as RHS
    highlightRow?: number;
    highlightCol?: number;
  }

  const initialSteps: MatrixStep[] = [
    {
      name: '初始方程构建',
      description: '由 E_u = 1 + ∑ P(u→v) E_v 移项得到线性方程组 (I - P)E = 1',
      matrix: [
        [1.0, -0.5, 1.0],
        [-0.5, 1.0, 1.0],
      ],
    },
    {
      name: '第 1 列选主元与消元',
      description: '以第 1 行为主元。Row2 = Row2 - (-0.5 / 1.0) * Row1 = Row2 + 0.5 * Row1',
      matrix: [
        [1.0, -0.5, 1.0],
        [0.0, 0.75, 1.5],
      ],
      highlightRow: 1,
      highlightCol: 0,
    },
    {
      name: '主对角线归一化',
      description: '第 2 行除以对角线系数 0.75: Row2 = Row2 / 0.75 => E_1 = 2.0',
      matrix: [
        [1.0, -0.5, 1.0],
        [0.0, 1.0, 2.0],
      ],
      highlightRow: 1,
      highlightCol: 1,
    },
    {
      name: '回代求解 (Back-Substitution)',
      description: '将 E_1 = 2.0 代入第 1 行：Row1 = Row1 + 0.5 * Row2 => E_0 = 2.0',
      matrix: [
        [1.0, 0.0, 2.0],
        [0.0, 1.0, 2.0],
      ],
      highlightRow: 0,
      highlightCol: 1,
    },
  ];

  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const cur = initialSteps[currentStepIdx];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 text-slate-200 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-semibold text-white">高斯消元降维过程 (Gaussian Elimination on Random Walk)</h3>
          <p className="text-xs text-slate-400">
            一般图上的击中时间必须列出全部节点方程，通过选主元、消元和回代在 O(N³) 内解出精确期望
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentStepIdx(0)}
            className="flex items-center gap-1 rounded bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700"
          >
            <RotateCcw className="h-3 w-3" /> 重置
          </button>
        </div>
      </div>

      {/* Stepper control bar */}
      <div className="my-4 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {initialSteps.map((step, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentStepIdx(idx)}
            className={`whitespace-nowrap rounded px-3 py-1 font-medium transition-colors ${
              currentStepIdx === idx
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            步骤 {idx + 1}: {step.name}
          </button>
        ))}
      </div>

      {/* Step description */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
          <span>▶ 当前阶段：</span>
          <span className="font-semibold text-white">{cur.name}</span>
        </div>
        <p className="mt-1 text-xs text-slate-300">{cur.description}</p>

        {/* Augmented matrix visualization */}
        <div className="mt-4 flex flex-col items-center">
          <div className="rounded-lg border border-slate-700 bg-slate-900 p-4 font-mono text-sm shadow-inner">
            <div className="mb-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>[系数矩阵 I - P]</span>
              <span>[常数项 b]</span>
            </div>
            {cur.matrix.map((row, rIdx) => (
              <div key={rIdx} className="flex items-center gap-3 py-1">
                <span className="w-6 text-xs text-slate-500">R{rIdx + 1}:</span>
                <span className="text-slate-400">[</span>
                {row.slice(0, row.length - 1).map((val, cIdx) => {
                  const isHighlighted = cur.highlightRow === rIdx && cur.highlightCol === cIdx;
                  return (
                    <span
                      key={cIdx}
                      className={`inline-block w-14 text-right transition-colors ${
                        isHighlighted
                          ? 'rounded bg-emerald-500/30 font-bold text-emerald-300'
                          : 'text-slate-200'
                      }`}
                    >
                      {val.toFixed(2)}
                    </span>
                  );
                })}
                <span className="text-slate-400">]</span>
                <span className="text-emerald-500">|</span>
                <span className="inline-block w-12 text-right font-bold text-emerald-400">
                  {row[row.length - 1].toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              disabled={currentStepIdx === 0}
              onClick={() => setCurrentStepIdx((prev) => Math.max(0, prev - 1))}
              className="rounded bg-slate-800 px-3 py-1 text-xs text-slate-300 hover:bg-slate-700 disabled:opacity-40"
            >
              上一步
            </button>
            <button
              disabled={currentStepIdx === initialSteps.length - 1}
              onClick={() => setCurrentStepIdx((prev) => Math.min(initialSteps.length - 1, prev + 1))}
              className="flex items-center gap-1 rounded bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-40"
            >
              下一步消元 <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
