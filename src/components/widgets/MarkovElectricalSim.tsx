import React, { useState } from 'react';
import { SeededRNG } from '../../lib/rng';
import { Zap, Play, RotateCcw } from 'lucide-react';

export const MarkovElectricalSim: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'polya' | 'resistor' | 'ehrenfest'>('polya');

  // Polya recurrence stats
  const [dimension, setDimension] = useState<1 | 2 | 3>(3);
  const [polyaSims, setPolyaSims] = useState<number>(0);
  const [polyaReturned, setPolyaReturned] = useState<number>(0);

  const runPolyaSim = (count: number) => {
    const rng = new SeededRNG(Date.now() + Math.random() * 5555);
    let ret = 0;
    const maxSteps = 400;

    for (let c = 0; c < count; c++) {
      let x = 0, y = 0, z = 0;
      let hasReturned = false;

      for (let s = 1; s <= maxSteps; s++) {
        if (dimension === 1) {
          x += rng.nextBool() ? 1 : -1;
        } else if (dimension === 2) {
          const move = rng.nextInt(0, 3);
          if (move === 0) x++;
          else if (move === 1) x--;
          else if (move === 2) y++;
          else y--;
        } else {
          const move = rng.nextInt(0, 5);
          if (move === 0) x++;
          else if (move === 1) x--;
          else if (move === 2) y++;
          else if (move === 3) y--;
          else if (move === 4) z++;
          else z--;
        }

        if (x === 0 && y === 0 && z === 0) {
          hasReturned = true;
          break;
        }
      }

      if (hasReturned) ret++;
    }

    setPolyaSims((prev) => prev + count);
    setPolyaReturned((prev) => prev + ret);
  };

  const polyaRate = polyaSims > 0 ? (polyaReturned / polyaSims) * 100 : 0;
  const theoreticalPolya = dimension === 1 ? 100 : dimension === 2 ? 100 : 34.05;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 text-slate-200 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-semibold text-white">马尔可夫链的上帝视角 (Electrical Analogy & Pólya Recurrence)</h3>
          <p className="text-xs text-slate-400">
            无向图随机游走等价于纯电阻网络：往返时间 = 2m · R_eff。醉汉总能回家，小鸟却可能迷航。
          </p>
        </div>

        <div className="flex rounded-lg bg-slate-800 p-0.5 text-xs">
          <button
            onClick={() => setActiveSubTab('polya')}
            className={`rounded px-2.5 py-1 font-medium ${
              activeSubTab === 'polya' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pólya 常返性 (1D/2D/3D)
          </button>
          <button
            onClick={() => setActiveSubTab('resistor')}
            className={`rounded px-2.5 py-1 font-medium ${
              activeSubTab === 'resistor' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            等效电阻类比
          </button>
          <button
            onClick={() => setActiveSubTab('ehrenfest')}
            className={`rounded px-2.5 py-1 font-medium ${
              activeSubTab === 'ehrenfest' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Ehrenfest 扩散罐
          </button>
        </div>
      </div>

      {activeSubTab === 'polya' && (
        <div className="my-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
            <span className="text-xs text-slate-400">选择游走空间维度：</span>
            <div className="flex gap-2">
              {[1, 2, 3].map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setDimension(d as 1 | 2 | 3);
                    setPolyaSims(0);
                    setPolyaReturned(0);
                  }}
                  className={`rounded px-3 py-1 font-mono text-xs font-bold ${
                    dimension === d ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {d}D 晶格空间
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
              <span className="text-xs font-semibold text-slate-300">蒙特卡洛常返测试 (上限 400 步)</span>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => runPolyaSim(500)}
                  className="flex items-center gap-1 rounded bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600"
                >
                  <Play className="h-3 w-3" /> 模拟 500 次
                </button>
                <button
                  onClick={() => runPolyaSim(2000)}
                  className="rounded bg-emerald-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                >
                  模拟 2,000 次
                </button>
                <button
                  onClick={() => {
                    setPolyaSims(0);
                    setPolyaReturned(0);
                  }}
                  className="rounded border border-slate-700 px-2.5 py-1 text-xs text-slate-400 hover:bg-slate-800"
                >
                  <RotateCcw className="h-3 w-3" />
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4 font-mono text-xs">
              <span className="font-sans font-semibold text-slate-300">返回起点概率检验</span>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">实测返回率:</span>
                  <span className="text-emerald-400 font-bold">
                    {polyaRate.toFixed(1)}% ({polyaReturned}/{polyaSims})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">理论渐近极限:</span>
                  <span className="text-white font-bold">
                    {dimension === 3 ? '≈ 34.05% (暂态，迷失概率 66%)' : '100% (常返态，必定返回)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'resistor' && (
        <div className="my-5 rounded-lg border border-slate-800 bg-slate-950/60 p-4 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-3">
            <Zap className="h-4 w-4" />
            <span>电网络与随机游走等价定理：</span>
          </div>
          <div className="space-y-3 text-slate-300">
            <div className="rounded border border-slate-800 bg-slate-900 p-3">
              <strong className="text-white">往返时间公式 (Commute Time)：</strong>
              <p className="mt-1 text-emerald-300 font-mono">
                C(u, v) = H(u, v) + H(v, u) = 2m · R_eff(u, v)
              </p>
              <p className="text-slate-400 mt-1">
                其中 m 是无向图总边数，R_eff 是将每条边视为 1Ω 电阻时，u 与 v 之间的等效电阻！
              </p>
            </div>
            <div className="rounded border border-slate-800 bg-slate-900 p-3">
              <strong className="text-white">回看经典结论：</strong>
              <ul className="mt-1 list-disc list-inside space-y-1 text-slate-400">
                <li>链上两端长 n：m = n，R_eff = n，往返时间 = 2n · n = 2n²；对称击中时间为 n²。</li>
                <li>立方体对角：m = 12，对角等效电阻 R_eff = 5/6 Ω。往返时间 = 24 × (5/6) = 20；对称击中时间严格等于 10 步！</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'ehrenfest' && (
        <div className="my-5 rounded-lg border border-slate-800 bg-slate-950/60 p-4 text-xs">
          <span className="font-semibold text-white">Ehrenfest 气体扩散罐模型：</span>
          <p className="mt-1 text-slate-400">
            两个容器共 n 个粒子。每步随机挑选一个粒子换到另一个容器。
          </p>
          <div className="mt-3 rounded border border-slate-800 bg-slate-900 p-3 font-mono">
            <div className="text-emerald-400">稳态分布：π(k) = C(n, k) / 2ⁿ (严格二项分布)</div>
            <div className="mt-1 text-slate-300">
              全空状态 (k=0) 的稳态概率仅为 1/2ⁿ，故从全空首次返回全空的平均步数为 2ⁿ 步！
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
