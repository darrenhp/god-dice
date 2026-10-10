export interface MindmapRule {
  triggerPattern: string; // 看到什么
  godTool: '拆' | '守恒' | '对称' | '倒放';
  recommendedMethod: string; // 想到什么
  closedFormLatex: string; // 闭式 / 关键公式
  representativeProblem: string; // 代表题 / 章节
}

export const MINDMAP_RULES: MindmapRule[] = [
  {
    triggerPattern: '求集齐 N 种物品、抽卡、掷骰全点数的期望总次数',
    godTool: '拆',
    recommendedMethod: '收集式期望分解为几何分布之和，直接化为调和数求和',
    closedFormLatex: 'E[T_N] = N \\sum_{i=1}^N \\frac{1}{i} = N H_N',
    representativeProblem: '洛谷 P1291、百事世界杯之旅 (第 1 章)',
  },
  {
    triggerPattern: '随机排列不动点、逆序对、左到右最大值、树上删点步数',
    godTool: '拆',
    recommendedMethod: '设置 0/1 指示变量 X_i，利用期望线性性无视依赖，直接算单项概率',
    closedFormLatex: 'E[\\sum X_i] = \\sum P(X_i = 1)',
    representativeProblem: 'CF 280C Game on Tree、绿皮书排列 (第 1 章)',
  },
  {
    triggerPattern: '52 张牌第一张 A 的位置、对称间隔分配',
    godTool: '对称',
    recommendedMethod: 'k 个标记点将剩余对象均匀分割成 k+1 个对称空隙',
    closedFormLatex: 'E[\\text{Pos}] = 1 + \\frac{N - k}{k + 1} = \\frac{N + 1}{k + 1}',
    representativeProblem: '52 张牌第一张 A 为 53/5 = 10.6 (第 1 章)',
  },
  {
    triggerPattern: '一般有向图/无向图上的期望经过次数或击中时间',
    godTool: '拆',
    recommendedMethod: '列全期望方程 E_u = 1 + ∑ P(u→v)E_v，高斯消元 (I - P)E = 1 求解',
    closedFormLatex: '(I - P)E = 1 \\quad (O(N^3))',
    representativeProblem: 'HNOI2013 游走、P3232 (第 2 章)',
  },
  {
    triggerPattern: '树上随机游走，从子树节点走向父节点',
    godTool: '拆',
    recommendedMethod: '设待定系数 E_u = k_u E_{fa} + b_u 自底向上递推；均匀游走直接用闭式',
    closedFormLatex: 'E(u \\to \\mathrm{fa}) = 2 \\cdot \\mathrm{size}_u - 1',
    representativeProblem: 'HDU 4035 Maze、树形游走 (第 2、7 章)',
  },
  {
    triggerPattern: '环上随机游走，求除起点外最后一个被访问的点',
    godTool: '对称',
    recommendedMethod: '拓扑已走弧段拉直为一维线段，由赌徒破产对称性，外侧概率严格均等',
    closedFormLatex: 'P(v \\text{ 是最后访问点}) = \\frac{1}{n-1}',
    representativeProblem: '圆桌传球、环上游走定理 (第 3 章)',
  },
  {
    triggerPattern: '随机字符流/硬币序列首次出现目标模式串 S 的等待时间',
    godTool: '守恒',
    recommendedMethod: '赌场倍投鞅模型 + KMP Border 分析，只对 Border 上的赌徒筹码求和',
    closedFormLatex: 'E[T] = \\sum_{k \\in \\mathrm{Border}(S)} m^k',
    representativeProblem: 'CTSC 歌唱王国 P4548、ABRACADABRA (第 4 章)',
  },
  {
    triggerPattern: '复杂多对象状态转换（如史莱姆分饼干、公司合并）',
    godTool: '守恒',
    recommendedMethod: '构造一维单对象势能函数 f(x)，使总势能 E[ΔΦ] = -1 构成鞅',
    closedFormLatex: '\\mathbb{E}[\\Delta \\Phi] = -1 \\implies E[T] = \\Phi_0 - \\Phi_T',
    representativeProblem: 'CF 1349D Slime and Biscuits (第 4 章)',
  },
  {
    triggerPattern: '两人抛硬币对决，看谁选的序列先出现 (Penney 博弈)',
    godTool: '守恒',
    recommendedMethod: '双赌场模型 Conway 重叠指数，后手选 !a2 a1 a2 必占绝对优势',
    closedFormLatex: '\\frac{P_A}{P_B} = \\frac{BB - BA}{AA - AB}',
    representativeProblem: 'HHH 对 THH 后手 87.5% 胜率 (第 5 章)',
  },
  {
    triggerPattern: '选举唱票始终领先、买票找零不排队、反射原理',
    godTool: '倒放',
    recommendedMethod: '将时间倒放，S_k / k 构成逆向鞅，由停时定理一步得出领先比',
    closedFormLatex: '\\Pr(\\text{始终领先}) = \\frac{P - Q}{P + Q}',
    representativeProblem: '伯特兰计票定理、买票找零 (第 6 章)',
  },
  {
    triggerPattern: '计算几何随机增量法复杂度分析（如最小圆覆盖）',
    godTool: '倒放',
    recommendedMethod: '后向分析法：倒着看随机删除当前点，该点引起重构的概率至多为 3/i',
    closedFormLatex: 'E[\\text{重构代价}] = \\sum_{i=1}^n \\frac{3}{i} \\cdot O(i) = O(n)',
    representativeProblem: '洛谷 P1742 最小圆覆盖 (第 6 章)',
  },
  {
    triggerPattern: '无向图随机游走从顶点 v 首次返回自身的步数',
    godTool: '守恒',
    recommendedMethod: '由细致平衡得平稳分布 π(v) = deg(v)/(2m)，平均返回时间为 1/π(v)',
    closedFormLatex: 'E[\\text{Return}] = \\frac{2m}{\\deg(v)}',
    representativeProblem: '8×8 棋盘骑士回原角期望 168 步 (第 7 章)',
  },
  {
    triggerPattern: '图上两节点往返时间 (Commute Time) 或击中时间',
    godTool: '守恒',
    recommendedMethod: '电阻网络类比：每条边设为 1Ω，往返时间等于 2m 乘以等效电阻',
    closedFormLatex: 'C(u, v) = 2m \\cdot R_{\\mathrm{eff}}(u, v)',
    representativeProblem: '立方体对角 10 步、链上两端 n² (第 7 章)',
  },
  {
    triggerPattern: '未知分布顺序出现，只能单向决定选或不选 (相亲/面试)',
    godTool: '倒放',
    recommendedMethod: '最优停止理论：跳过前 n/e 比例作为基准，随后选第一个超越者',
    closedFormLatex: 'k^* \\approx \\frac{n}{e} \\implies \\Pr(\\text{选到最优}) \\to \\frac{1}{e} \\approx 36.8\\%',
    representativeProblem: '经典秘书问题 (第 8 章)',
  },
  {
    triggerPattern: '连续均匀分布随机变量、折木棍围三角形',
    godTool: '对称',
    recommendedMethod: '几何概率：把条件化为二维/三维线性不等式，求可行域体积与样本空间比',
    closedFormLatex: 'P(\\text{三角形}) = \\frac{1}{4} = 25\\%',
    representativeProblem: '折木棍、蒲丰投针估计 π (第 9 章)',
  },
  {
    triggerPattern: '有利可图的投资、下注博弈，求最大复利长期仓位',
    godTool: '守恒',
    recommendedMethod: 'Kelly 准则：最大化对数财富期望 E[ln W]，严禁全仓或超过 2x Kelly',
    closedFormLatex: 'f^* = \\frac{b p - q}{b}',
    representativeProblem: 'Kelly 资产配置 (第 10 章)',
  },
  {
    triggerPattern: '随机快排比较次数、Treap 期望深度',
    godTool: '拆',
    recommendedMethod: '拆为主元成对包含概率：第 i 与第 j 个元素比较的概率是 2/(j - i + 1)',
    closedFormLatex: 'E[\\text{Comps}] = 2(n+1)H_n - 4n \\approx 2n \\ln n',
    representativeProblem: '随机快排分析 (第 11 章)',
  },
  {
    triggerPattern: '哈希碰撞、分布式负载均衡、球盒模型',
    godTool: '对称',
    recommendedMethod: '两选一力量 (Power of Two Choices)：随机探测 2 个桶挑负载较小者',
    closedFormLatex: '\\text{最大负载从 } \\frac{\\ln n}{\\ln \\ln n} \\to \\ln \\ln n',
    representativeProblem: '分布式哈希均衡 (第 11 章)',
  },
];
