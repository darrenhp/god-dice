import React, { useState } from 'react';
import { SeededRNG } from '../../lib/rng';
import { Play, RotateCcw } from 'lucide-react';

export const Walk1DSim: React.FC = () => {
  const [mode, setMode] = useState<'line' | 'circle'>('line');
  const [totalLength, setTotalLength] = useState<number>(10); // Length N
  const [startPos, setStartPos] = useState<number>(4); // Start a
  const [probRight, setProbRight] = useState<number>(0.5); // p (right)

  // Simulation stats
  const [simCount, setSimCount] = useState<number>(0);
  const [totalStepsAccum, setTotalStepsAccum] = useState<number>(0);
  const [reachRightCount, setReachRightCount] = useState<number>(0);
  const [seed, setSeed] = useState<number>(101);

  // Single active trace
  const [activePath, setActivePath] = useState<number[]>([startPos]);
  const [activeCurrent, setActiveCurrent] = useState<number>(startPos);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Theoretical values:
  // For Line (Gambler's Ruin):
  // If p == 0.5: E[T] = a(N-a), P(reach N) = a / N
  // If p != 0.5: q = 1-p; P(reach N) = (1 - (q/p)^a) / (1 - (q/p)^N)
  // For Circle (Hit target from dist p): E[T] = p(N - p)
  const q = 1 - probRight;
  const isSymmetric = Math.abs(probRight - 0.5) < 1e-6;

  let theoreticalSteps = 0;
  let theoreticalProbRight = 0;

  if (mode === 'line') {
    if (isSymmetric) {
      theoreticalSteps = startPos * (totalLength - startPos);
      theoreticalProbRight = startPos / totalLength;
    } else {
      const ratio = q / probRight;
      theoreticalProbRight = (1 - Math.pow(ratio, startPos)) / (1 - Math.pow(ratio, totalLength));
      // Non-symmetric stopping time formula:
      theoreticalSteps =
        (startPos - totalLength * theoreticalProbRight) / (q - probRight);
    }
  } else {
    // Circle mode: target at 0, started at startPos. Distance = startPos.
    theoreticalSteps = startPos * (totalLength - startPos);
    theoreticalProbRight = 1.0;
  }

  const stepSingleActive = () => {
    if (isFinished) return;
    const rng = new SeededRNG(Date.now());
    const goesRight = rng.nextBool(probRight);

    let next = activeCurrent + (goesRight ? 1 : -1);
    if (mode === 'circle') {
      next = (next + totalLength) % totalLength;
      const nextPath = [...activePath, next];
      setActivePath(nextPath);
      setActiveCurrent(next);
      if (next === 0) {
        setIsFinished(true);
        setSimCount((c) => c + 1);
        setTotalStepsAccum((s) => s + (nextPath.length - 1));
      }
    } else {
      const nextPath = [...activePath, next];
      setActivePath(nextPath);
      setActiveCurrent(next);
      if (next <= 0 || next >= totalLength) {
        setIsFinished(true);
        setSimCount((c) => c + 1);
        setTotalStepsAccum((s) => s + (nextPath.length - 1));
        if (next >= totalLength) {
          setReachRightCount((r) => r + 1);
        }
      }
    }
  };

  const runBatchSim = (count: number) => {
    const rng = new SeededRNG(seed + simCount);
    let stepsSum = 0;
    let rightWins = 0;

    for (let c = 0; c < count; c++) {
      let pos = startPos;
      let steps = 0;

      if (mode === 'circle') {
        while (steps < 20000) {
          const move = rng.nextBool(probRight) ? 1 : -1;
          pos = (pos + move + totalLength) % totalLength;
          steps++;
          if (pos === 0) break;
        }
        stepsSum += steps;
      } else {
        while (pos > 0 && pos < totalLength && steps < 20000) {
          const move = rng.nextBool(probRight) ? 1 : -1;
          pos += move;
          steps++;
        }
        stepsSum += steps;
        if (pos >= totalLength) rightWins++;
      }
    }

    setSimCount((prev) => prev + count);
    setTotalStepsAccum((prev) => prev + stepsSum);
    setReachRightCount((prev) => prev + rightWins);
  };

  const handleReset = () => {
    setActivePath([startPos]);
    setActiveCurrent(startPos);
    setIsFinished(false);
    setSimCount(0);
    setTotalStepsAccum(0);
    setReachRightCount(0);
  };

  const empiricalSteps = simCount > 0 ? totalStepsAccum / simCount : 0;
  const empiricalProbRight = simCount > 0 ? (reachRightCount / simCount) * 100 : 0;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 text-slate-200 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-semibold text-white">一维随机游走实验室 (1D Random Walk & Gambler's Ruin)</h3>
          <p className="text-xs text-slate-400">
            涵盖赌徒破产、非对称漂移悬崖、以及圆环环上击中时间 p(N - p)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-slate-800 p-0.5 text-xs">
            <button
              onClick={() => {
                setMode('line');
                handleReset();
              }}
              className={`rounded px-2.5 py-1 font-medium transition-colors ${
                mode === 'line' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              线段吸收壁 (赌徒破产)
            </button>
            <button
              onClick={() => {
                setMode('circle');
                handleReset();
              }}
              className={`rounded px-2.5 py-1 font-medium transition-colors ${
                mode === 'circle' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              环形游走 (首达时间)
            </button>
          </div>
        </div>
      </div>

      {/* Parameter Controls */}
      <div className="my-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">总长度 (N)</span>
            <span className="font-mono text-emerald-400">{totalLength}</span>
          </div>
          <input
            type="range"
            min={4}
            max={20}
            value={totalLength}
            onChange={(e) => {
              const val = Number(e.target.value);
              setTotalLength(val);
              setStartPos(Math.min(startPos, val - 1));
              handleReset();
            }}
            className="mt-2 w-full accent-emerald-500"
          />
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">出发点 (a)</span>
            <span className="font-mono text-emerald-400">{startPos}</span>
          </div>
          <input
            type="range"
            min={1}
            max={totalLength - 1}
            value={startPos}
            onChange={(e) => {
              setStartPos(Number(e.target.value));
              handleReset();
            }}
            className="mt-2 w-full accent-emerald-500"
          />
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">向右偏置概率 P(右)</span>
            <span className="font-mono text-emerald-400">{(probRight * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={0.9}
            step={0.05}
            value={probRight}
            onChange={(e) => {
              setProbRight(parseFloat(e.target.value));
              handleReset();
            }}
            className="mt-2 w-full accent-emerald-500"
          />
        </div>
      </div>

      {/* Visual Walk Track */}
      <div className="my-4 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            当前位置: <strong className="font-mono text-emerald-400">{activeCurrent}</strong>
            {isFinished && <span className="ml-2 text-amber-400">已终止！历经 {activePath.length - 1} 步</span>}
          </span>
          <div className="flex gap-2">
            <button
              onClick={stepSingleActive}
              disabled={isFinished}
              className="rounded bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700 disabled:opacity-40"
            >
              单步游走
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 rounded border border-slate-700 px-2 py-1 text-xs text-slate-400 hover:bg-slate-800"
            >
              <RotateCcw className="h-3 w-3" /> 重置
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-1 overflow-x-auto py-3">
          {Array.from({ length: totalLength + 1 }).map((_, idx) => {
            const isCur = activeCurrent === idx;
            const isStart = startPos === idx;
            const isBarrier = mode === 'line' && (idx === 0 || idx === totalLength);
            const isCircleTarget = mode === 'circle' && idx === 0;

            return (
              <div
                key={idx}
                className={`relative flex h-14 min-w-[34px] flex-1 flex-col items-center justify-center rounded-md border text-xs font-mono transition-all ${
                  isCur
                    ? 'border-emerald-400 bg-emerald-950/80 text-emerald-300 font-bold scale-105 shadow-md shadow-emerald-950'
                    : isBarrier || isCircleTarget
                      ? 'border-red-900/60 bg-red-950/30 text-red-400'
                      : isStart
                        ? 'border-amber-700/60 bg-amber-950/20 text-amber-300'
                        : 'border-slate-800 bg-slate-900/80 text-slate-400'
                }`}
              >
                <span>{idx}</span>
                <span className="text-[10px]">
                  {isCur ? '🚶' : isBarrier ? '🛑' : isCircleTarget ? '🎯' : isStart ? '🚩' : ''}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monte Carlo & Theory Comparison */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
          <div className="mb-3 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">快速蒙特卡洛检验</span>
            <span className="font-mono text-slate-400">已试验: {simCount} 次</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => runBatchSim(100)}
              className="flex items-center gap-1 rounded bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600"
            >
              <Play className="h-3 w-3" />
              +100 次
            </button>
            <button
              onClick={() => runBatchSim(1000)}
              className="rounded bg-emerald-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
            >
              +1,000 次
            </button>
            <button
              onClick={() => runBatchSim(5000)}
              className="rounded bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700"
            >
              +5,000 次
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4 font-mono text-xs">
          <span className="font-sans font-semibold text-slate-300">理论闭式 vs 试验结果</span>

          <div className="mt-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">平均游走步数 E[T]:</span>
              <span className="text-emerald-400 font-bold">
                模拟 {empiricalSteps.toFixed(2)} 步 | 理论 {theoreticalSteps.toFixed(2)} 步
              </span>
            </div>

            {mode === 'line' && (
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">右端吸收概率 P(到达 N):</span>
                <span className="text-amber-400 font-bold">
                  模拟 {empiricalProbRight.toFixed(1)}% | 理论 {(theoreticalProbRight * 100).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
