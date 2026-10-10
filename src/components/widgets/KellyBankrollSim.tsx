import React, { useState } from 'react';
import { SeededRNG } from '../../lib/rng';
import { Play, RotateCcw, TrendingUp } from 'lucide-react';

export const KellyBankrollSim: React.FC = () => {
  const [winProbPercent, setWinProbPercent] = useState<number>(60); // 60%
  const [bOdds, setBOdds] = useState<number>(1); // 1:1 payout
  const [betFractionPercent, setBetFractionPercent] = useState<number>(20); // 20%
  const [roundsCount, setRoundsCount] = useState<number>(50);

  const [wealthPaths, setWealthPaths] = useState<{ [strategy: string]: number[] }>({});
  const [finalWealth, setFinalWealth] = useState<{ [strategy: string]: number }>({});

  const p = winProbPercent / 100;
  const q = 1 - p;
  // Kelly optimal fraction: f* = (bp - q) / b
  const optimalKelly = Math.max(0, (bOdds * p - q) / bOdds);
  const optimalKellyPercent = optimalKelly * 100;

  const simulateComparison = () => {
    const rng = new SeededRNG(Date.now() + Math.random() * 6666);
    const initialBankroll = 100;

    // Strategies: Full Kelly, Half Kelly, Overbetting (2x Kelly), User Chosen
    const fullK = optimalKelly;
    const halfK = optimalKelly / 2;
    const doubleK = Math.min(0.95, optimalKelly * 2);
    const userK = betFractionPercent / 100;

    const pathFull: number[] = [initialBankroll];
    const pathHalf: number[] = [initialBankroll];
    const pathDouble: number[] = [initialBankroll];
    const pathUser: number[] = [initialBankroll];

    let wFull = initialBankroll;
    let wHalf = initialBankroll;
    let wDouble = initialBankroll;
    let wUser = initialBankroll;

    for (let r = 1; r <= roundsCount; r++) {
      const isWin = rng.nextBool(p);

      // Full Kelly
      wFull += isWin ? wFull * fullK * bOdds : -wFull * fullK;
      pathFull.push(Math.max(0.01, wFull));

      // Half Kelly
      wHalf += isWin ? wHalf * halfK * bOdds : -wHalf * halfK;
      pathHalf.push(Math.max(0.01, wHalf));

      // Double Kelly (Overbetting)
      wDouble += isWin ? wDouble * doubleK * bOdds : -wDouble * doubleK;
      pathDouble.push(Math.max(0.01, wDouble));

      // User Chosen
      wUser += isWin ? wUser * userK * bOdds : -wUser * userK;
      pathUser.push(Math.max(0.01, wUser));
    }

    setWealthPaths({
      '最优 Full Kelly': pathFull,
      '稳健 Half Kelly': pathHalf,
      '过度下注 2x Kelly': pathDouble,
      '当前设定比例': pathUser,
    });

    setFinalWealth({
      '最优 Full Kelly': wFull,
      '稳健 Half Kelly': wHalf,
      '过度下注 2x Kelly': wDouble,
      '当前设定比例': wUser,
    });
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 text-slate-200 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-semibold text-white">Kelly 准则与财富轨迹实验室 (Kelly Criterion Bankroll)</h3>
          <p className="text-xs text-slate-400">
            最大化长期对数财富增长率：f* = (b·p - q) / b。下注过小增长迟缓，下注过大（哪怕期望为正）也会导致几何爆仓！
          </p>
        </div>

        <button
          onClick={simulateComparison}
          className="flex items-center gap-1 rounded bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
        >
          <Play className="h-3 w-3" /> 模拟 50 轮复利轨迹
        </button>
      </div>

      {/* Controls */}
      <div className="my-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">胜率 P(胜)</span>
            <span className="font-mono text-emerald-400">{winProbPercent}%</span>
          </div>
          <input
            type="range"
            min={50}
            max={80}
            value={winProbPercent}
            onChange={(e) => setWinProbPercent(Number(e.target.value))}
            className="mt-2 w-full accent-emerald-500"
          />
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">净赔率 b (1:b)</span>
            <span className="font-mono text-emerald-400">{bOdds}:1</span>
          </div>
          <input
            type="range"
            min={1}
            max={3}
            step={0.5}
            value={bOdds}
            onChange={(e) => setBOdds(Number(e.target.value))}
            className="mt-2 w-full accent-emerald-500"
          />
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">用户测试下注比例</span>
            <span className="font-mono text-amber-400">{betFractionPercent}%</span>
          </div>
          <input
            type="range"
            min={5}
            max={80}
            value={betFractionPercent}
            onChange={(e) => setBetFractionPercent(Number(e.target.value))}
            className="mt-2 w-full accent-amber-500"
          />
        </div>
      </div>

      {/* Kelly Calculation Result Badge */}
      <div className="rounded-lg border border-emerald-900/60 bg-emerald-950/30 p-3 text-xs flex flex-wrap items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
          <span className="text-slate-300">
            根据 Kelly 准则计算出的最佳下注比例 f* = ({bOdds} × {p.toFixed(2)} - {q.toFixed(2)}) / {bOdds} =
          </span>
        </div>
        <span className="font-mono text-base font-bold text-emerald-400">
          {optimalKellyPercent.toFixed(1)}% 资金量
        </span>
      </div>

      {/* Trajectories Summary */}
      {Object.keys(finalWealth).length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 font-mono text-xs">
          {Object.entries(finalWealth).map(([name, val]) => (
            <div key={name} className="rounded border border-slate-800 bg-slate-950 p-2.5">
              <span className="text-slate-400 block font-sans text-[11px]">{name}</span>
              <span
                className={`text-sm font-bold mt-1 block ${
                  val >= 100 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                ${val.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
