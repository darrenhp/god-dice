import React, { useState } from 'react';
import { SeededRNG } from '../../lib/rng';
import { Play, RotateCcw, Target, CircleDot, HelpCircle } from 'lucide-react';

export const CycleLastVisited: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lastVisited' | 'hittingTime'>('lastVisited');
  const [cycleSize, setCycleSize] = useState<number>(5); // default n=5
  const [seed, setSeed] = useState<number>(314);

  // Tab 1: Last Visited states
  const [simCount, setSimCount] = useState<number>(0);
  const [lastVisitedFreq, setLastVisitedFreq] = useState<number[]>(Array(5).fill(0));
  const [activePos, setActivePos] = useState<number>(0);
  const [visitedNodes, setVisitedNodes] = useState<Set<number>>(new Set([0]));
  const [activeLastNode, setActiveLastNode] = useState<number | null>(null);

  // Tab 2: Hitting Time (0 -> p) states
  const [targetP, setTargetP] = useState<number>(1);
  const [hittingSimCount, setHittingSimCount] = useState<number>(0);
  const [hittingStepsAccum, setHittingStepsAccum] = useState<number>(0);
  const [currentHittingPos, setCurrentHittingPos] = useState<number>(0);
  const [currentHittingSteps, setCurrentHittingSteps] = useState<number>(0);
  const [isHitTarget, setIsHitTarget] = useState<boolean>(false);

  const resetLastVisited = (newSize = cycleSize) => {
    setActivePos(0);
    setVisitedNodes(new Set([0]));
    setActiveLastNode(null);
    setSimCount(0);
    setLastVisitedFreq(Array(newSize).fill(0));
  };

  const resetHittingTime = () => {
    setCurrentHittingPos(0);
    setCurrentHittingSteps(0);
    setIsHitTarget(false);
    setHittingSimCount(0);
    setHittingStepsAccum(0);
  };

  // Step single for Tab 1
  const stepSingleLastVisited = () => {
    if (visitedNodes.size === cycleSize) return;
    const rng = new SeededRNG(Date.now());
    const dir = rng.nextBool() ? 1 : -1;
    const nextPos = (activePos + dir + cycleSize) % cycleSize;
    setActivePos(nextPos);

    const nextVisited = new Set(visitedNodes);
    if (!nextVisited.has(nextPos)) {
      nextVisited.add(nextPos);
      if (nextVisited.size === cycleSize) {
        setActiveLastNode(nextPos);
        setSimCount((c) => c + 1);
        setLastVisitedFreq((prev) => {
          const nextArr = [...prev];
          nextArr[nextPos]++;
          return nextArr;
        });
      }
    }
    setVisitedNodes(nextVisited);
  };

  // Batch sim for Tab 1
  const runBatchLastVisited = (count: number) => {
    const rng = new SeededRNG(seed + simCount);
    const newFreq = [...lastVisitedFreq];

    for (let c = 0; c < count; c++) {
      const visited = new Set<number>([0]);
      let pos = 0;
      let lastNode = 0;

      while (visited.size < cycleSize) {
        const dir = rng.nextBool() ? 1 : -1;
        pos = (pos + dir + cycleSize) % cycleSize;
        if (!visited.has(pos)) {
          visited.add(pos);
          lastNode = pos;
        }
      }
      newFreq[lastNode]++;
    }

    setSimCount((prev) => prev + count);
    setLastVisitedFreq(newFreq);
  };

  // Step single for Tab 2 (Hitting Time)
  const stepSingleHitting = () => {
    if (isHitTarget) return;
    const rng = new SeededRNG(Date.now());
    const dir = rng.nextBool() ? 1 : -1;
    const nextPos = (currentHittingPos + dir + cycleSize) % cycleSize;
    const nextSteps = currentHittingSteps + 1;
    setCurrentHittingPos(nextPos);
    setCurrentHittingSteps(nextSteps);

    if (nextPos === targetP) {
      setIsHitTarget(true);
      setHittingSimCount((c) => c + 1);
      setHittingStepsAccum((s) => s + nextSteps);
    }
  };

  // Batch sim for Tab 2 (Hitting Time)
  const runBatchHitting = (count: number) => {
    const rng = new SeededRNG(seed + hittingSimCount + 777);
    let totalSteps = 0;

    for (let c = 0; c < count; c++) {
      let pos = 0;
      let steps = 0;
      while (pos !== targetP && steps < 50000) {
        const dir = rng.nextBool() ? 1 : -1;
        pos = (pos + dir + cycleSize) % cycleSize;
        steps++;
      }
      totalSteps += steps;
    }

    setHittingSimCount((prev) => prev + count);
    setHittingStepsAccum((prev) => prev + totalSteps);
  };

  // Theoretical values:
  // Tab 1: 1 / (n - 1)
  const theoreticalLastRate = cycleSize > 1 ? (1 / (cycleSize - 1)) * 100 : 0;
  // Tab 2: H(0 -> p) = p * (n - p)
  const theoreticalHittingSteps = targetP * (cycleSize - targetP);
  const empiricalHittingSteps =
    hittingSimCount > 0 ? hittingStepsAccum / hittingSimCount : 0;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 text-slate-200 shadow-xl">
      {/* Header with Sub-tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-semibold text-white">环上游走核心实验室 (Cycle Random Walk)</h3>
          <p className="text-xs text-slate-400">
            两个核心命题：从 0 走到 p 的击中时间 p(n-p)，与覆盖全图时最后被访问点的均等性 1/(n-1)
          </p>
        </div>

        <div className="flex rounded-lg bg-slate-800 p-0.5 text-xs">
          <button
            onClick={() => setActiveTab('lastVisited')}
            className={`flex items-center gap-1.5 rounded px-3 py-1 font-medium transition-colors ${
              activeTab === 'lastVisited'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CircleDot className="h-3.5 w-3.5" />
            <span>命题一：最后访问点 1/(n-1)</span>
          </button>
          <button
            onClick={() => setActiveTab('hittingTime')}
            className={`flex items-center gap-1.5 rounded px-3 py-1 font-medium transition-colors ${
              activeTab === 'hittingTime'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Target className="h-3.5 w-3.5" />
            <span>命题二：从 0 到 p 击中时间 p(n-p)</span>
          </button>
        </div>
      </div>

      {/* Global Cycle Size Selector */}
      <div className="my-3 flex items-center justify-between text-xs border-b border-slate-800/60 pb-3">
        <label className="flex items-center gap-2 text-slate-300">
          <span className="font-semibold text-white">环节点总数 n:</span>
          <select
            value={cycleSize}
            onChange={(e) => {
              const val = Number(e.target.value);
              setCycleSize(val);
              setTargetP(1);
              resetLastVisited(val);
              resetHittingTime();
            }}
            className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-white font-mono focus:outline-none"
          >
            <option value={4}>4 个节点 (0, 1, 2, 3)</option>
            <option value={5}>5 个节点 (0, 1, 2, 3, 4)</option>
            <option value={6}>6 个节点 (0, 1, 2, 3, 4, 5)</option>
            <option value={8}>8 个节点 (0, 1, 2, 3, 4, 5, 6, 7)</option>
          </select>
        </label>

        <span className="text-slate-400 text-[11px]">
          顺时针标号为 0 到 {cycleSize - 1} · 默认起点为 0
        </span>
      </div>

      {activeTab === 'lastVisited' ? (
        /* TAB 1: LAST VISITED VERTEX */
        <div>
          {/* Problem Statement Box */}
          <div className="mb-4 rounded-lg border border-slate-800 bg-slate-950/70 p-3.5 text-xs">
            <span className="font-bold text-emerald-400">【命题一：完整题意与规则】</span>
            <ul className="mt-1.5 list-disc list-inside space-y-1 text-slate-300 leading-relaxed">
              <li>
                <strong>起点状态</strong>：游走者在 <code className="font-mono text-emerald-300">t = 0</code> 时刻从节点 0 出发。此时节点 0 已经属于「已访问集合」（已点亮），但其余节点全是未访问的空白节点。
              </li>
              <li>
                <strong>游走过程</strong>：每一步以等概率 1/2 顺时针或逆时针走动。中途游走者可以<strong>无数次路过节点 0</strong>。
              </li>
              <li>
                <strong>停止时刻</strong>：直到圆环上所有 <code className="font-mono text-white">{cycleSize}</code> 个节点均至少被踏足一次时，游戏立即停止！
              </li>
              <li>
                <strong>核心问题</strong>：在游戏终止的瞬间，游走者脚下踩着的那个<strong>全图最后一个被首次点亮的新节点</strong>是谁？除 0 之外的每个节点被选中的概率是多少？
              </li>
            </ul>
          </div>

          {/* Visual Polygon Ring */}
          <div className="my-5 flex flex-col items-center justify-center rounded-lg border border-slate-800 bg-slate-950/60 p-6">
            <div className="relative h-56 w-56">
              <div className="absolute inset-4 rounded-full border border-dashed border-slate-800" />

              {Array.from({ length: cycleSize }).map((_, idx) => {
                const angle = (idx / cycleSize) * 2 * Math.PI - Math.PI / 2;
                const r = 90;
                const cx = 112 + r * Math.cos(angle);
                const cy = 112 + r * Math.sin(angle);

                const isCurrent = activePos === idx;
                const isVisited = visitedNodes.has(idx);
                const isStart = idx === 0;
                const isLast = activeLastNode === idx;

                return (
                  <div
                    key={idx}
                    style={{ left: `${cx}px`, top: `${cy}px` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 flex-col items-center justify-center rounded-full border font-mono text-xs font-bold transition-all ${
                      isCurrent
                        ? 'border-emerald-400 bg-emerald-500 text-slate-950 scale-125 z-20 shadow-lg shadow-emerald-500/50'
                        : isLast
                          ? 'border-amber-400 bg-amber-950 text-amber-300 z-10'
                          : isVisited
                            ? 'border-emerald-700/60 bg-emerald-950/40 text-emerald-300'
                            : isStart
                              ? 'border-blue-500 bg-blue-950 text-blue-300'
                              : 'border-slate-700 bg-slate-800 text-slate-400'
                    }`}
                  >
                    <span>{idx}</span>
                    {isStart && <span className="text-[8px] font-sans">起点</span>}
                    {isLast && <span className="text-[8px] font-sans">压轴</span>}
                  </div>
                );
              })}
            </div>

            <div className="mt-2 flex gap-2">
              <button
                onClick={stepSingleLastVisited}
                disabled={visitedNodes.size === cycleSize}
                className="rounded bg-slate-800 px-3 py-1 text-xs text-slate-300 hover:bg-slate-700 disabled:opacity-40"
              >
                单步走一步
              </button>
              <button
                onClick={() => resetLastVisited()}
                className="flex items-center gap-1 rounded border border-slate-700 px-2.5 py-1 text-xs text-slate-400 hover:bg-slate-800"
              >
                <RotateCcw className="h-3 w-3" /> 重置单局
              </button>
            </div>
          </div>

          {/* Frequencies & Explanation Box */}
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-300">
                  各节点作为「最后一个被首次访问点」的实测频率
                </span>
                <span className="font-mono text-xs text-slate-400">(试验: {simCount} 次)</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => runBatchLastVisited(100)}
                  className="flex items-center gap-1 rounded bg-emerald-700 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-600"
                >
                  <Play className="h-3 w-3" /> +100 次
                </button>
                <button
                  onClick={() => runBatchLastVisited(1000)}
                  className="rounded bg-emerald-800 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700"
                >
                  +1,000 次
                </button>
              </div>
            </div>

            {/* Crucial Note about Node 0 */}
            <div className="mb-4 rounded border border-amber-900/60 bg-amber-950/30 p-3 text-xs text-amber-200">
              <div className="flex items-start gap-2">
                <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <div>
                  <strong className="text-white">为什么候选列表中没有节点 0？</strong>
                  <p className="mt-1 text-slate-300">
                    因为游走者从节点 0 出发，节点 0 在第 0 步就已经被访问过了！终点规则是「全图所有新节点都被点亮」，因此<strong>最后一个被首次踏足的新节点</strong>只能从其余的 1 到 {cycleSize - 1} 中诞生，绝不可能是 0。
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {Array.from({ length: cycleSize }).map((_, idx) => {
                if (idx === 0) return null;
                const count = lastVisitedFreq[idx];
                const rate = simCount > 0 ? (count / simCount) * 100 : 0;
                return (
                  <div key={idx} className="text-xs">
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-300">
                        节点 {idx} 频率: {rate.toFixed(2)}% ({count} 次)
                      </span>
                      <span className="text-emerald-400">
                        理论值: {theoreticalLastRate.toFixed(2)}% (严格等于 1/{cycleSize - 1})
                      </span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: HITTING TIME (0 -> p) */
        <div>
          {/* Mathematical Explanation Box */}
          <div className="mb-4 rounded-lg border border-slate-800 bg-slate-950/70 p-4 text-xs leading-relaxed">
            <span className="font-bold text-emerald-400">【命题二：环上击中时间 H(0 → p) 剪开拉直定理】</span>
            <p className="mt-2 text-slate-300">
              问：从节点 0 出发，首次走到目标节点 p 的期望步数是多少？
            </p>
            <div className="mt-2.5 rounded-lg border border-slate-800 bg-slate-900 p-3 font-mono text-emerald-300">
              H(0 → p) = p · (n - p)
            </div>
            <p className="mt-2.5 text-slate-400">
              <strong>为什么可以拉直？</strong> 因为在游走者<strong>首次撞到目标 p 之前</strong>，他从未碰触过节点 p。因此，我们可以在目标节点 p 处把圆环剪开，展开成一段长度为 n 的线段！线段两端都是目标点 p（顺时针走 p 步到达，逆时针走 n - p 步到达）。
              这与在区间 [0, n] 上起点为 p、两端均为吸收壁的赌徒破产问题完全同构！由差分递推立刻解得期望步数为：<strong>p(n - p)</strong>。
            </p>
          </div>

          {/* Interactive Target Chooser */}
          <div className="my-4 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-white">选择目标节点 p (距离起点 0 为 p 步)：</span>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: cycleSize - 1 }).map((_, idx) => {
                  const nodeVal = idx + 1;
                  const isSelected = targetP === nodeVal;
                  return (
                    <button
                      key={nodeVal}
                      onClick={() => {
                        setTargetP(nodeVal);
                        resetHittingTime();
                      }}
                      className={`rounded px-3 py-1 font-mono text-xs font-bold transition-all ${
                        isSelected
                          ? 'border border-emerald-500 bg-emerald-950/80 text-emerald-300 shadow-sm'
                          : 'border border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      目标 p = {nodeVal}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Path Progress */}
            <div className="mt-4 flex flex-wrap items-center justify-between border-t border-slate-800/80 pt-3 text-xs font-mono">
              <span className="text-slate-400">
                当前游走位置: <strong className="text-emerald-400">{currentHittingPos}</strong>
                {isHitTarget ? (
                  <span className="ml-2 text-amber-400 font-bold">🎯 首次到达目标 p={targetP}！历经 {currentHittingSteps} 步</span>
                ) : (
                  <span className="ml-2 text-slate-400 font-normal">(已走 {currentHittingSteps} 步)</span>
                )}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={stepSingleHitting}
                  disabled={isHitTarget}
                  className="rounded bg-slate-800 px-3 py-1 text-xs text-slate-300 hover:bg-slate-700 disabled:opacity-40"
                >
                  单步走
                </button>
                <button
                  onClick={resetHittingTime}
                  className="rounded border border-slate-700 px-2.5 py-1 text-xs text-slate-400 hover:bg-slate-800"
                >
                  <RotateCcw className="h-3 w-3" /> 重置
                </button>
              </div>
            </div>
          </div>

          {/* Batch Monte Carlo Simulator & Formula Verification */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
              <div className="mb-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">蒙特卡洛首达测试 (从 0 走到 {targetP})</span>
                <span className="font-mono text-slate-400">已测: {hittingSimCount} 次</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => runBatchHitting(200)}
                  className="flex items-center gap-1 rounded bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600"
                >
                  <Play className="h-3 w-3" /> +200 次
                </button>
                <button
                  onClick={() => runBatchHitting(1000)}
                  className="rounded bg-emerald-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                >
                  +1,000 次
                </button>
                <button
                  onClick={resetHittingTime}
                  className="rounded border border-slate-700 px-2.5 py-1 text-xs text-slate-400 hover:bg-slate-800"
                >
                  清空
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4 font-mono text-xs">
              <span className="font-sans font-semibold text-slate-300">闭式公式 p(n - p) 验算</span>

              <div className="mt-3 space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">实测平均到达步数:</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {empiricalHittingSteps.toFixed(2)} 步
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">
                    理论闭式 {targetP} × ({cycleSize} - {targetP}):
                  </span>
                  <span className="text-white font-bold text-sm">
                    {theoreticalHittingSteps.toFixed(2)} 步
                  </span>
                </div>

                <div className="rounded bg-slate-900 p-2 font-sans text-[11px] text-slate-400">
                  即使目标只是紧邻的节点 1，从 0 走到 1 的期望步数也是 1 × ({cycleSize} - 1) = {cycleSize - 1} 步！因为中途有一半概率走向反方向。
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
