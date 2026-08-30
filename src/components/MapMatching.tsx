import React, { useState } from 'react';
import { GitBranchIcon, SplitIcon, CpuIcon } from './Icons';
import { useTheme } from '../lib/theme';

export const MapMatching: React.FC = () => {
  const { theme } = useTheme();
  const [showConstraints, setShowConstraints] = useState(true);
  const isDark = theme === 'dark';

  return (
    <section className="py-28 bg-white dark:bg-black border-t border-neutral-200 dark:border-neutral-800 transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 text-xs font-mono font-bold">
            <GitBranchIcon className="w-3.5 h-3.5" />
            <span>TOPOLOGICAL FUSION</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-tight leading-tight">
            Map matching & non-holonomic kinematic constraints.
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
            Unconstrained double integration of inertial sensors inevitably accumulates quadratic drift over time. IDR bounds error growth using strict vehicle kinematics and vector road graph topology.
          </p>
        </div>

        {/* Interactive Comparison Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Visual Vector Road Graph Demo (Left) */}
          <div className="lg:col-span-7 rounded-3xl bg-neutral-50 dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 space-y-6 shadow-xl relative">
            
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <span className="text-xs font-mono text-neutral-500 uppercase font-semibold">
                TRAJECTORY DRIFT PROJECTION
              </span>
              <button
                onClick={() => setShowConstraints(!showConstraints)}
                className={`px-4 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all border ${
                  showConstraints
                    ? 'bg-black text-white dark:bg-white dark:text-black border-transparent shadow-sm'
                    : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700'
                }`}
              >
                {showConstraints ? 'Constraints: ENABLED (IDR)' : 'Constraints: DISABLED (Raw Drift)'}
              </button>
            </div>

            {/* SVG Visualizer (High-contrast Monochrome) */}
            <div className="relative h-64 sm:h-80 w-full bg-white dark:bg-black rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex items-center justify-center shadow-inner">
              <svg className="w-full h-full p-4" viewBox="0 0 500 300">
                
                {/* True Vector Road */}
                <path
                  d="M 30 240 Q 150 240 220 180 T 470 60"
                  fill="none"
                  stroke={isDark ? "#22222A" : "#E2E2E8"}
                  strokeWidth="24"
                  strokeLinecap="round"
                />
                <path
                  d="M 30 240 Q 150 240 220 180 T 470 60"
                  fill="none"
                  stroke={isDark ? "#444452" : "#A1A1AA"}
                  strokeWidth="2"
                  strokeDasharray="6 6"
                />

                {/* Nodes */}
                <circle cx="30" cy="240" r="4" fill={isDark ? "#FFFFFF" : "#000000"} />
                <circle cx="220" cy="180" r="4" fill={isDark ? "#FFFFFF" : "#000000"} />
                <circle cx="470" cy="60" r="4" fill={isDark ? "#FFFFFF" : "#000000"} />

                {/* Unconstrained Drift Path (Dashed Grayscale) */}
                {(!showConstraints || true) && (
                  <path
                    d="M 30 240 Q 140 230 200 130 T 450 10"
                    fill="none"
                    stroke={isDark ? "#71717A" : "#A1A1AA"}
                    strokeWidth="2"
                    strokeDasharray={showConstraints ? "4 4" : "none"}
                    opacity={showConstraints ? "0.6" : "1"}
                  />
                )}

                {/* IDR Constrained Path (Solid White / Solid Black) */}
                {showConstraints && (
                  <path
                    d="M 30 240 Q 150 240 220 180 T 470 60"
                    fill="none"
                    stroke={isDark ? "#FFFFFF" : "#000000"}
                    strokeWidth="3.5"
                  />
                )}

                {/* Vehicle Marker */}
                <circle
                  cx={showConstraints ? "360" : "330"}
                  cy={showConstraints ? "105" : "60"}
                  r="7"
                  fill={showConstraints ? (isDark ? "#FFFFFF" : "#000000") : "#71717A"}
                  stroke={isDark ? "#000000" : "#FFFFFF"}
                  strokeWidth="2"
                />
                
                {/* Labels */}
                <text
                  x="375"
                  y={showConstraints ? "108" : "63"}
                  fill={isDark ? "#FFFFFF" : "#000000"}
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {showConstraints ? "IDR POSITION (< 1.8m Error)" : "RAW INERTIAL DRIFT (> 38.4m Error)"}
                </text>

                <text x="40" y="275" fill={isDark ? "#71717A" : "#888896"} fontSize="9" fontFamily="monospace">
                  ROAD NETWORK TOPOLOGY (VECTOR GRAPH)
                </text>
              </svg>
            </div>

            {/* Bottom Status */}
            <div className="flex items-center justify-between text-xs font-mono text-neutral-600 dark:text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-black dark:bg-white"></span>
                <span>Non-Holonomic Constraints: Active (Zero Lateral Slip)</span>
              </div>
              <span className="font-bold text-neutral-950 dark:text-white">Bounded Drift: 0.8%</span>
            </div>

          </div>

          {/* Right: Breakdown Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 space-y-2 shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700">
                  <CpuIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-950 dark:text-white">Non-Holonomic Constraints (NHC)</h4>
                  <div className="text-[11px] font-mono text-neutral-500">Physical Kinematic Bounds</div>
                </div>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 pl-12 leading-relaxed">
                Cars cannot move sideways instantly without slipping. IDR enforces zero lateral velocity ($v_y \approx 0$) and zero vertical velocity ($v_z \approx 0$), nullifying 2 out of 3 error dimensions.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 space-y-2 shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700">
                  <GitBranchIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-950 dark:text-white">Hidden Markov Model (HMM) Viterbi</h4>
                  <div className="text-[11px] font-mono text-neutral-500">Probabilistic Road Association</div>
                </div>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 pl-12 leading-relaxed">
                Evaluates emission probabilities and transition topologies to ensure trajectory states stay aligned with physical road centerlines during multi-lane splits.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 space-y-2 shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700">
                  <SplitIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-950 dark:text-white">Turn & Curve Heading Correction</h4>
                  <div className="text-[11px] font-mono text-neutral-500">Gyroscope Yaw Recalibration</div>
                </div>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 pl-12 leading-relaxed">
                Known road curvature geometry continuously cross-calibrates gyroscope bias parameters in real-time without user intervention.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
