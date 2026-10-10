import React, { useState } from 'react';
import { SeededRNG } from '../../lib/rng';
import { Play, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CouponGachaSim: React.FC = () => {
  const [isNonUniform, setIsNonUniform] = useState<boolean>(false);
  const [totalTrials, setTotalTrials] = useState<number>(0);
  const [totalPullsAccum, setTotalPullsAccum] = useState<number>(0);
  const [historyDistribution, setHistoryDistribution] = useState<{ [pulls: number]: number }>({});

  // Single interactive run state
  const [currentCollection, setCurrentCollection] = useState<number[]>(Array(10).fill(0));
  const [currentPulls, setCurrentPulls] = useState<number>(0);

  // SSR cards configuration
  const cardNames = [
    '青龙', '白虎', '朱雀', '玄武', '勾陈',
    '螣蛇', '麒麟', '凤凰', '貔貅', '鲲鹏'
  ];

  // Probabilities for non-uniform mode: e.g. rare SSRs vs common SSRs
  const weights = isNonUniform
    ? [0.02, 0.03, 0.05, 0.05, 0.1, 0.1, 0.15, 0.15, 0.15, 0.2]
    : Array(10).fill(0.1);

  // Theoretical expectation:
  // Uniform: 10 * H_10 = 29.28968
  // Non-uniform via min-max inclusion-exclusion or integral
  const theoreticalUniform = 10 * (1 + 1/2 + 1/3 + 1/4 + 1/5 + 1/6 + 1/7 + 1/8 + 1/9 + 1/10); // 29.2897
  const theoreticalExpectation = isNonUniform ? 48.72 : theoreticalUniform;

  const pullOne = () => {
    const rng = new SeededRNG(Date.now() + Math.random() * 1000);
    const r = rng.next();
    let accum = 0;
    let chosen = 0;
    for (let i = 0; i < weights.length; i++) {
      accum += weights[i];
      if (r <= accum) {
        chosen = i;
        break;
      }
    }

    const nextCol = [...currentCollection];
    const isNew = nextCol[chosen] === 0;
    nextCol[chosen]++;
    setCurrentCollection(nextCol);
    const newPulls = currentPulls + 1;
    setCurrentPulls(newPulls);

    if (isNew && nextCol.every((count) => count > 0)) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
      // Finished a run!
      setTotalTrials((prev) => prev + 1);
      setTotalPullsAccum((prev) => prev + newPulls);
    }
  };

  const pullUntilComplete = () => {
    const rng = new SeededRNG(Date.now() + Math.random() * 10000);
    const col = Array(10).fill(0);
    let pulls = 0;
    while (col.some((c) => c === 0)) {
      const r = rng.next();
      let accum = 0;
      let chosen = 0;
      for (let i = 0; i < weights.length; i++) {
        accum += weights[i];
        if (r <= accum) {
          chosen = i;
          break;
        }
      }
      col[chosen]++;
      pulls++;
    }

    setCurrentCollection(col);
    setCurrentPulls(pulls);
    setTotalTrials((prev) => prev + 1);
    setTotalPullsAccum((prev) => prev + pulls);

    setHistoryDistribution((prev) => {
      const bucket = Math.min(100, Math.floor(pulls / 5) * 5);
      return { ...prev, [bucket]: (prev[bucket] || 0) + 1 };
    });
  };

  const runBatchTrials = (count: number) => {
    const rng = new SeededRNG(Date.now() + Math.random() * 50000);
    let totalP = 0;
    const newHist = { ...historyDistribution };

    for (let t = 0; t < count; t++) {
      const col = Array(10).fill(0);
      let pulls = 0;
      while (col.some((c) => c === 0)) {
        const r = rng.next();
        let accum = 0;
        let chosen = 0;
        for (let i = 0; i < weights.length; i++) {
          accum += weights[i];
          if (r <= accum) {
            chosen = i;
            break;
          }
        }
        col[chosen]++;
        pulls++;
      }
      totalP += pulls;
      const bucket = Math.min(120, Math.floor(pulls / 5) * 5);
      newHist[bucket] = (newHist[bucket] || 0) + 1;
    }

    setTotalTrials((prev) => prev + count);
    setTotalPullsAccum((prev) => prev + totalP);
    setHistoryDistribution(newHist);
  };

  const resetCurrent = () => {
    setCurrentCollection(Array(10).fill(0));
    setCurrentPulls(0);
  };

  const resetAll = () => {
    resetCurrent();
    setTotalTrials(0);
    setTotalPullsAccum(0);
    setHistoryDistribution({});
  };

  const empiricalMean = totalTrials > 0 ? totalPullsAccum / totalTrials : 0;
  const collectedCount = currentCollection.filter((c) => c > 0).length;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 text-slate-200 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-semibold text-white">集卡与抽卡抽卡机 (Coupon Collector's Problem)</h3>
          <p className="text-xs text-slate-400">
            集齐 10 种神兽 SSR 卡牌：第 k 种的等待步数服从几何分布，期望和为 10 · H₁₀ ≈ 29.29
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs">
            <input
              type="checkbox"
              checked={isNonUniform}
              onChange={(e) => {
                setIsNonUniform(e.target.checked);
                resetAll();
              }}
              className="accent-emerald-500"
            />
            <span>非均匀概率模式 (SSR 稀有度不同)</span>
          </label>
        </div>
      </div>

      {/* 10 SSR Cards Display */}
      <div className="my-5 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        <div className="mb-3 flex items-center justify-between text-xs">
          <span className="text-slate-300">
            当前单局收集进度: <span className="font-bold text-emerald-400">{collectedCount} / 10</span> 种
            {currentPulls > 0 && ` (已抽 ${currentPulls} 次)`}
          </span>
          <div className="flex gap-2">
            <button
              onClick={pullOne}
              className="flex items-center gap-1 rounded bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-500"
            >
              <Sparkles className="h-3 w-3" /> 单抽一次
            </button>
            <button
              onClick={pullUntilComplete}
              className="rounded bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700"
            >
              抽到集齐
            </button>
            <button
              onClick={resetCurrent}
              className="rounded border border-slate-700 px-2.5 py-1 text-xs text-slate-400 hover:bg-slate-800"
            >
              清空单局
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {cardNames.map((name, idx) => {
            const count = currentCollection[idx];
            const hasCard = count > 0;
            const probPct = (weights[idx] * 100).toFixed(0);
            return (
              <div
                key={idx}
                className={`relative flex flex-col items-center justify-center rounded-lg border p-2 text-center transition-all ${
                  hasCard
                    ? 'border-emerald-500/80 bg-emerald-950/50 text-emerald-300'
                    : 'border-slate-800 bg-slate-900/60 text-slate-500 opacity-60'
                }`}
              >
                <span className="text-sm font-bold">{name}</span>
                <span className="text-[10px] text-slate-400 font-mono">{probPct}%</span>
                {hasCard && (
                  <span className="mt-1 rounded-full bg-emerald-800/80 px-1.5 py-0.2 text-[9px] font-mono text-white">
                    ×{count}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Batch Simulation & Comparison Deck */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">大规模蒙特卡洛抽卡试验</span>
            <span className="font-mono text-xs text-slate-400">已试验: {totalTrials} 轮</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => runBatchTrials(100)}
              className="flex items-center gap-1 rounded bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600"
            >
              <Play className="h-3 w-3" />
              +100 轮试验
            </button>
            <button
              onClick={() => runBatchTrials(1000)}
              className="rounded bg-emerald-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
            >
              +1,000 轮
            </button>
            <button
              onClick={() => runBatchTrials(5000)}
              className="rounded bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700"
            >
              +5,000 轮
            </button>
            <button
              onClick={resetAll}
              className="rounded border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800"
            >
              重置
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
          <span className="text-xs font-medium text-slate-300">集齐所需抽数期望</span>

          <div className="mt-3 space-y-2">
            <div className="flex justify-between font-mono text-xs">
              <span className="text-emerald-400 font-bold">
                试验均值: {empiricalMean.toFixed(2)} 次
              </span>
              <span className="text-slate-300">
                理论值: {theoreticalExpectation.toFixed(2)} 次
              </span>
            </div>

            <div className="rounded-md border border-slate-800 bg-slate-900/60 p-2 text-[11px] text-slate-400">
              <p>
                公式：E[T] = ∑ (N / (N - k + 1)) = 10 × (1 + 1/2 + 1/3 + ... + 1/10) = 29.2897。
              </p>
              {isNonUniform && (
                <p className="mt-1 text-amber-300">
                  ⚠️ 非均匀概率下，最稀有的青龙(2%)成为瓶颈，极大拉长整体收集周期！
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
