import React, { useState, useEffect, useRef } from 'react';
import { NavigationSession as NavSessionType } from '../lib/types';
import { SmartphoneIcon, CompassIcon, BatteryIcon, ShieldAlertIcon, TerminalIcon, ActivityIcon } from './Icons';
import { useTheme } from '../lib/theme';

interface NavigationSessionProps {
  session: NavSessionType;
}

export const NavigationSession: React.FC<NavigationSessionProps> = ({ session }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'sensor-graph' | 'attitude' | 'diagnostics'>('sensor-graph');
  const [attitude, setAttitude] = useState({ pitch: 1.2, roll: -0.4, yaw: 84.1 });
  const sensorCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setAttitude((prev) => ({
        pitch: Math.round((prev.pitch + (Math.random() - 0.5) * 0.4) * 10) / 10,
        roll: Math.round((prev.roll + (Math.random() - 0.5) * 0.3) * 10) / 10,
        yaw: Math.round((prev.yaw + (Math.random() - 0.5) * 0.8) * 10) / 10
      }));
    }, 250);
    return () => clearInterval(interval);
  }, []);

  // Hospital Monitor / ECG Real-time Sensor Oscilloscope
  useEffect(() => {
    if (activeTab !== 'sensor-graph') return;
    const canvas = sensorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isDark = theme === 'dark';
    let animId: number;
    let sweepX = 0;
    let tick = 0;

    const BUFFER_LEN = 800;
    const accelX = new Float32Array(BUFFER_LEN);
    const accelY = new Float32Array(BUFFER_LEN);
    const accelZ = new Float32Array(BUFFER_LEN);
    const gyroZ = new Float32Array(BUFFER_LEN);

    const render = () => {
      tick++;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const width = rect.width;
      const height = rect.height;

      // Hospital Monitor Dark / Light Background
      ctx.fillStyle = isDark ? '#050508' : '#F6F6FA';
      ctx.fillRect(0, 0, width, height);

      // Hospital Medical Reticle Grid
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < width; x += 10) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 10) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Major Divisions
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Populate High-Frequency Sensor Stream (200Hz)
      const pointsPerFrame = 6;
      for (let i = 0; i < pointsPerFrame; i++) {
        const idx = (sweepX + i) % BUFFER_LEN;
        const t = (tick * pointsPerFrame + i) * 0.05;

        // Tri-axial Road IMU micro-excitations
        const ax = Math.sin(t * 0.2) * 0.3 + (Math.sin(t * 7.5) + Math.cos(t * 18.2)) * 0.12;
        const ay = Math.cos(t * 0.18) * 0.25 + (Math.sin(t * 11.4) + Math.cos(t * 22.1)) * 0.10;
        
        // P-Q-R-S-T like Cardiac Shock impulse from road surface expansion joints
        const roadJolt = Math.sin(t * 0.08) > 0.90 ? Math.sin(t * 20.0) * 0.85 : 0;
        const az = 1.0 + Math.sin(t * 0.1) * 0.15 + (Math.sin(t * 14.8) * 0.18) + roadJolt;
        const gz = Math.sin(t * 0.3) * 0.4 + (Math.cos(t * 8.3) * 0.08);

        accelX[idx] = ax;
        accelY[idx] = ay;
        accelZ[idx] = az - 1.0; // Dynamic gravity-nulled acceleration
        gyroZ[idx] = gz;
      }
      sweepX = (sweepX + pointsPerFrame) % BUFFER_LEN;

      // Draw Channel Function with Sweep Erase Gap
      const drawStream = (data: Float32Array, midY: number, scale: number, color: string, widthLine: number) => {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = widthLine;
        ctx.beginPath();

        const sweepPx = (sweepX / BUFFER_LEN) * width;
        const gap = 20;

        for (let x = 0; x < width; x += 1.5) {
          const dist = (x - sweepPx + width) % width;
          if (dist < gap) continue;

          const bufIdx = Math.floor((x / width) * BUFFER_LEN);
          const y = midY + data[bufIdx] * scale;

          if (x === 0 || dist === gap) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      };

      // Channels:
      // Ch1: Accel Z (Forward/Vertical Shock)
      drawStream(accelZ, height * 0.28, height * 0.22, isDark ? '#FFFFFF' : '#000000', 2.0);
      // Ch2: Accel X/Y (Lateral & Longitudinal)
      drawStream(accelX, height * 0.65, height * 0.18, isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)', 1.2);
      // Ch3: Gyro Azimuth Rate
      drawStream(gyroZ, height * 0.88, height * 0.12, isDark ? 'rgba(180,180,200,0.6)' : 'rgba(80,80,100,0.6)', 1.0);

      // Sweep Vertical Scan Line
      const sweepLineX = (sweepX / BUFFER_LEN) * width;
      ctx.strokeStyle = isDark ? '#FFFFFF' : '#000000';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(sweepLineX, 0);
      ctx.lineTo(sweepLineX, height);
      ctx.stroke();

      // Channel Labels
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)';
      ctx.fillText('ACCEL-Z (DYNAMIC SHOCK) [±2.0g]', 10, height * 0.14);
      ctx.fillText('ACCEL-X/Y (LATERAL SLIP) [±1.0g]', 10, height * 0.52);
      ctx.fillText('GYRO-YAW RATE [±50°/s]', 10, height * 0.80);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [activeTab, theme]);

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Session Details Header */}
      <div className="p-3.5 sm:p-5 rounded-2xl bg-neutral-100 dark:bg-black/50 border border-neutral-200 dark:border-neutral-800 space-y-2.5 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        
        {/* Left: Device Model & Status */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-black text-white dark:bg-white dark:text-black shadow-sm shrink-0">
            <SmartphoneIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-xs sm:text-sm text-neutral-950 dark:text-white truncate">{session.deviceModel}</h4>
              <span className={`text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                session.status === 'DEAD RECKONING ACTIVE'
                  ? 'bg-black text-white dark:bg-white dark:text-black border-transparent'
                  : 'bg-neutral-200 text-black dark:bg-neutral-800 dark:text-white border-neutral-300 dark:border-neutral-700'
              }`}>
                {session.status === 'DEAD RECKONING ACTIVE' ? 'DR ACTIVE' : session.status}
              </span>
            </div>
            <div className="text-[10px] sm:text-xs font-mono text-neutral-500 mt-0.5 truncate">
              ID: {session.id} • {session.deviceId}
            </div>
          </div>
        </div>

        {/* Right: Battery & SDK Version */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-200 dark:border-neutral-800 text-[11px] sm:text-xs font-mono text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-1.5">
            <BatteryIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-900 dark:text-neutral-100" />
            <span>{session.batteryPct}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-900 dark:text-neutral-100" />
            <span>v1.4.2</span>
          </div>
        </div>
      </div>

      {/* Tab Selectors (Hospital Oscilloscope + Attitude + Diagnostics) */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-neutral-200 dark:border-neutral-800 pb-2">
        <button
          onClick={() => setActiveTab('sensor-graph')}
          className={`px-3 sm:px-4 py-1.5 rounded-xl text-[11px] sm:text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'sensor-graph'
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm font-bold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <ActivityIcon className="w-3.5 h-3.5" />
          <span>LIVE SENSOR OSCILLOSCOPE</span>
        </button>

        <button
          onClick={() => setActiveTab('attitude')}
          className={`px-3 sm:px-4 py-1.5 rounded-xl text-[11px] sm:text-xs font-mono font-semibold transition-all ${
            activeTab === 'attitude'
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm font-bold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
          }`}
        >
          ATTITUDE & ORIENTATION
        </button>

        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`px-3 sm:px-4 py-1.5 rounded-xl text-[11px] sm:text-xs font-mono font-semibold transition-all ${
            activeTab === 'diagnostics'
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm font-bold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
          }`}
        >
          DIAGNOSTIC LOGS
        </button>
      </div>

      {/* Live Hospital-Grade Sensor Oscilloscope Graph */}
      {activeTab === 'sensor-graph' && (
        <div className="space-y-3">
          <div className="relative h-56 sm:h-72 w-full rounded-2xl bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-inner">
            <canvas ref={sensorCanvasRef} className="w-full h-full block" />

            {/* Live Readout Pill on Canvas */}
            <div className="absolute top-2.5 right-2.5 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-black/90 border border-neutral-300 dark:border-neutral-700 text-[10px] font-mono shadow-sm flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse"></span>
                <span className="font-bold text-neutral-950 dark:text-white">200 Hz STREAM</span>
              </div>
              <span className="text-neutral-500">|</span>
              <span className="text-neutral-700 dark:text-neutral-300">EKF Cov: 0.32m²</span>
            </div>
          </div>
          <div className="text-[11px] font-mono text-neutral-500 flex items-center justify-between">
            <span>High-frequency multi-axis smartphone strapdown IMU streaming ring buffer</span>
            <span className="font-bold text-neutral-900 dark:text-white">800 Datapoints / Scan</span>
          </div>
        </div>
      )}

      {/* Attitude Tab */}
      {activeTab === 'attitude' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
          <div className="p-3.5 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-neutral-800 space-y-1">
            <div className="text-[9px] sm:text-[10px] font-mono text-neutral-500 font-semibold uppercase">PITCH (LATERAL TILT)</div>
            <div className="text-xl sm:text-2xl font-mono font-extrabold text-neutral-950 dark:text-white">
              {attitude.pitch}°
            </div>
            <div className="text-[9px] sm:text-[10px] font-mono text-neutral-600 dark:text-neutral-400">Road Grade: 2.1%</div>
          </div>

          <div className="p-3.5 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-neutral-800 space-y-1">
            <div className="text-[9px] sm:text-[10px] font-mono text-neutral-500 font-semibold uppercase">ROLL (LATERAL CAMBER)</div>
            <div className="text-xl sm:text-2xl font-mono font-extrabold text-neutral-950 dark:text-white">
              {attitude.roll}°
            </div>
            <div className="text-[9px] sm:text-[10px] font-mono text-neutral-600 dark:text-neutral-400">Superelevation: 0.7°</div>
          </div>

          <div className="p-3.5 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-neutral-800 space-y-1">
            <div className="text-[9px] sm:text-[10px] font-mono text-neutral-500 flex items-center justify-between font-semibold uppercase">
              <span>YAW AZIMUTH</span>
              <CompassIcon className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl sm:text-2xl font-mono font-extrabold text-neutral-950 dark:text-white">
              {attitude.yaw}°
            </div>
            <div className="text-[9px] sm:text-[10px] font-mono text-neutral-600 dark:text-neutral-400">True North Locked</div>
          </div>
        </div>
      )}

      {/* Diagnostics Logs Tab */}
      {activeTab === 'diagnostics' && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-black text-white font-mono text-[11px] sm:text-xs space-y-2 border border-neutral-800 max-h-56 overflow-y-auto break-words">
          <div className="text-neutral-300 flex items-start gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
            <span>[2026-08-30T14:48:02Z] EKF covariance converged to 0.42 m²</span>
          </div>
          <div className="text-neutral-400 pl-5">
            [2026-08-30T14:48:03Z] GNSS status: {session.gnssStatus} (Position error: ±{session.positionErrorMeters}m)
          </div>
          <div className="text-neutral-300 pl-5">
            [2026-08-30T14:48:04Z] AI speed inference latency: 3.8ms (ONNX INT8)
          </div>
          <div className="text-neutral-400 flex items-start gap-1.5">
            <ShieldAlertIcon className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
            <span>[2026-08-30T14:48:05Z] Zero-lateral slip constraint verified</span>
          </div>
        </div>
      )}

    </div>
  );
};
