import React, { useState } from 'react';
import { SeededRNG } from '../../lib/rng';
import { Play, RotateCcw } from 'lucide-react';

export const RandomizedAlgorithmsSim: React.FC = () => {
  const [tab, setTab] = useState<'quicksort' | 'balls'>('quicksort');

  // Quicksort
  const [nElements, setNElements] = useState<number>(100);
  const [qsTrials, setQsTrials] = useState<number>(0);
  const [totalComparisons, setTotalComparisons] = useState<number>(0);

  // Compute exact theoretical quicksort comparisons: 2(n+1)H_n - 4n
  const computeTheoreticalQs = (n: number) => {
    let h = 0;
    for (let i = 1; i <= n; i++) h += 1 / i;
    return 2 * (n + 1) * h - 4 * n;
  };

  const runQuicksortSim = (count: number) => {
    const rng = new SeededRNG(Date.now() + Math.random() * 3333);
    let comparisonsSum = 0;

    for (let c = 0; c < count; c++) {
      let comps = 0;
      const arr = rng.shuffle(Array.from({ length: nElements }, (_, i) => i));

      const sortHelper = (list: number[]) => {
        if (list.length <= 1) return;
        const pivotIdx = rng.nextInt(0, list.length - 1);
        const pivot = list[pivotIdx];
        const left: number[] = [];
        const right: number[] = [];

        for (let i = 0; i < list.length; i++) {
          if (i === pivotIdx) continue;
          comps++;
          if (list[i] < pivot) left.push(list[i]);
          else right.push(list[i]);
        }

        sortHelper(left);
        sortHelper(right);
      };

      sortHelper(arr);
      comparisonsSum += comps;
    }

    setQsTrials((prev) => prev + count);
    setTotalComparisons((prev) => prev + comparisonsSum);
  };

  // Balls and Bins (Power of Two Choices)
  const [binsCount] = useState<number>(50);
  const [ballsCount] = useState<number>(50);
  const [useTwoChoices, setUseTwoChoices] = useState<boolean>(false);
  const [binsLoad, setBinsLoad] = useState<number[]>(Array(50).fill(0));

  const runBallsBins = () => {
    const rng = new SeededRNG(Date.now());
    const bins = Array(binsCount).fill(0);

    for (let i = 0; i < ballsCount; i++) {
      if (useTwoChoices) {
        // Pick 2 random bins, choose the one with less balls
        const b1 = rng.nextInt(0, binsCount - 1);
        const b2 = rng.nextInt(0, binsCount - 1);
        if (bins[b1] <= bins[b2]) bins[b1]++;
        else bins[b2]++;
      } else {
        // Single random choice
        const b = rng.nextInt(0, binsCount - 1);
        bins[b]++;
      }
    }

    setBinsLoad(bins);
  };

  const maxLoad = Math.max(...binsLoad);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 text-slate-200 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-semibold text-white">算法中的概率：随机化与分析 (Randomized Algorithms)</h3>
          <p className="text-xs text-slate-400">
            指示变量拆分快排比较次数，以及两选一力量（Power of Two Choices）将最大负载从 ln n 压缩至 ln ln n！
          </p>
        </div>

        <div className="flex rounded-lg bg-slate-800 p-0.5 text-xs">
          <button
            onClick={() => setTab('quicksort')}
            className={`rounded px-3 py-1 font-medium ${
              tab === 'quicksort' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            随机快排比较次数
          </button>
          <button
            onClick={() => setTab('balls')}
            className={`rounded px-3 py-1 font-medium ${
              tab === 'balls' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            球盒模型与两选一
          </button>
        </div>
      </div>

      {tab === 'quicksort' ? (
        <div className="my-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 text-xs">
            <span className="font-semibold text-slate-300">数组规模 n = {nElements}</span>
            <p className="mt-1 text-slate-400">
              每次随机挑选主元。两个元素 x_i 与 x_j 会发生比较的概率是 2 / (j - i + 1)。
            </p>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => runQuicksortSim(100)}
                className="flex items-center gap-1 rounded bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600"
              >
                <Play className="h-3 w-3" /> 测试 100 次排序
              </button>
              <button
                onClick={() => runQuicksortSim(500)}
                className="rounded bg-emerald-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
              >
                测试 500 次
              </button>
              <button
                onClick={() => {
                  setQsTrials(0);
                  setTotalComparisons(0);
                }}
                className="rounded border border-slate-700 px-2 py-1 text-xs text-slate-400 hover:bg-slate-800"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-lg border border-slate-800 bg-slate-950/60 p-4 font-mono text-xs">
            <div>
              <span className="font-sans font-semibold text-slate-300">期望比较次数验算</span>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">实测平均比较次数:</span>
                  <span className="text-emerald-400 font-bold">
                    {qsTrials > 0 ? (totalComparisons / qsTrials).toFixed(1) : '--'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">理论精确值 2(n+1)H_n - 4n:</span>
                  <span className="text-white font-bold">
                    {computeTheoreticalQs(nElements).toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">渐近主项 2n ln n:</span>
                  <span className="text-slate-400">
                    {(2 * nElements * Math.log(nElements)).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Balls and Bins */
        <div className="my-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs">
            <div className="flex items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={useTwoChoices}
                  onChange={(e) => setUseTwoChoices(e.target.checked)}
                  className="accent-emerald-500"
                />
                <span className={useTwoChoices ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                  开启两选一力量 (Power of Two Choices)
                </span>
              </label>
            </div>

            <button
              onClick={runBallsBins}
              className="flex items-center gap-1 rounded bg-emerald-600 px-3 py-1.5 font-semibold text-white hover:bg-emerald-500"
            >
              <Play className="h-3 w-3" /> 投掷 50 个球到 50 个桶
            </button>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
            <div className="mb-2 flex justify-between text-xs font-mono">
              <span className="text-slate-400">各桶负载分布 (50 桶)</span>
              <span className="text-emerald-400 font-bold">最大负载 (Max Load): {maxLoad}</span>
            </div>

            <div className="flex items-end gap-1 h-24 border-b border-slate-800 pt-2">
              {binsLoad.map((load, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-emerald-500/80 rounded-t-[1px] transition-all hover:bg-emerald-400"
                  style={{ height: `${Math.max(4, (load / Math.max(1, maxLoad)) * 100)}%` }}
                  title={`桶 ${idx}: ${load} 球`}
                />
              ))}
            </div>

            <p className="mt-3 text-[11px] text-slate-400">
              {useTwoChoices
                ? '⚡ 两选一模式下：每次随机看两个桶并选负载较小的那个放球，最大负载从 O(ln n / ln ln n) 惊人地暴降为 O(ln ln n)！负载极其平整！'
                : '单选模式下：完全随机哈希投掷，容易出现局部高负载峰值。'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
