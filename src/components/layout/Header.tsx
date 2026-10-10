import React from 'react';
import { Sparkles, Github } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenDeployModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenDeployModal,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate('chapter:preface')}
          className="flex items-center gap-2 whitespace-nowrap text-left shrink-0 text-base font-bold tracking-tight text-white transition-opacity hover:opacity-90"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-sm">
            🎲
          </span>
          <span className="font-sans font-extrabold text-white">
            GodDice <span className="text-emerald-400">· 上帝的骰子</span>
          </span>
        </button>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigate('chapter:preface')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentView.startsWith('chapter:')
                ? 'text-emerald-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            教程
          </button>
          <button
            onClick={() => onNavigate('playground')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentView === 'playground'
                ? 'text-emerald-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            实验场
          </button>
          <button
            onClick={() => onNavigate('cheatsheet')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentView === 'cheatsheet'
                ? 'text-emerald-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            速查手册
          </button>
          <button
            onClick={() => onNavigate('problems')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentView === 'problems'
                ? 'text-emerald-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            题库
          </button>
          <button
            onClick={() => onNavigate('verification')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentView === 'verification'
                ? 'text-emerald-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            数值核对清单
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenDeployModal}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/40 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 transition-all hover:bg-emerald-900/50 hover:border-emerald-500 whitespace-nowrap shrink-0"
          >
            <Github className="h-3.5 w-3.5 text-emerald-400" />
            <span>GitHub Pages 部署</span>
          </button>
        </div>
      </div>
    </header>
  );
};
