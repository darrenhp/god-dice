export interface ChapterData {
  id: string;
  number: number | 'preface' | 'appendix';
  title: string;
  subtitle: string;
  tier: '必修' | '进阶' | '选修' | '附录';
  toolUsed: ('拆' | '守恒' | '对称' | '倒放')[];
  summary: string;
  primaryWidget: string;
  sections: {
    heading: string;
    content: string;
    latexFormula?: string;
  }[];
  keyFormulaLatex: string;
  recommendedProblems: string[]; // Problem IDs
}

export const CHAPTERS_DATA: ChapterData[] = [
  {
    id: 'ch_preface',
    number: 'preface',
    title: '序章：直觉谬误博物馆',
    subtitle: '为什么人类直觉在概率面前总是失效？',
    tier: '必修',
    toolUsed: ['拆', '对称'],
    summary: '收集蒙提霍尔三门问题、假阳性基础率谬误、生日悖论、100 囚犯开盒子、两信封悖论与圣彼得堡悖论等经典反直觉命题，打碎日常思维的错觉。',
    primaryWidget: 'MontyHallSim',
    keyFormulaLatex: 'P(A \\mid B) = \\frac{P(B \\mid A) P(A)}{P(B)}',
    sections: [
      {
        heading: '直觉的破产：人类大脑并非为概率进化',
        content: '在现实世界中，人类习惯于因果线性思维，对「条件」的更新极其迟钝。三门问题中，许多人坚信剩下的两扇门依然是 50:50；医学检测中，面对 99% 精确度的阳性报告，几乎所有人认为自己必死无疑。本章作为全书序章，为你陈列直觉最容易折戟的经典展品。',
      },
      {
        heading: '三门问题与上帝信息增量',
        content: '当你最初选定一扇门时，选中山羊的概率是 (n-1)/n。主持人是一位拥有全知视角（上帝视角）的裁判，他不会随机乱开，而是必然在剩下的门中帮你排掉 n-2 扇羊门！因此，「换门」本质上是在继承最初挑错的庞大先验概率。',
        latexFormula: 'P(\\text{换门获胜}) = \\frac{n-1}{n}',
      },
      {
        heading: '基础率谬误：微观高精度与宏观低发病率的拉扯',
        content: '当罕见病基础发病率只有 1% 时，100,000 人中仅有 1,000 名患者。即使检测特异度高达 99%，99,000 名健康人中也会产生 990 名“假阳性”！真阳性与假阳性在分子分母中几乎平分秋色。检测阳性并不等于确诊！',
        latexFormula: 'P(D \\mid +) = \\frac{0.01 \\times 0.99}{0.01 \\times 0.99 + 0.99 \\times 0.01} = 50\\%',
      },
      {
        heading: '100 囚犯与置换环奇迹',
        content: '如果每个囚犯独立随机抽选 50 个盒子，全员生还概率低至 (1/2)¹⁰⁰ ≈ 7.9×10⁻³¹，在宇宙尺度上等同于不可能。然而，通过顺次追踪盒子内部号码形成的置换环，囚犯们将彼此的命运绑定在了一起：只要整个随机置换中不存在长度大于 50 的环，所有人将同时成功！',
        latexFormula: 'P(\\text{生还}) = 1 - \\sum_{L=51}^{100} \\frac{1}{L} = 1 - (H_{100} - H_{50}) \\approx 1 - \\ln 2 \\approx 31.18\\%',
      },
    ],
    recommendedProblems: ['p_100_prisoners_boxes', 'p_first_ace'],
  },
  {
    id: 'ch_1',
    number: 1,
    title: '第 1 章 破除直觉：期望的线性性',
    subtitle: '第一把上帝武器：「拆」——不问整体分布，只问微观指示',
    tier: '必修',
    toolUsed: ['拆', '对称'],
    summary: '期望线性性 E[X+Y] = E[X] + E[Y] 永远成立，完全不需要 X 与 Y 相互独立！配合 0/1 指示变量与对称性，把复杂的全局组合期望瞬间切成微观碎片。',
    primaryWidget: 'CouponGachaSim',
    keyFormulaLatex: 'E[\\sum_{i=1}^n X_i] = \\sum_{i=1}^n E[X_i] \\qquad (\\text{无需独立})',
    sections: [
      {
        heading: '泥潭：试图硬算概率分布的悲剧',
        content: '初学者在面对期望题时，第一反应往往是求解 P(X = k) 的分布列，然后用定义 ∑ k·P(X=k) 去求和。但这往往直接撞上组合爆炸的死胡同。例如抽卡集齐 10 种 SSR，若想算刚好在第 k 次集齐的概率，需要用到第二类斯特林数和极其复杂的容斥。',
      },
      {
        heading: '降维：指示变量与几何分解',
        content: '上帝武器第一招：拆！定义 X_i 为收集第 i 种新卡所需的额外步数。因为每当你手头已有 i-1 种卡时，下一次抽到未拥有卡牌的概率是 (N - i + 1) / N，这是独立的几何分布，其期望步数就是概率的倒数 N / (N - i + 1)！将它们全部相加，立刻得出优雅的调和数结论。',
        latexFormula: 'E[T_N] = \\sum_{i=1}^N \\frac{N}{N - i + 1} = N \\sum_{i=1}^N \\frac{1}{i} = N H_N',
      },
      {
        heading: '树上游戏 CF 280C：线性性与祖先深度',
        content: '在树上每次随机选一个现存节点并删除其整棵子树，求删光所有节点的期望步数。若按时间步推导将陷入深渊；但利用指示变量 I_u 表示“节点 u 是否由自己被选中而删除”，u 必须在其所有祖先节点之前被选到，概率恰好是 1 / depth(u)！总期望就是所有深度的倒数和！',
        latexFormula: 'E[\\text{Steps}] = \\sum_{u=1}^n \\frac{1}{\\mathrm{depth}(u)}',
      },
      {
        heading: '适用条件与反例警示',
        content: '线性性对求和永远成立；但注意：E[XY] = E[X]E[Y] 仅在独立时成立；方差 Var(X+Y) = Var(X) + Var(Y) + 2Cov(X,Y) 需要协方差为零；高阶矩 E[X²] 绝不能直接平方！',
      },
    ],
    recommendedProblems: ['p_cf280c', 'p_luogu_1291', 'p_luogu_4550', 'p_cf235b', 'p_first_ace', 'p_random_perm_cycles'],
  },
  {
    id: 'ch_2',
    number: 2,
    title: '第 2 章 微观的挣扎：状态机与图论',
    subtitle: '从一般图到树与链的降维阶梯',
    tier: '必修',
    toolUsed: ['拆'],
    summary: '高斯消元是 O(N³) 的重型武器。但通过 DAG 拓扑倒推、树上待定系数 k,b (O(N))、链上差分与对称合并，绝大多数图论游走问题都能被降维秒杀。',
    primaryWidget: 'GaussVisualizer',
    keyFormulaLatex: 'E_u = 1 + \\sum_{v} P(u \\to v) E_v \\implies (I - P)E = 1',
    sections: [
      {
        heading: '一般图的矩阵泥潭：高斯消元 O(N³)',
        content: '在任意图上，从节点 u 出发的击中时间满足全期望方程 E_u = 1 + ∑ P(u→v) E_v。这是一个 N 阶线性方程组 (I - P)E = 1。使用标准高斯消元需要 O(N³) 时间，遇到网格图或树状图时效率低下。',
      },
      {
        heading: '树上待定系数：自底向上 O(N)',
        content: '树没有环。设每个节点到父节点的线性递推关系为 E_u = k_u · E_fa + b_u。叶子节点常数确定，自底向上可以线性合并计算出所有 k_u 和 b_u，然后再自顶向下代入即可！均匀游走时更存在惊人的闭式：E(u → fa) = 2·size_u - 1。',
        latexFormula: 'E_u = k_u E_{\\mathrm{fa}} + b_u \\qquad \\implies \\quad E(u \\to \\mathrm{fa}) = 2 \\cdot \\mathrm{size}_u - 1',
      },
      {
        heading: '立方体顶点对称合并：8 维坍缩为 3 维',
        content: '立方体有 8 个顶点，若列 8 阶消元极其繁琐。但根据距对角终点的曼哈顿距离，8 个点可以完美折叠为距离 0, 1, 2, 3 的 4 个等价类！列出 3 阶简单方程组，立即解出 10 步。',
      },
    ],
    recommendedProblems: ['p_luogu_4316', 'p_luogu_3232', 'p_cube_walk', 'p_coin_hh_ht'],
  },
  {
    id: 'ch_3',
    number: 3,
    title: '第 3 章 拓扑的魔法：环上游走与拉直',
    subtitle: '第二把上帝武器：「对称与拓扑」——拉直闭合边界',
    tier: '必修',
    toolUsed: ['对称', '拆'],
    summary: '深入环上游走的两大核心命题：从 0 走到 p 的击中时间 H(0→p) = p(n-p)（切环拉直为赌徒破产），以及覆盖全图时每个节点成为压轴最后访问点的完全均等性 1/(n-1)。',
    primaryWidget: 'CycleLastVisited',
    keyFormulaLatex: 'H(0 \\to p) = p(n - p) \\qquad P(\\text{第 } n \\text{ 个点是 } v) = \\frac{1}{n-1} \\quad (v \\ne 0)',
    sections: [
      {
        heading: '一、题意严格定义与边界澄清',
        content: '设定：一个长度为 n 的无向圆环，节点依次顺时针编号为 0, 1, 2, ..., n-1。游走者在 t = 0 时刻处于节点 0（节点 0 从一开始即属于「已访问集合」）。每一步以等概率 1/2 顺时针或逆时针移动到相邻节点。\n\n本章研究两个核心命题：\n1. 击中时间（Hitting Time）：从 0 出发，首次到达指定目标节点 p 需要走多少步？\n2. 覆盖与终局节点（Cover & Last Visited）：游走一直持续到全图所有 n 个节点均被至少访问一次时终止，哪一个节点是全图最后一个被首次访问的？',
      },
      {
        heading: '二、从 0 走到 p 的期望步数：拉直为赌徒破产',
        content: '很多同学会觉得在环上可能顺时针绕过去，也可能逆时针绕过去，列方程会无限成环。然而，用「上帝视角」看：在首次到达目标节点 p 之前，游走者从未触碰过 p！\n\n因此，我们可以直接在目标节点 p 处将圆环剪断并拉直为一条线段！\n• 剪断后，两端点都是目标节点 p（左端是逆时针到达 p，右端是顺时针到达 p）。\n• 整个线段总长度为 n，起点 0 距离一端为 p，距离另一端为 n - p。\n• 无论游走者先碰触左端还是右端，都意味着首次成功抵达了节点 p！\n\n这在数学上完全等价于：区间 [0, n] 上两端均为吸收壁的经典赌徒破产问题！设 E_x 为当前距目标距离为 x 时的期望步数，由方程 E_x = 1 + 0.5 E_{x-1} + 0.5 E_{x+1} 且 E_0 = E_n = 0，代数解精确给出：\nE_p = p(n - p)。',
        latexFormula: 'H(0 \\to p) = p(n - p)',
      },
      {
        heading: '三、实例验算：相邻点 1 为什么期望要走 n-1 步？',
        content: '例如 n = 5 的环，从 0 走到邻居 1（距离 p = 1）：\n期望步数不是 1，而是 1 × (5 - 1) = 4 步！\n直觉解释：虽然有 50% 的概率第 1 步就直接走到 1，但还有 50% 的概率第 1 步反向走到了 4。一旦走到 4，游走者就陷入了深渊，必须在全环中反复震荡，甚至顺时针绕整整一圈才到 1！这些深渊路径的权重拉高了整体均值，不多不少正好平衡在 4 步。',
      },
      {
        heading: '四、最后一个被点亮节点的完全均等性：1 / (n-1)',
        content: '全图覆盖时刻 T 定义为已访问节点数首次达到 n 的瞬间。因为起点 0 在第 0 步已被标记访问，所以压轴被首次点亮的新节点只能在 1 ~ n-1 产生。\n\n大多数人的直觉会误认为：离起点 0 最远的对称点（如 n/2）最难到达，理应最容易成为最后被访问的点。然而，严格结论是：除起点 0 外，其余每一个节点 v 成为最后一个被访问点的概率严格相同，全都是 1 / (n - 1)！\n\n推导证明（拓扑弧段拉直）：\n任意时刻，已访问过的所有点在圆环上必然构成一段连续的闭弧 [L, R]。当弧长增长到 n - 1 时，全图仅剩最后一个空白节点 v 未被访问。此时游走者必定停留在 v 的两个紧邻点（v-1 或 v+1）之一！节点 v 能够成为这唯一的幸存者，等价于以 v 为剪断点的线段上，游走者在撞到 v 之前先走遍了其余所有区域。由对称性，每个外侧位置的幸存概率完全一致！',
        latexFormula: 'P(v \\text{ 是最后一个被首次访问的节点}) = \\frac{1}{n-1} \\qquad (\\forall v \\in \\{1, 2, \\dots, n-1\\})',
      },
      {
        heading: '五、全环覆盖时间（Cover Time）',
        content: '在圆环上，将已访问弧段从长度 k 扩张到 k+1，游走者正处于弧段的端点，要离开这段弧触碰新点，期望需要 k 步。将扩张过程从 k = 1 一直累加到 n - 1，即可得出访问完整个圆环所需的期望总步数：\nC = 1 + 2 + 3 + ... + (n - 1) = n(n - 1) / 2。',
        latexFormula: 'C_n = \\sum_{k=1}^{n-1} k = \\frac{n(n-1)}{2}',
      },
    ],
    recommendedProblems: ['p_cycle_last_visited', 'p_100_prisoners_boxes'],
  },
  {
    id: 'ch_4',
    number: 4,
    title: '第 4 章 上帝的武器：鞅与停时定理',
    subtitle: '第三把上帝武器：「守恒」——寻找绝对公平的赌局',
    tier: '必修',
    toolUsed: ['守恒'],
    summary: '什么是绝对公平？条件期望 E[X_{n+1} | F_n] = X_n。结合 Doob 停时定理，将复杂的随机过程时间求解，降维成初态与终态的守恒代数方程！',
    primaryWidget: 'MartingalePathSim',
    keyFormulaLatex: 'E[X_T] = E[X_0] \\qquad (\\text{停时定理三条件})',
    sections: [
      {
        heading: '绝对公平的定义：鞅 (Martingale)',
        content: '如果一个随机过程满足未来时刻的条件期望恒等于当下，这就是鞅。鞅是数学中最纯粹的“能量守恒”。由 Doob 停时定理，在温和条件下，即使我们在某个随机时刻 T 停下，系统守恒量依旧不变：E[X_T] = E[X_0]！',
      },
      {
        heading: '赌场模型与 CTSC 歌唱王国：秒杀字符串等待时间',
        content: '每一秒有一位新赌徒携带 1 元进入赌场，押注下一个字符是否匹配目标串 S。若匹配成功，筹码翻 m 倍；若失败则离场。赌场是绝对公平的，总筹码是鞅！在字符串 S 首次出现时游戏停止，此时唯有属于 S 的 KMP Border 的赌徒能够幸存，带走 m^k 筹码！',
        latexFormula: 'E[T] = \\sum_{k \\in \\mathrm{Border}(S)} m^k',
      },
      {
        heading: '势函数法：CF 1349D Slime and Biscuits',
        content: '当状态空间指数爆炸时，寻找单变量势能函数 f(x)，令总势能 Φ = ∑ f(a_i) 满足 E[ΔΦ] = -1。此时 Φ_t + t 构成一个标准的鞅！停时步数 E[T] 直接等于终态势能与初态势能的差值！',
      },
      {
        heading: '停时定理反例：为什么倍投法不能战胜上帝？',
        content: '倍投法声称“只要输了就加倍下注，首次获胜便停手，净赚 1 元”。若停时定理在此成立，E[X_T] = 1 ≠ 0 将引发逻辑崩溃。其破坏了停时定理必须满足的“财富有界”或“增量有界”前提：有限本金下必然爆仓！',
      },
    ],
    recommendedProblems: ['p_luogu_4548', 'p_cf1349d', 'p_cliff_walk', 'p_red_black_card'],
  },
  {
    id: 'ch_5',
    number: 5,
    title: '第 5 章 博弈的降维：彭尼游戏与重叠指数',
    subtitle: '非传递性石头剪刀布与 Conway 重叠指数',
    tier: '必修',
    toolUsed: ['守恒', '对称'],
    summary: '彭尼游戏（Penney\'s Game）：谁的硬币序列先出现谁获胜。后手总能挑选克制先手的序列！Conway 重叠公式将繁复的双自动机吸收链降维为二进制重叠代数比。',
    primaryWidget: 'PenneyGameArena',
    keyFormulaLatex: '\\frac{P_A}{P_B} = \\frac{BB - BA}{AA - AB} \\qquad XY = \\sum_{k=1}^L 2^{k-1} [\\mathrm{suf}_k(X) = \\mathrm{pre}_k(Y)]',
    sections: [
      {
        heading: '前置反直觉：HH 与 HT 的等待时间陷阱',
        content: '抛硬币等到 HH 出现平均需要 6 次，而等到 HT 出现平均只需 4 次！但在 HH 与 HT 的两两对决中，谁先出现的胜率竟然完全平分秋色各占 50%！这就是“等待时间”与“首达对决”的微妙界限。',
      },
      {
        heading: 'Conway 双赌场定理与后手克制',
        content: '设 A 和 B 是两个候选序列。开设两个赌场分别给 A 和 B 押注。通过双鞅联立消元，Conway 证明两者的胜率比严格等于两者的重叠指数差之比！若先手选 a1 a2 a3，后手挑选 非a2, a1, a2，长度为 3 时后手胜率保底达到 2/3，最高可达 7/8 (87.5%)！',
      },
      {
        heading: 'Efron 非传递骰子：概率世界的莫比乌斯环',
        content: 'A 胜 B (2/3)，B 胜 C (2/3)，C 胜 D (2/3)，D 胜 A (2/3)！在随机变量的偏序关系中，传递律荡然无存。',
      },
    ],
    recommendedProblems: ['p_penney_hhh_thh', 'p_efron_dice'],
  },
  {
    id: 'ch_6',
    number: 6,
    title: '第 6 章 时间的倒流：逆向鞅与宏观守恒',
    subtitle: '第四把上帝武器：「倒放」——从终局倒流时间看微观',
    tier: '必修',
    toolUsed: ['倒放', '守恒'],
    summary: '正向看计票是复杂的波动，但将时间倒放，S_k / k 是一个标准的逆向鞅！配合投票者模型的宏观同化守恒，秒杀选举计票与随机增量算法。',
    primaryWidget: 'BallotBackward',
    keyFormulaLatex: '\\Pr(\\text{A 全程领先}) = \\frac{P - Q}{P + Q} \\qquad (\\text{伯特兰计票定理})',
    sections: [
      {
        heading: '计票定理与时间倒放',
        content: 'A 得 P 票，B 得 Q 票 (P > Q)。求唱票全程 A 始终领先的概率。若正向列递推，边界条件繁复无比；但如果将时间倒放，从最后一张已唱出的总票数倒着往前看，已唱均值构成了逆向鞅！',
      },
      {
        heading: '算法联系：后向分析法 (Backward Analysis)',
        content: '在计算几何的随机增量法（如洛谷 P1742 最小圆覆盖）中，直接分析加入第 i 个点引起圆重建的概率极其困难。但若时间倒流，从当前的 i 个点中随机删掉一个点，该点是边界点（决定圆的至多 3 个点）的概率显然不超过 3/i！由此证明期望时间严格 O(N)。',
      },
    ],
    recommendedProblems: ['p_bertrand_ballot', 'p_luogu_1742'],
  },
  {
    id: 'ch_7',
    number: 7,
    title: '第 7 章 马尔可夫链的上帝视角：稳态、可逆与电网络',
    subtitle: '“喝醉的酒鬼总能回家，喝醉的小鸟可能永远迷路”',
    tier: '进阶',
    toolUsed: ['守恒', '对称'],
    summary: '稳态分布 π(v) = deg(v)/(2m)，返回时间 1/π(v)。将离散图映射为纯电阻网络，利用欧姆定律与基尔霍夫定律直接读取击中时间与 Pólya 常返性。',
    primaryWidget: 'MarkovElectricalSim',
    keyFormulaLatex: '\\mathrm{commute}(u, v) = 2m \\cdot R_{\\mathrm{eff}}(u, v) \\qquad \\pi(v) = \\frac{\\deg v}{2m}',
    sections: [
      {
        heading: '稳态分布与细致平衡',
        content: '在无向图上，由于细致平衡 π_u P_{uv} = π_v P_{vu} 天然成立，平稳分布具有极其简明的闭式：每个顶点的概率严格正比于其度数 deg(v) / (2m)。首次返回自身的平均步数就是 2m / deg(v)。例如国际象棋骑士回原角期望恰为 168 步！',
      },
      {
        heading: 'Pólya 随机游走定理',
        content: '在一维和二维无限方格网中，电网络向无穷远处的有效电阻为无穷大，电流无法逃逸，随机游走是常返态（返回起点的概率为 100%）。但在三维网格中，空间立体扩散使得等效电阻收敛为有限值，电流可逃逸，返回起点的概率仅约为 34.05%！',
      },
    ],
    recommendedProblems: ['p_polya_recurrence', 'p_knight_return'],
  },
  {
    id: 'ch_8',
    number: 8,
    title: '第 8 章 何时收手：最优停止',
    subtitle: '从秘书问题 1/e 法则到倒推决策 DP',
    tier: '进阶',
    toolUsed: ['拆', '倒放'],
    summary: '最优停止规则的核心在于确定保留价值（Reservation Price）。利用倒推期望 DP 与极值微积分，掌握决策收手的最优平衡点。',
    primaryWidget: 'OptimalStoppingSim',
    keyFormulaLatex: 'k^* \\approx \\frac{n}{e} \\approx 36.8\\% \\implies \\Pr(\\text{成功}) \\approx \\frac{1}{e}',
    sections: [
      {
        heading: '秘书问题与相亲法则',
        content: '有 n 位按随机顺序出现的应聘者，面试后必须立即决定录取或淘汰。先拒绝前 k 位作为基准线，随后录用第一个比前 k 位都要优秀的应聘者。对成功率函数求导，当 k = n/e ≈ 36.8% 时，录用到全场最优者的概率达到极大值 1/e ≈ 36.8%！',
      },
      {
        heading: '骰子重掷与倒推 DP',
        content: '掷骰最多有 k 次机会，若对当前点数不满意可放弃重掷。利用倒推：最后一次期望是 3.5；倒数第二次只在点数 ≥ 4 时收手，期望为 4.25；倒数第三次只在点数 ≥ 5 时收手，期望为 14/3 ≈ 4.67！',
      },
    ],
    recommendedProblems: ['p_secretary_problem'],
  },
  {
    id: 'ch_9',
    number: 9,
    title: '第 9 章 连续的魔法：几何概率与微积分',
    subtitle: '折木棍 1/4、蒲丰投针与 Bertrand 弦悖论',
    tier: '进阶',
    toolUsed: ['拆', '对称'],
    summary: '样本空间从点集跃迁到高维测度。折木棍三角不等式、蒲丰投针估计 π、次序统计量以及检验悖论。',
    primaryWidget: 'GeometricProbSim',
    keyFormulaLatex: 'P(\\text{折棍成三角形}) = \\frac{1}{4} \\qquad P(\\text{投针相交}) = \\frac{2l}{\\pi d}',
    sections: [
      {
        heading: '折木棍与可行域积分',
        content: '单位长度的木棍随机折两刀，三段能组成三角形的充要条件是任意段长小于 1/2。在二维样本空间 (x,y) 平面上，这是一个面积比值为 (1/8) / (1/2) = 1/4 的直角三角形。',
      },
      {
        heading: 'Bertrand 弦悖论：定义决定的真理',
        content: '圆内挑选一条弦长大于 √3 的概率是多少？根据“随机”定义的不同，答案可以是 1/3（随机端点）、1/2（随机半径）、或 1/4（随机中点）。概率在连续空间中高度依赖测度的选取！',
      },
    ],
    recommendedProblems: ['p_stick_triangle', 'p_buffon_needle'],
  },
  {
    id: 'ch_10',
    number: 10,
    title: '第 10 章 通往量化：布朗运动、定价与 Kelly',
    subtitle: '离散世界向连续金融工程的跃迁',
    tier: '选修',
    toolUsed: ['守恒'],
    summary: '布朗运动是随机游走的连续极限，折现资产价格在风险中性测度下是鞅。Kelly 准则告诉你如何最大化长期复利并规避爆仓。',
    primaryWidget: 'KellyBankrollSim',
    keyFormulaLatex: 'f^* = \\frac{b p - q}{b} \\qquad (\\text{Kelly 准则最优下注仓位})',
    sections: [
      {
        heading: 'Kelly 准则：对数增长率的最大化',
        content: '单纯追求算术期望会导致倾家荡产（倍投全仓）。Kelly 准则以期望对数财富为目标，推导出黄金仓位 f* = (bp - q) / b。下注超过 2 倍 Kelly 即使胜率有利，在几何平均意义下也会必然归零！',
      },
    ],
    recommendedProblems: ['p_kelly_criterion'],
  },
  {
    id: 'ch_11',
    number: 11,
    title: '第 11 章 算法中的概率：随机化与概率方法',
    subtitle: '期望分析是随机算法的通用语言',
    tier: '选修',
    toolUsed: ['拆', '对称'],
    summary: '随机快排期望比较次数 2(n+1)H_n - 4n、Treap 期望树高、两选一力量（Power of Two Choices）、以及用概率方法证明组合对象的存在性。',
    primaryWidget: 'RandomizedAlgorithmsSim',
    keyFormulaLatex: 'E[\\text{Quicksort Comps}] = 2(n+1)H_n - 4n \\approx 2n \\ln n',
    sections: [
      {
        heading: '随机快排的指示变量证明',
        content: '两个元素 x_i 与 x_j 会发生比较，当且仅当在其之间的所有元素中，有一个率先被选为主元，概率为 2/(j - i + 1)。直接求和即可得出无懈可击的 2n ln n。',
      },
      {
        heading: '两选一力量 (Power of Two Choices)',
        content: '将 n 个球扔进 n 个盒子，单选最大负载约为 ln n / ln ln n。但只要在放入前随机挑选 2 个候选盒子并放入较轻者，最大负载奇迹般降至 ln ln n！微小的局部比较孕育了宏观上的极致均衡。',
      },
    ],
    recommendedProblems: ['p_quicksort_comparisons', 'p_luogu_1742'],
  },
];
