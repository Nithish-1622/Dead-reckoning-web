import React, { useState, useEffect, useRef } from 'react';
import { CpuIcon, ActivityIcon, SparklesIcon } from './Icons';
import { useTheme } from '../lib/theme';

export const MLEngineSection: React.FC = () => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [filterMode, setFilterMode] = useState<'both' | 'raw' | 'filtered'>('both');
  const [roadSurface, setRoadSurface] = useState<'asphalt' | 'cobblestone' | 'pothole'>('asphalt');
  const [sampleRate, setSampleRate] = useState<200 | 400 | 800>(400);

  // Live Medical-Grade Telemetry Readouts
  const [liveMetrics, setLiveMetrics] = useState({
    peakG: 2.14,
    rmsNoise: 0.38,
    snrDb: 38.6,
    inferenceMs: 3.6,
    bufferPoints: 1200
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isDark = theme === 'dark';
    let animId: number;
    let sweepX = 0;
    let tick = 0;

    // High-Density Ring Buffer simulating medical/ECG monitor stream (1500 datapoints)
    const BUFFER_SIZE = 1200;
    const rawBuffer = new Float32Array(BUFFER_SIZE);
    const aiBuffer = new Float32Array(BUFFER_SIZE);
    const gyroBuffer = new Float32Array(BUFFER_SIZE);

    const render = () => {
      tick += 1;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const width = rect.width;
      const height = rect.height;

      // Pure Monitor Background
      ctx.fillStyle = isDark ? '#06060A' : '#F4F4F8';
      ctx.fillRect(0, 0, width, height);

      // 1. Hospital Monitor Medical Grid (5mm & 1mm reticle grid)
      const gridMajor = 40;
      const gridMinor = 8;

      // Minor grid dots / lines
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.035)' : 'rgba(0, 0, 0, 0.035)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let x = 0; x < width; x += gridMinor) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridMinor) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Major grid divisions
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.09)' : 'rgba(0, 0, 0, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += gridMajor) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridMajor) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Channel divider centerlines
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 0, 0, 0.15)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, height * 0.35);
      ctx.lineTo(width, height * 0.35);
      ctx.moveTo(0, height * 0.70);
      ctx.lineTo(width, height * 0.70);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. High-Frequency Data Stream Generation (Hospital Patient Monitor / ECG density)
      const pointsPerFrame = Math.floor(sampleRate / 60);
      const noiseMult = roadSurface === 'cobblestone' ? 2.2 : roadSurface === 'pothole' ? 3.0 : 1.0;

      for (let i = 0; i < pointsPerFrame; i++) {
        const idx = (sweepX + i) % BUFFER_SIZE;
        const t = (tick * pointsPerFrame + i) * 0.04;

        // Base vehicle kinetic motion
        const baseMotion = Math.sin(t * 0.15) * 0.45 + Math.sin(t * 0.05) * 0.2;

        // High-frequency road chassis vibrations (engine 1200-3000 RPM harmonic micro-spikes)
        const engineVibe = Math.sin(t * 2.8) * 0.18 + Math.cos(t * 6.7) * 0.12 + Math.sin(t * 14.3) * 0.08;
        const roadMicro = (Math.sin(t * 8.4) + Math.cos(t * 17.2) + Math.sin(t * 31.5)) * 0.15 * noiseMult;
        
        // Pothole / Expansion Joint ECG-like cardiac pulse spike
        const spike = roadSurface === 'pothole' && Math.sin(t * 0.06) > 0.88 
          ? Math.sin(t * 18.0) * Math.exp(-Math.abs(Math.sin(t * 0.06) - 0.94) * 25) * 2.2 
          : 0;

        // Raw IMU Signal (High-frequency noise)
        rawBuffer[idx] = baseMotion + engineVibe + roadMicro + spike;

        // Gyro Angular Pitch Rate
        gyroBuffer[idx] = Math.cos(t * 0.15) * 0.35 + (Math.sin(t * 9.1) * 0.08) + (spike * 0.5);

        // AI Neural Denoised Speed Profile (Clean, pure vehicle dynamics)
        aiBuffer[idx] = baseMotion;
      }

      sweepX = (sweepX + pointsPerFrame) % BUFFER_SIZE;

      // Dynamic Medical Channel Drawing (Hospital Oscilloscope with Sweep Bar)
      const ch1Y = height * 0.20; // Raw Accel
      const ch2Y = height * 0.52; // Gyro Rate
      const ch3Y = height * 0.84; // AI Clean Speed

      const ch1Scale = height * 0.14;
      const ch2Scale = height * 0.12;
      const ch3Scale = height * 0.12;

      // Function to render a waveform channel with sweep-gap like hospital ECG monitors
      const drawChannel = (
        data: Float32Array,
        centerY: number,
        scaleY: number,
        color: string,
        lineWidth: number,
        glow: boolean
      ) => {
        ctx.save();
        if (glow && isDark) {
          ctx.shadowColor = 'rgba(255, 255, 255, 0.45)';
          ctx.shadowBlur = 6;
        }

        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();

        const sweepPosPx = (sweepX / BUFFER_SIZE) * width;
        const gapPx = 28; // Hospital sweep erase gap

        for (let x = 0; x < width; x += 1.5) {
          // Erase gap right ahead of sweep bar (Hospital CRT phosphor style)
          const distToSweep = (x - sweepPosPx + width) % width;
          if (distToSweep < gapPx) continue;

          const bufIdx = Math.floor((x / width) * BUFFER_SIZE);
          const val = data[bufIdx];
          const y = centerY + val * scaleY;

          if (x === 0 || distToSweep === gapPx) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        ctx.restore();
      };

      // Render Channel 1: Raw Accel (±2g High-Frequency Noise)
      if (filterMode === 'both' || filterMode === 'raw') {
        drawChannel(
          rawBuffer, 
          ch1Y, 
          ch1Scale, 
          isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)', 
          1.1, 
          false
        );
      }

      // Render Channel 2: Gyro Angular Pitch Rate
      if (filterMode === 'both' || filterMode === 'raw') {
        drawChannel(
          gyroBuffer, 
          ch2Y, 
          ch2Scale, 
          isDark ? 'rgba(200, 200, 220, 0.55)' : 'rgba(80, 80, 100, 0.55)', 
          1.2, 
          false
        );
      }

      // Render Channel 3: AI Neural Denoised Speed Profile (Solid High-Contrast)
      if (filterMode === 'both' || filterMode === 'filtered') {
        drawChannel(
          aiBuffer, 
          ch3Y, 
          ch3Scale, 
          isDark ? '#FFFFFF' : '#000000', 
          2.6, 
          true
        );
      }

      // 3. Hospital Monitor Vertical Sweep Scan Line (Green/White Phospor Bar)
      const sweepLineX = (sweepX / BUFFER_SIZE) * width;
      const grad = ctx.createLinearGradient(sweepLineX - 25, 0, sweepLineX, 0);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      grad.addColorStop(0.7, isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)');
      grad.addColorStop(1, isDark ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.85)');

      ctx.fillStyle = grad;
      ctx.fillRect(sweepLineX - 25, 0, 25, height);

      ctx.strokeStyle = isDark ? '#FFFFFF' : '#000000';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(sweepLineX, 0);
      ctx.lineTo(sweepLineX, height);
      ctx.stroke();

      // Channel Labels on Canvas
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';
      ctx.fillText('CH1 • RAW ACCELEROMETER [±2g @ 200Hz]', 12, ch1Y - height * 0.12);
      ctx.fillText('CH2 • GYROSCOPE PITCH RATE [deg/s]', 12, ch2Y - height * 0.10);
      ctx.fillText('CH3 • AI INFERRED FORWARD SPEED PROFILE [m/s]', 12, ch3Y - height * 0.10);

      // Periodically update readouts
      if (tick % 15 === 0) {
        const curPeak = (1.8 + Math.random() * 0.7 * noiseMult).toFixed(2);
        const curRms = (0.28 + Math.random() * 0.15 * noiseMult).toFixed(2);
        const curSnr = (38.2 + (Math.random() - 0.5) * 1.5).toFixed(1);
        setLiveMetrics({
          peakG: parseFloat(curPeak),
          rmsNoise: parseFloat(curRms),
          snrDb: parseFloat(curSnr),
          inferenceMs: 3.6,
          bufferPoints: BUFFER_SIZE
        });
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [filterMode, roadSurface, sampleRate, theme]);

  return (
    <section className="min-h-[calc(100vh-4.5rem)] flex flex-col justify-center py-10 sm:py-14 bg-neutral-100 dark:bg-[#070709] border-t border-neutral-200 dark:border-neutral-800 transition-colors relative scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Header */}
        <div className="max-w-3xl space-y-3 sm:space-y-4 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-200 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 text-xs font-mono font-bold">
            <CpuIcon className="w-3.5 h-3.5" />
            <span>INTELLIGENCE LAYER</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-tight leading-tight">
            From noisy motion to usable vehicle dynamics.
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
            Raw smartphone accelerometers capture engine revs, cabin vibrations, and rough pavement. IDR’s neural model rejects noise and extracts pure vehicle speed profiles in real time.
          </p>
        </div>

        {/* High-Frequency Hospital-Grade Waveform Studio */}
        <div className="rounded-3xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-8 space-y-6 shadow-xl">
          
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            
            {/* Stream View Modes */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono text-neutral-500 font-bold">STREAM VIEW:</span>
              <div className="flex items-center gap-1">
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
                    {mode === 'both' ? 'Multi-Channel ECG Overlay' : mode === 'raw' ? 'Raw IMU Noise' : 'AI Speed Profile'}
                  </button>
                ))}
              </div>
            </div>

            {/* Road Stimulus + Sampling Rate */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono text-neutral-500 font-bold">STIMULUS:</span>
                {(['asphalt', 'cobblestone', 'pothole'] as const).map((surface) => (
                  <button
                    key={surface}
                    onClick={() => setRoadSurface(surface)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-mono capitalize transition-all border ${
                      roadSurface === surface
                        ? 'bg-black text-white dark:bg-white dark:text-black border-transparent font-bold shadow-sm'
                        : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-400 border-neutral-300 dark:border-neutral-700 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {surface}
                  </button>
                ))}
              </div>

              {/* High Frequency Sampling Rate Switcher */}
              <div className="flex items-center gap-1 p-0.5 rounded-xl bg-neutral-100 dark:bg-black/50 border border-neutral-300 dark:border-neutral-700 text-xs font-mono">
                {([200, 400, 800] as const).map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setSampleRate(rate)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
                      sampleRate === rate
                        ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                        : 'text-neutral-500 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {rate}Hz
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Hospital-Grade Oscilloscope Canvas */}
          <div className="relative h-72 sm:h-96 w-full rounded-2xl bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-inner">
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Hospital-Style Live Digital Telemetry HUD (Top Right) */}
            <div className="absolute top-3 right-3 p-3 rounded-2xl bg-white/95 dark:bg-black/90 border border-neutral-300 dark:border-neutral-700 text-[10px] sm:text-[11px] font-mono shadow-lg backdrop-blur-md space-y-1.5 min-w-[150px]">
              <div className="flex items-center justify-between pb-1 border-b border-neutral-200 dark:border-neutral-800">
                <span className="text-neutral-500 uppercase font-bold text-[9px] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-ping inline-block"></span>
                  LIVE STREAM
                </span>
                <span className="font-bold text-neutral-900 dark:text-white">{sampleRate} Hz</span>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-0.5">
                <div>
                  <div className="text-neutral-500 text-[8px]">PK NOISE</div>
                  <div className="font-extrabold text-neutral-950 dark:text-white">±{liveMetrics.peakG}g</div>
                </div>
                <div>
                  <div className="text-neutral-500 text-[8px]">RMS</div>
                  <div className="font-extrabold text-neutral-950 dark:text-white">{liveMetrics.rmsNoise}g</div>
                </div>
                <div>
                  <div className="text-neutral-500 text-[8px]">AI SNR</div>
                  <div className="font-extrabold text-neutral-950 dark:text-white">{liveMetrics.snrDb} dB</div>
                </div>
                <div>
                  <div className="text-neutral-500 text-[8px]">LATENCY</div>
                  <div className="font-extrabold text-neutral-950 dark:text-white">{liveMetrics.inferenceMs} ms</div>
                </div>
              </div>
              <div className="pt-1 text-[8px] text-neutral-500 border-t border-neutral-200 dark:border-neutral-800 flex justify-between font-bold">
                <span>BUFFER DENSITY</span>
                <span className="text-neutral-900 dark:text-white">{liveMetrics.bufferPoints} PTS</span>
              </div>
            </div>

            {/* Sweep Status Indicator (Bottom Left) */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-black/90 border border-neutral-300 dark:border-neutral-700 text-[10px] font-mono shadow-sm">
              <span className="w-2 h-2 rounded-full bg-neutral-950 dark:bg-white animate-pulse"></span>
              <span className="text-neutral-700 dark:text-neutral-300 font-bold">
                CONTINUOUS SWEEP • RING BUFFER LOCKED
              </span>
            </div>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#070709] border border-neutral-200 dark:border-neutral-800 space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 font-semibold">
                <ActivityIcon className="w-4 h-4 text-neutral-950 dark:text-white" />
                <span>FREQUENCY REJECTION</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-neutral-950 dark:text-white">
                99.8% Out-of-Band Noise
              </div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                Filters 12Hz–80Hz engine and rough road micro-oscillations.
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#070709] border border-neutral-200 dark:border-neutral-800 space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 font-semibold">
                <CpuIcon className="w-4 h-4 text-neutral-950 dark:text-white" />
                <span>MODEL FOOTPRINT</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-neutral-950 dark:text-white">
                1.2 MB Quantized ONNX
              </div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                Executes via NNAPI / CoreML with under 4% CPU consumption.
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#070709] border border-neutral-200 dark:border-neutral-800 space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 font-semibold">
                <SparklesIcon className="w-4 h-4 text-neutral-950 dark:text-white" />
                <span>VELOCITY ESTIMATE</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-neutral-950 dark:text-white">
                ±0.4 km/h Precision
              </div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                Continuously fed into the strapdown EKF prediction step.
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
