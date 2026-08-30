import React, { useState } from 'react';
import { HardDriveIcon, FilterIcon, CompassIcon, BinaryIcon, CircuitBoardIcon, RefreshIcon, GitBranchIcon, GaugeIcon, ChevronRightIcon, CheckIcon } from './Icons';

interface PipelineStage {
  id: number;
  title: string;
  category: string;
  icon: React.ReactNode;
  summary: string;
  inputData: string;
  algorithm: string;
  outputData: string;
  telemetryMetric: string;
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 1,
    title: 'Smartphone Sensor HAL',
    category: 'HARDWARE LAYER',
    icon: <HardDriveIcon className="w-5 h-5" />,
    summary: 'Direct hardware access to internal MEMS tri-axial accelerometer, gyroscope, and GNSS receiver.',
    inputData: 'Raw IMU sensor registers (Android SensorManager)',
    algorithm: 'High-frequency interrupt sampling with FIFO timestamp matching',
    outputData: 'Raw Accel [ax, ay, az], Gyro [gx, gy, gz] @ 200 Hz',
    telemetryMetric: '200.0 Hz synced'
  },
  {
    id: 2,
    title: 'Sensor Preprocessing & Bias Nulling',
    category: 'SIGNAL CONDITIONING',
    icon: <FilterIcon className="w-5 h-5" />,
    summary: 'Removes thermal drift, high-frequency engine vibration spikes, and calibrates dynamic zero-velocity bias.',
    inputData: '200Hz raw IMU data stream',
    algorithm: 'Butterworth Bandpass (0.2–18Hz) + Online Kalman Gyro Bias Estimator',
    outputData: 'Conditioned specific forces & angular velocity vectors',
    telemetryMetric: 'Drift bias: < 0.015°/s'
  },
  {
    id: 3,
    title: 'Automatic Vehicle Alignment',
    category: 'FRAME TRANSFORMATION',
    icon: <CompassIcon className="w-5 h-5" />,
    summary: 'Dynamically determines the phone orientation inside the vehicle cabin regardless of phone mount angle.',
    inputData: 'Conditioned acceleration during initial forward acceleration/braking',
    algorithm: 'Gravity vector decomposition + Principal Component Analysis (PCA)',
    outputData: 'DCM / Quaternion rotation matrix from Phone Frame -> Vehicle Frame',
    telemetryMetric: 'Alignment Lock: 99.8%'
  },
  {
    id: 4,
    title: 'AI Speed & Motion Estimation',
    category: 'DEEP LEARNING EDGE INFERENCE',
    icon: <BinaryIcon className="w-5 h-5" />,
    summary: 'Neural network estimates vehicle longitudinal speed and micro-dynamics directly from road vibrations.',
    inputData: 'Aligned acceleration spectra & vibration harmonic window',
    algorithm: 'Quantized INT8 1D-CNN + GRU Recurrent Temporal Network',
    outputData: 'Predicted Forward Velocity ($v_x$) + Stop/Motion Confidence',
    telemetryMetric: 'Inference Latency: 3.8 ms'
  },
  {
    id: 5,
    title: 'Strapdown INS Mechanization',
    category: 'INERTIAL NAVIGATION',
    icon: <CircuitBoardIcon className="w-5 h-5" />,
    summary: 'Propagates high-rate vehicle position, velocity, and attitude (PVA) using quaternion differential equations.',
    inputData: 'Vehicle-frame angular rates & AI-assisted longitudinal acceleration',
    algorithm: '4th-order Runge-Kutta quaternion integration with Coriolis compensation',
    outputData: 'High-rate inertial PVA state vector [P, V, Q]',
    telemetryMetric: 'Attitude rate: 200 Hz'
  },
  {
    id: 6,
    title: 'GNSS + INS Extended Kalman Filter',
    category: 'OPTIMAL SENSOR FUSION',
    icon: <RefreshIcon className="w-5 h-5" />,
    summary: 'Continuously updates covariance error matrices. When GNSS degrades, smoothly switches to dead reckoning mode.',
    inputData: 'INS states + GNSS pseudoranges / Doppler (when available)',
    algorithm: '15-State Error-State Extended Kalman Filter (ES-EKF)',
    outputData: 'Fused state estimate + Error Covariance matrix ($P$)',
    telemetryMetric: 'Convergence: < 120 ms'
  },
  {
    id: 7,
    title: 'Map Matching & Kinematic Constraints',
    category: 'TOPOLOGICAL REFINEMENT',
    icon: <GitBranchIcon className="w-5 h-5" />,
    summary: 'Applies non-holonomic vehicle constraints (zero lateral slip) and projects position onto vector road graphs.',
    inputData: 'Fused position + Local OpenStreetMap vector topology graph',
    algorithm: 'Hidden Markov Model (HMM) Viterbi Map-Matcher + NHC slip bounds',
    outputData: 'Drift-corrected road segment coordinate + heading lock',
    telemetryMetric: 'NHC lateral slip: 0.0 m/s'
  },
  {
    id: 8,
    title: 'Seamless Continuous Navigation Output',
    category: 'OUTPUT SUBSYSTEM',
    icon: <GaugeIcon className="w-5 h-5" />,
    summary: 'Delivers buttery smooth 60fps location updates to the navigation UI with zero jumps or dead-zone dropouts.',
    inputData: 'Drift-constrained trajectory state vector',
    algorithm: 'Dynamic spline interpolation & confidence scoring',
    outputData: 'High-rate location, heading, velocity, and uncertainty bounds',
    telemetryMetric: 'Output Rate: 60 FPS'
  }
];

export const ArchitectureFlow: React.FC = () => {
  const [activeStage, setActiveStage] = useState<PipelineStage>(PIPELINE_STAGES[3]);

  return (
    <section id="pipeline" className="py-28 bg-white dark:bg-black border-t border-neutral-200 dark:border-neutral-800 transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 text-xs font-mono font-bold">
            <CircuitBoardIcon className="w-3.5 h-3.5" />
            <span>SYSTEM ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-tight leading-tight">
            How IDR works: The 8-Stage Pipeline
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
            From noisy raw smartphone IMU registers to centimeter-level vehicle dynamic estimation. Every processing stage operates entirely on-device in real-time.
          </p>
        </div>

        {/* Pipeline Layout (High-Contrast B&W) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Stage Stepper */}
          <div className="lg:col-span-6 space-y-2.5">
            {PIPELINE_STAGES.map((stage, idx) => {
              const isActive = activeStage.id === stage.id;
              return (
                <div key={stage.id} className="relative">
                  <button
                    onClick={() => setActiveStage(stage)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-2xl transition-all border flex items-center justify-between group ${
                      isActive
                        ? 'bg-neutral-100 dark:bg-[#15151C] text-neutral-950 dark:text-white border-black dark:border-white shadow-md'
                        : 'bg-neutral-50 dark:bg-[#0D0D12] border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 border ${
                          isActive
                            ? 'bg-black text-white dark:bg-white dark:text-black border-transparent shadow-sm'
                            : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400 border-neutral-300 dark:border-neutral-700'
                        }`}
                      >
                        0{stage.id}
                      </div>
                      <div>
                        <div className={`text-[10px] font-mono uppercase tracking-wider ${isActive ? 'text-black dark:text-white font-bold' : 'text-neutral-500'}`}>
                          {stage.category}
                        </div>
                        <div className={`font-semibold text-sm ${isActive ? 'text-neutral-950 dark:text-white font-bold' : 'text-neutral-800 dark:text-neutral-200'}`}>
                          {stage.title}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`hidden sm:inline text-xs font-mono ${isActive ? 'text-black dark:text-white font-bold' : 'text-neutral-500'}`}>
                        {stage.telemetryMetric}
                      </span>
                      <ChevronRightIcon className={`w-4 h-4 transition-transform ${isActive ? 'text-black dark:text-white rotate-90 sm:rotate-0' : 'text-neutral-400'}`} />
                    </div>
                  </button>

                  {idx < PIPELINE_STAGES.length - 1 && (
                    <div className="w-0.5 h-2 bg-neutral-200 dark:border-neutral-800 mx-auto my-0.5" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Stage Inspector Card */}
          <div className="lg:col-span-6 sticky top-28 rounded-3xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black shadow-sm">
                  {activeStage.icon}
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold">
                    STAGE 0{activeStage.id} // {activeStage.category}
                  </span>
                  <h3 className="text-xl font-bold text-neutral-950 dark:text-white mt-0.5">{activeStage.title}</h3>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-mono text-neutral-500 font-semibold">BENCHMARK</div>
                <div className="text-xs font-mono font-bold text-neutral-950 dark:text-white">{activeStage.telemetryMetric}</div>
              </div>
            </div>

            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {activeStage.summary}
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-neutral-800 space-y-1">
                <div className="text-[11px] font-mono text-neutral-500 uppercase font-bold">INPUT STREAM</div>
                <div className="text-xs font-mono text-neutral-800 dark:text-neutral-200">{activeStage.inputData}</div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-neutral-800 space-y-1">
                <div className="text-[11px] font-mono text-neutral-500 uppercase font-bold">PROCESSING ALGORITHM</div>
                <div className="text-xs font-mono text-neutral-800 dark:text-neutral-200">{activeStage.algorithm}</div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-neutral-800 space-y-1">
                <div className="text-[11px] font-mono text-neutral-500 uppercase font-bold">OUTPUT SPECIFICATION</div>
                <div className="text-xs font-mono text-neutral-950 dark:text-white font-bold">{activeStage.outputData}</div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-mono text-neutral-500 border-t border-neutral-200 dark:border-neutral-800">
              <span className="flex items-center gap-1.5 text-neutral-950 dark:text-white font-bold">
                <CheckIcon className="w-3.5 h-3.5" /> Edge Validated (Android NDK)
              </span>
              <span>Zero cloud dependency</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
