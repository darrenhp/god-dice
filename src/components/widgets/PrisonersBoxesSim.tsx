import React, { useState } from 'react';
import { SeededRNG } from '../../lib/rng';
import { Play, RotateCcw, Check, X } from 'lucide-react';

export const PrisonersBoxesSim: React.FC = () => {
  const [totalPrisoners] = useState<number>(100);
  const [maxTries] = useState<number>(50);
  const [seed, setSeed] = useState<number>(137);

  // Stats
  const [roundsSimulated, setRoundsSimulated] = useState<number>(0);
  const [successCount, setSuccessCount] = useState<number>(0);

  // Current round boxes permutation
  const [boxes, setBoxes] = useState<number[]>(() => {
    const arr = Array.from({ length: 100 }, (_, i) => i);
    const rng = new SeededRNG(137);
    return rng.shuffle(arr);
  });

  // Cycle decomposition of current boxes
  const computeCycles = (perm: number[]) => {
    const visited = new Array(perm.length).fill(false);
    const cycles: number[][] = [];
    for (let i = 0; i < perm.length; i++) {
      if (!visited[i]) {
        const curCycle: number[] = [];
        let curr = i;
        while (!visited[curr]) {
          visited[curr] = true;
          curCycle.push(curr);
          curr = perm[curr];
        }
        cycles.push(curCycle);
      }
    }
    return cycles;
  };

  const currentCycles = computeCycles(boxes);
  const maxCycleLen = Math.max(...currentCycles.map((c) => c.length));
  const isCurrentSuccessful = maxCycleLen <= maxTries;

  const handleShuffleCurrent = () => {
    const rng = new SeededRNG(Date.now());
    const newBoxes = rng.shuffle(Array.from({ length: 100 }, (_, i) => i));
    setBoxes(newBoxes);
  };

  const runBatchSimulations = (count: number) => {
    const rng = new SeededRNG(seed + roundsSimulated);
    let succ = 0;
    for (let r = 0; r < count; r++) {
      const perm = rng.shuffle(Array.from({ length: 100 }, (_, i) => i));
      const visited = new Array(100).fill(false);
      let roundMaxCycle = 0;

      for (let i = 0; i < 100; i++) {
        if (!visited[i]) {
          let len = 0;
          let curr = i;
          while (!visited[curr]) {
            visited[curr] = true;
            len++;
            curr = perm[curr];
          }
          if (len > roundMaxCycle) roundMaxCycle = len;
        }
      }

      if (roundMaxCycle <= 50) succ++;
    }

    setSuccessCount((prev) => prev + succ);
    setRoundsSimulated((prev) => prev + count);
  };

  const empiricalSuccessRate =
    roundsSimulated > 0 ? (successCount / roundsSimulated) * 100 : 0;
  // 1 - (H_100 - H_50) approx 31.18%
  const theoreticalSuccessRate = (1 - (5.1873775 - 4.4992053)) * 100;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 text-slate-200 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-semibold text-white">100 囚犯开盒子悖论 (Prisoner Box Cycles)</h3>
          <p className="text-xs text-slate-400">
            随机独立翻箱成功率仅为 (1/2)¹⁰⁰ ≈ 7.9×10⁻³¹，而置换追踪环策略成功率惊人地高达 31.2%！
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffleCurrent}
            className="flex items-center gap-1 rounded bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700"
          >
            <RotateCcw className="h-3 w-3" />
            重排盒子
          </button>
        </div>
      </div>

      {/* Current Permutation Inspector */}
      <div className="my-5 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-white">当前 100 盒子置换环结构：</span>
            <span
              className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold ${
                isCurrentSuccessful
                  ? 'border border-emerald-500/40 bg-emerald-950/60 text-emerald-400'
                  : 'border border-red-500/40 bg-red-950/60 text-red-400'
              }`}
            >
              {isCurrentSuccessful ? (
                <>
                  <Check className="h-3.5 w-3.5" /> 本轮全部获救！(最大环长 {maxCycleLen} ≤ 50)
                </>
              ) : (
                <>
                  <X className="h-3.5 w-3.5" /> 本轮失败 (出现超长环：长度 {maxCycleLen} &gt; 50)
                </>
              )}
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">分解成 {currentCycles.length} 个不相交环</span>
        </div>

        {/* Visual ring summary */}
        <div className="mt-3 flex flex-wrap gap-2">
          {currentCycles.map((cycle, idx) => {
            const isDanger = cycle.length > 50;
            return (
              <div
                key={idx}
                className={`rounded border px-2 py-1 text-xs font-mono ${
                  isDanger
                    ? 'border-red-500 bg-red-950/40 text-red-300 font-bold'
                    : 'border-slate-800 bg-slate-900 text-slate-300'
                }`}
              >
                环 #{idx + 1}：长 {cycle.length} {isDanger && '⚠️ 爆表'}
              </div>
            );
          })}
        </div>
      </div>

      {/* Monte Carlo Simulator */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">批量模拟检验 (环策略)</span>
            <span className="font-mono text-xs text-slate-400">已测: {roundsSimulated} 轮</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => runBatchSimulations(100)}
              className="flex items-center gap-1 rounded-md bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600"
            >
              <Play className="h-3 w-3" />
              +100 轮
            </button>
            <button
              onClick={() => runBatchSimulations(1000)}
              className="rounded-md bg-emerald-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
            >
              +1,000 轮
            </button>
            <button
              onClick={() => {
                setRoundsSimulated(0);
                setSuccessCount(0);
              }}
              className="rounded-md border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              重置
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
          <span className="text-xs font-medium text-slate-300">获救成功率统计</span>

          <div className="mt-3">
            <div className="flex justify-between font-mono text-xs">
              <span className="text-emerald-400">
                模拟成功率: {empiricalSuccessRate.toFixed(2)}% ({successCount}/{roundsSimulated})
              </span>
              <span className="text-slate-400">理论值: ≈ 31.18%</span>
            </div>
            <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${empiricalSuccessRate}%` }}
              />
            </div>
          </div>

          <p className="mt-3 text-[11px] text-slate-400">
            理论推导：长度为 L &gt; 50 的环互斥且至多存在一个，概率恰为 1/L。
            失败概率 = ∑(L=51 to 100) 1/L = H₁₀₀ - H₅₀ ≈ ln 2 ≈ 0.6882。
            故全员生还概率为 1 - ln 2 ≈ 31.18%！
          </p>
        </div>
      </div>
    </div>
  );
};
