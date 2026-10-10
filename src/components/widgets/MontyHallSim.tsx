import React, { useState, useTransition } from 'react';
import { SeededRNG } from '../../lib/rng';
import { Play, RotateCcw, Award } from 'lucide-react';

export const MontyHallSim: React.FC = () => {
  const [doorsCount, setDoorsCount] = useState<number>(3);
  const [seed, setSeed] = useState<number>(42);
  const [stayWins, setStayWins] = useState<number>(0);
  const [switchWins, setSwitchWins] = useState<number>(0);
  const [totalSims, setTotalSims] = useState<number>(0);
  const [, startTransition] = useTransition();

  // Interactive single round state
  const [prizeDoor, setPrizeDoor] = useState<number>(() => Math.floor(Math.random() * 3));
  const [selectedDoor, setSelectedDoor] = useState<number | null>(null);
  const [revealedGoatDoor, setRevealedGoatDoor] = useState<number | null>(null);
  const [finalResult, setFinalResult] = useState<'win' | 'lose' | null>(null);

  const theoreticalSwitch = (doorsCount - 1) / doorsCount;
  const theoreticalStay = 1 / doorsCount;

  const handlePickDoor = (doorIndex: number) => {
    if (selectedDoor !== null && revealedGoatDoor !== null) {
      // Final decision
      const won = doorIndex === prizeDoor;
      setFinalResult(won ? 'win' : 'lose');
      setTotalSims((prev) => prev + 1);
      if (doorIndex === selectedDoor) {
        if (won) setStayWins((prev) => prev + 1);
      } else {
        if (won) setSwitchWins((prev) => prev + 1);
      }
      return;
    }

    // First pick: Host reveals goat doors
    setSelectedDoor(doorIndex);
    const availableGoats = [];
    for (let i = 0; i < doorsCount; i++) {
      if (i !== doorIndex && i !== prizeDoor) {
        availableGoats.push(i);
      }
    }
    // Host opens doorsCount - 2 goat doors
    const goat = availableGoats[Math.floor(Math.random() * availableGoats.length)];
    setRevealedGoatDoor(goat);
  };

  const handleResetInteractive = () => {
    setPrizeDoor(Math.floor(Math.random() * doorsCount));
    setSelectedDoor(null);
    setRevealedGoatDoor(null);
    setFinalResult(null);
  };

  const runBatchSimulation = (count: number) => {
    startTransition(() => {
      const rng = new SeededRNG(seed + totalSims);
      let sWins = 0;
      let swWins = 0;

      for (let i = 0; i < count; i++) {
        const prize = rng.nextInt(0, doorsCount - 1);
        const choice = rng.nextInt(0, doorsCount - 1);

        if (choice === prize) {
          sWins++;
        } else {
          swWins++;
        }
      }

      setStayWins((prev) => prev + sWins);
      setSwitchWins((prev) => prev + swWins);
      setTotalSims((prev) => prev + count);
    });
  };

  const handleFullReset = () => {
    setStayWins(0);
    setSwitchWins(0);
    setTotalSims(0);
    handleResetInteractive();
  };

  const stayRate = totalSims > 0 ? (stayWins / totalSims) * 100 : 0;
  const switchRate = totalSims > 0 ? (switchWins / totalSims) * 100 : 0;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 text-slate-200 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-semibold text-white">三门问题实验室 (Monty Hall Simulation)</h3>
          <p className="text-xs text-slate-400">
            当主持人打开 n - 2 扇山羊门，换门获胜的概率严格等于 (n - 1) / n
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <label className="flex items-center gap-1.5 text-slate-300">
            <span>总门数 (n):</span>
            <select
              value={doorsCount}
              onChange={(e) => {
                const val = Number(e.target.value);
                setDoorsCount(val);
                handleFullReset();
              }}
              className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value={3}>3 门 (标准经典)</option>
              <option value={4}>4 门</option>
              <option value={5}>5 门</option>
              <option value={10}>10 门</option>
              <option value={50}>50 门</option>
              <option value={100}>100 门 (直觉放大器)</option>
            </select>
          </label>

          <label className="flex items-center gap-1 text-slate-400">
            <span>种子:</span>
            <input
              type="number"
              value={seed}
              onChange={(e) => setSeed(Number(e.target.value))}
              className="w-16 rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-center text-white"
            />
          </label>
        </div>
      </div>

      {/* Interactive Door stage */}
      <div className="my-5 rounded-lg border border-slate-800/80 bg-slate-950/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">
            单局试玩：
            {selectedDoor === null
              ? '请点击一扇门下注'
              : revealedGoatDoor !== null && finalResult === null
                ? '主持人排除了山羊门！请决定坚持原选择还是换门：'
                : finalResult === 'win'
                  ? '🎉 恭喜！你赢得了跑车！'
                  : '🐐 遗憾，这是一只山羊。'}
          </span>
          <button
            onClick={handleResetInteractive}
            className="flex items-center gap-1 rounded bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700"
          >
            <RotateCcw className="h-3 w-3" />
            重玩单局
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 py-2">
          {Array.from({ length: Math.min(doorsCount, 10) }).map((_, idx) => {
            const isSelected = selectedDoor === idx;
            const isRevealed = revealedGoatDoor === idx;
            const isPrize = prizeDoor === idx;

            let bgColor = 'bg-slate-800/80 hover:bg-slate-700 border-slate-700';
            if (isRevealed) bgColor = 'bg-red-950/40 border-red-800/80 text-red-300';
            else if (isSelected) bgColor = 'bg-emerald-950/60 border-emerald-500 text-emerald-300';
            if (finalResult && isPrize) bgColor = 'bg-amber-950/70 border-amber-500 text-amber-300';

            return (
              <button
                key={idx}
                disabled={isRevealed}
                onClick={() => handlePickDoor(idx)}
                className={`relative flex h-24 w-16 flex-col items-center justify-between rounded-lg border p-2 text-xs font-medium transition-all ${bgColor}`}
              >
                <span className="text-[10px] text-slate-400">门 {idx + 1}</span>
                <span className="text-2xl">
                  {finalResult ? (isPrize ? '🏎️' : '🐐') : isRevealed ? '🐐' : isSelected ? '👉' : '🚪'}
                </span>
                <span className="text-[9px]">
                  {isRevealed ? '排除山羊' : isSelected ? '当前选择' : '点击选择'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fast Monte Carlo simulation controls */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">快速蒙特卡洛模拟</span>
            <span className="font-mono text-xs text-slate-400">已模拟: {totalSims.toLocaleString()} 次</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => runBatchSimulation(100)}
              className="flex items-center gap-1 rounded-md bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600"
            >
              <Play className="h-3 w-3" />
              +100 次
            </button>
            <button
              onClick={() => runBatchSimulation(1000)}
              className="rounded-md bg-emerald-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
            >
              +1,000 次
            </button>
            <button
              onClick={() => runBatchSimulation(5000)}
              className="rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700"
            >
              +5,000 次
            </button>
            <button
              onClick={handleFullReset}
              className="rounded-md border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              重置统计
            </button>
          </div>
        </div>

        {/* Results Comparison Deck */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
          <span className="text-xs font-medium text-slate-300">策略胜率对比</span>

          <div className="mt-3 space-y-3 text-xs">
            {/* Switch strategy */}
            <div>
              <div className="flex justify-between font-mono">
                <span className="text-emerald-400">【换门策略】模拟胜率: {switchRate.toFixed(2)}%</span>
                <span className="text-slate-400">理论值: {(theoreticalSwitch * 100).toFixed(2)}%</span>
              </div>
              <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${switchRate}%` }}
                />
              </div>
            </div>

            {/* Stay strategy */}
            <div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-300">【不换策略】模拟胜率: {stayRate.toFixed(2)}%</span>
                <span className="text-slate-400">理论值: {(theoreticalStay * 100).toFixed(2)}%</span>
              </div>
              <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-slate-600 transition-all duration-300"
                  style={{ width: `${stayRate}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-400">
            <Award className="h-3.5 w-3.5 text-emerald-400" />
            <span>
              降维本质：初始挑错的概率是 {(theoreticalSwitch * 100).toFixed(1)}%，只要主持人排除错门，换门就等于把挑错全转化为胜利！
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
