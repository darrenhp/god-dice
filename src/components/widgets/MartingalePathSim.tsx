import React, { useState } from 'react';
import { SeededRNG } from '../../lib/rng';
import { AlertTriangle, Play, RotateCcw } from 'lucide-react';

export const MartingalePathSim: React.FC = () => {
  const [useDoublingStrategy, setUseDoublingStrategy] = useState<boolean>(false);
  const [maxRounds, setMaxRounds] = useState<number>(30);
  const [simRunsCount, setSimRunsCount] = useState<number>(0);
  const [avgFinalWealth, setAvgFinalWealth] = useState<number>(0);
  const [paths, setPaths] = useState<number[][]>([]);
  const [seed, setSeed] = useState<number>(777);

  const runSimulation = (runs = 10) => {
    const rng = new SeededRNG(seed + simRunsCount);
    const newPaths: number[][] = [];
    let wealthSum = 0;

    for (let r = 0; r < runs; r++) {
      const path: number[] = [0];
      let currentWealth = 0;
      let currentBet = 1;

      for (let t = 1; t <= maxRounds; t++) {
        const win = rng.nextBool(0.5);

        if (useDoublingStrategy) {
          // Doubling strategy (倍投法): bet doubles on loss, stop on first win
          if (win) {
            currentWealth += currentBet;
            path.push(currentWealth);
            break; // Stopped at first win!
          } else {
            currentWealth -= currentBet;
            path.push(currentWealth);
            currentBet *= 2;
            if (currentBet > 10000) break; // Risk explosion limit
          }
        } else {
          // Fair coin game (标准无偏鞅): +1 or -1 each step
          currentWealth += win ? 1 : -1;
          path.push(currentWealth);
        }
      }
      newPaths.push(path);
      wealthSum += path[path.length - 1];
    }

    setPaths(newPaths);
    setSimRunsCount((c) => c + runs);
    setAvgFinalWealth(wealthSum / runs);
  };

  const reset = () => {
    setPaths([]);
    setSimRunsCount(0);
    setAvgFinalWealth(0);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 text-slate-200 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-semibold text-white">鞅与停时定理实验室 (Martingale & Optional Stopping)</h3>
          <p className="text-xs text-slate-400">
            绝对公平的赌局：E[X_n | F_n-1] = X_n-1。探究停时定理成立条件与倍投悖论！
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs">
            <input
              type="checkbox"
              checked={useDoublingStrategy}
              onChange={(e) => {
                setUseDoublingStrategy(e.target.checked);
                reset();
              }}
              className="accent-amber-500"
            />
            <span className={useDoublingStrategy ? 'text-amber-400 font-semibold' : 'text-slate-300'}>
              开启经典倍投法 (Martingale Doubling)
            </span>
          </label>
        </div>
      </div>

      {/* Simulator canvas / line graph */}
      <div className="my-5 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-slate-300">
            鞅轨迹可视化 (10 条样本路径) | 初始资本 X₀ = 0
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => runSimulation(10)}
              className="flex items-center gap-1 rounded bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-500"
            >
              <Play className="h-3 w-3" /> 生成轨迹
            </button>
            <button
              onClick={reset}
              className="rounded border border-slate-700 px-2 py-1 text-xs text-slate-400 hover:bg-slate-800"
            >
              <RotateCcw className="h-3 w-3" /> 清空
            </button>
          </div>
        </div>

        {/* SVG Path rendering */}
        <div className="relative h-56 w-full rounded border border-slate-900 bg-slate-950 p-2">
          {paths.length === 0 ? (
            <div className="flex h-full items-center justify-center text-xs text-slate-500">
              点击“生成轨迹”按钮绘制随机鞅路径
            </div>
          ) : (
            <svg className="h-full w-full overflow-visible">
              {/* Zero line */}
              <line
                x1="0%"
                y1="50%"
                x2="100%"
                y2="50%"
                stroke="#334155"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {paths.map((p, pIdx) => {
                // Find min & max for auto scaling
                const points = p
                  .map((val, stepIdx) => {
                    const x = (stepIdx / (useDoublingStrategy ? 15 : maxRounds)) * 100;
                    // Center at 50%
                    const y = 50 - (val / (useDoublingStrategy ? 30 : 12)) * 40;
                    return `${x}%,${Math.max(5, Math.min(95, y))}%`;
                  })
                  .join(' ');

                const finalVal = p[p.length - 1];
                const strokeColor =
                  finalVal > 0 ? '#10b981' : finalVal < 0 ? '#f43f5e' : '#94a3b8';

                return (
                  <polyline
                    key={pIdx}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="1.5"
                    strokeOpacity="0.75"
                    points={points}
                  />
                );
              })}
            </svg>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between font-mono text-xs">
          <span className="text-slate-400">理论初值: X₀ = 0.00</span>
          <span
            className={
              Math.abs(avgFinalWealth) < 0.8 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'
            }
          >
            样本均值 E[X_T]: {avgFinalWealth.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Educational Callout */}
      {useDoublingStrategy ? (
        <div className="rounded-lg border border-amber-900/60 bg-amber-950/30 p-4 text-xs text-amber-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
            <div>
              <span className="font-semibold text-white">倍投策略为什么打破了停时定理？</span>
              <p className="mt-1 text-slate-300">
                如果赌徒拥有无限本金，停时 T（首次抛出正面）几乎必然有限，且最终总能带走 +1 元的收益（E[X_T] = 1 ≠ X₀ = 0）。
                这似乎“击败了上帝”。但停时定理三条件之一要求“财富有界”或“E[T] 有限且增量有界”：在现实中，连续抛出反面会导致所需下注额呈 2ⁿ 指数级爆炸，路径下限无界！一旦触碰有限本金破产壁，期望值立刻暴跌归零。
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4 text-xs text-slate-300">
          <span className="font-semibold text-emerald-400">停时定理 (Doob's Optional Stopping Theorem)</span>
          <div className="mt-1 space-y-1 text-slate-400">
            <p>若 (X_n) 是鞅，T 是停时，并在以下条件之一成立时严格满足 E[X_T] = E[X_0]：</p>
            <p>1. 停时 T 有界（存在常数 M 使得 T ≤ M）；</p>
            <p>2. E[T] &lt; ∞ 且单步增量 |X_(n+1) - X_n| 有界；</p>
            <p>3. X_n 是一致可积的 (Uniformly Integrable)。</p>
          </div>
        </div>
      )}
    </div>
  );
};
