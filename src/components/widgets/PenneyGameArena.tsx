import React, { useState } from 'react';
import { SeededRNG } from '../../lib/rng';
import { Play, RotateCcw, Swords, Dices } from 'lucide-react';

export const PenneyGameArena: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'penney' | 'efron'>('penney');

  // Penney Game states
  const [playerSeq, setPlayerSeq] = useState<string>('HHH');
  const [coinStream, setCoinStream] = useState<string>('');
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [botScore, setBotScore] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Counter strategy rule for length 3:
  // If player chooses a1 a2 a3, bot picks (!a2) a1 a2
  const getBotCounter = (seq: string) => {
    if (seq.length < 3) return 'THH';
    const notA2 = seq[1] === 'H' ? 'T' : 'H';
    return notA2 + seq[0] + seq[1];
  };

  const botSeq = getBotCounter(playerSeq);

  // Conway overlap index: XY = sum 2^(k-1) [suffix_k(X) == prefix_k(Y)]
  const conwayOverlap = (x: string, y: string) => {
    let sum = 0;
    const len = x.length;
    for (let k = 1; k <= len; k++) {
      const suffixX = x.slice(len - k);
      const prefixY = y.slice(0, k);
      if (suffixX === prefixY) {
        sum += Math.pow(2, k - 1);
      }
    }
    return sum;
  };

  const AA = conwayOverlap(playerSeq, playerSeq);
  const AB = conwayOverlap(playerSeq, botSeq);
  const BB = conwayOverlap(botSeq, botSeq);
  const BA = conwayOverlap(botSeq, playerSeq);

  const denom = (AA - AB) + (BB - BA);
  const theoreticalBotWinProb = denom !== 0 ? (AA - AB) / denom : 0.5;

  const runPenneyMatch = (rounds = 100) => {
    const rng = new SeededRNG(Date.now() + Math.random() * 9999);
    let pWins = 0;
    let bWins = 0;
    let lastStream = '';

    for (let r = 0; r < rounds; r++) {
      let buf = '';
      while (true) {
        const coin = rng.nextBool() ? 'H' : 'T';
        buf += coin;
        if (buf.endsWith(playerSeq)) {
          pWins++;
          break;
        }
        if (buf.endsWith(botSeq)) {
          bWins++;
          break;
        }
      }
      if (r === rounds - 1) lastStream = buf.slice(-30);
    }

    setPlayerScore((prev) => prev + pWins);
    setBotScore((prev) => prev + bWins);
    setCoinStream(lastStream);
  };

  // Efron non-transitive dice tournament
  const efronDice = {
    A: [4, 4, 4, 4, 0, 0],
    B: [3, 3, 3, 3, 3, 3],
    C: [6, 6, 2, 2, 2, 2],
    D: [5, 5, 5, 1, 1, 1],
  };

  const [selectedDice1, setSelectedDice1] = useState<keyof typeof efronDice>('A');
  const [selectedDice2, setSelectedDice2] = useState<keyof typeof efronDice>('B');
  const [dice1Wins, setDice1Wins] = useState<number>(0);
  const [dice2Wins, setDice2Wins] = useState<number>(0);
  const [diceRounds, setDiceRounds] = useState<number>(0);

  const computeExactEfronProb = (d1: number[], d2: number[]) => {
    let d1Wins = 0;
    for (const v1 of d1) {
      for (const v2 of d2) {
        if (v1 > v2) d1Wins++;
      }
    }
    return d1Wins / 36;
  };

  const exactD1WinProb = computeExactEfronProb(
    efronDice[selectedDice1],
    efronDice[selectedDice2]
  );

  const runDiceMatch = (rounds = 500) => {
    const rng = new SeededRNG(Date.now() + Math.random() * 8888);
    const d1 = efronDice[selectedDice1];
    const d2 = efronDice[selectedDice2];
    let w1 = 0;
    let w2 = 0;

    for (let r = 0; r < rounds; r++) {
      const v1 = rng.choice(d1);
      const v2 = rng.choice(d2);
      if (v1 > v2) w1++;
      else if (v2 > v1) w2++;
    }

    setDice1Wins((prev) => prev + w1);
    setDice2Wins((prev) => prev + w2);
    setDiceRounds((prev) => prev + rounds);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 text-slate-200 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-semibold text-white">非传递博弈竞技场 (Penney's Game & Non-transitive Dice)</h3>
          <p className="text-xs text-slate-400">
            概率世界的“石头剪刀布”：随机变量不满足传递律，后手总能挑选出碾压先手的克制序列！
          </p>
        </div>

        <div className="flex rounded-lg bg-slate-800 p-0.5 text-xs">
          <button
            onClick={() => setActiveTab('penney')}
            className={`flex items-center gap-1 rounded px-3 py-1 font-medium transition-colors ${
              activeTab === 'penney' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Swords className="h-3 w-3" /> 彭尼硬币决斗 (Penney)
          </button>
          <button
            onClick={() => setActiveTab('efron')}
            className={`flex items-center gap-1 rounded px-3 py-1 font-medium transition-colors ${
              activeTab === 'efron' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Dices className="h-3 w-3" /> Efron 非传递骰子
          </button>
        </div>
      </div>

      {activeTab === 'penney' ? (
        <div className="mt-5 space-y-5">
          {/* Controls: Pick 3 coin sequence */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
              <span className="text-xs text-slate-400">你（先手）选择长度 3 的硬币序列：</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {['HHH', 'HHT', 'HTH', 'HTT', 'THH', 'THT', 'TTH', 'TTT'].map((seq) => (
                  <button
                    key={seq}
                    onClick={() => {
                      setPlayerSeq(seq);
                      setPlayerScore(0);
                      setBotScore(0);
                      setCoinStream('');
                    }}
                    className={`rounded px-2.5 py-1 font-mono text-xs font-bold transition-all ${
                      playerSeq === seq
                        ? 'border border-blue-500 bg-blue-950/80 text-blue-300 shadow-md'
                        : 'border border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {seq}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-emerald-900/60 bg-emerald-950/20 p-4">
              <span className="text-xs text-emerald-400">电脑（后手）秒选致命克制序列：</span>
              <div className="mt-2 flex items-center gap-3">
                <span className="font-mono text-2xl font-black text-emerald-300">{botSeq}</span>
                <span className="text-xs text-slate-400">
                  (策略：取你第 2 位的反面放最前)
                </span>
              </div>
            </div>
          </div>

          {/* Conway analysis table */}
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2 text-xs">
              <span className="font-semibold text-slate-300">Conway 重叠指数矩阵与理论胜率</span>
              <span className="font-mono text-emerald-400">
                P(先手) : P(后手) = (BB - BA) : (AA - AB)
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-4 text-xs font-mono sm:grid-cols-4">
              <div className="rounded bg-slate-900 p-2">AA (你对你): <strong className="text-white">{AA}</strong></div>
              <div className="rounded bg-slate-900 p-2">AB (你对电脑): <strong className="text-white">{AB}</strong></div>
              <div className="rounded bg-slate-900 p-2">BB (电脑对电脑): <strong className="text-white">{BB}</strong></div>
              <div className="rounded bg-slate-900 p-2">BA (电脑对你): <strong className="text-white">{BA}</strong></div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-slate-400">后手电脑理论获胜概率：</span>
              <span className="font-mono text-base font-bold text-emerald-400">
                {(theoreticalBotWinProb * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Match duel controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-800 bg-slate-950/50 p-4">
            <div className="flex items-center gap-4 text-xs font-mono">
              <div>你的比分: <strong className="text-blue-400 text-sm">{playerScore}</strong></div>
              <div className="text-slate-500">vs</div>
              <div>电脑比分: <strong className="text-emerald-400 text-sm">{botScore}</strong></div>
              <div className="text-slate-400 font-sans">
                (胜率: {(playerScore + botScore > 0 ? (botScore / (playerScore + botScore)) * 100 : 0).toFixed(1)}%)
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => runPenneyMatch(100)}
                className="flex items-center gap-1 rounded bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
              >
                <Play className="h-3 w-3" /> 决斗 100 局
              </button>
              <button
                onClick={() => runPenneyMatch(1000)}
                className="rounded bg-emerald-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                决斗 1,000 局
              </button>
              <button
                onClick={() => {
                  setPlayerScore(0);
                  setBotScore(0);
                  setCoinStream('');
                }}
                className="rounded border border-slate-700 px-2.5 py-1 text-xs text-slate-400 hover:bg-slate-800"
              >
                <RotateCcw className="h-3 w-3" /> 重置
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Efron Dice Tab */
        <div className="mt-5 space-y-5">
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 text-xs">
            <span className="font-semibold text-slate-200">Efron 4 颗非传递骰子面值定义：</span>
            <div className="mt-3 grid grid-cols-1 gap-2 font-mono sm:grid-cols-4">
              <div className="rounded border border-slate-800 bg-slate-900 p-2">骰子 A: [4, 4, 4, 4, 0, 0]</div>
              <div className="rounded border border-slate-800 bg-slate-900 p-2">骰子 B: [3, 3, 3, 3, 3, 3]</div>
              <div className="rounded border border-slate-800 bg-slate-900 p-2">骰子 C: [6, 6, 2, 2, 2, 2]</div>
              <div className="rounded border border-slate-800 bg-slate-900 p-2">骰子 D: [5, 5, 5, 1, 1, 1]</div>
            </div>
            <p className="mt-3 text-emerald-400">
              环形克制链：A 胜 B (2/3) → B 胜 C (2/3) → C 胜 D (2/3) → D 胜 A (2/3)！
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs">
              <label className="text-slate-400">选择第 1 颗骰子：</label>
              <div className="mt-2 flex gap-2">
                {(['A', 'B', 'C', 'D'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setSelectedDice1(d);
                      setDice1Wins(0);
                      setDice2Wins(0);
                      setDiceRounds(0);
                    }}
                    className={`rounded px-3 py-1 font-bold ${
                      selectedDice1 === d ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    骰子 {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs">
              <label className="text-slate-400">选择第 2 颗骰子：</label>
              <div className="mt-2 flex gap-2">
                {(['A', 'B', 'C', 'D'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setSelectedDice2(d);
                      setDice1Wins(0);
                      setDice2Wins(0);
                      setDiceRounds(0);
                    }}
                    className={`rounded px-3 py-1 font-bold ${
                      selectedDice2 === d ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    骰子 {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-800 bg-slate-950/50 p-4">
            <div className="text-xs font-mono">
              <span className="text-slate-400">理论 {selectedDice1} 胜率: </span>
              <strong className="text-emerald-400 text-sm">{(exactD1WinProb * 100).toFixed(1)}%</strong>
              <span className="ml-4 text-slate-400">实测比分: </span>
              <span className="text-white">
                {dice1Wins} : {dice2Wins} ({diceRounds} 轮)
              </span>
            </div>

            <button
              onClick={() => runDiceMatch(1000)}
              className="flex items-center gap-1 rounded bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
            >
              <Play className="h-3 w-3" /> 投掷 1,000 次
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
