import React, { useState, useEffect } from 'react';
import { SeededRNG } from '../../lib/rng';
import { Play, Pause, RotateCcw } from 'lucide-react';

export const VoterModelGrid: React.FC = () => {
  const gridSize = 16; // 16x16 = 256 cells
  const totalCells = gridSize * gridSize;

  const [initialRatioPercent, setInitialRatioPercent] = useState<number>(40);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [grid, setGrid] = useState<boolean[]>(() => {
    const arr = Array(totalCells).fill(false);
    const rng = new SeededRNG(42);
    for (let i = 0; i < totalCells; i++) {
      arr[i] = rng.nextBool(0.4);
    }
    return arr;
  });

  const aCount = grid.filter(Boolean).length;
  const currentRatio = (aCount / totalCells) * 100;

  const resetGrid = (ratioPct = initialRatioPercent) => {
    const rng = new SeededRNG(Date.now());
    const arr = Array(totalCells).fill(false);
    for (let i = 0; i < totalCells; i++) {
      arr[i] = rng.nextBool(ratioPct / 100);
    }
    setGrid(arr);
    setIsRunning(false);
  };

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setGrid((prev) => {
        const next = [...prev];
        const rng = new SeededRNG(Date.now() + Math.random() * 1000);
        // Run a small batch of voter steps
        for (let step = 0; step < 40; step++) {
          const idx = rng.nextInt(0, totalCells - 1);
          const r = Math.floor(idx / gridSize);
          const c = idx % gridSize;
          // Pick a random neighbor (periodic boundary / torus)
          const neighbors = [
            ((r - 1 + gridSize) % gridSize) * gridSize + c,
            ((r + 1) % gridSize) * gridSize + c,
            r * gridSize + ((c - 1 + gridSize) % gridSize),
            r * gridSize + ((c + 1) % gridSize),
          ];
          const neighborIdx = rng.choice(neighbors);
          next[idx] = next[neighborIdx];
        }
        return next;
      });
    }, 60);

    return () => clearInterval(timer);
  }, [isRunning, totalCells, gridSize]);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 text-slate-200 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-semibold text-white">投票者模型与宏观守恒 (Voter Model Simulation)</h3>
          <p className="text-xs text-slate-400">
            微观上每个人随机同化为邻居的意见，宏观上意见占比严格满足鞅性质：最终被 A 意见统一的概率恰好等于初始占比 A / N！
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-1 rounded px-3 py-1 text-xs font-semibold text-white transition-colors ${
              isRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            {isRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            {isRunning ? '暂停同化' : '开始同化演化'}
          </button>
          <button
            onClick={() => resetGrid()}
            className="flex items-center gap-1 rounded border border-slate-700 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-800"
          >
            <RotateCcw className="h-3 w-3" /> 重置
          </button>
        </div>
      </div>

      {/* Grid and stats */}
      <div className="my-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Visual 2D Grid */}
        <div className="flex flex-col items-center justify-center rounded-lg border border-slate-800 bg-slate-950/60 p-4">
          <div
            className="grid gap-[2px] rounded border border-slate-800 bg-slate-900 p-2"
            style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
          >
            {grid.map((val, idx) => (
              <div
                key={idx}
                className={`h-3 w-3 rounded-[1px] transition-colors duration-200 sm:h-3.5 sm:w-3.5 ${
                  val ? 'bg-emerald-500 shadow-xs shadow-emerald-500/50' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
              意见 A: {aCount} 格
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-slate-700" />
              意见 B: {totalCells - aCount} 格
            </span>
          </div>
        </div>

        {/* Martingale and Conservation deck */}
        <div className="flex flex-col justify-between rounded-lg border border-slate-800 bg-slate-950/60 p-4">
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">初始 A 占比滑块</span>
              <span className="font-mono text-emerald-400">{initialRatioPercent}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={90}
              value={initialRatioPercent}
              onChange={(e) => {
                const val = Number(e.target.value);
                setInitialRatioPercent(val);
                resetGrid(val);
              }}
              className="mt-2 w-full accent-emerald-500"
            />

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">当前 A 占比 (瞬时鞅值):</span>
                <span className="text-emerald-400 font-bold">{currentRatio.toFixed(1)}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${currentRatio}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 rounded border border-slate-800 bg-slate-900/60 p-3 text-[11px] text-slate-300">
            <span className="font-semibold text-white">宏观守恒定律：</span>
            <p className="mt-1 text-slate-400">
              由于每一步被同化的期望等于周围邻居的平均比例，全网的平均占比 X_t 是一个无漂移的鞅。根据停时定理，当最终系统达到完全同化（稳态吸收）时，全网同化为 A 的概率严格等于 X_0 = {initialRatioPercent}%。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
