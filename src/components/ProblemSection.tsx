import React, { useState } from 'react';
import { OUTAGE_SCENARIOS } from '../lib/telemetrySimulation';
import { TriangleAlertIcon, SatelliteIcon, WifiOffIcon, CrosshairIcon, CornerDownRightIcon } from './Icons';

export const ProblemSection: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState(OUTAGE_SCENARIOS[0]);

  return (
    <section id="problem" className="py-28 bg-neutral-100 dark:bg-[#070709] border-t border-neutral-200 dark:border-neutral-800 transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 text-xs font-mono font-bold">
            <TriangleAlertIcon className="w-3.5 h-3.5" />
            <span>CRITICAL OUTAGE BOTTLENECK</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-tight leading-tight">
            When GNSS line-of-sight disappears, navigation breaks.
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
            Consumer apps rely exclusively on satellite line-of-sight. When high-density structures block satellite signals, positional tracking collapses into erratic jumps or total freezes.
          </p>
        </div>

        {/* Environmental Scenarios Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Scenario Selectors */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-2 font-semibold">
              Critical Blackout Scenarios:
            </div>

            {OUTAGE_SCENARIOS.map((sc) => {
              const isSelected = selectedScenario.id === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => setSelectedScenario(sc)}
                  className={`w-full text-left p-4 rounded-2xl transition-all border ${
                    isSelected
                      ? 'bg-white dark:bg-[#14141A] border-black dark:border-white shadow-lg'
                      : 'bg-white/60 dark:bg-[#0D0D11] border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 text-neutral-700 dark:text-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold text-sm ${isSelected ? 'text-neutral-950 dark:text-white font-bold' : 'text-neutral-800 dark:text-neutral-300'}`}>
                      {sc.title}
                    </span>
                    <span className="text-xs font-mono text-neutral-500">{sc.durationSec}s avg</span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                    {sc.subtitle}
                  </p>
                  {isSelected && (
                    <div className="mt-3 pt-2.5 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-neutral-900 dark:text-neutral-100 flex items-center gap-1 font-semibold">
                        <WifiOffIcon className="w-3 h-3" /> {sc.gnssSignalLoss}
                      </span>
                      <span className="font-bold text-neutral-950 dark:text-white flex items-center gap-1">
                        Inspect Analysis <CornerDownRightIcon className="w-3 h-3" />
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Scenario Comparison Card */}
          <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 space-y-6 shadow-xl">
            
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <span className="text-[11px] font-mono text-neutral-500 uppercase font-semibold">Scenario Deep Dive</span>
                <h3 className="text-xl font-bold text-neutral-950 dark:text-white mt-0.5">{selectedScenario.title}</h3>
              </div>
              <div className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 text-xs font-mono font-bold">
                Blackout Window: {selectedScenario.durationSec}s
              </div>
            </div>

            {/* Side-by-Side Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Conventional GNSS-Only */}
              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200 text-xs font-mono font-bold">
                  <WifiOffIcon className="w-4 h-4" />
                  <span>CONVENTIONAL GNSS-ONLY</span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {selectedScenario.conventionalBehavior}
                </p>
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="text-[10px] font-mono text-neutral-500">ACCUMULATED DRIFT / BLACKOUT:</div>
                  <div className="text-sm font-mono font-bold text-neutral-950 dark:text-white mt-0.5">
                    {selectedScenario.maxDriftWithoutDR}
                  </div>
                </div>
              </div>

              {/* IDR Sensor Fusion */}
              <div className="p-5 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-400 dark:border-neutral-600 space-y-3 shadow-md">
                <div className="flex items-center gap-2 text-neutral-950 dark:text-white text-xs font-mono font-bold">
                  <CrosshairIcon className="w-4 h-4" />
                  <span>IDR DEAD RECKONING</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {selectedScenario.idrBehavior}
                </p>
                <div className="pt-2 border-t border-neutral-300 dark:border-neutral-700">
                  <div className="text-[10px] font-mono text-neutral-500">POSITIONAL ACCURACY:</div>
                  <div className="text-sm font-mono font-bold text-neutral-950 dark:text-white mt-0.5">
                    {selectedScenario.idrPositionError}
                  </div>
                </div>
              </div>

            </div>

            {/* Statement Callout */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-neutral-800 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black shrink-0 shadow-sm">
                <SatelliteIcon className="w-4 h-4" />
              </div>
              <div className="text-xs text-neutral-700 dark:text-neutral-300 space-y-1">
                <div className="font-bold text-neutral-950 dark:text-white font-mono">Satellite signal disappeared. Navigation did not.</div>
                <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  By executing strapdown inertial propagation constrained by AI vehicle dynamic models and vector road networks, IDR eliminates dead zones completely.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
