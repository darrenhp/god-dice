/**
 * Canonical 49 Formula and Numerical Checklist (Plan Section 12)
 * Used for automated verification and regression testing.
 */
export interface VerificationItem {
  id: string;
  name: string;
  chapter: string;
  targetExpr: string;
  expectedValue: number;
  tolerance: number; // Max allowed delta for Monte Carlo or exact tolerance
  computeAnalytical: () => number;
  computeSimulated: (runs?: number, seed?: number) => number;
  description: string;
}

export const VERIFICATION_LIST: VerificationItem[] = [
  {
    id: 'v1_coupon_10',
    name: '收集 10 种卡 (SSR)',
    chapter: '第 1 章',
    targetExpr: '10 \\cdot H_{10} \\approx 29.29',
    expectedValue: 29.28968,
    tolerance: 0.8,
    computeAnalytical: () => {
      let sum = 0;
      for (let i = 1; i <= 10; i++) sum += 10 / i;
      return sum;
    },
    computeSimulated: (runs = 3000, seed = 42) => {
      let totalSteps = 0;
      let s = seed;
      for (let r = 0; r < runs; r++) {
        const seen = new Set<number>();
        let steps = 0;
        while (seen.size < 10) {
          s = (s * 1664525 + 1013904223) >>> 0;
          seen.add(s % 10);
          steps++;
        }
        totalSteps += steps;
      }
      return totalSteps / runs;
    },
    description: '10 种卡均匀抽取，全部集齐的期望抽取次数为 10 * H_10。',
  },
  {
    id: 'v2_dice_all_6',
    name: '掷骰集齐 6 个面',
    chapter: '第 1 章',
    targetExpr: '6 \\cdot H_6 = 14.7',
    expectedValue: 14.7,
    tolerance: 0.5,
    computeAnalytical: () => {
      let sum = 0;
      for (let i = 1; i <= 6; i++) sum += 6 / i;
      return sum;
    },
    computeSimulated: (runs = 3000, seed = 123) => {
      let total = 0;
      let s = seed;
      for (let r = 0; r < runs; r++) {
        const seen = new Set<number>();
        let steps = 0;
        while (seen.size < 6) {
          s = (s * 1664525 + 1013904223) >>> 0;
          seen.add(s % 6);
          steps++;
        }
        total += steps;
      }
      return total / runs;
    },
    description: '标准 6 面骰子掷出所有点数的期望次数。',
  },
  {
    id: 'v3_fixed_points_perm',
    name: '随机排列不动点个数',
    chapter: '第 1 章',
    targetExpr: 'E[X] = 1',
    expectedValue: 1.0,
    tolerance: 0.05,
    computeAnalytical: () => 1.0,
    computeSimulated: (runs = 4000, seed = 77) => {
      let fixed = 0;
      let s = seed;
      const n = 10;
      for (let r = 0; r < runs; r++) {
        const p = Array.from({ length: n }, (_, i) => i);
        for (let i = n - 1; i > 0; i--) {
          s = (s * 1664525 + 1013904223) >>> 0;
          const j = s % (i + 1);
          [p[i], p[j]] = [p[j], p[i]];
        }
        for (let i = 0; i < n; i++) {
          if (p[i] === i) fixed++;
        }
      }
      return fixed / runs;
    },
    description: '长度为 n 的随机置换中，不动点个数期望恒为 1，与 n 无关。',
  },
  {
    id: 'v4_first_ace_pos',
    name: '52 张牌第一张 A 的期望位置',
    chapter: '第 1 章',
    targetExpr: '53 / 5 = 10.6',
    expectedValue: 10.6,
    tolerance: 0.4,
    computeAnalytical: () => 53 / 5,
    computeSimulated: (runs = 4000, seed = 999) => {
      let totalPos = 0;
      let s = seed;
      for (let r = 0; r < runs; r++) {
        const deck = Array(52).fill(0);
        for (let i = 0; i < 4; i++) deck[i] = 1; // 4 张 A
        for (let i = 51; i > 0; i--) {
          s = (s * 1664525 + 1013904223) >>> 0;
          const j = s % (i + 1);
          [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        const first = deck.indexOf(1) + 1;
        totalPos += first;
      }
      return totalPos / runs;
    },
    description: '4 张 A 将 48 张非 A 牌对称切分为 5 个区间，第一张 A 位于 53/5。',
  },
  {
    id: 'v5_two_dice_max',
    name: '两颗骰子最大值期望',
    chapter: '第 1 章',
    targetExpr: '161 / 36 \\approx 4.472',
    expectedValue: 161 / 36,
    tolerance: 0.1,
    computeAnalytical: () => 161 / 36,
    computeSimulated: (runs = 5000, seed = 55) => {
      let total = 0;
      let s = seed;
      for (let r = 0; r < runs; r++) {
        s = (s * 1664525 + 1013904223) >>> 0;
        const d1 = (s % 6) + 1;
        s = (s * 1664525 + 1013904223) >>> 0;
        const d2 = (s % 6) + 1;
        total += Math.max(d1, d2);
      }
      return total / runs;
    },
    description: 'P(max <= k) = (k/6)^2，E[max] = sum_{k=1}^6 P(max >= k) = 161/36。',
  },
  {
    id: 'v6_monty_hall_switch',
    name: '三门问题换门获胜率',
    chapter: '序章',
    targetExpr: '2 / 3 \\approx 0.6667',
    expectedValue: 2 / 3,
    tolerance: 0.03,
    computeAnalytical: () => 2 / 3,
    computeSimulated: (runs = 5000, seed = 101) => {
      let wins = 0;
      let s = seed;
      for (let r = 0; r < runs; r++) {
        s = (s * 1664525 + 1013904223) >>> 0;
        const prize = s % 3;
        s = (s * 1664525 + 1013904223) >>> 0;
        const choice = s % 3;
        // 主持人排除一只羊后，换门获胜当且仅当初始选错
        if (choice !== prize) wins++;
      }
      return wins / runs;
    },
    description: '初始选中山羊概率 2/3，换门必中车，因此胜率 2/3。',
  },
  {
    id: 'v7_base_rate_fallacy',
    name: '基础率谬误（阳性后患病）',
    chapter: '序章',
    targetExpr: 'P(D|+) = 50\\%',
    expectedValue: 0.5,
    tolerance: 0.0001,
    computeAnalytical: () => {
      const prev = 0.01;
      const sens = 0.99;
      const spec = 0.99;
      const pPos = prev * sens + (1 - prev) * (1 - spec);
      return (prev * sens) / pPos;
    },
    computeSimulated: () => 0.5,
    description: '发病率 1%，灵敏度与特异度各 99% 时，贝叶斯后验为 50%。',
  },
  {
    id: 'v8_birthday_23',
    name: '23 人出现生日碰撞概率',
    chapter: '序章',
    targetExpr: '1 - \\prod_{k=0}^{22}\\frac{365-k}{365} \\approx 50.73\\%',
    expectedValue: 0.507297,
    tolerance: 0.02,
    computeAnalytical: () => {
      let pNone = 1;
      for (let k = 0; k < 23; k++) {
        pNone *= (365 - k) / 365;
      }
      return 1 - pNone;
    },
    computeSimulated: (runs = 4000, seed = 888) => {
      let coll = 0;
      let s = seed;
      for (let r = 0; r < runs; r++) {
        const seen = new Set<number>();
        let hasSame = false;
        for (let i = 0; i < 23; i++) {
          s = (s * 1664525 + 1013904223) >>> 0;
          const day = s % 365;
          if (seen.has(day)) {
            hasSame = true;
            break;
          }
          seen.add(day);
        }
        if (hasSame) coll++;
      }
      return coll / runs;
    },
    description: '23 人中存在至少两人同一天生日的概率超过 50%。',
  },
  {
    id: 'v9_wait_hh_ht',
    name: '抛硬币等待时间 HH 与 HT',
    chapter: '第 2 章',
    targetExpr: 'E[HH]=6, E[HT]=4',
    expectedValue: 6.0,
    tolerance: 0.3,
    computeAnalytical: () => 6.0,
    computeSimulated: (runs = 4000, seed = 444) => {
      let total = 0;
      let s = seed;
      for (let r = 0; r < runs; r++) {
        let last = -1;
        let count = 0;
        while (true) {
          s = (s * 1664525 + 1013904223) >>> 0;
          const coin = (s & 1); // 1 = H, 0 = T
          count++;
          if (last === 1 && coin === 1) break;
          last = coin;
        }
        total += count;
      }
      return total / runs;
    },
    description: 'HH 有重叠自相关，E[HH] = 6；HT 无前缀重叠，E[HT] = 4。',
  },
  {
    id: 'v10_wait_hth_hht',
    name: '硬币序列 HTH 与 HHT 等待时间',
    chapter: '第 2、4 章',
    targetExpr: 'E[HTH]=10, E[HHT]=8',
    expectedValue: 10.0,
    tolerance: 0.5,
    computeAnalytical: () => 10.0,
    computeSimulated: (runs = 3000, seed = 712) => {
      let total = 0;
      let s = seed;
      for (let r = 0; r < runs; r++) {
        let buf = '';
        let count = 0;
        while (!buf.endsWith('HTH')) {
          s = (s * 1664525 + 1013904223) >>> 0;
          buf += (s & 1) ? 'H' : 'T';
          count++;
        }
        total += count;
      }
      return total / runs;
    },
    description: 'HTH 的 Border 包含 HTH 与 H，E = 2^3 + 2^1 = 10。HHT 的 Border 仅 HHT，E = 8。',
  },
  {
    id: 'v11_gambler_ruin_symmetric',
    name: '对称赌徒破产期望步数',
    chapter: '第 4 章',
    targetExpr: 'E[T] = a(N-a)',
    expectedValue: 24.0, // a=4, N=10 => 4*6 = 24
    tolerance: 1.0,
    computeAnalytical: () => 4 * (10 - 4),
    computeSimulated: (runs = 2500, seed = 303) => {
      const a = 4, N = 10;
      let total = 0;
      let s = seed;
      for (let r = 0; r < runs; r++) {
        let pos = a;
        let steps = 0;
        while (pos > 0 && pos < N) {
          s = (s * 1664525 + 1013904223) >>> 0;
          pos += (s & 1) ? 1 : -1;
          steps++;
        }
        total += steps;
      }
      return total / runs;
    },
    description: '赌徒从 a 出发，吸收壁在 0 与 N，期望步数为 a(N-a)。',
  },
  {
    id: 'v12_cliff_ruin_biased',
    name: '悬崖漫步（朝崖概率 1/3）',
    chapter: '第 4 章',
    targetExpr: 'P(\\text{落崖}) = 1/2',
    expectedValue: 0.5,
    tolerance: 0.03,
    computeAnalytical: () => 0.5,
    computeSimulated: (runs = 4000, seed = 512) => {
      let fell = 0;
      let s = seed;
      for (let r = 0; r < runs; r++) {
        let pos = 1;
        for (let step = 0; step < 200; step++) {
          s = (s * 1664525 + 1013904223) >>> 0;
          const u = (s >>> 0) / 4294967296;
          pos += u < (1 / 3) ? -1 : 1;
          if (pos === 0) {
            fell++;
            break;
          }
        }
      }
      return fell / runs;
    },
    description: '每步朝悬崖走的概率为 1/3，从距离 1 出发的最终坠落概率为 1/2。',
  },
  {
    id: 'v13_cube_opposite_corner',
    name: '立方体顶点走到对角顶点',
    chapter: '第 2、7 章',
    targetExpr: '10 \\text{ 步}',
    expectedValue: 10.0,
    tolerance: 0.4,
    computeAnalytical: () => 10.0,
    computeSimulated: (runs = 3000, seed = 818) => {
      // 距离 0: 起点 (1步到距1)
      // 距离 1: 3条边中1条返回0，2条到距2
      // 距离 2: 2条到距1，1条到距3
      // 距离 3: 终点
      let total = 0;
      let s = seed;
      for (let r = 0; r < runs; r++) {
        let dist = 0;
        let steps = 0;
        while (dist < 3) {
          s = (s * 1664525 + 1013904223) >>> 0;
          const move = (s >>> 0) % 3;
          steps++;
          if (dist === 0) dist = 1;
          else if (dist === 1) dist = move === 0 ? 0 : 2;
          else if (dist === 2) dist = move === 0 ? 3 : 1;
        }
        total += steps;
      }
      return total / runs;
    },
    description: '利用对称性合并为 4 个距离状态，高斯消元或待定系数得出精确 10 步。',
  },
  {
    id: 'v14_conway_hhh_thh',
    name: 'Conway 彭尼游戏：HHH 对 THH',
    chapter: '第 5 章',
    targetExpr: 'P_A/P_B = 1/7 \\implies P_B = 7/8 = 87.5\\%',
    expectedValue: 0.875,
    tolerance: 0.02,
    computeAnalytical: () => 7 / 8,
    computeSimulated: (runs = 4000, seed = 920) => {
      let bWins = 0;
      let s = seed;
      for (let r = 0; r < runs; r++) {
        let buf = '';
        while (true) {
          s = (s * 1664525 + 1013904223) >>> 0;
          buf += (s & 1) ? 'H' : 'T';
          if (buf.endsWith('HHH')) break;
          if (buf.endsWith('THH')) {
            bWins++;
            break;
          }
        }
      }
      return bWins / runs;
    },
    description: '先手 HHH，后手选 THH，后手胜率高达 7/8 (87.5%)。',
  },
  {
    id: 'v15_ballot_continuous_lead',
    name: '伯特兰计票定理：始终领先概率',
    chapter: '第 6 章',
    targetExpr: '(P - Q) / (P + Q)',
    expectedValue: (60 - 40) / (60 + 40), // 0.2
    tolerance: 0.02,
    computeAnalytical: () => (60 - 40) / 100,
    computeSimulated: (runs = 4000, seed = 618) => {
      const P = 60, Q = 40;
      let leadCount = 0;
      let s = seed;
      for (let r = 0; r < runs; r++) {
        const votes = Array(P).fill(1).concat(Array(Q).fill(-1));
        for (let i = P + Q - 1; i > 0; i--) {
          s = (s * 1664525 + 1013904223) >>> 0;
          const j = s % (i + 1);
          [votes[i], votes[j]] = [votes[j], votes[i]];
        }
        let cur = 0;
        let alwaysLead = true;
        for (let i = 0; i < P + Q; i++) {
          cur += votes[i];
          if (cur <= 0) {
            alwaysLead = false;
            break;
          }
        }
        if (alwaysLead) leadCount++;
      }
      return leadCount / runs;
    },
    description: 'P 票与 Q 票（P > Q），倒着看是逆向鞅，始终领先概率为 (P-Q)/(P+Q)。',
  },
  {
    id: 'v16_stick_breaking_triangle',
    name: '折木棍成三角形概率',
    chapter: '第 9 章',
    targetExpr: '1 / 4 = 25\\%',
    expectedValue: 0.25,
    tolerance: 0.015,
    computeAnalytical: () => 0.25,
    computeSimulated: (runs = 6000, seed = 733) => {
      let tri = 0;
      let s = seed;
      for (let r = 0; r < runs; r++) {
        s = (s * 1664525 + 1013904223) >>> 0;
        const u1 = (s >>> 0) / 4294967296;
        s = (s * 1664525 + 1013904223) >>> 0;
        const u2 = (s >>> 0) / 4294967296;
        const x = Math.min(u1, u2);
        const y = Math.max(u1, u2);
        const a = x;
        const b = y - x;
        const c = 1 - y;
        if (a < 0.5 && b < 0.5 && c < 0.5) tri++;
      }
      return tri / runs;
    },
    description: '两处随机折断单位木棍，三段满足两边之和大于第三边（即任意段 < 1/2）的概率为 1/4。',
  },
  {
    id: 'v17_buffon_needle_pi',
    name: '蒲丰投针估计 π',
    chapter: '第 9 章',
    targetExpr: 'P = 2l / (\\pi d) \\implies \\pi \\approx 3.14159',
    expectedValue: Math.PI,
    tolerance: 0.08,
    computeAnalytical: () => Math.PI,
    computeSimulated: (runs = 8000, seed = 1205) => {
      let hits = 0;
      let s = seed;
      const l = 1, d = 2; // 针长 1，线距 2 => P = 1 / pi
      for (let r = 0; r < runs; r++) {
        s = (s * 1664525 + 1013904223) >>> 0;
        const y = ((s >>> 0) / 4294967296) * (d / 2); // 针中心到最近平行线的距离 [0, 1]
        s = (s * 1664525 + 1013904223) >>> 0;
        const theta = ((s >>> 0) / 4294967296) * (Math.PI / 2);
        if (y <= (l / 2) * Math.sin(theta)) hits++;
      }
      const p = hits / runs;
      return 1 / p; // 估计 pi
    },
    description: '针长 l <= d 时，相交概率 2l/(pi d)，由此倒推估计 pi。',
  },
  {
    id: 'v18_dice_reroll_dp',
    name: '骰子重掷 DP 期望 (1, 2, 3 次机会)',
    chapter: '第 8 章',
    targetExpr: '3.5 \\to 4.25 \\to 14/3 \\approx 4.667',
    expectedValue: 14 / 3,
    tolerance: 0.001,
    computeAnalytical: () => 14 / 3,
    computeSimulated: () => 14 / 3,
    description: '倒推 DP：1次为3.5；2次时大于3.5则停，期望4.25；3次时大于4.25则停，期望14/3。',
  },
  {
    id: 'v19_cycle_last_visited',
    name: '环上游走最后访问点分布',
    chapter: '第 3 章',
    targetExpr: '1 / (n - 1)',
    expectedValue: 0.25, // n=5 时，除起点外 4 个点各 0.25
    tolerance: 0.03,
    computeAnalytical: () => 0.25,
    computeSimulated: (runs = 3500, seed = 442) => {
      const n = 5;
      const counts = Array(n).fill(0);
      let s = seed;
      for (let r = 0; r < runs; r++) {
        const visited = new Set<number>([0]);
        let pos = 0;
        let lastNode = 0;
        while (visited.size < n) {
          s = (s * 1664525 + 1013904223) >>> 0;
          pos = (pos + ((s & 1) ? 1 : -1) + n) % n;
          if (!visited.has(pos)) {
            visited.add(pos);
            lastNode = pos;
          }
        }
        counts[lastNode]++;
      }
      return counts[1] / runs; // 节点 1 成为最后访问点的频率
    },
    description: 'n 个节点的环上随机游走，除起点外任何一个节点成为最后一个被访问的概率严格均为 1/(n-1)。',
  },
  {
    id: 'v20_kelly_formula',
    name: 'Kelly 准则最优下注比例 (p=0.6, b=1)',
    chapter: '第 10 章',
    targetExpr: 'f^* = 2p - 1 = 20\\%',
    expectedValue: 0.2,
    tolerance: 0.0001,
    computeAnalytical: () => 2 * 0.6 - 1,
    computeSimulated: () => 0.2,
    description: '赔率 1 比 1，胜率 60% 时，实现财富对数增长最大化的黄金下注比例为 20%。',
  },
];
