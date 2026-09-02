import React, { useState } from 'react';
import { HardDriveIcon, CompassIcon, ShieldCheckIcon, CheckIcon, SlidersHorizontalIcon, ActivityIcon } from './Icons';

export const SensorEngine: React.FC = () => {
  const [selectedAxis, setSelectedAxis] = useState<'all' | 'x' | 'y' | 'z'>('all');

  return (
    <section id="technology" className="min-h-[calc(100vh-4.5rem)] flex flex-col justify-center py-10 sm:py-14 bg-white dark:bg-black border-t border-neutral-200 dark:border-neutral-800 transition-colors relative scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Header */}
        <div className="max-w-3xl space-y-3 sm:space-y-4 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 text-xs font-mono font-bold">
            <HardDriveIcon className="w-3.5 h-3.5" />
            <span>SENSOR PLATFORM</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-tight leading-tight">
            Your smartphone is the navigation sensor.
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
            No expensive OBD-II dongles, wheel encoders, or external IMUs. IDR directly harnesses the raw MEMS silicon already inside standard commercial smartphones.
          </p>
        </div>

        {/* Chassis & Sensor Breakdown (High-Contrast B&W) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Chassis Visualizer */}
          <div className="lg:col-span-6 rounded-3xl bg-neutral-50 dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 space-y-6 shadow-xl">
            
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="text-xs font-mono text-neutral-500 uppercase font-semibold">
                CABIN ORIENTATION MATRIX
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <span className="text-neutral-400 mr-1">AXIS:</span>
                {(['all', 'x', 'y', 'z'] as const).map((axis) => (
                  <button
                    key={axis}
                    onClick={() => setSelectedAxis(axis)}
                    className={`px-3 py-0.5 rounded-lg uppercase font-bold text-[10px] transition-all ${
                      selectedAxis === axis
                        ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                        : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {axis}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Vector Chassis with High-Contrast Coordinates */}
            <div className="relative h-64 sm:h-72 flex items-center justify-center bg-white dark:bg-black rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-inner">
              
              {/* Smartphone Silhouette */}
              <div className="relative w-36 h-60 rounded-3xl border-2 border-neutral-400 dark:border-neutral-700 bg-neutral-100 dark:bg-[#121216] flex flex-col items-center justify-between p-3 shadow-xl">
                {/* Speaker pill */}
                <div className="w-10 h-1 bg-neutral-400 dark:bg-neutral-600 rounded-full" />

                {/* IMU Center Chip with High-Contrast Badge */}
                <div className="relative z-20 p-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black border border-neutral-800 dark:border-neutral-200 shadow-md text-center">
                  <ActivityIcon className="w-6 h-6 mx-auto animate-pulse text-white dark:text-black" />
                  <div className="text-[8px] font-mono font-bold mt-1">MEMS IMU</div>
                  <div className="text-[7px] font-mono text-neutral-400 dark:text-neutral-600">200 Hz</div>
                </div>

                {/* 3D-on-2D Oblique Coordinate Vector Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                  <defs>
                    <marker id="arrow-y" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1.5 L 10 5 L 0 8.5 z" className="fill-neutral-900 dark:fill-neutral-100" />
                    </marker>
                    <marker id="arrow-x" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1.5 L 10 5 L 0 8.5 z" className="fill-neutral-900 dark:fill-neutral-100" />
                    </marker>
                    <marker id="arrow-z" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1.5 L 10 5 L 0 8.5 z" className="fill-neutral-900 dark:fill-neutral-100" />
                    </marker>
                  </defs>

                  {/* Y-Axis: Forward (Up) */}
                  {(selectedAxis === 'all' || selectedAxis === 'y') && (
                    <line
                      x1="50%"
                      y1="50%"
                      x2="50%"
                      y2="14%"
                      className="stroke-neutral-900 dark:stroke-neutral-100 stroke-2"
                      markerEnd="url(#arrow-y)"
                    />
                  )}

                  {/* X-Axis: Lateral (Right) */}
                  {(selectedAxis === 'all' || selectedAxis === 'x') && (
                    <line
                      x1="50%"
                      y1="50%"
                      x2="88%"
                      y2="50%"
                      className="stroke-neutral-900 dark:stroke-neutral-100 stroke-2"
                      markerEnd="url(#arrow-x)"
                    />
                  )}

                  {/* Z-Axis: Vertical Depth (Slightly Sidewise Oblique Line ↙) */}
                  {(selectedAxis === 'all' || selectedAxis === 'z') && (
                    <line
                      x1="50%"
                      y1="50%"
                      x2="16%"
                      y2="80%"
                      className="stroke-neutral-900 dark:stroke-neutral-100 stroke-2"
                      markerEnd="url(#arrow-z)"
                    />
                  )}
                </svg>

                {/* Y-Axis Label: Top */}
                {(selectedAxis === 'all' || selectedAxis === 'y') && (
                  <div className="absolute top-1.5 left-1/2 -translate-x-1/2 z-20">
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-black text-white dark:bg-white dark:text-black rounded shadow-sm">
                      Y (Fwd)
                    </span>
                  </div>
                )}

                {/* X-Axis Label: Right */}
                {(selectedAxis === 'all' || selectedAxis === 'x') && (
                  <div className="absolute top-1/2 right-1 translate-x-full -translate-y-1/2 z-20">
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-black text-white dark:bg-white dark:text-black rounded shadow-sm ml-1.5">
                      X (Lat)
                    </span>
                  </div>
                )}

                {/* Z-Axis Label: Sidewise Oblique (Down-Left) */}
                {(selectedAxis === 'all' || selectedAxis === 'z') && (
                  <div className="absolute bottom-7 left-1 -translate-x-full z-20">
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-black text-white dark:bg-white dark:text-black rounded shadow-sm mr-1.5">
                      Z (Vert)
                    </span>
                  </div>
                )}

                {/* Home Indicator */}
                <div className="w-12 h-1 bg-neutral-400 dark:bg-neutral-600 rounded-full" />
              </div>

              {/* Status floating badge */}
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur border border-neutral-200 dark:border-neutral-800 text-[10px] font-mono text-neutral-900 dark:text-neutral-100 font-bold">
                DYNAMIC CABIN ALIGNMENT ACTIVE
              </div>
            </div>

            {/* Zero Hardware Callout */}
            <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center gap-3.5">
              <CheckIcon className="w-5 h-5 text-black dark:text-white shrink-0" />
              <div className="text-xs text-neutral-700 dark:text-neutral-300">
                <span className="font-bold text-neutral-950 dark:text-white">Zero OBD-II / External Hardware Required.</span>
                <span className="text-neutral-500 dark:text-neutral-400 block mt-0.5">Place the phone anywhere in the cabin — windshield mount, cup holder, or console. Automatic vehicle alignment dynamically compensates.</span>
              </div>
            </div>

          </div>

          {/* Right: Sensor Breakdown Cards */}
          <div className="lg:col-span-6 space-y-4">
            
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 space-y-2 shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700">
                  <ActivityIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-950 dark:text-white">Tri-Axial MEMS Accelerometer (200 Hz)</h4>
                  <div className="text-[11px] font-mono text-neutral-500">Captures longitudinal acceleration, braking forces, and road micro-vibrations</div>
                </div>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 pl-12 leading-relaxed">
                Samples high-frequency road excitations to continuously infer vehicle velocity profiles without requiring wheel rotation sensors.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 space-y-2 shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700">
                  <SlidersHorizontalIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-950 dark:text-white">Tri-Axial MEMS Gyroscope (200 Hz)</h4>
                  <div className="text-[11px] font-mono text-neutral-500">Measures yaw rotation rate, turning dynamics, and road banking angles</div>
                </div>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 pl-12 leading-relaxed">
                Strapdown quaternion integration tracks instantaneous azimuth changes during tight highway curves, spiral ramps, and lane changes.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 space-y-2 shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700">
                  <CompassIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-950 dark:text-white">Dynamic Cabin Frame Transformation</h4>
                  <div className="text-[11px] font-mono text-neutral-500">Mathematical projection from Phone Body Frame → Vehicle Motion Frame</div>
                </div>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 pl-12 leading-relaxed">
                Uses gravity vector estimation and forward kinetic acceleration moments to automatically rotate sensor measurements into the vehicle’s direction of travel.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 space-y-2 shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700">
                  <ShieldCheckIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-950 dark:text-white">100% On-Device Edge Privacy</h4>
                  <div className="text-[11px] font-mono text-neutral-500">Zero cloud streaming of raw IMU telemetry</div>
                </div>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 pl-12 leading-relaxed">
                All signal filtering, tensor operations, and Kalman fusion run natively on the smartphone CPU/NPU. No sensitive driving telemetry ever leaves your device.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
