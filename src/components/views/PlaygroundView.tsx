import React, { useState } from 'react';
import { WidgetRenderer } from '../widgets/WidgetRenderer';
import { PlayCircle, Share2, Sparkles, Check } from 'lucide-react';

export const PlaygroundView: React.FC = () => {
  const widgetList = [
    { id: 'MontyHallSim', name: '三门问题 (Monty Hall)', chapter: '序章' },
    { id: 'BayesTestSim', name: '基础率谬误 (Bayes PPV)', chapter: '序章' },
    { id: 'PrisonersBoxesSim', name: '100 囚犯开盒子', chapter: '序章/第3章' },
    { id: 'CouponGachaSim', name: '集卡抽卡机 (10 SSR)', chapter: '第 1 章' },
    { id: 'GaussVisualizer', name: '高斯消元步步推', chapter: '第 2 章' },
    { id: 'TreeDPVisualizer', name: '树上随机游走 DP', chapter: '第 2 章' },
    { id: 'Walk1DSim', name: '一维游走 & 赌徒破产', chapter: '第 2/3/4 章' },
    { id: 'CycleLastVisited', name: '环上最后访问点 1/(n-1)', chapter: '第 3 章' },
    { id: 'MartingalePathSim', name: '鞅路径 & 停时倍投', chapter: '第 4 章' },
    { id: 'BorderCasinoSim', name: '赌场模型 & KMP Border', chapter: '第 4 章' },
    { id: 'PenneyGameArena', name: '彭尼博弈 & Efron 骰子', chapter: '第 5 章' },
    { id: 'VoterModelGrid', name: '投票者模型宏观守恒', chapter: '第 6 章' },
    { id: 'BallotBackward', name: '伯特兰计票时间倒放', chapter: '第 6 章' },
    { id: 'MarkovElectricalSim', name: '电网络 & Pólya 常返', chapter: '第 7 章' },
    { id: 'OptimalStoppingSim', name: '最优停止 (秘书/掷骰)', chapter: '第 8 章' },
    { id: 'GeometricProbSim', name: '几何概率 (蒲丰/折棍)', chapter: '第 9 章' },
    { id: 'KellyBankrollSim', name: 'Kelly 准则复利仓位', chapter: '第 10 章' },
    { id: 'RandomizedAlgorithmsSim', name: '随机快排 & 两选一力量', chapter: '第 11 章' },
  ];

  const [selectedWidgetId, setSelectedWidgetId] = useState<string>('MontyHallSim');
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  const handleCopyShareLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#/playground?sim=${selectedWidgetId}`;
    navigator.clipboard.writeText(url);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const currentWidgetMeta = widgetList.find((w) => w.id === selectedWidgetId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Page Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white sm:text-3xl tracking-tight">
            全站互动实验场 (Playground)
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            18 个高精度概率模拟器一站式调试 · 支持参数微调与种子复现
          </p>
        </div>

        <button
          onClick={handleCopyShareLink}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700 hover:text-white"
        >
          {copiedHash ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
          <span>{copiedHash ? '已复制分享链接！' : '复制组件链接'}</span>
        </button>
      </div>

      {/* Widget Tabs Carousel */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {widgetList.map((item) => {
          const isActive = item.id === selectedWidgetId;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedWidgetId(item.id)}
              className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${
                isActive
                  ? 'border border-emerald-500/50 bg-emerald-950/60 text-emerald-300 font-bold shadow-md shadow-emerald-950/50'
                  : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{item.name}</span>
              <span className="ml-1.5 text-[10px] text-slate-400 font-normal">
                [{item.chapter}]
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Widget Container */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-2 sm:p-4">
        <div className="mb-3 flex items-center justify-between px-2 text-xs text-slate-400">
          <span className="font-semibold text-white">
            当前载入：{currentWidgetMeta?.name} ({currentWidgetMeta?.chapter})
          </span>
          <span className="font-mono text-[11px] text-emerald-400">
            GodDice Lab Active
          </span>
        </div>
        <WidgetRenderer widgetName={selectedWidgetId} />
      </div>
    </div>
  );
};
