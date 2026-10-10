import React, { useState } from 'react';
import { SeededRNG } from '../../lib/rng';
import { Play, RotateCcw } from 'lucide-react';

export const OptimalStoppingSim: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'secretary' | 'dice'>('secretary');

  // Secretary problem
  const [candidateCount] = useState<number>(100);
  const [rejectThreshold, setRejectThreshold] = useState<number>(37); // n/e
  const [secSims, setSecSims] = useState<number>(0);
  const [secWins, setSecWins] = useState<number>(0);

  const runSecretarySim = (count: number) => {
    const rng = new SeededRNG(Date.now() + Math.random() * 4444);
    let wins = 0;

    for (let c = 0; c < count; c++) {
      // 100 candidates with random distinct ranks 1..100 (100 is best)
      const ranks = rng.shuffle(Array.from({ length: 100 }, (_, i) => i + 1));
      let bestInRejection = 0;

      // Phase 1: reject first k
      for (let i = 0; i < rejectThreshold; i++) {
        if (ranks[i] > bestInRejection) bestInRejection = ranks[i];
      }

      // Phase 2: select first candidate better than bestInRejection
      let chosen = ranks[ranks.length - 1]; // fallback to last
      for (let i = rejectThreshold; i < 100; i++) {
        if (ranks[i] > bestInRejection) {
          chosen = ranks[i];
          break;
        }
      }

      if (chosen === 100) wins++;
    }

    setSecSims((prev) => prev + count);
    setSecWins((prev) => prev + wins);
  };

  // Dice reroll DP
  const [rerollChances, setRerollChances] = useState<number>(3);

  // Compute DP expectation:
  // V_1 = 3.5
  // V_k = (sum_{d=1}^6 max(d, V_{k-1})) / 6
  const computeDiceDP = (k: number) => {
    const dp: number[] = [3.5];
    for (let i = 1; i < k; i++) {
      const prev = dp[i - 1];
      let sum = 0;
      for (let d = 1; d <= 6; d++) {
        sum += Math.max(d, prev);
      }
      dp.push(sum / 6);
    }
    return dp;
  };

  const diceExpectations = computeDiceDP(4);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 text-slate-200 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-semibold text-white">何时收手：最优停止理论 (Optimal Stopping)</h3>
          <p className="text-xs text-slate-400">
            停时定理是「已知规则，算结果」；最优停止则是「自定规则，求最高期望回报」。
          </p>
        </div>

        <div className="flex rounded-lg bg-slate-800 p-0.5 text-xs">
          <button
            onClick={() => setActiveTab('secretary')}
            className={`rounded px-3 py-1 font-medium ${
              activeTab === 'secretary' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            秘书问题 (1/e 法则)
          </button>
          <button
            onClick={() => setActiveTab('dice')}
            className={`rounded px-3 py-1 font-medium ${
              activeTab === 'dice' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            骰子重掷最优决策 DP
          </button>
        </div>
      </div>

      {activeTab === 'secretary' ? (
        <div className="my-5 space-y-4">
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">
                先观察拒绝前 k 位候选人 (基准线)
              </span>
              <span className="font-mono text-emerald-400">k = {rejectThreshold} 人 (总计 100 人)</span>
            </div>
            <input
              type="range"
              min={5}
              max={80}
              value={rejectThreshold}
              onChange={(e) => {
                setRejectThreshold(Number(e.target.value));
                setSecSims(0);
                setSecWins(0);
              }}
              className="mt-2 w-full accent-emerald-500"
            />
            <div className="mt-1 flex justify-between text-[10px] text-slate-400">
              <span>过于急躁 (k=5)</span>
              <span className="text-emerald-400 font-bold">黄金阈值 100/e ≈ 37</span>
              <span>过于挑剔 (k=80)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
              <span className="text-xs font-semibold text-slate-300">快速批量模拟 (100 人选拔)</span>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => runSecretarySim(500)}
                  className="flex items-center gap-1 rounded bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600"
                >
                  <Play className="h-3 w-3" /> 模拟 500 次
                </button>
                <button
                  onClick={() => runSecretarySim(2000)}
                  className="rounded bg-emerald-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                >
                  模拟 2,000 次
                </button>
                <button
                  onClick={() => {
                    setSecSims(0);
                    setSecWins(0);
                  }}
                  className="rounded border border-slate-700 px-2 py-1 text-xs text-slate-400 hover:bg-slate-800"
                >
                  <RotateCcw className="h-3 w-3" />
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4 font-mono text-xs">
              <span className="font-sans font-semibold text-slate-300">选中最优秀秘书的概率</span>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">实测成功率:</span>
                  <span className="text-emerald-400 font-bold">
                    {(secSims > 0 ? (secWins / secSims) * 100 : 0).toFixed(1)}% ({secWins}/{secSims})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">理论极限值 1/e:</span>
                  <span className="text-white font-bold">≈ 36.79%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Dice Reroll DP Tab */
        <div className="my-5 space-y-4">
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
            <span className="text-xs font-semibold text-slate-200">
              掷骰最多有 k 次机会，若对当前点数不满意可放弃并重掷，取最终点数：
            </span>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-4 font-mono text-xs">
              <div className="rounded border border-slate-800 bg-slate-900 p-3">
                <span className="text-slate-400 block font-sans">1 次机会 (无退路)</span>
                <span className="text-base font-bold text-white mt-1 block">3.500</span>
                <span className="text-[11px] text-slate-400 font-sans mt-1 block">
                  基准均值 7/2
                </span>
              </div>
              <div className="rounded border border-slate-800 bg-slate-900 p-3">
                <span className="text-slate-400 block font-sans">2 次机会</span>
                <span className="text-base font-bold text-emerald-400 mt-1 block">4.250</span>
                <span className="text-[11px] text-slate-400 font-sans mt-1 block">
                  ≥ 4 点收手，≤ 3 重掷 (17/4)
                </span>
              </div>
              <div className="rounded border border-slate-800 bg-slate-900 p-3">
                <span className="text-slate-400 block font-sans">3 次机会</span>
                <span className="text-base font-bold text-amber-400 mt-1 block">4.667 (14/3)</span>
                <span className="text-[11px] text-slate-400 font-sans mt-1 block">
                  ≥ 5 点收手，≤ 4 重掷
                </span>
              </div>
              <div className="rounded border border-slate-800 bg-slate-900 p-3">
                <span className="text-slate-400 block font-sans">4 次机会</span>
                <span className="text-base font-bold text-purple-400 mt-1 block">4.867 (73/15)</span>
                <span className="text-[11px] text-slate-400 font-sans mt-1 block">
                  ≥ 5 点收手，≤ 4 重掷
                </span>
              </div>
            </div>

            <div className="mt-4 text-[11px] text-slate-400">
              递推方程：<span className="font-mono text-emerald-400">V_k = (1/6) · ∑ max(d, V_k-1)</span>。因为掷骰代价为零，更多机会单调增加收益期望，但边际收益迅速衰减！
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
