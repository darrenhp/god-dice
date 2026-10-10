import React, { useState } from 'react';
import { WidgetRenderer } from '../widgets/WidgetRenderer';
import { Share2, Check, ArrowLeft, ArrowRight, Layers, Search } from 'lucide-react';

interface WidgetMeta {
  id: string;
  name: string;
  chapter: string;
  category: '必修基础' | '鞅与博弈' | '进阶选修';
  desc: string;
}

export const PlaygroundView: React.FC = () => {
  const widgetList: WidgetMeta[] = [
    // Category 1: 必修基础
    { id: 'MontyHallSim', name: '三门问题', chapter: '序章', category: '必修基础', desc: '可调门数，换门胜率逼近 (n-1)/n' },
    { id: 'BayesTestSim', name: '基础率谬误', chapter: '序章', category: '必修基础', desc: '假阳性与 2×2 列联频数表' },
    { id: 'PrisonersBoxesSim', name: '100 囚犯开盒子', chapter: '序章/第3章', category: '必修基础', desc: '置换环结构追踪与 ~31.2% 奇迹' },
    { id: 'CouponGachaSim', name: '集卡抽卡机', chapter: '第 1 章', category: '必修基础', desc: '10 SSR 抽卡与 10·H₁₀ 期望' },
    { id: 'GaussVisualizer', name: '高斯消元步步推', chapter: '第 2 章', category: '必修基础', desc: '一般图随机游走消元矩阵' },
    { id: 'TreeDPVisualizer', name: '树上游走 DP', chapter: '第 2 章', category: '必修基础', desc: '待定系数与 2·size-1 闭式' },
    { id: 'Walk1DSim', name: '一维游走破产', chapter: '第 2/3/4 章', category: '必修基础', desc: '吸收壁赌徒破产与偏置悬崖' },
    { id: 'CycleLastVisited', name: '环上游走与击中', chapter: '第 3 章', category: '必修基础', desc: '击中时间 p(n-p) 与最后访问 1/(n-1)' },

    // Category 2: 鞅与博弈
    { id: 'MartingalePathSim', name: '鞅路径与停时', chapter: '第 4 章', category: '鞅与博弈', desc: '公平赌局与倍投破产反例' },
    { id: 'BorderCasinoSim', name: '赌场模型 Border', chapter: '第 4 章', category: '鞅与博弈', desc: '歌唱王国与 KMP 筹码计算' },
    { id: 'PenneyGameArena', name: '彭尼博弈 & 骰子', chapter: '第 5 章', category: '鞅与博弈', desc: 'Conway 重叠指数与 Efron 非传递骰' },
    { id: 'VoterModelGrid', name: '投票者模型', chapter: '第 6 章', category: '鞅与博弈', desc: '网格微观同化与宏观守恒' },
    { id: 'BallotBackward', name: '计票时间倒放', chapter: '第 6 章', category: '鞅与博弈', desc: '伯特兰逆向鞅 (P-Q)/(P+Q)' },

    // Category 3: 进阶选修
    { id: 'MarkovElectricalSim', name: '电网络 & Pólya', chapter: '第 7 章', category: '进阶选修', desc: '等效电阻与 1D/2D/3D 常返性' },
    { id: 'OptimalStoppingSim', name: '最优停止决策', chapter: '第 8 章', category: '进阶选修', desc: '秘书 37% 法则与骰子重掷 DP' },
    { id: 'GeometricProbSim', name: '几何概率多模型', chapter: '第 9 章', category: '进阶选修', desc: '蒲丰投针估 π、折木棍 1/4 与弦悖论' },
    { id: 'KellyBankrollSim', name: 'Kelly 准则复利', chapter: '第 10 章', category: '进阶选修', desc: '最佳资金配比与防爆仓防衰减' },
    { id: 'RandomizedAlgorithmsSim', name: '算法概率与两选一', chapter: '第 11 章', category: '进阶选修', desc: '随机快排比较数与球盒两选一力量' },
  ];

  const [selectedCategory, setSelectedCategory] = useState<'全部' | '必修基础' | '鞅与博弈' | '进阶选修'>('全部');
  const [selectedWidgetId, setSelectedWidgetId] = useState<string>('MontyHallSim');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  const filteredWidgets = widgetList.filter((w) => {
    if (selectedCategory !== '全部' && w.category !== selectedCategory) return false;
    if (searchFilter.trim() !== '') {
      const q = searchFilter.toLowerCase();
      return w.name.toLowerCase().includes(q) || w.chapter.toLowerCase().includes(q) || w.desc.toLowerCase().includes(q);
    }
    return true;
  });

  const currentIndex = widgetList.findIndex((w) => w.id === selectedWidgetId);
  const currentWidgetMeta = widgetList[currentIndex] || widgetList[0];

  const handlePrev = () => {
    const nextIdx = (currentIndex - 1 + widgetList.length) % widgetList.length;
    setSelectedWidgetId(widgetList[nextIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % widgetList.length;
    setSelectedWidgetId(widgetList[nextIdx].id);
  };

  const handleCopyShareLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#/playground?sim=${selectedWidgetId}`;
    navigator.clipboard.writeText(url);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Top Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white sm:text-3xl tracking-tight">
            全站互动实验场 (Playground)
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            18 个高精度概率模拟器一站式调试 · 分类收纳，零横向滚动打扰
          </p>
        </div>

        <button
          onClick={handleCopyShareLink}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700 hover:text-white"
        >
          {copiedHash ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
          <span>{copiedHash ? '已复制分享链接！' : '复制组件直达链接'}</span>
        </button>
      </div>

      {/* Category Tabs & Quick Filter Controls (Wrap Grid, No infinite horizontal scroll) */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Segmented Category Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/90 p-1 text-xs">
            {(['全部', '必修基础', '鞅与博弈', '进阶选修'] as const).map((cat) => {
              const count = cat === '全部' ? widgetList.length : widgetList.filter((w) => w.category === cat).length;
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-md px-3 py-1 font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span>{cat}</span>
                  <span className="ml-1 text-[10px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="快速过滤模拟器名称..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Responsive Multi-column Grid (Replaces long horizontal scrollbar) */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {filteredWidgets.map((item) => {
            const isSelected = item.id === selectedWidgetId;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedWidgetId(item.id)}
                className={`flex flex-col items-start justify-between rounded-lg border p-2.5 text-left transition-all ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-950/70 text-emerald-300 shadow-md shadow-emerald-950/50 ring-1 ring-emerald-500/30'
                    : 'border-slate-800/80 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80'
                }`}
              >
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs truncate text-white">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block truncate">
                    {item.chapter}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 line-clamp-1 mt-1 font-sans">
                  {item.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Simulator Stage Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 sm:p-5">
        {/* Quick Prev / Next Navigator Deck */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs">
              {currentIndex + 1}
            </span>
            <div>
              <span className="font-bold text-white text-sm">
                {currentWidgetMeta.name}
              </span>
              <span className="ml-2 text-slate-400 text-xs">
                [{currentWidgetMeta.chapter} · {currentWidgetMeta.category}]
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              title="切换到上一个模拟器"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>上一个</span>
            </button>
            <span className="font-mono text-slate-400 text-[11px] px-1">
              {currentIndex + 1} / {widgetList.length}
            </span>
            <button
              onClick={handleNext}
              className="flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              title="切换到下一个模拟器"
            >
              <span>下一个</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Embedded Interactive Simulator */}
        <WidgetRenderer widgetName={selectedWidgetId} />
      </div>
    </div>
  );
};
