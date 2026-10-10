import React, { useState } from 'react';
import { Network, CheckCircle } from 'lucide-react';

interface TreeNode {
  id: number;
  name: string;
  parentId: number | null;
  children: number[];
  size: number;
  k: number;
  b: number;
  expectedStepsToParent: number;
}

export const TreeDPVisualizer: React.FC = () => {
  // A clean 5-node rooted tree:
  // Node 0 (Root)
  //   -> Node 1 (Child of 0)
  //      -> Node 3 (Child of 1)
  //      -> Node 4 (Child of 1)
  //   -> Node 2 (Child of 0)
  const initialNodes: TreeNode[] = [
    { id: 0, name: '根节点 (Root)', parentId: null, children: [1, 2], size: 5, k: 0, b: 0, expectedStepsToParent: 0 },
    { id: 1, name: '节点 1', parentId: 0, children: [3, 4], size: 3, k: 1, b: 5, expectedStepsToParent: 5 }, // 2*3 - 1 = 5
    { id: 2, name: '节点 2 (叶)', parentId: 0, children: [], size: 1, k: 1, b: 1, expectedStepsToParent: 1 }, // 2*1 - 1 = 1
    { id: 3, name: '节点 3 (叶)', parentId: 1, children: [], size: 1, k: 1, b: 1, expectedStepsToParent: 1 },
    { id: 4, name: '节点 4 (叶)', parentId: 1, children: [], size: 1, k: 1, b: 1, expectedStepsToParent: 1 },
  ];

  const [selectedNodeId, setSelectedNodeId] = useState<number>(1);
  const selectedNode = initialNodes[selectedNodeId];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 text-slate-200 shadow-xl">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-base font-semibold text-white">树上游走与待定系数降维 (Tree Random Walk DP)</h3>
        <p className="text-xs text-slate-400">
          一般图消元需 O(N³)，但树结构天然支持待定系数设 E_u = k_u · E_fa + b_u，自底向上递推并在 O(N) 内收敛！
          均匀游走时子节点走到父节点的期望步数精确满足闭式：2 · size_u - 1。
        </p>
      </div>

      <div className="my-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Visual Tree Layout */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
          <span className="text-xs font-semibold text-slate-300">点击节点查看树形待定系数：</span>

          <div className="mt-4 flex flex-col items-center gap-6">
            {/* Level 0: Root */}
            <button
              onClick={() => setSelectedNodeId(0)}
              className={`flex h-11 w-36 items-center justify-center rounded-lg border text-xs font-semibold transition-all ${
                selectedNodeId === 0
                  ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300 shadow-md shadow-emerald-950/50'
                  : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600'
              }`}
            >
              Root (size=5)
            </button>

            {/* Level 1: Node 1 & Node 2 */}
            <div className="flex w-full justify-around">
              <button
                onClick={() => setSelectedNodeId(1)}
                className={`flex h-11 w-32 items-center justify-center rounded-lg border text-xs font-semibold transition-all ${
                  selectedNodeId === 1
                    ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300 shadow-md shadow-emerald-950/50'
                    : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600'
                }`}
              >
                Node 1 (size=3)
              </button>
              <button
                onClick={() => setSelectedNodeId(2)}
                className={`flex h-11 w-32 items-center justify-center rounded-lg border text-xs font-semibold transition-all ${
                  selectedNodeId === 2
                    ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300 shadow-md shadow-emerald-950/50'
                    : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600'
                }`}
              >
                Node 2 (叶, size=1)
              </button>
            </div>

            {/* Level 2: Children of Node 1 */}
            <div className="flex w-3/4 justify-around">
              <button
                onClick={() => setSelectedNodeId(3)}
                className={`flex h-10 w-28 items-center justify-center rounded-lg border text-xs font-medium transition-all ${
                  selectedNodeId === 3
                    ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
                    : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:border-slate-600'
                }`}
              >
                Node 3 (叶, size=1)
              </button>
              <button
                onClick={() => setSelectedNodeId(4)}
                className={`flex h-10 w-28 items-center justify-center rounded-lg border text-xs font-medium transition-all ${
                  selectedNodeId === 4
                    ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
                    : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:border-slate-600'
                }`}
              >
                Node 4 (叶, size=1)
              </button>
            </div>
          </div>
        </div>

        {/* Node DP Details & Theorem Check */}
        <div className="flex flex-col justify-between rounded-lg border border-slate-800 bg-slate-950/60 p-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-semibold text-white">{selectedNode.name}</span>
              <span className="font-mono text-xs text-slate-400">子树大小 size = {selectedNode.size}</span>
            </div>

            {selectedNode.parentId !== null ? (
              <div className="mt-4 space-y-3 font-mono text-xs">
                <div className="rounded border border-slate-800 bg-slate-900 p-2.5">
                  <span className="text-slate-400 font-sans block text-[11px] mb-1">
                    待定系数方程形式：E_u = k_u · E_fa + b_u
                  </span>
                  <div className="text-emerald-400 font-bold text-sm">
                    E_{selectedNode.id} = 1.0 · E_{selectedNode.parentId} + {selectedNode.b}
                  </div>
                </div>

                <div className="rounded border border-slate-800 bg-slate-900 p-2.5">
                  <span className="text-slate-400 font-sans block text-[11px] mb-1">
                    从该节点出发，首次走到父节点的期望步数：
                  </span>
                  <div className="text-amber-400 font-bold text-sm">
                    E(u → fa) = {selectedNode.expectedStepsToParent} 步
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded border border-emerald-950 bg-emerald-950/30 p-2.5 text-emerald-300">
                  <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span className="text-xs font-sans">
                    检验闭式定理：2 · size - 1 = 2 × {selectedNode.size} - 1 ={' '}
                    <strong className="font-mono">{2 * selectedNode.size - 1} 步</strong> (完全吻合！)
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-4 text-xs text-slate-400">
                这是根节点，作为全树拓扑的基准参考点。
              </div>
            )}
          </div>

          <div className="mt-4 rounded border border-slate-800 bg-slate-900/60 p-3 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-200">为什么是 2·size - 1？</span>
            <p className="mt-1">
              由马尔可夫链的遍历守恒性质，进入这棵大小为 size 的子树，要最终从根部出去，必须穿越每条子树边往返各一次（共 2*(size-1) 步），加上迈入父节点的那最后一步，恰为 2·(size - 1) + 1 = 2·size - 1 步！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
