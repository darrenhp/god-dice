import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-10 text-xs text-slate-500">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <span className="font-semibold text-slate-400">
            GodDice · 上帝的骰子 — 降维概率与算法指南
          </span>
          <p className="text-slate-400 italic">
            “醉汉在微观里踉跄，上帝在宏观里守恒。”
          </p>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <span>基于「拆 · 守恒 · 对称 · 倒放」四大武器</span>
          <span aria-hidden="true">·</span>
          <span>双模兼容 AI Studio & GitHub Pages</span>
        </div>
      </div>
    </footer>
  );
};
