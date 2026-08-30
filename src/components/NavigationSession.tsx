import React, { useState, useEffect } from 'react';
import { NavigationSession as NavSessionType } from '../lib/types';
import { SmartphoneIcon, CompassIcon, BatteryIcon, ShieldAlertIcon, TerminalIcon } from './Icons';

interface NavigationSessionProps {
  session: NavSessionType;
}

export const NavigationSession: React.FC<NavigationSessionProps> = ({ session }) => {
  const [activeTab, setActiveTab] = useState<'attitude' | 'diagnostics'>('attitude');
  const [attitude, setAttitude] = useState({ pitch: 1.2, roll: -0.4, yaw: 84.1 });

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

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Session Details Header (Structured Mobile Layout) */}
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

      {/* Tab Selectors (Mobile Touch Sizing) */}
      <div className="flex items-center gap-1.5 border-b border-neutral-200 dark:border-neutral-800 pb-2">
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

      {/* Attitude Tab (Clean 3-Column / Responsive on Mobile) */}
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
