import React from 'react';
import { X, CheckCircle, Github, Terminal, Globe } from 'lucide-react';

interface DeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-200 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Github className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              AI Studio & GitHub Pages 双模兼容部署方案
            </h2>
            <p className="text-xs text-slate-400">
              如何一键推送到 GitHub 并自动部署到 https://darrenhp.github.io/god-dice/
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4 text-xs leading-relaxed">
          <div className="rounded-lg border border-emerald-900/60 bg-emerald-950/20 p-3.5">
            <div className="flex items-center gap-2 font-semibold text-emerald-300">
              <CheckCircle className="h-4 w-4" />
              <span>当前已配置就绪，无需手动繁琐修改！</span>
            </div>
            <p className="mt-1 text-slate-300">
              本项目在 <code className="rounded bg-slate-800 px-1 py-0.5 font-mono text-emerald-400">vite.config.ts</code> 中配置了智能动态基路径：
              <code className="ml-1 rounded bg-slate-800 px-1 py-0.5 font-mono text-emerald-400">base: process.env.VITE_BASE_PATH || './'</code>。
              在 AI Studio 开发预览中默认使用相对路径 <code className="font-mono text-emerald-400">./</code>（可在任何域名子路径直接运行），在 GitHub Actions 构建时自动注入 <code className="font-mono text-emerald-400">/god-dice/</code>，彻底杜绝 404！
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Terminal className="h-4 w-4 text-slate-400" />
              <span>部署步骤 (只需要两步)：</span>
            </h3>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-slate-300">
              <span className="text-slate-500 font-sans block mb-1">1. 推送代码至 GitHub 仓库（如 god-dice）：</span>
              <pre className="overflow-x-auto text-emerald-400">
git init
git add .
git commit -m "feat: init GodDice interactive guide"
git remote add origin https://github.com/darrenhp/god-dice.git
git branch -M main
git push -u origin main
              </pre>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-slate-300">
              <span className="text-slate-500 font-sans block mb-1">2. 开启 GitHub Pages 自动化发布：</span>
              <p className="font-sans text-slate-400">
                进入仓库的 <strong>Settings → Pages → Build and deployment → Source</strong>，下拉选择 <strong className="text-white">GitHub Actions</strong> 即可。
                仓库根目录下的 <code className="text-emerald-400">.github/workflows/deploy.yml</code> 会自动执行类型检查、构建并在 1 分钟内完成部署！
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-400" />
              <span className="text-slate-300">目标发布生产网址：</span>
            </div>
            <a
              href="https://darrenhp.github.io/god-dice/"
              target="_blank"
              rel="noreferrer"
              className="font-mono text-emerald-400 hover:underline"
            >
              https://darrenhp.github.io/god-dice/
            </a>
          </div>
        </div>

        <div className="mt-6 flex justify-end border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
          >
            了解并关闭
          </button>
        </div>
      </div>
    </div>
  );
};
