import React, { useState, useEffect, useRef } from 'react';
import { CpuIcon, ActivityIcon, SparklesIcon, SlidersIcon } from './Icons';
import { useTheme } from '../lib/theme';

export const MLEngineSection: React.FC = () => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [filterMode, setFilterMode] = useState<'both' | 'raw' | 'filtered'>('both');
  const [roadSurface, setRoadSurface] = useState<'asphalt' | 'cobblestone' | 'pothole'>('asphalt');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isDark = theme === 'dark';
    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.04;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const width = rect.width;
      const height = rect.height;

      // Pure Black/White background
      ctx.fillStyle = isDark ? '#050508' : '#F5F5F7';
      ctx.fillRect(0, 0, width, height);

      // Baseline
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      const midY = height / 2;
      const noiseAmp = roadSurface === 'cobblestone' ? 24 : roadSurface === 'pothole' ? 32 : 12;

      // 1. Raw Accelerometer (Faint Grayscale Noise)
      if (filterMode === 'both' || filterMode === 'raw') {
        ctx.beginPath();
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.35)';
        ctx.lineWidth = 1.2;

        for (let x = 0; x < width; x++) {
          const t = (x + time * 60) * 0.05;
          const baseMotion = Math.sin(t * 0.2) * (height * 0.2);
          const engineVibe = Math.sin(t * 3.8) * 8;
          const roadNoise = (Math.sin(t * 7.1) + Math.cos(t * 11.3) + Math.sin(t * 19.7)) * (noiseAmp / 3);
          const pothole = roadSurface === 'pothole' && Math.sin(t * 0.08) > 0.85 ? Math.sin(t * 15) * 45 : 0;

          const y = midY + baseMotion + engineVibe + roadNoise + pothole;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // 2. AI Filtered Speed Profile (High-Contrast Solid White / Solid Black)
      if (filterMode === 'both' || filterMode === 'filtered') {
        ctx.beginPath();
        ctx.strokeStyle = isDark ? '#FFFFFF' : '#000000';
        ctx.lineWidth = 3;

        for (let x = 0; x < width; x++) {
          const t = (x + time * 60) * 0.05;
          const cleanMotion = Math.sin(t * 0.2) * (height * 0.2);
          const y = midY + cleanMotion;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [filterMode, roadSurface, theme]);

  return (
    <section className="py-28 bg-neutral-100 dark:bg-[#070709] border-t border-neutral-200 dark:border-neutral-800 transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-200 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 text-xs font-mono font-bold">
            <CpuIcon className="w-3.5 h-3.5" />
            <span>INTELLIGENCE LAYER</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-tight leading-tight">
            From noisy motion to usable vehicle dynamics.
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
            Raw smartphone accelerometers capture engine revs, cabin vibrations, and rough pavement. IDR’s neural model rejects noise and extracts pure vehicle speed profiles.
          </p>
        </div>

        {/* Waveform Studio */}
        <div className="rounded-3xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 space-y-6 shadow-xl">
          
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-neutral-500">STREAM VIEW:</span>
              <div className="flex items-center gap-1.5">
                {(['both', 'raw', 'filtered'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setFilterMode(mode)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold uppercase transition-all border ${
                      filterMode === mode
                        ? 'bg-black text-white dark:bg-white dark:text-black border-transparent shadow-sm'
                        : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-400 border-neutral-300 dark:border-neutral-700 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {mode === 'both' ? 'Overlay (Raw + AI)' : mode === 'raw' ? 'Raw IMU Noise' : 'AI Speed Profile'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-neutral-500">ROAD STIMULUS:</span>
              <div className="flex items-center gap-1.5">
                {(['asphalt', 'cobblestone', 'pothole'] as const).map((surface) => (
                  <button
                    key={surface}
                    onClick={() => setRoadSurface(surface)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono capitalize transition-all border ${
                      roadSurface === surface
                        ? 'bg-black text-white dark:bg-white dark:text-black border-transparent shadow-sm'
                        : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-400 border-neutral-300 dark:border-neutral-700 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {surface}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Canvas Waveform */}
          <div className="relative h-56 sm:h-72 w-full rounded-2xl bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-inner">
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Overlay Indicator */}
            <div className="absolute top-3 right-3 flex items-center gap-4 px-3.5 py-1.5 rounded-xl bg-white/90 dark:bg-black/90 border border-neutral-300 dark:border-neutral-700 text-[11px] font-mono shadow-sm">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-400"></span>
                <span className="text-neutral-600 dark:text-neutral-400">Raw Accel (±2g Noise)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-black dark:bg-white"></span>
                <span className="text-neutral-950 dark:text-white font-bold">AI Forward Accel</span>
              </div>
            </div>

            <div className="absolute bottom-3 left-3 text-[10px] font-mono text-neutral-500">
              SAMPLE RATE: 200 Hz | INFERENCE LATENCY: 3.8 ms (ONNX INT8 RUNTIME)
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 space-y-1">
              <div className="text-xs font-mono font-bold text-neutral-950 dark:text-white flex items-center gap-1.5">
                <SparklesIcon className="w-3.5 h-3.5" /> Combustion Harmonic Rejection
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Filters 30–60Hz internal combustion engine harmonics from polluting velocity integration.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 space-y-1">
              <div className="text-xs font-mono font-bold text-neutral-950 dark:text-white flex items-center gap-1.5">
                <ActivityIcon className="w-3.5 h-3.5" /> Pothole / Shockwave Isolation
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Zero-velocity update (ZUPT) and shock-wave filtering prevent vertical bumps from polluting forward speed.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 space-y-1">
              <div className="text-xs font-mono font-bold text-neutral-950 dark:text-white flex items-center gap-1.5">
                <SlidersIcon className="w-3.5 h-3.5" /> Dynamic Speed Regressor
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Trained on over 20,000 km of real-world urban and highway driving datasets across diverse car models.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
