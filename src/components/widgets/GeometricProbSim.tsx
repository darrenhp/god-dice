import React, { useState } from 'react';
import { SeededRNG } from '../../lib/rng';
import { Play, RotateCcw } from 'lucide-react';

export const GeometricProbSim: React.FC = () => {
  const [subTab, setSubTab] = useState<'stick' | 'buffon' | 'bertrand'>('stick');

  // Stick breaking
  const [stickSims, setStickSims] = useState<number>(0);
  const [triangleWins, setTriangleWins] = useState<number>(0);

  const runStickSim = (count: number) => {
    const rng = new SeededRNG(Date.now() + Math.random() * 7777);
    let tri = 0;
    for (let i = 0; i < count; i++) {
      const u1 = rng.next();
      const u2 = rng.next();
      const x = Math.min(u1, u2);
      const y = Math.max(u1, u2);
      const a = x;
      const b = y - x;
      const c = 1 - y;
      if (a < 0.5 && b < 0.5 && c < 0.5) tri++;
    }
    setStickSims((prev) => prev + count);
    setTriangleWins((prev) => prev + tri);
  };

  // Buffon's needle
  const [needleSims, setNeedleSims] = useState<number>(0);
  const [needleCrosses, setNeedleCrosses] = useState<number>(0);

  const runNeedleSim = (count: number) => {
    const rng = new SeededRNG(Date.now() + Math.random() * 8888);
    let cross = 0;
    const l = 1.0;
    const d = 2.0;

    for (let i = 0; i < count; i++) {
      const y = rng.next() * (d / 2); // Center distance to nearest line
      const theta = rng.next() * (Math.PI / 2);
      if (y <= (l / 2) * Math.sin(theta)) cross++;
    }

    setNeedleSims((prev) => prev + count);
    setNeedleCrosses((prev) => prev + cross);
  };

  const piEstimate =
    needleCrosses > 0 ? (2 * 1.0 * needleSims) / (needleCrosses * 2.0) : 0;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 text-slate-200 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-semibold text-white">连续的魔法：几何概率实验室 (Geometric Probability)</h3>
          <p className="text-xs text-slate-400">
            当样本空间从离散走向连续，「面积与测度就是概率」。折木棍、蒲丰投针与 Bertrand 弦悖论。
          </p>
        </div>

        <div className="flex rounded-lg bg-slate-800 p-0.5 text-xs">
          <button
            onClick={() => setSubTab('stick')}
            className={`rounded px-2.5 py-1 font-medium ${
              subTab === 'stick' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            折木棍成三角形 (1/4)
          </button>
          <button
            onClick={() => setSubTab('buffon')}
            className={`rounded px-2.5 py-1 font-medium ${
              subTab === 'buffon' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            蒲丰投针估算 π
          </button>
          <button
            onClick={() => setSubTab('bertrand')}
            className={`rounded px-2.5 py-1 font-medium ${
              subTab === 'bertrand' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Bertrand 弦悖论
          </button>
        </div>
      </div>

      {subTab === 'stick' && (
        <div className="my-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
            <span className="text-xs font-semibold text-slate-300">折木棍散点几何演示</span>
            <p className="mt-1 text-xs text-slate-400">
              两处断点 x &lt; y 将长度 1 剪成三段 a, b, c。能够围成三角形当且仅当每一段长均严格小于 1/2。
            </p>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => runStickSim(1000)}
                className="flex items-center gap-1 rounded bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600"
              >
                <Play className="h-3 w-3" /> 折棍 1,000 次
              </button>
              <button
                onClick={() => runStickSim(5000)}
                className="rounded bg-emerald-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
              >
                折棍 5,000 次
              </button>
              <button
                onClick={() => {
                  setStickSims(0);
                  setTriangleWins(0);
                }}
                className="rounded border border-slate-700 px-2 py-1 text-xs text-slate-400 hover:bg-slate-800"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-lg border border-slate-800 bg-slate-950/60 p-4 font-mono text-xs">
            <div>
              <span className="font-sans font-semibold text-slate-300">构成三角形概率验算</span>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">实测成三角形比例:</span>
                  <span className="text-emerald-400 font-bold">
                    {(stickSims > 0 ? (triangleWins / stickSims) * 100 : 0).toFixed(2)}% ({triangleWins}/{stickSims})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">理论精确闭式:</span>
                  <span className="text-white font-bold">1/4 = 25.00%</span>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded border border-slate-800 bg-slate-900/60 p-3 text-[11px] text-slate-400 font-sans">
              在二维平面 (x, y) 样本空间直角三角形（面积 1/2）中，满足 x &lt; 1/2, y - x &lt; 1/2, 1 - y &lt; 1/2 的可行域是一个小三角形，面积严格为 1/8。比值恰为 (1/8) / (1/2) = 1/4！
            </div>
          </div>
        </div>
      )}

      {subTab === 'buffon' && (
        <div className="my-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 text-xs">
            <span className="font-semibold text-slate-300">蒲丰投针参数设置</span>
            <p className="mt-1 text-slate-400">
              针长 l = 1.0，平行线间距 d = 2.0。投掷针相交平行线的理论概率 P = 2l / (πd) = 1 / π。
            </p>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => runNeedleSim(2000)}
                className="flex items-center gap-1 rounded bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600"
              >
                <Play className="h-3 w-3" /> 掷针 2,000 次
              </button>
              <button
                onClick={() => runNeedleSim(10000)}
                className="rounded bg-emerald-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
              >
                掷针 10,000 次
              </button>
              <button
                onClick={() => {
                  setNeedleSims(0);
                  setNeedleCrosses(0);
                }}
                className="rounded border border-slate-700 px-2 py-1 text-xs text-slate-400 hover:bg-slate-800"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-lg border border-slate-800 bg-slate-950/60 p-4 font-mono text-xs">
            <div>
              <span className="font-sans font-semibold text-slate-300">圆周率 π 倒推估计</span>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">相交线次数:</span>
                  <span className="text-white">
                    {needleCrosses} / {needleSims} ({(needleSims > 0 ? (needleCrosses / needleSims) * 100 : 0).toFixed(2)}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">蒙特卡洛估计 π:</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {piEstimate > 0 ? piEstimate.toFixed(5) : '--'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">真实 π 值:</span>
                  <span className="text-slate-300">3.14159...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {subTab === 'bertrand' && (
        <div className="my-5 rounded-lg border border-slate-800 bg-slate-950/60 p-4 text-xs">
          <span className="font-semibold text-white">Bertrand 弦悖论：何谓“随机挑选一条弦”？</span>
          <p className="mt-1 text-slate-400">
            在一个单位圆中随机挑选一条弦，其长度大于内接等边三角形边长 (√3) 的概率取决于你如何定义“随机”：
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded border border-slate-800 bg-slate-900 p-3">
              <strong className="text-emerald-400">方法 1：随机端点</strong>
              <p className="mt-1 text-slate-400">
                固定一个端点，在圆周上均匀随机选另一个端点。弧长落在 [120°, 240°] 内才能大于 √3。
              </p>
              <span className="mt-2 block font-mono text-sm font-bold text-white">概率 = 1/3 ≈ 33.3%</span>
            </div>

            <div className="rounded border border-slate-800 bg-slate-900 p-3">
              <strong className="text-amber-400">方法 2：随机半径</strong>
              <p className="mt-1 text-slate-400">
                随机选一条半径，并在半径上均匀选一点作垂线为弦。弦心距必须小于 R/2 = 1/2。
              </p>
              <span className="mt-2 block font-mono text-sm font-bold text-white">概率 = 1/2 = 50.0%</span>
            </div>

            <div className="rounded border border-slate-800 bg-slate-900 p-3">
              <strong className="text-purple-400">方法 3：随机中点</strong>
              <p className="mt-1 text-slate-400">
                在圆盘内部均匀随机挑选一个点作为弦的中点。该点必须落在半径为 1/2 的同心圆内。
              </p>
              <span className="mt-2 block font-mono text-sm font-bold text-white">概率 = 1/4 = 25.0%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
