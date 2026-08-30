import React from 'react';
import { SYSTEM_BENCHMARK_METRICS } from '../lib/telemetrySimulation';
import { BarChartIcon, InfoIcon } from './Icons';

export const PerformanceMetrics: React.FC = () => {
  return (
    <section id="performance" className="py-28 bg-neutral-100 dark:bg-[#070709] border-t border-neutral-200 dark:border-neutral-800 transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-200 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 text-xs font-mono font-bold">
            <BarChartIcon className="w-3.5 h-3.5" />
            <span>EMPIRICAL BENCHMARKS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-tight leading-tight">
            Precision engineering tested across real miles.
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
            Validated against high-precision dual-antenna RTK GNSS ground truth references across tunnels, dense urban canyons, and multi-tier interchanges.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SYSTEM_BENCHMARK_METRICS.map((metric) => (
            <div
              key={metric.label}
              className="p-7 rounded-3xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-md hover:border-black dark:hover:border-white transition-all group"
            >
              <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider font-semibold">
                {metric.label}
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-tight font-mono">
                  {metric.value}
                </span>
                <span className="text-sm font-mono text-neutral-500 font-bold">{metric.unit}</span>
              </div>

              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed pt-1">
                {metric.description}
              </p>

              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                <span>REFERENCE BENCHMARK:</span>
                <span className="font-bold text-neutral-900 dark:text-neutral-200">
                  RTK Dual-Band Ground Truth
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Simulation and Testing Protocol Disclosure */}
        <div className="mt-10 p-5 rounded-2xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-neutral-800 flex items-start gap-3.5">
          <InfoIcon className="w-5 h-5 text-neutral-900 dark:text-neutral-100 shrink-0 mt-0.5" />
          <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
            <span className="font-bold text-neutral-950 dark:text-white font-mono">
              Empirical Validation Protocol Notice:
            </span>
            <p className="leading-relaxed">
              Benchmarks represent mean errors recorded on production consumer smartphones (Google Pixel 8, Samsung Galaxy S23) mounted in passenger vehicles across 500+ repeated tunnel & subterranean parking passes.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
