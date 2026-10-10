import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';

export const BayesTestSim: React.FC = () => {
  // Population baseline: 100,000 people
  const totalPopulation = 100000;
  const [prevalencePercent, setPrevalencePercent] = useState<number>(1.0); // 1%
  const [sensitivityPercent, setSensitivityPercent] = useState<number>(99.0); // 99%
  const [specificityPercent, setSpecificityPercent] = useState<number>(99.0); // 99%

  const prev = prevalencePercent / 100;
  const sens = sensitivityPercent / 100;
  const spec = specificityPercent / 100;

  // Breakdown numbers out of 100,000
  const diseasedTotal = Math.round(totalPopulation * prev);
  const healthyTotal = totalPopulation - diseasedTotal;

  const truePositive = Math.round(diseasedTotal * sens);
  const falseNegative = diseasedTotal - truePositive;

  const falsePositive = Math.round(healthyTotal * (1 - spec));
  const trueNegative = healthyTotal - falsePositive;

  const totalPositiveTests = truePositive + falsePositive;
  const posteriorProbability =
    totalPositiveTests > 0 ? (truePositive / totalPositiveTests) * 100 : 0;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 text-slate-200 shadow-xl">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-base font-semibold text-white">基础率谬误与贝叶斯检测 (Base Rate Fallacy)</h3>
        <p className="text-xs text-slate-400">
          当疾病本身很罕见时，即使检测准确度高达 99%，拿到阳性结果后真正患病的概率也可能只有 50%
        </p>
      </div>

      <div className="my-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Slider 1: Prevalence */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">基础患病率 P(患病)</span>
            <span className="font-mono text-emerald-400">{prevalencePercent.toFixed(2)}%</span>
          </div>
          <input
            type="range"
            min={0.05}
            max={10.0}
            step={0.05}
            value={prevalencePercent}
            onChange={(e) => setPrevalencePercent(parseFloat(e.target.value))}
            className="mt-2 w-full accent-emerald-500"
          />
          <div className="mt-1 flex justify-between text-[10px] text-slate-400">
            <span>罕见 0.05%</span>
            <span>经典 1.0%</span>
            <span>高发 10.0%</span>
          </div>
        </div>

        {/* Slider 2: Sensitivity */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">灵敏度 (真阳率 Sensitivity)</span>
            <span className="font-mono text-emerald-400">{sensitivityPercent.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min={80.0}
            max={99.9}
            step={0.1}
            value={sensitivityPercent}
            onChange={(e) => setSensitivityPercent(parseFloat(e.target.value))}
            className="mt-2 w-full accent-emerald-500"
          />
          <div className="mt-1 flex justify-between text-[10px] text-slate-400">
            <span>80.0%</span>
            <span>95.0%</span>
            <span>99.9%</span>
          </div>
        </div>

        {/* Slider 3: Specificity */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">特异度 (真阴率 Specificity)</span>
            <span className="font-mono text-emerald-400">{specificityPercent.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min={80.0}
            max={99.9}
            step={0.1}
            value={specificityPercent}
            onChange={(e) => setSpecificityPercent(parseFloat(e.target.value))}
            className="mt-2 w-full accent-emerald-500"
          />
          <div className="mt-1 flex justify-between text-[10px] text-slate-400">
            <span>80.0%</span>
            <span>95.0%</span>
            <span>99.9%</span>
          </div>
        </div>
      </div>

      {/* 2x2 Frequency Matrix */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/60 p-3">
          <div className="mb-2 text-xs font-semibold text-slate-300">
            100,000 人群假想列联表 (2×2 频数表)
          </div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-1.5">实际状态</th>
                <th className="py-1.5 text-emerald-400">检测阳性 (+)</th>
                <th className="py-1.5 text-slate-400">检测阴性 (-)</th>
                <th className="py-1.5 text-slate-400">行合计</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr>
                <td className="py-2 text-slate-300 font-sans">实际患病 (D)</td>
                <td className="py-2 text-emerald-400 font-semibold">{truePositive.toLocaleString()} (真阳)</td>
                <td className="py-2 text-slate-400">{falseNegative.toLocaleString()} (漏诊)</td>
                <td className="py-2 text-slate-300">{diseasedTotal.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-300 font-sans">实际健康 (H)</td>
                <td className="py-2 text-amber-400 font-semibold">{falsePositive.toLocaleString()} (假阳)</td>
                <td className="py-2 text-slate-400">{trueNegative.toLocaleString()} (真阴)</td>
                <td className="py-2 text-slate-300">{healthyTotal.toLocaleString()}</td>
              </tr>
              <tr className="border-t border-slate-700 font-sans font-semibold">
                <td className="py-2 text-white">列合计</td>
                <td className="py-2 text-emerald-300 font-mono">{totalPositiveTests.toLocaleString()}</td>
                <td className="py-2 text-slate-400 font-mono">{(falseNegative + trueNegative).toLocaleString()}</td>
                <td className="py-2 text-white font-mono">{totalPopulation.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Posterior Result Card */}
        <div className="flex flex-col justify-between rounded-lg border border-slate-800 bg-slate-950/60 p-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">检测阳性后真正患病的后验概率 P(D | +)</span>
              <span className="font-mono text-2xl font-bold text-emerald-400">
                {posteriorProbability.toFixed(2)}%
              </span>
            </div>

            <div className="mt-3">
              <div className="flex justify-between text-xs text-slate-400">
                <span>真阳性占比: {truePositive.toLocaleString()}</span>
                <span>假阳性占比: {falsePositive.toLocaleString()}</span>
              </div>
              <div className="mt-1 flex h-4 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="bg-emerald-500 transition-all duration-300"
                  style={{ width: `${posteriorProbability}%` }}
                  title="真阳性"
                />
                <div
                  className="bg-amber-500 transition-all duration-300"
                  style={{ width: `${100 - posteriorProbability}%` }}
                  title="假阳性"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-md border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-300">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <div>
                <span className="font-semibold text-white">为什么直觉会错？</span>
                <p className="mt-1 text-slate-400">
                  因为健康人群是患病人群的整整{' '}
                  <span className="font-mono text-white">
                    {(healthyTotal / Math.max(1, diseasedTotal)).toFixed(0)} 倍
                  </span>
                  ！哪怕只有 1% 的健康人被误判为阳性，庞大基数产生的假阳性人数（
                  {falsePositive.toLocaleString()}）也会轻易超过真阳性人数（
                  {truePositive.toLocaleString()}）。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
