import React, { useState } from 'react';
import { SeededRNG } from '../../lib/rng';
import { Play, RotateCcw } from 'lucide-react';

export const BallotBackward: React.FC = () => {
  const [pVotes, setPVotes] = useState<number>(60); // P
  const [qVotes, setQVotes] = useState<number>(40); // Q (P > Q)
  const [simCount, setSimCount] = useState<number>(0);
  const [alwaysLeadCount, setAlwaysLeadCount] = useState<number>(0);
  const [seed, setSeed] = useState<number>(108);

  // Single active sample path for visual rendering
  const [samplePath, setSamplePath] = useState<number[]>([]);
  const [isSampleAlwaysLead, setIsSampleAlwaysLead] = useState<boolean>(false);

  // Theoretical probability: (P - Q) / (P + Q)
  const theoreticalProb = (pVotes - qVotes) / (pVotes + qVotes);

  const generateSinglePath = () => {
    const rng = new SeededRNG(Date.now());
    const votes = Array(pVotes).fill(1).concat(Array(qVotes).fill(-1));
    const shuffled = rng.shuffle(votes);

    const path: number[] = [0];
    let cur = 0;
    let always = true;
    for (let i = 0; i < shuffled.length; i++) {
      cur += shuffled[i];
      path.push(cur);
      if (cur <= 0) always = false;
    }

    setSamplePath(path);
    setIsSampleAlwaysLead(always);
    setSimCount((c) => c + 1);
    if (always) setAlwaysLeadCount((c) => c + 1);
  };

  const runBatchSim = (count: number) => {
    const rng = new SeededRNG(seed + simCount);
    let leads = 0;
    const total = pVotes + qVotes;

    for (let c = 0; c < count; c++) {
      const votes = Array(pVotes).fill(1).concat(Array(qVotes).fill(-1));
      const shuffled = rng.shuffle(votes);
      let cur = 0;
      let always = true;
      for (let i = 0; i < total; i++) {
        cur += shuffled[i];
        if (cur <= 0) {
          always = false;
          break;
        }
      }
      if (always) leads++;
    }

    setSimCount((prev) => prev + count);
    setAlwaysLeadCount((prev) => prev + leads);
  };

  const handleReset = () => {
    setSamplePath([]);
    setSimCount(0);
    setAlwaysLeadCount(0);
  };

  const empiricalProb = simCount > 0 ? (alwaysLeadCount / simCount) * 100 : 0;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 text-slate-200 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-semibold text-white">伯特兰计票定理与时间倒放 (Bertrand's Ballot Theorem)</h3>
          <p className="text-xs text-slate-400">
            候选人 A 得 P 票，B 得 Q 票 (P &gt; Q)。唱票全程 A 始终领先的概率等于 (P - Q) / (P + Q)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-slate-300">
            <span>A 票数:</span>
            <input
              type="number"
              min={10}
              max={100}
              value={pVotes}
              onChange={(e) => {
                const v = Number(e.target.value);
                setPVotes(Math.max(qVotes + 1, v));
                handleReset();
              }}
              className="w-14 rounded border border-slate-700 bg-slate-800 px-1 py-0.5 text-center text-white"
            />
          </label>
          <label className="flex items-center gap-1.5 text-xs text-slate-300">
            <span>B 票数:</span>
            <input
              type="number"
              min={5}
              max={pVotes - 1}
              value={qVotes}
              onChange={(e) => {
                const v = Number(e.target.value);
                setQVotes(Math.min(pVotes - 1, v));
                handleReset();
              }}
              className="w-14 rounded border border-slate-700 bg-slate-800 px-1 py-0.5 text-center text-white"
            />
          </label>
        </div>
      </div>

      {/* Path visualizer */}
      <div className="my-5 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-slate-300">
            唱票波动折线图 (总票数 {pVotes + qVotes})
            {samplePath.length > 0 && (
              <span className={`ml-3 font-semibold ${isSampleAlwaysLead ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isSampleAlwaysLead ? '✅ 全程严格领先 (未触碰 0)' : '❌ 曾被追平或反超 (触碰 0)'}
              </span>
            )}
          </span>
          <div className="flex gap-2">
            <button
              onClick={generateSinglePath}
              className="rounded bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700"
            >
              唱票单轮
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 rounded border border-slate-700 px-2 py-1 text-xs text-slate-400 hover:bg-slate-800"
            >
              <RotateCcw className="h-3 w-3" /> 重置
            </button>
          </div>
        </div>

        <div className="relative h-44 w-full rounded border border-slate-900 bg-slate-950 p-2">
          {samplePath.length === 0 ? (
            <div className="flex h-full items-center justify-center text-xs text-slate-500">
              点击“唱票单轮”或“批量模拟”查看领先轨迹
            </div>
          ) : (
            <svg className="h-full w-full overflow-visible">
              {/* Zero danger line */}
              <line
                x1="0%"
                y1="85%"
                x2="100%"
                y2="85%"
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text x="2%" y="82%" fill="#ef4444" fontSize="10">
                0 (追平线)
              </text>

              {/* Sample path */}
              <polyline
                fill="none"
                stroke={isSampleAlwaysLead ? '#10b981' : '#f43f5e'}
                strokeWidth="2"
                points={samplePath
                  .map((val, idx) => {
                    const x = (idx / (pVotes + qVotes)) * 100;
                    // val ranges from e.g. -20 to (P-Q)
                    const maxVal = pVotes - qVotes + 10;
                    const y = 85 - (val / maxVal) * 75;
                    return `${x}%,${Math.max(5, Math.min(95, y))}%`;
                  })
                  .join(' ')}
              />
            </svg>
          )}
        </div>
      </div>

      {/* Stats comparison */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
          <div className="mb-3 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">蒙特卡洛唱票模拟</span>
            <span className="font-mono text-slate-400">已测: {simCount} 次</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => runBatchSim(500)}
              className="flex items-center gap-1 rounded bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600"
            >
              <Play className="h-3 w-3" /> +500 次
            </button>
            <button
              onClick={() => runBatchSim(2000)}
              className="rounded bg-emerald-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
            >
              +2,000 次
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4 font-mono text-xs">
          <span className="font-sans font-semibold text-slate-300">全程领先概率定理验算</span>

          <div className="mt-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">模拟实测概率:</span>
              <span className="text-emerald-400 font-bold">
                {empiricalProb.toFixed(2)}% ({alwaysLeadCount} / {simCount})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">理论闭式 (P-Q)/(P+Q):</span>
              <span className="text-white font-bold">
                {(theoreticalProb * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
