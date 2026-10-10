import React, { useState } from 'react';
import { Coins, Sparkles } from 'lucide-react';

export const BorderCasinoSim: React.FC = () => {
  const [targetString, setTargetString] = useState<string>('ABABA');
  const [alphabetSize, setAlphabetSize] = useState<number>(2); // Binary or custom

  // KMP border computation: finds all prefixes of S that are also suffixes of S
  const computeBorders = (s: string) => {
    const n = s.length;
    const pi = new Array(n).fill(0);
    for (let i = 1; i < n; i++) {
      let j = pi[i - 1];
      while (j > 0 && s[i] !== s[j]) j = pi[j - 1];
      if (s[i] === s[j]) j++;
      pi[i] = j;
    }

    // Trace all border lengths
    const borderLengths: number[] = [n]; // The string itself is always a border of length n
    let cur = pi[n - 1];
    while (cur > 0) {
      borderLengths.push(cur);
      cur = pi[cur - 1];
    }
    return borderLengths.sort((a, b) => b - a);
  };

  const borders = targetString.length > 0 ? computeBorders(targetString) : [];

  // Expected waiting time: sum_{k in Border} m^k
  const computeExpectedSteps = () => {
    let sum = BigInt(0);
    const m = BigInt(alphabetSize);
    for (const len of borders) {
      let power = BigInt(1);
      for (let i = 0; i < len; i++) {
        power *= m;
      }
      sum += power;
    }
    return sum.toString();
  };

  const presetStrings = [
    { label: 'HH (抛硬币)', str: 'HH', m: 2 },
    { label: 'HT (抛硬币)', str: 'HT', m: 2 },
    { label: 'HTH (硬币)', str: 'HTH', m: 2 },
    { label: 'HHT (硬币)', str: 'HHT', m: 2 },
    { label: 'ABABA (5位串)', str: 'ABABA', m: 2 },
    { label: '66 (连续两个6点)', str: '66', m: 6 },
    { label: 'ABRACADABRA (Williams 经典)', str: 'ABRACADABRA', m: 26 },
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 text-slate-200 shadow-xl">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-base font-semibold text-white">赌场模型与 KMP Border 计算器 (Casino Martingale)</h3>
        <p className="text-xs text-slate-400">
          CTSC 歌唱王国与 Williams 经典模型：每一秒进场一个赌徒，带 1 元倍投目标串。停时定理得出精确期望公式：
          E[T] = ∑_(k ∈ Border) m^k
        </p>
      </div>

      {/* Preset selector */}
      <div className="my-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400">经典预设：</span>
        {presetStrings.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setTargetString(p.str);
              setAlphabetSize(p.m);
            }}
            className="rounded border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-slate-300 hover:border-emerald-500 hover:text-white"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom string input */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
          <label className="text-xs text-slate-400">目标字符串 S</label>
          <input
            type="text"
            value={targetString}
            onChange={(e) => setTargetString(e.target.value.toUpperCase())}
            className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-3 py-1.5 font-mono text-sm uppercase text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
          <label className="text-xs text-slate-400">字符集大小 m (例如 2=硬币, 6=骰子, 26=英文字母)</label>
          <input
            type="number"
            min={2}
            max={52}
            value={alphabetSize}
            onChange={(e) => setAlphabetSize(Math.max(2, Number(e.target.value)))}
            className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-3 py-1.5 font-mono text-sm text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Results breakdown */}
      <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
          <Coins className="h-4 w-4" />
          <span>KMP Border 分解与赌徒幸存筹码：</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {borders.map((len, idx) => {
            const sub = targetString.slice(0, len);
            return (
              <div
                key={idx}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-600/40 bg-emerald-950/40 px-3 py-1.5 text-xs font-mono text-emerald-300"
              >
                <span>Border 长度 {len}:</span>
                <span className="font-bold text-white">"{sub}"</span>
                <span className="text-slate-400">→</span>
                <span className="font-semibold text-amber-300">
                  {alphabetSize}^{len}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between border-t border-slate-800/80 pt-4">
          <span className="text-xs font-semibold text-slate-300">
            首次出现 "{targetString}" 的期望等待步数 E[T]：
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xl font-bold text-emerald-400">
              {computeExpectedSteps()}
            </span>
            <span className="text-xs text-slate-400">步</span>
          </div>
        </div>
      </div>
    </div>
  );
};
